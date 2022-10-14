'use strict';

import { expect } from 'chai';
import sinon from "sinon";
import * as common from './../blockCommon.js';
import moment from 'moment';
import DateClass from './../../src/buildin/date.js';

afterEach(() => {
  sinon.restore();
});

//use fixed time for test
const fakeTime = moment('2016-04-03 12:34:56');

describe('Buildin Date', ()=> {

    describe('#constructor basic', common.constructor(DateClass));

    describe('#constructor', ()=> {
        it('should construct and store custom options', () => {
            var block = new DateClass({
                format: 'HH:mm'
            });

            expect(block.format).to.equal('HH:mm');
        });
    });

    describe('update basic', common.update(DateClass));

    describe('update', ()=> {
        it('should update the output', async()=>  {
            sinon.stub(moment, 'now').returns(fakeTime);
            //construct block
            var block = new DateClass({
                format: 'HH:mm'
            });

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('12:34');
            expect(output.full_text).to.equal('12:34');

        });
    });
})