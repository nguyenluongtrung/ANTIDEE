const mongoose = require("mongoose");

const domesticHelperFeedbackSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Account"

    },
    domesticHelperId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Account"
    },
    rating: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        maxLength: 255
    },
    reply:{
        type:[
            {
                content:{
                    type:String,
                    maxLength:255,
                    
                },
                userId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Account"
                }
            }
        ]
    }
}, { timestamp: true })

module.exports = mongoose.model('DomesticHelperFeedback', domesticHelperFeedbackSchema);