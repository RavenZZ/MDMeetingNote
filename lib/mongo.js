var mongoose = require('mongoose');
var schema = require('./dataSchema');

var config = require('../configuration');

var client = mongoose.createConnection(config.mongodb.host, config.mongodb.database, config.mongodb.port);

var draftModel = client.model('draft', schema.draft);
var templateModel = client.model('template', schema.template);
var noteTaskModel = client.model('task', schema.task);
var noteModel = client.model('note', schema.note);


var mongo = function () {
    var _this = this;
    var _callback;

    this.addDraft = function (noteid, uid, pid, text, callback) {

    };

    this.updateDraft = function (id, noteid, text, callback) {

    };

    this.removeDraft = function (id, uid, callback) {

    };

    this.getDraftList = function (uid, pid, callback) {

    };

    this.getDraftFromNote = function (noteid, uid, pid, callback) {

    };

    /////////华丽的分割线a

    this.saveDraftToTemplate = function (draftId, uid, pid, callback) {

    };

    this.removeTemplate = function (templateId, uid, callback) {

    };

    ////////华丽的分割线b

    this.initNote = function (taskid, calendarid, sharedNote, uid, callback) {
        var n = {
            calendarid: calendarid,
            sharedNote: '',
            createuser: uid,
            tasks: []
        };
        var note = new noteModel();
        note.save(function (err, result, num) {
            if (err) {
                callback(err, result);
            } else {
                callback(null, num);
            }
        });
    };

    this.attachNoteToMingdao = function (noteid, callback) {

    };


};


module.exports = mongo;


























