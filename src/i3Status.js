#! /usr/bin/env node

'use strict';

/** @module i3Status */

import yaml from 'read-yaml';
import buildin from './buildin/index.js';
import logger from 'winston';
import { exec } from 'child_process';
import Crypto from './crypto.js';
import NoReporter from './noReporter.js';

/** button mapping from i3bar number to button name */
const named_buttons = {
    1: 'left',
    2: 'middle',
    3: 'right',
    4: 'up',
    5: 'down'
}

export default class i3Status {

    /**
     * @param {Object} options - options from the commandline
     * @param {Stream} output - output stream i3Status will write to
     */
    constructor(options, output) {
        //check id config file is present
        var config = yaml.sync(options.config);
        config.main = config.main || {};
        config.blocks = config.blocks || [];

        //store as members
        this.config = config;
        this.output = output;

        // set configured interval, fallback to 30 seconds
        config.main.interval = config.main.interval || 30;

        // set configured color, fallback to white
        config.main.color = config.main.color || '#FFFFFF';

        //values for output
        this.lines = new Array(config.blocks.length);

        //crypto
        this.crypto = new Crypto(options.secret);

        //init repoter
        this.reporter = this.initReporter(config.reporter);
    }

    /**
     * start i3Status. Will initialize all blocks and update them according to the configured interval.
     */
    async run() {
        //print header for i3
        this.output.write('{"version":1,"click_events":true}\n[[]\n');

        //load and update all blocks
        await this.initializeBlocks();

        this.config.blocks.forEach(config => {
            var block = this.blocks[config.name];
            logger.debug('starting %s with interval %d ms', block.__name, config.interval);

            //remember interval time
            block.__interval_time = config.interval;

            //start timer on block
            block.__interval = setInterval(() => {
                block.update()
            }, config.interval);

            //update block for the first time;
            block.update();
        });

    }

    /**
     * initialize all blocks, sets common properties and adds listeners for updated, pause and resume.
     * @private
     */
    async initializeBlocks() {
        const crypto = this.crypto;
        //for all blocks from the config
        
        //check config to be valid
        this.checkConfig();

        const initBlocks = await Promise.all(this.config.blocks.map(async config => {

            //decrypt encrypted values
            config = crypto.decrypt(config);

            //use configured interval or fallback to main interval, convert to ms
            config.interval = (config.interval || this.config.main.interval) * 1000;

            //prepare default output
            var output = {
                name: config.name,
                color: config.color || this.config.main.color,
                background: config.background || this.config.main.background
            };

            //load block
            if (config.type) {
                var type = buildin[config.type];
                if (type == null) {
                    throw new Error('block of type ' + config.type + ' is unknown');
                }
                var block = new type(config, output);
            } else if (config.module) {
                //load module
                try {
                    const module = await import(config.module);
                    var moduleConstructor = module.default;

                    //legacy modules
                    if(module.default.default){
                        moduleConstructor=module.default.default;
                    }

                    var block = new moduleConstructor(config, output);
                } catch (e) {
                    var block = new buildin.text({
                        text: `unable to load module '${config.module}': `+e
                    });
                    block.output.color = '#FF0000';
                }
            }

            //set name
            block.__name = config.name;

            //add click
            block.__click = config.click;

            //add label
            block.__label = config.label;

            //add logger
            block.__logger = logger;

            //add reporter
            block.__reporter = Object.assign(this.reporter,{});

            //add listener for updated
            block.on('updated', ((block, data) => {
                this.update(block.__name, data);
            }));

            //add listener for pause
            block.on('pause', (block) => {
                this.pauseBlock(block);
            });

            //add listener for resume
            block.on('resume', (block) => {
                this.resumeBlock(block);
            });

            //add default action code if no other exists
            if (!block.action)
                block.action = defaultAction;

           return block;
        }));

        const initBlocksMap = initBlocks.reduce((map, block)=> {
            map[block['__name']] = block;
            return map;
        }, {});
        

        var index = 0;
        this.blocks = this.config.blocks.reduce( (map, config)=> {
            var block=initBlocksMap[config.name];
            block.__index= index++;
            map[block['__name']] = block;
            return map;
        },{});
    }

    /**
     * clear all intervals to shutdown i3Status
     */
    close() {
        //clear all intervals
        for (const name in this.blocks) {
            let block = this.blocks[name];
            block.interval = clearInterval(block.__interval);
        }
    }

    /**
     * update the output of a block with the given data
    */
    update(name, data) {
        var block = this.blocks[name];
        var index = block.__index;
        var label = block.__label;
        var line = this.lines[index] = data;

        //add label
        if (label && label.length > 0) {
            line.short_text = label + ' ' + line.short_text;
            line.full_text = label + ' ' + line.full_text;
        }

        this.print();
    }

    /**
     * print all blocks to output stream.
     * @private
     */
    print() {
        this.output.write(',' + JSON.stringify(this.lines) + '\n');
    }

    /**
     * dispatch action to the target block
     */
    action(data) {
        //dispatch action to block
        var block = this.blocks[data.name];
        if (block) block.action(data);
    }

    /**
     * pause (remove) the interval for the given block to prevent further calls to update.
     * @private
     */
    pauseBlock(block) {
        logger.debug('pause interval for ', block.__name);
        block.__interval = clearInterval(block.__interval);
    }

    /**
     * resume (set new) interval for the given block to execute calls to update.
     * @private
     */
    resumeBlock(block) {
        logger.debug(`resume interval (${block.__interval_time}) for ${block.__name}`);
        block.__interval = setInterval(() => {
            block.update();
        }, block.__interval_time);
    }

    /**
     * check if the config is valid.
     * @param {Object} - config for the block to test
     * @private
     */
    checkConfig() {
        //check for duplicate names
        if(this.config.blocks.length != new Set(this.config.blocks.map(it=>it.name)).size){
            throw new Error('config error: duplicate block name found');
        }
        this.config.blocks.forEach(config=> {
            if (!config.name)
                throw new Error('config error: block needs a name');
            if (!config.type && !config.module)
                throw new Error('config error: block ' + config.name + ' has no type/module');
        });
    }

    initReporter(config){
        if(!config || !config.module) return new NoReporter();
        var Reporter = require(config.module).default;
        return new Reporter(config);
    }

}

/**
 * Default action handler for actions from the i3bar.
 * @param {Object} - action from i3bar, see http://i3wm.org/docs/i3bar-protocol.html#_click_events
 */
function defaultAction(action) {
    logger.debug('button pressed on %s:', this.__name, action);
    if (typeof this.__click === 'string') {
        //config is click: command

        //all button clicks have the same action
        exec(this.__click);
    } else if (typeof this.__click === 'object') {
        //config has click action per mouse button

        //get command for the action button
        var command = this.__click[named_buttons[action.button] || action.button];

        //if command exists, execute it
        if (command) exec(command);
    }
}

