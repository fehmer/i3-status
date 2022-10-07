#! /usr/bin/env node

'use strict';

import i3Status from './i3Status.js';
import program from 'commander';
import logger from 'winston';
import Crypto from './crypto.js';


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
    .option('-s, --secret [text]', 'secret for encrypted config values')
    .option('--encrypt [value]', 'encrypt config value and exit')
    .option('--decrypt [value]', 'decrypt config value and exit')
    .option('-v, --verbose', 'enable verbose logging')
    .parse(process.argv);

//enable verbose logging if set
if (program.verbose) {
    logger.level = 'debug';
}

//encrypt value and exit
if (program.encrypt || program.decrypt) {
    if (!program.secret) {
        console.log('secret is not defined, please provide a secret (master password) on startup with --secret [text]');
        process.exit(1);
    }

    const crypto = new Crypto(program.secret);

    if (program.encrypt)
        console.log(crypto.encrypt(program.encrypt));
    else if (program.decrypt)
        console.log(crypto.decrypt(program.decrypt));

    process.exit(0);


}

//config file is required, if missing print help and exit
if (!program.config) {
    program.help();
}


//log program starg
logger.info('starting i3-status, logfile:', logConfig.filename);
logger.debug('verbose logging activated');

if (!program.secret) logger.warn('secret is not defined, please provide a secret (master password) on startup with --secret [text]');


//create i3Status instance and start
let i3 = new i3Status(program, process.stdout);
await i3.run();


//read from stdin, try to parse json and pass to i3Status
process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        let text = chunk.toString('utf-8');
        let match = text = /.*(\{.*\}).*/.exec(text);
        if (match && match[1]) i3.action(JSON.parse(match[1]));
    }
});