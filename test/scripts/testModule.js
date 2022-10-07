'use strict';

import { EventEmitter } from 'events';

export default class TestModule extends EventEmitter {
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
        this.secretValue = options.secretValue;
    }

    update() {
        //update output
        var text = 'test_module'
        this.output.full_text = text;
        this.output.short_text = text;

        //emit updated event to i3Status
        this.emit('updated', this, this.output);
    }
}