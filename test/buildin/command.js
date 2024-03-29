'use strict';

import chai from 'chai';
const expect = chai.expect
import * as common from './../blockCommon.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Command from './../../src/buildin/command.js';
import spies from 'chai-spies';
chai.use(spies);

describe('Buildin Command', ()=> {
    describe('#constructor basic', common.constructor(Command));

    describe('#constructor', ()=> {
        it('should construct and store custom options', () => {
            var block = new Command({});


        });
    });

    describe('update basic', common.update(Command));

    describe('update', ()=> {
        it('should update the output and fire updated', async() => {
            //construct block
            var block = new Command({
                command: path.join(path.dirname(fs.realpathSync(fileURLToPath(import.meta.url))), '../scripts/test.sh')
            });

            const spy = chai.spy.on(block, 'emit');
            const output = await common.execute(block);

            //check output line
            expect(output.short_text).to.equal('test_short');
            expect(output.full_text).to.equal('test_full');
            expect(output.color).to.equal('#FF00FF');
            expect(output.urgent).to.be.false;

            //command should stop interval and start a new one
            expect(spy).to.be.called.with('pause');
            expect(spy).to.be.called.with('resume');
        });

        it('should update the output urgent and fire updated', async() => {
            //construct block
            var block = new Command({
                command: path.join(path.dirname(fs.realpathSync(fileURLToPath(import.meta.url))), '../scripts/urgent.sh')
            });

            const output = await common.execute(block);

            //check output line
            expect(output.short_text).to.equal('short_test');
            expect(output.full_text).to.equal('full_test');
            expect(output.color).to.equal('#FF0000');
            expect(output.urgent).to.be.true;
        });
    });

})