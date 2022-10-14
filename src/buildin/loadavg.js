'use strict';

/** @module buildin/loadavg */
import os from 'os';

/**
 * Buildin LoadAvg shows the load average for the last minute.
 * if warning is true the block will be urgent if load average
 * is greater than the number of cpus.
 */

export default class LoadAvg {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        options = options || {};
        this.output = output || {};

        this.showPercentage = options.display === 'percentage';
        this.warning = options.warning || false;

        this.ncpu = os.cpus().length;
    }

    /**
     * update the blocks output with the last minute load average.
     */
    async refresh() {
        //update output
        var text;
        var avg = os.loadavg()[0];
        var percentage = avg / this.ncpu;

        if (this.showPercentage) {
            text = (percentage*100).toFixed(0) + '%';
        } else {
            text = avg.toFixed(2);
        }

        this.output.full_text = text;
        this.output.short_text = text;

        //block is urgent if warning is enabled and avg is greater the cpu count
        this.output.urgent = this.warning && avg > this.ncpu;
    }

}