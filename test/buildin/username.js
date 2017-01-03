'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import * as common from './../blockCommon';
import os from 'os';
import Username from './../../lib/buildin/username';

describe('Buildin Username', function() {

    describe('#constructor basic', common.constructor(Username));

    describe('update basic', common.update(Username));

    describe('update', function() {
        it('should update the output and fire updated', sinon.test(function(done) {

            //mock os.userInfo()
            this.stub(os, 'userInfo').returns({
                username: 'peter'
            });

            //construct block
            var block = new Username();

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('peter');
                expect(output.full_text).to.equal('peter');

                done();
            });

        }));
    });
})