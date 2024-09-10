// depositSchema.js
const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    blockNumber: Number,
    blockTimestamp: Date,
    fee: String,
    hash: String,
    pubkey: String
});

const Deposit = mongoose.model('Deposit', depositSchema);

module.exports = Deposit;
