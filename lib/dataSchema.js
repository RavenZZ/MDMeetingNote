var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var draftSchema = new Schema({
    noteid: Schema.Types.ObjectId,
    uid: String,
    pid: String,
    text: String,
    update: {type:Date, default: new Date()},
    create: {type:Date, default: new Date()}
});

var noteTasksSchema= new Schema({
    id:String,
    name:String
});

var templateSchema = new Schema({
    uid: String,
    pid: String,
    text: String
});


var noteSchema = new Schema({
    taskid:String,
    calendarid:String,
    sharedNote:String,
    tasks:[noteTasksSchema],
    createuser:String,
    create:{type:Date, default: new Date()},
    update:{type:Date, default: new Date()}
});
