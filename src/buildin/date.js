'use strict';

/** @module buildin/date */

import { EventEmitter } from 'events';
import logger from 'winston';
import moment from 'moment';

/**
 * Buildin date shows the current date/time in a configurable format.
 * @extends EventEmitter
 */

export default class Date extends EventEmitter {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        super();
        options = options || {};
        this.output = output || {};

        //custom config
        this.format = options.format || 'MMM DD HH:mm';
    }

    /**
     * update the blocks output with the current date/time.
     * Remember to emit updated event when done.
     */
    update() {
        //update output
        var date = moment().format(this.format);
        this.output.full_text = date;
        this.output.short_text = date;

        //emit updated event to i3Status
        this.emit('updated', this, this.output);
    }

}