'use strict';
import { expect } from 'chai';

export function constructor(blockClass) {
    return () => {

        it('should construct without options', () => {
            var block = new blockClass();
        });


        it('should construct and store options', () => {
            var block = new blockClass({
            }, {
                short_text: 'short',
                long_text: 'long',
                color: 'red'
            });

            expect(block.output.short_text).to.equal('short');
            expect(block.output.long_text).to.equal('long');
            expect(block.output.color).to.equal('red');
        });

    };
}


export function update(blockClass) {
    return () => {
        it('should update the output and fire updated', function(done) {
            //construct block
            var block = new blockClass({
            }, {
                color: 'red'
            });

            execute(block, (output) => {
                //check output line to be set
                expect(output.short_text).to.be.a.string;
                expect(output.full_text).to.be.a.string;
                expect(output.color).to.equal('red');

                done();
            })

        });
    }
}

export function execute(block, verify, prepare) {
    block.__name = block.constructor.name;

    block.on('updated', function(target, output) {
        clearInterval(target.interval);

        expect(target.__name).to.equal(block.__name);
        verify(output);
    });

    //simulate set interval, will never fire
    block._interval = 10000;
    block.interval = setInterval(() => {
        block.update();
    }, block._interval);

    if (prepare)
        prepare(block);

    block.update();
}