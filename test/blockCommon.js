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
        it('should update the output', async()=> {
            //construct block
            var block = new blockClass({
            }, {
                color: 'red'
            });

            const output = await execute(block);

            //check output line to be set
            expect(output.short_text).to.be.a.string;
            expect(output.full_text).to.be.a.string;
            expect(output.color).to.equal('red');

        });
    }
}

export async function execute(block) {
    if(block.refresh === undefined){
        return await new Promise(async resolve => {
       
            block.on('updated', async(target, output) => {
                clearInterval(target.interval);
                resolve(output);
            });
            block.update();
        });
    } else {
        await block.refresh();
        return block.output;
    }
    
}
