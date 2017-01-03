'use strict';

import { expect } from 'chai';
import buildin from './../../lib/buildin';
import DateClass from './../../lib/buildin/date';
import Text from './../../lib/buildin/text';
import Hostname from './../../lib/buildin/hostname';
import Username from './../../lib/buildin/username';
import Memory from './../../lib/buildin/memory';
import LoadAvg from './../../lib/buildin/loadavg';
import Uptime from './../../lib/buildin/uptime';
import DiskFree from './../../lib/buildin/diskfree';
import Command from './../../lib/buildin/command';

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