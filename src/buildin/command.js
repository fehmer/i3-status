'use strict';

/** @module buildin/command */

import { EventEmitter } from 'events';
import { exec } from 'child_process';
import logger from 'winston';

/**
 * Buildin command runs commands as a child process.
 * @extends EventEmitter
 */

export default class Command extends EventEmitter {
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

        this.command = options.command || 'echo command not defined';

    }

    /**
     * update the blocks output.
     * Remember to emit updated event when done.
     */
    update() {
        this.execute(this.command);
    }

    /**
     * execute the command, update the output full_text, short_text
     * and set urgent if exit code != 0.
     * @private
     */
    execute(command) {

        //stop old interval
        this.emit('pause', this);

        //prepare command
        var cmdline = this.command.split(' ');
        var cmd = cmdline.shift();

        //execute command
        logger.debug('execute command %s for block %s', cmd, this.__name);
        exec(cmd, cmdline, (error, stdout, stderr) => {

            //set urgent flag based on exitcode
            this.output.urgent = (error) ? true : false;

            //split by newline, filter out empty lines
            var result = stdout.split(['\n']).filter((element) => {
                return element.length != 0;
            });

            //update output
            this.output.full_text = result.length > 0 ? result[0] : '';
            this.output.short_text = result.length > 1 ? result[1] : '';

            //set color only if set in result
            if (result.length > 2)
                this.output.color = result[2];

            //set new interval
            this.emit('resume', this);

            //emit updated event to i3Status
            this.emit('updated', this, this.output);

        });

    }

}