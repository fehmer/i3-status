'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import * as common from './../blockCommon.js';
import os from 'os';
import Memory from './../../src/buildin/memory.js';

afterEach(() => {
  sinon.restore();
});

describe('Buildin Memory', ()=> {
    describe('#constructor basic', common.constructor(Memory));

    describe('#constructor', ()=> {
        it('should construct and store custom options', () => {
            var block = new Memory({
                display: 'amount',
                warning: 40
            });

            expect(block.display).to.equal('amount');
            expect(block.warning).to.equal(40);
        });

        it('should construct and use default options', () => {
            var block = new Memory();

            expect(block.display).to.equal('percent');
            expect(block.warning).to.equal(10);
        });

        it('should refuse to construct with unknown display', () => {
            expect(()=> {
                var block = new Memory({
                    display: 'unknown'
                });
            }).to.throw('display must be percentage or amount');
        });

    });

    describe('update basic', common.update(Memory));

    describe('update', ()=> {
        it('should update the output amount', async()=> {
            //mock os.freemem() and os.totalmem
            sinon.stub(os, 'freemem').returns(15.5 * 1024 * 1024 * 1024);
            sinon.stub(os, 'totalmem').returns(16 * 1024 * 1024 * 1024);
            //construct block
            var block = new Memory({
                display: 'amount'
            });

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('512MB/16GB');
            expect(output.full_text).to.equal('512MB/16GB');
            expect(output.urgent).to.be.false;
        });

        it('should update the output percent', async()=> {
            //mock os.freemem() and os.totalmem
            sinon.stub(os, 'freemem').returns(4 * 1024 * 1024 * 1024);
            sinon.stub(os, 'totalmem').returns(16 * 1024 * 1024 * 1024);
            //construct block
            var block = new Memory();

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('75%');
            expect(output.full_text).to.equal('75%');
            expect(output.urgent).to.be.false;
        });

        it('should update the output percent_free', async()=> {
            //mock os.freemem() and os.totalmem
            sinon.stub(os, 'freemem').returns(4 * 1024 * 1024 * 1024);
            sinon.stub(os, 'totalmem').returns(16 * 1024 * 1024 * 1024);
            //construct block
            var block = new Memory({
                display: 'percent_free'
            });

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('25%');
            expect(output.full_text).to.equal('25%');
            expect(output.urgent).to.be.false;
        });


        it('should update the output percent_free with urgent',  async()=> {
            //mock os.freemem() and os.totalmem
            sinon.stub(os, 'freemem').returns(.5 * 1024 * 1024 * 1024);
            sinon.stub(os, 'totalmem').returns(16 * 1024 * 1024 * 1024);
            //construct block
            var block = new Memory({
                display: 'percent_free'
            });

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('3%');
            expect(output.full_text).to.equal('3%');
            expect(output.urgent).to.be.true;
        });
    });

})