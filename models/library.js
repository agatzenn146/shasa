const mongoose = require('mongoose');

let librarySchema = new mongoose.Schema({
    name : {type:String,
        required: true,
    },
   
    image:{
        type: String
    },
    
    description:{
        type: String
    },

    date:{
        type: Date,
        default : Date.now,
    },
   
});

module.exports = mongoose.model('library',librarySchema) 