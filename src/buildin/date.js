'use strict';

/** @module buildin/date */
import moment from 'moment';

/**
 * Buildin date shows the current date/time in a configurable format.
 */

export default class Date {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        options = options || {};
        this.output = output || {};

        //custom config
        this.format = options.format || 'MMM DD HH:mm';
    }

    /**
     * update the blocks output with the current date/time.
     */
    async refresh() {
        //update output
        var date = moment().format(this.format);
        
        this.output.full_text = date;
        this.output.short_text = date;
    }
}