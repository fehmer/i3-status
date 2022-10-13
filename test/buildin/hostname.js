'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import * as common from './../blockCommon.js';
import os from 'os';
import Hostname from './../../src/buildin/hostname.js';

afterEach(() => {
  sinon.restore();
});

describe('Buildin Hostname', ()=> {

    describe('#constructor basic', common.constructor(Hostname));

    describe('#constructor', ()=> {
        it('should construct and store custom options', () => {
            var block = new Hostname({
                fqn: true
            });
            expect(block.fqn).to.be.true;
        });
    });

    describe('update basic', common.update(Hostname));

    describe('update', ()=> {
        it('should update the output and fire updated', async()=> {

            //mock os.hostname()
            sinon.stub(os, 'hostname').returns('agecanonix.local');

            //construct block
            var block = new Hostname({
                fqn: true
            });

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('agecanonix.local');
            expect(output.full_text).to.equal('agecanonix.local');
        });
    });

    describe('transform', ()=> {
        it('should extract hostname from simple hostname', () => {
            var block = new Hostname();
            var text = block.transform('agecanonix');
            expect(text).to.equal('agecanonix');
        });

        it('should extract hostname from two part fqn', () => {
            var block = new Hostname();
            var text = block.transform('agecanonix.local');
            expect(text).to.equal('agecanonix');
        });

        it('should extract hostname from three part fqn', () => {
            var block = new Hostname();
            var text = block.transform('agecanonix.local.lan');
            expect(text).to.equal('agecanonix');
        });

        it('should not transform fqn from fqn', () => {
            var block = new Hostname({
                fqn: true
            });
            var text = block.transform('agecanonix.local.lan');
            expect(text).to.equal('agecanonix.local.lan');
        });
    });
})