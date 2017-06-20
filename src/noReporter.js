'use strict';

/** Fallback reporter does nothing and does not support any types */
export default class NoReporter {
    /**
     * @param {Object} options - options from the config yaml
     */
    constructor(options) {}

    /**
     * displays information
     * @param {String} data - content to show, based on the supported type it could be html.
     * @param {Object} action - action from i3bar, see http://i3wm.org/docs/i3bar-protocol.html#_click_events. Contains the click position.
     */
    display(data, action) {}


    /**
     * @param {String} type - type of the content the module provides, e.g. html
     * @return {boolean} true, if the type is supported, false otherwise
     */
    supports(type) {
        return false;
    }
}