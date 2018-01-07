var mongoose = require(''); // fill inside ' '

var Schema = mongoose.Schema;

mongoose.connect("  "); // Type url for connection

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
});

mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});

mongoose.connect(' '); // Type url for connection

module.exports.user=mongoose.model('User',new Schema({
    name:String,
    /*
        fill here
    */
    friends:[]
},{strict: false}));

module.exports.online=mongoose.model('online',new Schema({
    /*
        code here
    */
}));

module.exports.messages=mongoose.model('message',new Schema({
    message : String,
    /*
        fill here
    */
    date    : Date
}));