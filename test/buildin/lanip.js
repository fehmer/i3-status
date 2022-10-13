'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import * as common from './../blockCommon.js';
import os from 'os';
import Lanip from './../../src/buildin/lanip.js';

afterEach(() => {
  sinon.restore();
});

describe('Buildin Lanip', ()=> {

    describe('#constructor basic', common.constructor(Lanip));

    describe('#constructor', ()=> {
        it('should construct and store custom options', () => {
            var block = new Lanip({
                interface: 'lo'
            });
            expect(block.interface).to.equal('lo');
        });
    });

    describe('update basic', common.update(Lanip));

    describe('update', ()=> {
        it('should update the output and fire updated', async()=> {

            //mock os.lanip()
            sinon.stub(os, 'networkInterfaces').returns({
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

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('127.0.0.1');
            expect(output.full_text).to.equal('127.0.0.1');
        });
    });

    describe('getIp', ()=> {

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