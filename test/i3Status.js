'use strict';

import chai from 'chai';
const { expect } = chai; 
import chaiString from 'chai-string';
chai.use(chaiString);
import assert from 'assert';
import concat from 'concat-stream';
import logger from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import I3Status from './../src/i3Status.js';
import TextClass from './../src/buildin/text.js';
import TestModuleClass from './scripts/testModule.js'
import TestModuleAsyncClass from './scripts/testModuleAsync.js'


if (process.env.DEBUG)
    logger.level = 'debug';

describe('i3Status', () => {

    describe('constructor', () => {
        it('should read and store config file', () => {
            var instance = new I3Status({
                config: './test/.config/test.yml'
            });

            //check config
            expect(instance.config.main.interval).to.equal(5);
            expect(instance.config.main.color).to.equal('#E0E0E0');

            //check there are two blocks
            expect(instance.config.blocks).to.have.lengthOf(4);

            //check line is created, it holds the output for each block
            expect(instance.lines).to.have.lengthOf(4);
        });


        it('should read and store config file with fallbacks', () => {
            var instance = new I3Status({
                config: './test/.config/test-fallback.yml'
            });

            //check config
            expect(instance.config.main.interval).to.equal(30);
            expect(instance.config.main.color).to.equal('#FFFFFF');

            //check there are two blocks
            expect(instance.config.blocks).to.have.lengthOf(0);

            //check line is created, it holds the output for each block
            expect(instance.lines).to.have.lengthOf(0);

        });
    });

    describe('initializeBlocks', () => {

        it('should handle buildin blocks',async() => {

            var instance = new I3Status({
                config: './test/.config/test.yml'
            });

            const __dirname = path.dirname(fs.realpathSync(fileURLToPath(import.meta.url)));
            instance.config.blocks[2].module = path.join(__dirname, 'scripts/testModuleAsync.js')
            instance.config.blocks[3].module = path.join(__dirname, 'scripts/testModule.js')

            //call initializeBlocks
            await instance.initializeBlocks();

            //get block for date and check it
            var block = instance.blocks.date;
            expect(block).to.be.an.instanceof(TextClass);
            expect(block.__name).to.equal('date');
            expect(block.text).to.equal('13:37');
            expect(block.__index).to.equal(0);
            expect(block).to.have.property('__logger');
            //update method exists
            expect(block.refresh).to.be.ok;
            expect(block.__meta.type).to.equal('async');

            //get block for date and check it
            block = instance.blocks.seconds;
            expect(block).to.be.an.instanceof(TextClass);
            expect(block.__name).to.equal('seconds');
            expect(block.text).to.equal('42');
            expect(block.__index).to.equal(1);
            expect(block.refresh).to.be.ok;
            expect(block.__meta.type).to.equal('async');

            //get block for asyncBlock and check it
            block = instance.blocks.asyncBlock;
            expect(block).to.be.an.instanceof(TestModuleAsyncClass);
            expect(block.__name).to.equal('asyncBlock');
            expect(block.text).to.equal('async working');
            expect(block.__index).to.equal(2);
            expect(block.update).to.be.undefined;
            expect(block.refresh).to.be.ok;
            expect(block.__meta.type).to.equal('async');

             //get block for asyncBlock and check it
            block = instance.blocks.eventBlock;
            expect(block).to.be.an.instanceof(TestModuleClass);
            expect(block.__name).to.equal('eventBlock');
            expect(block.text).to.equal('event working');
            expect(block.__index).to.equal(3);
            expect(block.refresh).to.be.undefined;
            expect(block.update).to.be.ok;
            expect(block.__meta.type).to.equal('event');

        });

        it('should handle module blocks', async () => {
            var instance = new I3Status({
                config: './test/.config/test-modules.yml',
                secret: 'secret'
            });

            //replace non-npm module with absolute path
            const __dirname = path.dirname(fs.realpathSync(fileURLToPath(import.meta.url)));
            instance.config.blocks[1].module = path.join(__dirname, 'scripts/testModule.js')
            instance.config.blocks[3].module = path.join(__dirname, 'scripts/testModuleAsync.js')

            //call initializeBlocks
            await instance.initializeBlocks();

            //get block for nonexisting module and check it
            var block = instance.blocks.module;
            expect(block.__name).to.equal('module');
            expect(block.text).to.contain('unable to load module \'nonexisting\':');
            expect(block.__index).to.equal(0);

            //get block for non npm module and check it
            block = instance.blocks.module2;
            expect(block.__name).to.equal('module2');
            expect(block.text).to.equal('module working');
            expect(block.__index).to.equal(1);
            expect(block.secretValue).to.equal('test'); //decrypted value


            //get block for  npm module and check it
            block = instance.blocks.module3;
            expect(block.__name).to.equal('module3');
            expect(block.text).to.equal('npm module working');
            expect(block.__index).to.equal(2);

            //get block for non-npm module and check it
            block = instance.blocks.module4;
            expect(block.__name).to.equal('module4');
            expect(block.text).to.equal('async working');
            expect(block.__meta.type).to.equal('async');
            expect(block.__index).to.equal(3);

        });

        it('should reject blocks without name', async() => {
            var instance = new I3Status({
                config: './test/.config/test-noname.yml'
            });

            await assert.rejects(async () => instance.initializeBlocks(),
                {message: 'config error: block needs a name'}
            );
           
           
        });

        it('should reject blocks without type/module', async() => {
            var instance = new I3Status({
                config: './test/.config/test-notype.yml'
            });

            //call initializeBlocks should throw error
             await assert.rejects(async () => instance.initializeBlocks(),
                {message: 'config error: block date has no type/module'}
            );

        });
   

        it('should reject blocks with duplicate names', async() => {
            var instance = new I3Status({
                config: './test/.config/test-duplicate.yml'
            });

            //call initializeBlocks should throw error
           await assert.rejects(async () => instance.initializeBlocks(),
                {message: 'config error: duplicate block name found'}
            );
        });
      
    });

    describe('run', () => {

        it('should output header and start modules', async() => {

            //capture stdout
            var capture = concat((lines) => {
                //header should be outputted and the first line with null values
                expect(lines).to.equal('{"version":1,"click_events":true}\n[[]\n');
            });

            //configure instance, use capture as output
            var instance = new I3Status({
                config: './test/.config/test.yml'
            }, capture);

            //overwrite intervals
            instance.config.blocks[0].interval = 0.02;
            instance.config.blocks[1].interval = 0.01;

            //wait for updates;
            var remaining = {
                date: 1, //date should be called one time
                seconds: 2, //seconds should be called two times
                count: 3
            }

            //overwrite update method
            instance.update = (name, data) => {
                logger.debug('update for', name);
                remaining[name]--;
                remaining.count--;

                //after all calls are completed
                if (remaining.count == 0) {
                    //close instance
                    instance.close();

                    //end output capture, calls the validation above
                    capture.end();

                    //date is called one time, seconds two times
                    expect(remaining.date).to.equal(0)
                    expect(remaining.seconds).to.equal(0);

                    //check cleared intervals by close
                    for (const name in instance.blocks) {
                        expect(instance.blocks[name].interval).to.be.undefined;
                    }

                }
            }

            //start instance
            instance.run();
        });

    });

    describe('run', () => {

        it('should output all blocks', async() => {

        const dateBlockOutput = '{"name":"date","color":"#E0E0E0","full_text":" 13:37","short_text":" 13:37"}';
        const secondBlockOutput = '{"name":"seconds","color":"#ff00ff","full_text":" 42","short_text":" 42"}';
        const asyncBlockOutput = '{"name":"asyncBlock","color":"#E0E0E0","full_text":"async working","short_text":"async working"}';
        const eventBlockOutput = '{"name":"eventBlock","color":"#E0E0E0","full_text":"event working","short_text":"event working"}';

            //capture stdout
            var capture = concat((lines) => {
                //header should be outputted and the first line with null values
                expect(lines).to.startsWith(
                    '{"version":1,"click_events":true}\n[[]\n'
                );
                expect(lines).to.endsWith(
                    `,[${dateBlockOutput},${secondBlockOutput},${asyncBlockOutput},${eventBlockOutput}]\n`
                );
            });

            //configure instance, use capture as output
            var instance = new I3Status({
                config: './test/.config/test.yml'
            }, capture);

            const __dirname = path.dirname(fs.realpathSync(fileURLToPath(import.meta.url)));
            instance.config.blocks[2].module = path.join(__dirname, 'scripts/testModuleAsync.js')
            instance.config.blocks[3].module = path.join(__dirname, 'scripts/testModule.js')

            await instance.run();

            //end capture
            capture.end();
            instance.close();

        });

    });

})