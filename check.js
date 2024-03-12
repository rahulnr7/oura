const {Block, hash_transaction} = require ("@emurgo/cardano-serialization-lib-nodejs")
const fs = require ("fs")
const path = require ("path")

const cborHex = fs.readFileSync(path.join(__dirname,'cbor.txt')).toString()
const block = Block.from_wrapped_bytes(Buffer.from(cborHex,'hex'))

for (let i = 0; i < block.transaction_bodies().len(); i++) {
    const tx = block.transaction_bodies().get(i);
    const hash = hash_transaction(tx).to_hex();
    if (hash === '00a5d69211a2c4c1ea2013206b8fc41c300cac76f84c4c026647d8a4d8afad92') {
   //   console.log(tx.to_hex());
        console.log(tx.to_json())
    }
}