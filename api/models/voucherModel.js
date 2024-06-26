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
        enum: ['Mua sắm', 'Dịch vụ', 'Giải trí', 'Du lịch', 'Ẩm thực'],
        required: true
    },
    image: {
        type: String,
        // required: true
    },
    voucherAccounts: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        },
        receivedAt: {
            type: Date,
            default: Date.now
        },
        isUsed:{
            type:Boolean,
            default: false
        }
    }]

},{
    timestamps:true
});


const Voucher = mongoose.model('Voucher', voucherSchema);
module.exports = Voucher;
