'use strict';

/** @module buildin/text */

import { EventEmitter } from 'events';

/**
 * Buildin command shows a fixed text from the configuration
 * @extends EventEmitter
 */
export default class Text extends EventEmitter {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        super();
        options = options || {};
        this.output = output || {};

        //custom config
        this.text = options.text || '';

    }

    /**
     * update the blocks output with the configured text.
     * Remember to emit updated event when done.
     */
    update() {
        //update output
        this.output.full_text = this.text;
        this.output.short_text = this.text;

        //emit updated event to i3Status
        this.emit('updated', this, this.output);
    }

}