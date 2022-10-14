'use strict';

/** @module buildin/command */
import util from 'util';
import child_process from 'child_process';
const exec = util.promisify(child_process.exec);
import logger from 'winston';

/**
 * Buildin command runs commands as a child process.
 */

export default class Command {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        options = options || {};
        this.output = output || {};

        //custom config
        this.text = options.text || '';

        this.command = options.command || 'echo command not defined';

    }

    /**
     * update the blocks output.
     */
    async refresh() {
        await this.execute(this.command);
    }

    /**
     * execute the command, update the output full_text, short_text
     * and set urgent if exit code != 0.
     * @private
     */
    async execute(command) {

        //prepare command
        var cmdline = this.command.split(' ');
        var cmd = cmdline.shift();

        //execute command
        logger.debug('execute command %s for block %s', cmd, this.__name);

        var result;
        try{
            result = await exec(cmd, cmdline);
            this.output.urgent = false;
        } catch (error){
            //set urgent flag based on exitcode
            result = error;
            this.output.urgent = true;
        }

        const {stdout, stderr} = result;

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
    }

    pauseDuringRefresh() {
        //pause interval during execution to prevent command to be called while already running
        return true;
    }

}