'use strict';

/** @module buildin/text */

/**
 * Buildin command shows a fixed text from the configuration
 */
export default class Text {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        options = options || {};
        this.output = output || {};

        //custom config
        this.text = options.text || '';

    }

    /**
     * update the blocks output with the configured text.
     */
    async refresh() {
        //update output
        this.output.full_text = this.text;
        this.output.short_text = this.text;
    }

}