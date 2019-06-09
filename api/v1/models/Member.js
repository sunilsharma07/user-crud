var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,

    connection = require('../db/connection'),
    ED = rootRequire('services/encry_decry'),
    DS = rootRequire('services/date'); // date services

    var moment = require('moment');

// model schema
var schema = new Schema({
    name: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0
        /* 1 = active, 0 = inactive, 2= deleted*/
    },
    added_by: {
        type: Schema.Types.ObjectId,
        ref: 'tbl_users'
    },
    updated_at: {
       type: Date,
       //default: DS.now()
       default: moment().toISOString()
    },
    created_at: {
       type: Date,
       //default: DS.now()
       default: moment().toISOString()
    }
}, {
    collection: 'tbl_member'
});

schema.pre('save', function(next) {
    var user = this;  
    this.updated_at = moment().toISOString();
    this.created_at = moment().toISOString();
    next();
});

schema.pre('update', function(next) {
    this.update({}, { $set: { updated_at: moment().toISOString() } });
    next();
});

module.exports = connection.model(schema.options.collection, schema);
