'use strict';

/** @module buildin/hostname */
import os from 'os';

/**
 * Buildin hostname shows the hostname as short name or full qualified if configured.
 */

export default class Hostname {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        options = options || {};
        this.output = output || {};

        //show fqn?
        this.fqn = options.fqn;
    }

    /**
     * update the blocks output with the current hostname.
     */
    async refresh() {
        //update output
        var text = this.transform(os.hostname());
        this.output.full_text = text;
        this.output.short_text = text;
    }

    /**
     * strip domain part from hostname if fqn is set to false.
     * @private
     */
    transform(hostname) {
        if (this.fqn) return hostname;
        return hostname.split('.')[0];
    }

}