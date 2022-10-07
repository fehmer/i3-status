'use strict';

/** @module buildin */

import command from './command.js';
import date from './date.js';
import diskfree from './diskfree.js';
import hostname from './hostname.js';
import lanip from './lanip.js';
import loadavg from './loadavg.js';
import memory from './memory.js';
import text from './text.js';
import uptime from './uptime.js';
import username from './username.js';

/**
 * buildins contains all available buildin types
 */
export default {
    command,
    date,
    diskfree,
    hostname,
    lanip,
    loadavg,
    memory,
    text,
    uptime,
    username
}