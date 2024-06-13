const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const appFeedbackSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: Number,
        required: true
    },
    
    email: {
        type: String,
    },

    description: {
        type: String,
    }
},{
    timestamps:true
});


const Voucher = mongoose.model('appFeedback', appFeedbackSchema);
module.exports = Voucher;
