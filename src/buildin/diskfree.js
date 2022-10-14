'use strict';

/** @module buildin/diskfree */
import diskusage from 'diskusage';
import os from 'os';
import bytes from 'bytes';

/**
 * Buildin DiskFree shows free disk space for a given mount point.
 */

export default class DiskFree {
    /**
     * @param {Object} options - block configuration from config file
     * @param {Object} output - block output for i3bar
     */
    constructor(options, output) {
        options = options || {};
        this.output = output || {};

        //custom config
        this.mount = options.mount || os.homedir();
        this.warning = options.warning;

    }

    /**
     * update the blocks output with the available bytes free.
     */
    async refresh() {
        //update output
        const info = await diskusage.check(this.mount);
        const text = bytes(info.available, { decimalPlaces: 0 });
            
        this.output.full_text = text;
        this.output.short_text = text;
        this.output.urgent = this.isUrgent(info);
    }

    /**
     * determine if the available free space is beneath the warning limit.
     * the limit can be in percent, bytes or a string like 25g for 25 gigabytes.
     * @private
     */
    isUrgent(info) {
        if (!this.warning) return false;

        if (typeof this.warning === 'number') {
            //is urgent if available space is lower than warning value (in bytes)
            return info.available < this.warning;
        } else if (this.warning.endsWith('%')) {
            //is urgent if available space is lower than a percentage
            var free = (info.available / info.total) * 100;
            var warn = parseInt(this.warning.substr(0, this.warning.length - 1));
            return free < warn;
        } else {
            //parse this.warning (e.g. 50mb) to bytes and check if available is lower
            var warn = bytes.parse(this.warning);
            return info.available < warn;
        }
    }

}
