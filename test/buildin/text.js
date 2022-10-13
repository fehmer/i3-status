'use strict';

import { expect } from 'chai';
import * as common from './../blockCommon.js';
import Text from './../../src/buildin/text.js';

describe('Buildin Text', ()=> {
    describe('#constructor basic', common.constructor(Text));

    describe('#constructor', ()=> {
        it('should construct and store custom options', () => {
            var block = new Text({
                text: 'Peter'
            });

            expect(block.text).to.equal('Peter');
        });
    });

    describe('update basic', common.update(Text));

    describe('update', async()=> {
        it('should update the output and fire updated', async() => {
            //construct block
            var block = new Text({
                text: 'Peter'
            });

            const output = await common.execute(block);
            //check output line
            expect(output.short_text).to.equal('Peter');
            expect(output.full_text).to.equal('Peter');
        });
    });

})