var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var draftSchema = new Schema({
    noteid: Schema.Types.ObjectId,
    uid: String,
    pid: String,
    text: String,
    update: {type: Date, default: new Date()},
    create: {type: Date, default: new Date()}
});

var templateSchema = new Schema({
    uid: String,
    pid: String,
    text: String
});


var noteTaskSchema = new Schema({
    id: String,
    name: String,
    charge: String
});


var noteSchema = new Schema({
    taskid: String,
    calendarid: String,
    sharedNote: String,
    tasks: [noteTaskSchema],
    createuser: String,
    create: {type: Date, default: new Date()},
    update: {type: Date, default: new Date()}
});


module.exports = {
    draft: draftSchema,
    template: templateSchema,
    note: noteSchema,
    task: noteTaskSchema
};