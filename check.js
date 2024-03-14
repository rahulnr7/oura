const {
  Block,
  hash_transaction,
} = require("@emurgo/cardano-serialization-lib-nodejs");
const fs = require("fs");
const path = require("path");

// Replace with Transaction Hash for which CBOR is needed
const txnHash =
  "00a5d69211a2c4c1ea2013206b8fc41c300cac76f84c4c026647d8a4d8afad92";

const strData = fs.readFileSync(path.join(__dirname, "output.txt")).toString();

let cborHexFound = false;
let extractedData = "";

const cborIndex = strData.indexOf("cbor_hex");
if (cborIndex !== -1) {
  const colonIndex = strData.indexOf(":", cborIndex);
  const openingQuoteIndex = strData.indexOf('"', colonIndex);

  if (openingQuoteIndex !== -1) {
    const closingQuoteIndex = strData.indexOf('"', openingQuoteIndex + 1);
    if (closingQuoteIndex !== -1) {
      extractedData = strData.substring(
        openingQuoteIndex + 1,
        closingQuoteIndex
      );
      cborHexFound = true;
    }
  }
}

const cborHex = extractedData;
const block = Block.from_wrapped_bytes(Buffer.from(cborHex, "hex"));

for (let i = 0; i < block.transaction_bodies().len(); i++) {
  const tx = block.transaction_bodies().get(i);
  const hash = hash_transaction(tx).to_hex();
  if (hash === txnHash) {
    console.log(tx.to_hex()); //CBOR hex
    console.log(tx.to_json()); //CBOR JSON
  }
}
