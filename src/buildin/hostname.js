'use strict';

/** @module buildin/hostname */
import { EventEmitter } from 'events';
import { hostname } from 'os';

/**
 * Buildin hostname shows the hostname as short name or full qualified if configured.
 * @extends EventEmitter
 */

export default class Hostname extends EventEmitter {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        super();
        options = options || {};
        this.output = output || {};

        //show fqn?
        this.fqn = options.fqn;
    }

    /**
     * update the blocks output with the current hostname.
     * Remember to emit updated event when done.
     */
    update() {
        //update output
        var text = this.transform(hostname());
        this.output.full_text = text;
        this.output.short_text = text;

        //emit updated event to i3Status
        this.emit('updated', this, this.output);
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