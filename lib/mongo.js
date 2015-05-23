var mongoose = require('mongoose');
var schema = require('./dataSchema');

var config = require('../configuration');

var client = mongoose.createConnection(config.mongodb.host, config.mongodb.database, config.mongodb.port);

var draftModel = client.model('draft', schema.draft);
var templateModel = client.model('template', schema.template);
var noteTaskModel = client.model('task', schema.task);
var noteModel = client.model('note', schema.note);




























