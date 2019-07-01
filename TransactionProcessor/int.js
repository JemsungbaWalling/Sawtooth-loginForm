'use strict'

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { createHash } = require('crypto');
const cbor = require('cbor')
const { InternalError } = require('sawtooth-sdk/processor/handler')

const TP_FAMILY = 'loginForm'
const TP_NAMESPACE = hash(TP_FAMILY).substring(0, 6);
const TP_VERSION = '1.0';


function hash(input) {
    return createHash('sha512').update(input).digest('hex').toLowerCase().slice(0, 64)

}

function StorePl(context, address, payload) {
    let payloadBytes = cbor.encode(payload);
    let entries = {
        [address]: payloadBytes
    }
    return context.setState(entries)
}

class loginHandler extends TransactionHandler {
    constructor() {
        console.log(`Iniitialising the Transaction Family with the name ${TP_FAMILY} and with the address ${TP_NAMESPACE}`)
        super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE]);
    }

    apply(transactionProcessorRequest, context) {
        console.log('apply')
            // throw new InternalError('Entered the apply function')
        let payload = cbor.decode(transactionProcessorRequest.payload)
        console.log(payload)
        let header = transactionProcessorRequest.header
        const publicKey = header.signerPublicKey
        console.log('Public KEY' + publicKey)
        const address = TP_NAMESPACE + hash(publicKey).slice(-64);
        console.log('Address ', address)
        return StorePl(context, address, payload);
    }
}

module.exports = loginHandler
