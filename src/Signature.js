const nacl = require('libsodium-wrappers');
let kpair;
module.exports = async () => {
    await nacl.ready;
    kpair = nacl.crypto_sign_keypair();
    return Object.freeze({
        verifyingKey: kpair.publicKey,
        sign: (message) => {
            return nacl.crypto_sign(message, kpair.privateKey)
        }
    })}
