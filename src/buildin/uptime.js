'use strict';

/** @module buildin/uptime */

import { EventEmitter } from 'events';
import { uptime } from 'os';
import moment from 'moment';
import moment_format from 'moment-duration-format';

/**
 * Buildin uptime displays the current uptime.
 * @extends EventEmitter
 */
export default class Uptime extends EventEmitter {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        super();
        options = options || {};
        this.output = output || {};
        this.format = options.format || 'y[y] D[d] hh:mm';
        this.format_options = {
            trim: (options.trim === undefined || options.trim == true) ? 'left' : false,
            forceLength: true
        };

    }

    /**
     * update the blocks output with the current uptime.
     * Remember to emit updated event when done.
     */
    update() {
        var text = this.buildText(uptime());

        //update output
        this.output.full_text = text;
        this.output.short_text = text;

        //emit updated event to i3Status
        this.emit('updated', this, this.output);
    }

    /**
     * converts the seconds in a human readable format.
     * @private
     */
    buildText(seconds) {
        return moment.duration(seconds, 'seconds').format(this.format, this.format_options);
    }

}