'use strict';

/** @module builtin/lanip */

import { EventEmitter } from 'events';
import { networkInterfaces } from 'os';

export default class LanIP extends EventEmitter {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        super();
        options = options || {};
        this.output = output || {};

        this.interface = options.interface;
    }

    /**
     * update the block's output with the IP of the specified interface
     */
    update() {
        const output = {};
        Object.assign(output, this.output);
        Object.assign(output, this.buildText());

        output.full_text = output.text;
        output.short_text = output.text;

        this.output = output;
        this.emit('updated', this, output);

        return output;
    }

    buildText() {
        const output = {};

        const interfaces = networkInterfaces();
        const networks = interfaces[this.interface];

        if ( ! networks ) {
            output.text = `interface not found: '${this.interface}'`;
            return;
        }

        if ( networks.length < 1 ) {
            output.text = `No IP`;
            return;
        }

        output.text = networks[0].address;

        return output;
    }
}