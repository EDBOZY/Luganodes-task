require('dotenv').config();
const { ethers } = require('ethers');
const mongoose = require('mongoose');
const Deposit = require('../src/depositSchema');
const logger = require('../src/logger');

// Load environment variables
const RPC_URL = process.env.RPC_URL;
const MONGO_URI = process.env.MONGO_URI;
const BEACON_CONTRACT = process.env.BEACON_CONTRACT.toLowerCase(); // Ensure lowercase for comparison

// Initialize Ethereum provider
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Connect to MongoDB and handle errors
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('MongoDB connected successfully');
        trackDeposits(); // Start tracking after MongoDB is connected
    })
    .catch((err) => {
        logger.error('Error connecting to MongoDB:', err);
    });

// Track deposits to Beacon Contract
async function trackDeposits() {
    provider.on('block', async (blockNumber) => {
        logger.info(`New block detected: ${blockNumber}`);
        try {
            const block = await provider.getBlockWithTransactions(blockNumber);
            logger.info(`Processing block ${blockNumber} with ${block.transactions.length} transactions.`);
            
            // Process each transaction in the block
            for (let tx of block.transactions) {
                if (tx.to) {
                    // Log transaction details for debugging
                    // logger.info(`Transaction found: ${tx.hash}, To: ${tx.to}`);
                    
                    if (tx.to.toLowerCase() === BEACON_CONTRACT) {
                        logger.info(`Deposit detected in block ${blockNumber}, TX: ${tx.hash}`);
                        await saveDeposit(tx, block.timestamp);
                    }
                }
            }
        } catch (err) {
            logger.error('Error tracking deposits:', err);
        }
    });
}

// Save deposit details to the database
async function saveDeposit(tx, blockTimestamp) {
    try {
        // Log the transaction hash for reference
        logger.info(`Saving deposit with TX hash: ${tx.hash}`);
        
        // Create a new deposit object
        const deposit = new Deposit({
            blockNumber: tx.blockNumber,
            blockTimestamp: new Date(blockTimestamp * 1000),
            fee: ethers.utils.formatEther(tx.gasPrice.mul(tx.gasLimit)),
            hash: tx.hash,
            pubkey: tx.from // Replace this if you're tracking actual deposit pubkeys
        });
        
        // Save the deposit to MongoDB
        await deposit.save();
        logger.info(`Deposit saved successfully: ${tx.hash}`);
    } catch (err) {
        logger.error('Error saving deposit:', err);
    }
}

// Optional: A function to test with known transactions
async function trackSpecificTransaction(txHash) {
    try {
        const tx = await provider.getTransaction(txHash);
        const receipt = await provider.getTransactionReceipt(txHash);

        if (tx.to && tx.to.toLowerCase() === BEACON_CONTRACT) {
            logger.info(`Deposit found in transaction ${tx.hash}`);
            await saveDeposit(tx, receipt.blockNumber);
        } else {
            logger.info(`Transaction ${txHash} is not a deposit to the Beacon Contract.`);
        }
    } catch (err) {
        logger.error(`Error fetching or saving transaction ${txHash}:`, err);
    }
}

// Use this to test known deposit transactions
trackSpecificTransaction('0x1391be19259f10e01336a383217cf35344dd7aa157e95030f46235448ef5e5d6');
trackSpecificTransaction('0x53c98c3371014fd54275ebc90a6e42dffa2eee427915cab5f80f1e3e9c64eba4');


