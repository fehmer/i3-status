'use strict';

/** @module buildin/username */

import { EventEmitter } from 'events';
import { userInfo } from 'os';

/**
 * Buildin username shows the name of the current user.
 * @extends EventEmitter
 */

export default class Username extends EventEmitter {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        super();
        options = options || {};
        this.output = output || {};
    }

    /**
     * update the blocks output with the current username.
     * Remember to emit updated event when done.
     */
    update() {
        //update output
        var text = userInfo().username;
        this.output.full_text = text;
        this.output.short_text = text;

        //emit updated event to i3Status
        this.emit('updated', this, this.output);
    }
}