'use strict';

/** @module builtin/lanip */
import os from 'os';

export default class LanIP {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        options = options || {};
        this.output = output || {};

        this.interface = options.interface;
    }

    /**
     * update the block's output with the IP of the specified interface
     */
    async refresh() {
        var text = this.extractIp(os.networkInterfaces());
        this.output.full_text = text;
        this.output.short_text = text;
    }

    extractIp(interfaces) {
        const networks = interfaces[this.interface];

        if ( ! networks ) {
            return `interface not found: '${this.interface}'`;
        }

        if ( networks.length < 1 ) {
            return `No IP`;
        }

        return networks[0].address;
    }
}