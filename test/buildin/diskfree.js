'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import os from 'os';
import diskusage from 'diskusage';
import * as common from './../blockCommon.js';
import Diskfree from './../../src/buildin/diskfree.js';

afterEach(() => {
  sinon.restore();
});

describe('Buildin Diskfree', function() {
    describe('#constructor basic', common.constructor(Diskfree));

    describe('#constructor', function() {
        it('should construct and store custom options', () => {
            var block = new Diskfree({
                mount: '/mnt/disk2',
                warning: '10%'
            });

            expect(block.mount).to.equal('/mnt/disk2');
            expect(block.warning).to.equal('10%');
        });

        it('should construct and store default options', ()=> {

            //mock os.homedir
            sinon.stub(os, 'homedir').returns('/home/peter');

            var block = new Diskfree();

            expect(block.mount).to.equal('/home/peter');
            expect(block.warning).to.be.undefined;
        });
    });

    describe('update basic', common.update(Diskfree));

    describe('update', function() {
        it('should update the output and fire updated', ()=> {

            //mock diskusage
            sinon.stub(diskusage, 'check').yields(null, {
                available: mb(500),
                total: mb(530)
            });

            //construct block
            var block = new Diskfree({
                mount: '/mnt/test'
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('500MB');
                expect(output.full_text).to.equal('500MB');
            });
        });

        it('should update with low disk space defined by percentage', ()=> {

            //mock diskusage
            sinon.stub(diskusage, 'check').yields(null, {
                available: mb(40),
                total: mb(500)
            });

            //construct block
            var block = new Diskfree({
                mount: '/mnt/test',
                warning: '10%'
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('40MB');
                expect(output.full_text).to.equal('40MB');
                expect(output.urgent).to.be.true;

            });
        });

         it('should update with low disk space defined by total amount as number',()=> {

            //mock diskusage
            sinon.stub(diskusage, 'check').yields(null, {
                available: mb(40)
            });

            //construct block
            var block = new Diskfree({
                mount: '/mnt/test',
                warning: mb(50)
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('40MB');
                expect(output.full_text).to.equal('40MB');
                expect(output.urgent).to.be.true;

            });
        });

        it('should update with low disk space defined by total amount as 50mb', ()=> {

            //mock diskusage
            sinon.stub(diskusage, 'check').yields(null, {
                available: mb(40)
            });

            //construct block
            var block = new Diskfree({
                mount: '/mnt/test',
                warning: '50mb'
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('40MB');
                expect(output.full_text).to.equal('40MB');
                expect(output.urgent).to.be.true;

            });
        });
    });
});

function kb(kbytes) {
    return kbytes * 1024;
}
function mb(mbytes) {
    return kb(mbytes * 1024);
}
function gb(gbytes) {
    return mb(gbytes * 1024);
}