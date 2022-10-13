'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import * as common from './../blockCommon.js';
import os from 'os';
import Username from './../../src/buildin/username.js';

afterEach(() => {
  sinon.restore();
});

describe('Buildin Username', ()=> {

    describe('#constructor basic', common.constructor(Username));

    describe('update basic', common.update(Username));

    describe('update', ()=> {
        it('should update the output and fire updated', async() => {

            //mock os.userInfo()
            sinon.stub(os, 'userInfo').returns({
                username: 'peter'
            });

            //construct block
            var block = new Username();

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('peter');
            expect(output.full_text).to.equal('peter');
        });
    });
})