'use strict';

import chai from 'chai';
import chaiString from 'chai-string';
import Crypto from './../lib/crypto';

const expect = chai.expect;
const prefix = '§_';

chai.use(chaiString);

describe('crypto', () => {


    describe('#constructor', () => {
        it('shoud construct with secret', () => {
            var crypto = new Crypto('secret');

            expect(crypto.secret).to.equal('secret');
        });

    });


    describe('encrypt', () => {
        it('should encrypt value', () => {
            var crypto = new Crypto('secret');

            var value = crypto.encrypt('test');

            //check
            expect(value).to.startWith(prefix);
        });

    });

    describe('decrypt', () => {
        it('should decrypt encrypted value', () => {
            var crypto = new Crypto('secret');

            var value = crypto.decrypt('§_BDnDawYRQ0HmJ2iGD6QZb+Vsn+s=');

            //check
            expect(value).to.equal('test');
        });

        it('should detect and return unencrypted value', () => {
            var crypto = new Crypto('secret');

            var value = crypto.decrypt('test');

            //check
            expect(value).to.equal('test');
        });

        it('should throw error when decrypting without secret', () => {
            var crypto = new Crypto();
            expect(() => {
                crypto.decrypt('§_encrypted');
            }).to.throw('secret cannot be undefined');

        });



        it('should decrypt nested values', () => {
            var crypto = new Crypto('secret');
            var config = {
                a: 7,
                b: 'test',
                c: '§_BDnDawYRQ0HmJ2iGD6QZb+Vsn+s=',
                o: {
                    a:7,
                    b: 'test',
                    c: '§_BDnDawYRQ0HmJ2iGD6QZb+Vsn+s='
                },
                p: ['§_GmUiVrWTysAuKwI2fK25kVYb', '§_BDnDawYRQ0HmJ2iGD6QZb+Vsn+s=', 'plaintext']
            }

            var value = crypto.decrypt(config);

            expect(value.a).to.equal(7);
            expect(value.b).to.equal('test');
            expect(value.c).to.equal('test');

            expect(value.o.a).to.equal(7);
            expect(value.o.b).to.equal('test');
            expect(value.o.c).to.equal('test');

            expect(value.p).to.have.ordered.members(['42', 'test', 'plaintext']);
        });

    });

});

