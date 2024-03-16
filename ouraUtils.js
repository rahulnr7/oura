import { spawn } from 'child_process'
import fs from "fs"
import { Block, hash_transaction } from "@emurgo/cardano-serialization-lib-nodejs"
import path from "path"


// Sample Oura command to execute
// 'oura daemon --config daemon.toml --cursor 116956876,2760ee4207c51344154116cb465138a99eb7214cd8c2fdf1486cd81994ce50e0'

export const runOuraCommand = async (absolutSlot, blockhash) => {

    return new Promise((resolve, reject) => {

        // Use the full path to the 'oura' executable
        const ouraPath = "/usr/local/bin/oura";
        const args = [
            "daemon",
            "--config",
            "daemon.toml",
            "--cursor",
            `${absolutSlot},${blockhash}`,
        ];

        // Execute the command
        const child = spawn(ouraPath, args)

        // Store the output in a file
        const outputFile = "output.txt";
        const outputStream = fs.createWriteStream(outputFile)

        // Pipe the child process stdout to the output file
        child.stdout.pipe(outputStream)
        // Set a timeout to kill the child process after 3 seconds
        const timeout = setTimeout(() => {
            console.log("Timeout reached. Stopping execution.")
            child.kill("SIGINT") // Send a SIGINT signal to gracefully terminate the child process
            resolve(stdoutData)
        }, 3000) // 3 seconds

        // Listen for the child process to exit
        child.on("exit", (code, signal) => {
            clearTimeout(timeout) // Clear the timeout when the process exits
            console.log(`Child process exited with code ${code} and signal ${signal}`)
        })

        // Listen for any output from the child process
        let stdoutData = ''
        child.stdout.on("data", (data) => {
            // console.log(`stdout: ${data}`)
            stdoutData += data.toString()
        })

        child.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`)
        })

        child.on('error', (err) => {
            reject(err)
        })
    })

}

export const getLogs = async (absolutSlot, blockhash) => {
    console.log('calllin oura')
    return runOuraCommand(absolutSlot, blockhash).then((strData) => {
        let cborHexFound = false;
        let extractedData = "";

        const cborIndex = strData.indexOf("cbor_hex")
        if (cborIndex !== -1) {
            const colonIndex = strData.indexOf(":", cborIndex)
            const openingQuoteIndex = strData.indexOf('"', colonIndex)

            if (openingQuoteIndex !== -1) {
                const closingQuoteIndex = strData.indexOf('"', openingQuoteIndex + 1)
                if (closingQuoteIndex !== -1) {
                    extractedData = strData.substring(
                        openingQuoteIndex + 1,
                        closingQuoteIndex
                    )
                    cborHexFound = true;
                }
            }
        }
        return extractedData
    }).catch((err) => {
        console.error('Error occured', err)
    })
}


export const getCBOR = async (txnHash, cborHex, format) => {

    const block = Block.from_wrapped_bytes(Buffer.from(cborHex, "hex"))

    for (let i = 0; i < block.transaction_bodies().len(); i++) {
        const tx = block.transaction_bodies().get(i)
        const hash = hash_transaction(tx).to_hex()
        if (hash === txnHash) {
            format == 'json' ? console.log(tx.to_json()) : console.log(tx.to_hex())
        }
    }
}



