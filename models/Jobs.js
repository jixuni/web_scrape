const mongoose = require("mongoose");

const Schema = mongoose.Schema;


let JobSchema = new Schema ({
   
    title: {
        type: String,
        require: true
    },
    url: {
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        required: true
    },
    //require function not working
    location: {
        type: String,
        // validate: {
        //     validator: function() {
        //         if(this.location == null) {
        //             this.location =  "None Listed"
        //         }
        //         return this.location;
        //     }
        // }
    },
    description: {
        type: String,
    },
    address: {
        type: String,
       
    },
    compensation: {
        type: String,
        
    }
})



var Jobs = mongoose.model("Joblist", JobSchema);

module.exports = Jobs;