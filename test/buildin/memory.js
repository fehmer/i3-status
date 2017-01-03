'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import * as common from './../blockCommon';
import os from 'os';
import Memory from './../../lib/buildin/memory';

describe('Buildin Memory', function() {
    describe('#constructor basic', common.constructor(Memory));

    describe('#constructor', function() {
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
            expect(function() {
                var block = new Memory({
                    display: 'unknown'
                });
            }).to.throw('display must be percentage or amount');
        });

    });

    describe('update basic', common.update(Memory));

    describe('update', function() {
        it('should update the output amount and fire updated', sinon.test(function(done) {
            //mock os.freemem() and os.totalmem
            this.stub(os, 'freemem').returns(15.5 * 1024 * 1024 * 1024);
            this.stub(os, 'totalmem').returns(16 * 1024 * 1024 * 1024);
            //construct block
            var block = new Memory({
                display: 'amount'
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('512MB/16GB');
                expect(output.full_text).to.equal('512MB/16GB');
                expect(output.urgent).to.be.false;

                done();
            });
        }));

        it('should update the output percent and fire updated', sinon.test(function(done) {
            //mock os.freemem() and os.totalmem
            this.stub(os, 'freemem').returns(4 * 1024 * 1024 * 1024);
            this.stub(os, 'totalmem').returns(16 * 1024 * 1024 * 1024);
            //construct block
            var block = new Memory();

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('75%');
                expect(output.full_text).to.equal('75%');
                expect(output.urgent).to.be.false;

                done();
            });
        }));

        it('should update the output percent_free and fire updated', sinon.test(function(done) {
            //mock os.freemem() and os.totalmem
            this.stub(os, 'freemem').returns(4 * 1024 * 1024 * 1024);
            this.stub(os, 'totalmem').returns(16 * 1024 * 1024 * 1024);
            //construct block
            var block = new Memory({
                display: 'percent_free'
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('25%');
                expect(output.full_text).to.equal('25%');
                expect(output.urgent).to.be.false;

                done();
            });
        }));


        it('should update the output percent_free with urgent and fire updated', sinon.test(function(done) {
            //mock os.freemem() and os.totalmem
            this.stub(os, 'freemem').returns(.5 * 1024 * 1024 * 1024);
            this.stub(os, 'totalmem').returns(16 * 1024 * 1024 * 1024);
            //construct block
            var block = new Memory({
                display: 'percent_free'
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('3%');
                expect(output.full_text).to.equal('3%');
                expect(output.urgent).to.be.true;

                done();
            });
        }));
    });

})