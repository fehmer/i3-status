'use strict';

/** @module buildin/memory */

import { EventEmitter } from 'events';
import { freemem, totalmem } from 'os';
import bytes from 'bytes';

/**
 * Buildin memory displays the used/free amount of memory in percent or total amount.
 * @extends EventEmitter
 */

export default class Memory extends EventEmitter {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        super();
        options = options || {};
        this.output = output || {};
        this.display = options.display || 'percent';
        if (this.display != 'percent' && this.display != 'percent_free' && this.display != 'amount')
            throw new Error('display must be percentage or amount');

        this.warning = options.warning || 10;

        //custom config
        this.text = options.text || '';

    }

    /**
     * update the blocks output with the free/used memory based on the config.
     * Remember to emit updated event when done.
     */
    update() {
        //update output
        var output = this.buildText();

        this.output.full_text = output.text;
        this.output.short_text = output.text;
        this.output.urgent = output.urgent;

        //emit updated event to i3Status
        this.emit('updated', this, this.output);
    }

    /**
     * builds the output text.
     * @private
     */
    buildText() {
        var output = {};
        var free = freemem();
        var total = totalmem();

        if (this.display == 'amount') {
            //show bytes used and bytes total
            output.text = bytes(total - free, {decimalPlaces: 2}) + '/' + bytes(total, {decimalPlaces: 2});

        } else if (this.display == 'percent') {
            ///show used memory in percent
            output.text = Math.floor((total - free) / total * 100) + '%';

        } else {
            //show free memory in percent
            output.text = Math.floor(free / total * 100) + '%';
        }

        //block is urgent if free memory is less the the warning percentage
        output.urgent = (free / total * 100) <= this.warning;

        return output;

    }

}