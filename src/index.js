#! /usr/bin/env node

'use strict';

import i3Status from './i3Status';
import program from 'commander';
import logger from 'winston';


//configure logger, log to .i3Status.log, disable console logger
const logConfig = {
    filename: '.i3Status.log'
};
logger.add(logger.transports.File, logConfig);
logger.remove(logger.transports.Console);
logger.level = 'info';


//define program options
program
    .version('0.0.1')
    .option('-c, --config [file]', 'yaml config file')
    .option('-v, --verbose')
    .parse(process.argv);

//config file is required, if missing print help and exit
if (!program.config) {
    program.help();
}

//enable verbose logging if set
if (program.verbose) {
    logger.level = 'debug';
}

//log program starg
logger.info('starting i3-status, logfile:', logConfig.filename);
logger.debug('verbose logging activated');

//create i3Status instance and start
let i3 = new i3Status(program, process.stdout);
i3.run();


//read from stdin, try to parse json and pass to i3Status
process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        let text = chunk.toString('utf-8');
        let match = text = /.*(\{.*\}).*/.exec(text);
        if (match && match[1]) i3.action(JSON.parse(match[1]));
    }
});