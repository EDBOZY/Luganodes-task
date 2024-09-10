// require('dotenv').config();
// const { ethers } = require('ethers');
// // import { JsonRpcProvider } from 'ethers';


// // Use the hardcoded RPC URL for now to test connection
// const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/');

// // Test the connection
// async function getLatestBlock() {
//     try {
//         console.log("Attempting to fetch the latest block...");
//         const blockNumber = await provider.getBlockNumber();
//         console.log("Latest block number: ", blockNumber);

//         const block = await provider.getBlock(blockNumber);
//         console.log("Block details: ", block);
//     } catch (error) {
//         console.error("Error fetching block number:", error);
//     }
// }

// getLatestBlock();

// require('dotenv').config();
// const mongoose = require('mongoose');
// const Deposit = require('./depositSchema');
// const logger = require('./logger');

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(async () => {
//         logger.info('MongoDB connected for testing');

//         const testDeposit = new Deposit({
//             blockNumber: 12345678,
//             blockTimestamp: new Date(),
//             fee: '0.01',
//             hash: '0x1234567890abcdef',
//             pubkey: '0xabcdef1234567890'
//         });

//         await testDeposit.save();
//         logger.info('Test deposit saved successfully.');
//     })
//     .catch((err) => {
//         logger.error('Error connecting to MongoDB for testing:', err);
//     });


// Imports the Alchemy SDK
const main = async () => {
    // Beacon Deposit Contract address
    let toAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa"; // Beacon Deposit Contract
  
    // Fetch ETH transactions (external and internal) to the specified contract
    let response = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0", // Start from the genesis block
      toAddress: toAddress,
      excludeZeroValue: true,
      category: ["external", "internal"], // Track ETH and internal contract calls
    });
  
    // Logging the response to the console
    console.log(response);
  };
  
  main();
  
