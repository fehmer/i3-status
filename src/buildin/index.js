'use strict';

/** @module buildin */

import command from './command';
import date from './date';
import diskfree from './diskfree';
import hostname from './hostname';
import loadavg from './loadavg';
import memory from './memory';
import text from './text';
import uptime from './uptime';
import username from './username';

/**
 * buildins contains all available buildin types
 */
export default {
    command,
    date,
    diskfree,
    hostname,
    loadavg,
    memory,
    text,
    uptime,
    username
}