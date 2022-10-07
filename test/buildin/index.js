'use strict';

import { expect } from 'chai';
import buildin from './../../src/buildin/index.js';
import DateClass from './../../src/buildin/date.js';
import Text from './../../src/buildin/text.js';
import Hostname from './../../src/buildin/hostname.js';
import Username from './../../src/buildin/username.js';
import Memory from './../../src/buildin/memory.js';
import LoadAvg from './../../src/buildin/loadavg.js';
import Uptime from './../../src/buildin/uptime.js';
import DiskFree from './../../src/buildin/diskfree.js';
import Command from './../../src/buildin/command.js';

describe('Buildins meta', () => {
    it('should contain type date', () => {
        expect(buildin.date).to.equal(DateClass);
    });

    it('should contain type text', () => {
        expect(buildin.text).to.equal(Text);
    });

    it('should contain type hostname', () => {
        expect(buildin.hostname).to.equal(Hostname);
    });

    it('should contain type username', () => {
        expect(buildin.username).to.equal(Username);
    });

    it('should contain type memory', () => {
        expect(buildin.memory).to.equal(Memory);
    });

    it('should contain type loadavg', () => {
        expect(buildin.loadavg).to.equal(LoadAvg);
    });

    it('should contain type uptime', () => {
        expect(buildin.uptime).to.equal(Uptime);
    });

    it('should contain type diskfree', () => {
        expect(buildin.diskfree).to.equal(DiskFree);
    });

        it('should contain type command', () => {
        expect(buildin.command).to.equal(Command);
    });

});