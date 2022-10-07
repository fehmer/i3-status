'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import os from 'os';
import * as common from './../blockCommon.js';
import LoadAvg from './../../src/buildin/loadavg.js';

describe('Buildin LoadAvg', function() {
    describe('#constructor basic', common.constructor(LoadAvg));

    describe('#constructor', function() {
        it('should construct and store custom options', ()=> {

            //mock cpu count
            sinon.stub(os, 'cpus').returns(new Array(4));

            var block = new LoadAvg({
                warning: true
            });

            expect(block.warning).to.be.true;
            expect(block.ncpu).to.equal(4);
        });

        it('should construct with default options', ()=> {

            //mock cpu count
            sinon.stub(os, 'cpus').returns(new Array(2));

            var block = new LoadAvg();
            expect(block.warning).to.be.false;
            expect(block.ncpu).to.equal(2);
        });
    });


    describe('update basic', common.update(LoadAvg));

    describe('update', function() {
        it('should update the output and fire updated', ()=> {

            //mock cpu count
            sinon.stub(os, 'cpus').returns(new Array(4));

            //mock loadavg
            sinon.stub(os, 'loadavg').returns([4.408203125, 4.55078125, 4.50390625]);

            //construct block
            var block = new LoadAvg();

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('4.41');
                expect(output.full_text).to.equal('4.41');
                expect(output.urgent).to.be.false;
            });
        });

        it('should update the output as percentage and fire updated', ()=> {

            //mock cpu count
            sinon.stub(os, 'cpus').returns(new Array(4));

            //mock loadavg
            sinon.stub(os, 'loadavg').returns([1, 1, 1]);

            //construct block
            var block = new LoadAvg({
                display: 'percentage'
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('25%');
                expect(output.full_text).to.equal('25%');
                expect(output.urgent).to.be.false;
            });
        });

        it('should update the urgent output and fire updated', ()=> {

            //mock cpu count
            sinon.stub(os, 'cpus').returns(new Array(4));

            //mock loadavg
            sinon.stub(os, 'loadavg').returns([4.008203125, 4.55078125, 6.50390625]);

            //construct block
            var block = new LoadAvg({
                warning: true
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('4.01');
                expect(output.full_text).to.equal('4.01');
                expect(output.urgent).to.be.true;
            });
        });

    });

})