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
    }
},{
    timestamps:true
});


const Voucher = mongoose.model('voucher', voucherSchema);
module.exports = Voucher;
