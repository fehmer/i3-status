'use strict';

/** @module buildin/username */
import os from 'os';

/**
 * Buildin username shows the name of the current user.
 */

export default class Username {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        options = options || {};
        this.output = output || {};
    }

    /**
     * update the blocks output with the current username.
     */
    async refresh() {
        //update output
        var text = os.userInfo().username;
        this.output.full_text = text;
        this.output.short_text = text;
    }
}