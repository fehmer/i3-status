'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import os from 'os';
import * as common from './../blockCommon.js';
import Uptime from './../../src/buildin/uptime.js';

afterEach(() => {
  sinon.restore();
});

describe('Buildin Uptime', ()=> {
    describe('#constructor basic', common.constructor(Uptime));

    describe('update basic', common.update(Uptime));

    describe('update', ()=> {
        it('should update the output and fire updated', async()=> {

            //mock os.uptime
            sinon.stub(os, 'uptime').returns(m(45));
            //construct block
            var block = new Uptime();

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('45');
            expect(output.full_text).to.equal('45');
        });
    });

    describe('buildText', ()=> {
        it('should format 3h 34m', () => {
            var text = new Uptime().buildText(h(3) + m(34));
            expect(text).to.equal('03:34');
        });

        it('should format 4m 30d 12h 10m', () => {
            var text = new Uptime().buildText(d(4 * 31) + h(12) + m(5));
            expect(text).to.equal('124d 12:05');
        });

        it('should format 4m 30d 12h 10m', () => {
            var text = new Uptime().buildText(y(5) + d(10 * 31) + h(12) + m(10));
            expect(text).to.equal('5y 309d 12:10');
        });

        it('should apply custom format', () => {
            var text = new Uptime({
                format: 'h [hours]'
            }).buildText(h(500) + m(31));
            expect(text).to.equal('501 hours');
        });

        it('should not trim if trim is set to false', () => {
            var text = new Uptime({
                trim: false
            }).buildText(d(4 * 31) + h(12) + m(10));
            expect(text).to.equal('0y 124d 12:10');
        });

    });

})

function y(years) {
    return years * d(365);
}
function d(days) {
    return days * h(24);
}
function h(hours) {
    return hours * m(60);
}
function m(minutes) {
    return minutes * 60;
}