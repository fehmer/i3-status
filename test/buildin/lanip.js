'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import * as common from './../blockCommon';
import os from 'os';
import Lanip from './../../lib/buildin/lanip';

describe('Buildin lanip', function() {

    describe('#constructor basic', common.constructor(Lanip));

    describe('#constructor', function() {
        it('should construct and store custom options', () => {
            var block = new Lanip({
                interface: 'lo'
            });
            expect(block.interface).to.equal('lo');
        });
    });

    describe('update basic', common.update(Lanip));

    describe('update', function() {
        it('should update the output and fire updated', sinon.test(function(done) {

            //mock os.lanip()
            this.stub(os, 'networkInterfaces').returns({
                lo: [{
                    address: '127.0.0.1',
                    netmask: '255.0.0.0',
                    family: 'IPv4',
                    mac: '00:00:00:00:00:00',
                    internal: true,
                    cidr: '127.0.0.1/8'
                }],
            });

            //construct block
            var block = new Lanip({
                interface: 'lo'
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('127.0.0.1');
                expect(output.full_text).to.equal('127.0.0.1');

                done();
            });
        }));
    });

    describe('getIp', function() {

         it('should extract for known interface', () => {
            var block = new Lanip({interface: 'lo' });
            var text = block.extractIp({lo: [{address: '127.0.0.1'}]});
            expect(text).to.equal('127.0.0.1');
        });

        it('should handle missing interface', () => {
            var block = new Lanip({interface: 'eth0' });
            var text = block.extractIp({lo: [{address: '127.0.0.1'}]});
            expect(text).to.equal('interface not found: \'eth0\'');
        });

        it('should handle interface without address', () => {
            var block = new Lanip({interface: 'lo' });
            var text = block.extractIp({lo: []});
            expect(text).to.equal('No IP');
        });
    });
    
})