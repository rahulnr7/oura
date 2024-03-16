import * as ouraUtils from './ouraUtils.js'

// replacce param 1
const absoluteSlot = '118995024'
// replace param2
const blockhash = 'b8695cf98aa41c6b7d3803df45b62d244621d5d16fa16ba6a0a1a3f8fdf1cdc2'
// replace txnHash
const txnHash = "4e8d04bfb5a91ab5c999e798d1fb7acd60339dd4a6769b69c4ac420391ed4a42"

const cborhex = await ouraUtils.getLogs(absoluteSlot, blockhash)

// replace the third parameter with 'hex' or 'json' to change the output format
await ouraUtils.getCBOR(txnHash, cborhex, 'json')
