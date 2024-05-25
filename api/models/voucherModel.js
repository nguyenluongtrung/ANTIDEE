const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voucherSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    startDate: { 
        type: Date, 
        // required: true
     },

    endDate: { 
        type: Date, 
        // required: true 
    },
    
    discountValue: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    code: {
        type: String,
        required: true
    },

    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        // required: true
    },
    image: {
        type: String,
        // required: true
    },
    voucherAccounts: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receivedAt: {
            type: Date,
            default: Date.now
        }
    }]

},{
    timestamps:true
});


const Voucher = mongoose.model('voucher', voucherSchema);
module.exports = Voucher;
