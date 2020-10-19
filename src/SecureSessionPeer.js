const nacl = require('libsodium-wrappers');
const Decryptor = require('./Decryptor');
const Encryptor = require('./Encryptor');
module.exports = async (peer) => {
    await nacl.ready;
    const kp = nacl.crypto_kx_keypair();
    let encryptor, decryptor, rx, tx, msg, peer2;
    let myObj = Object.freeze({
       publicKey: kp.publicKey,
       encrypt: (msg) => {
            return encryptor.encrypt(msg);
       },
       decrypt: (ciphertext, nonce) => {
            return decryptor.decrypt(ciphertext, nonce);
       },
       tMsg: (_msg) => {
        msg = _msg;
        },
       send: (msg) => {
        peer2.tMsg(myObj.encrypt(msg));
       },
       receive: () => {
            return myObj.decrypt(msg.ciphertext, msg.nonce);
       },
       generateSharedKeys: async (peer) => {
        peer2 = peer;      
        const server_keys = nacl.crypto_kx_server_session_keys(kp.publicKey, kp.privateKey, peer2.publicKey);
        rx = server_keys.sharedRx;
        tx = server_keys.sharedTx;
        decryptor = await Decryptor(rx);
        encryptor = await Encryptor(tx);
        }
    });
    if (peer) {
        peer2 = peer;
        const client_keys = nacl.crypto_kx_client_session_keys(kp.publicKey, kp.privateKey, peer2.publicKey);
        rx = client_keys.sharedRx;
        decryptor = await Decryptor(rx);
        tx = client_keys.sharedTx;
        encryptor = await Encryptor(tx);
        peer2.generateSharedKeys(myObj);
    }
    return myObj;
}