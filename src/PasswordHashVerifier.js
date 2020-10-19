const nacl = require('libsodium-wrappers');
module.exports = async (key) => {
    await nacl.ready;
    return Object.freeze({
        verify: (hashedpass, pass) => {
           return nacl.crypto_pwhash_str_verify(hashedpass, pass);
}});
}