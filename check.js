import {Block, hash_transaction} from "@emurgo/cardano-serialization-lib-nodejs"
import fs from "fs"
import path from "path"

// Replace with Transaction Hash for which CBOR is needed
const txnHash =
  "4e8d04bfb5a91ab5c999e798d1fb7acd60339dd4a6769b69c4ac420391ed4a42";

const strData = fs.readFileSync(path.join("output.txt")).toString();

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
