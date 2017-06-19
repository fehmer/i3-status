'use strict';

import aes256 from 'aes256';
import deepMap from 'deep-map';

export default class Crypto {

    /**
     * @param {String} secret - secret
     */
    constructor(secret, prefix) {
        this.secret = secret;
        this.prefix = prefix || '§_';
    }

    encrypt(value) {
        return this.prefix + aes256.encrypt(this.secret, value);
    }

    decrypt(value) {
        if (!value) return undefined;

        if (typeof value === 'object') return deepMap(value, this.decrypt, {
                thisArg: this,
                inPlace: true
            });

        if (typeof value === 'string' && value.startsWith(this.prefix)) {
            if (!this.secret)
                throw new Error('secret cannot be undefined');

            return aes256.decrypt(this.secret, value.substr(2));
        }



        return value;
    }



}