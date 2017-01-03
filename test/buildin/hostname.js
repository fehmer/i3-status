'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import * as common from './../blockCommon';
import os from 'os';
import Hostname from './../../lib/buildin/hostname';

describe('Buildin Hostname', function() {

    describe('#constructor basic', common.constructor(Hostname));

    describe('#constructor', function() {
        it('should construct and store custom options', () => {
            var block = new Hostname({
                fqn: true
            });
            expect(block.fqn).to.be.true;
        });
    });

    describe('update basic', common.update(Hostname));

    describe('update', function() {
        it('should update the output and fire updated', sinon.test(function(done) {

            //mock os.hostname()
            this.stub(os, 'hostname').returns('agecanonix.local');

            //construct block
            var block = new Hostname({
                fqn: true
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('agecanonix.local');
                expect(output.full_text).to.equal('agecanonix.local');

                done();
            });
        }));
    });

    describe('transform', function() {
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