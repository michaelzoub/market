import crypto from "crypto"

export function createUUIDForCryptoTx() {
    return crypto.randomUUID()
}