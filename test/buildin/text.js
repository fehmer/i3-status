'use strict';

import { expect } from 'chai';
import * as common from './../blockCommon.js';
import Text from './../../src/buildin/text.js';

describe('Buildin Text', function() {
    describe('#constructor basic', common.constructor(Text));

    describe('#constructor', function() {
        it('should construct and store custom options', () => {
            var block = new Text({
                text: 'Peter'
            });

            expect(block.text).to.equal('Peter');
        });
    });

    describe('update basic', common.update(Text));

    describe('update', function() {
        it('should update the output and fire updated', (done) => {
            //construct block
            var block = new Text({
                text: 'Peter'
            });

            common.execute(block, (output) => {
                //check output line
                expect(output.short_text).to.equal('Peter');
                expect(output.full_text).to.equal('Peter');

                done();
            });
        });
    });

})