'use strict';

import { expect } from 'chai';
import * as common from './../blockCommon.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Command from './../../src/buildin/command.js';

describe('Buildin Command', function() {
    describe('#constructor basic', common.constructor(Command));

    describe('#constructor', function() {
        it('should construct and store custom options', () => {
            var block = new Command({});


        });
    });

    describe('update basic', common.update(Command));

    describe('update', function() {
        it('should update the output and fire updated', (done) => {
            //construct block
            var block = new Command({
                command: path.join(path.dirname(fs.realpathSync(fileURLToPath(import.meta.url))), '../scripts/test.sh')
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('test_short');
                expect(output.full_text).to.equal('test_full');
                expect(output.color).to.equal('#FF00FF');
                expect(output.urgent).to.be.false;

                //command should stop interval and start a new one
                expect(block.interval.testid).to.be.undefined;

                done();
            }, (block) => {
                block.interval.testmarker = true;
                block._interval = 30000;
            });
        });

        it('should update the output urgent and fire updated', (done) => {
            //construct block
            var block = new Command({
                command: path.join(path.dirname(fs.realpathSync(fileURLToPath(import.meta.url))), '../scripts/urgent.sh')
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('short_test');
                expect(output.full_text).to.equal('full_test');
                expect(output.color).to.equal('#FF0000');
                expect(output.urgent).to.be.true;

                //command should stop interval and start a new one
                expect(block.interval.testid).to.be.undefined;

                done();
            }, (block) => {
                block.interval.testmarker = true;
                block._interval = 30000;
            });
        });
    });

})