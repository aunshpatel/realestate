import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }, 
    address:{
        type: String,
        required: true
    },
    selectedCurrency:{
        type: String,
        required: true
    },
    regularPrice:{
        type: Number,
        required: true
    },
    discountPrice:{
        type: Number,
        // required: true
    },
    bathrooms:{
        type: Number,
        required: true
    },
    bedrooms:{
        type: Number,
        required: true
    },
    furnished:{
        type: String,
        required: true
    },
    parking:{
        type: Number,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    discount:{
        type: Boolean,
        required: true
    },
    isFlagged:{
        type: Boolean,
        // required: true,
        default: false
    },
    flaggedReason: {
        type: String,
        default:'',
    },
    imageUrls:{
        type: Array,
        // required: true
    },
    userRef:{
        type: String,
        required: true
    }
},{ timestamps:true });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;