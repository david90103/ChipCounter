var mongoose = require('mongoose'),
    assert = require('assert');


var url = 'mongodb://david:admindavid@ds115758.mlab.com:15758/chip-counter_heroku';
var roomSchema = mongoose.Schema({
    room_id: Number,
    players: {
        type: Number,
        required: true,
        default: 0
    },
    defaultChips: {
      type: Number,
      required: true,
      default: 1000
    },
    playerList: {
      type: Array,
      required: true,
      default: new Array()
    },
    createTime: {
        type: Date,
        required: true,
        default: new Date()
    }
});

exports.connect = function() {
  mongoose.connect(url);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    console.log("Database Connected.");
  });
  room = mongoose.model('room', roomSchema);

}

exports.insert = function (roomID) {
  if (roomID) {
    var newroom = new room({ room_id: parseInt(roomID)});
    newroom.save(function (err, docs) {
      if (err) return console.error(err);
    });
  }
}

exports.remove = function (roomID) {
  room.remove({room_id: roomID}, function(err, docs){
    if(err) console.log(err);
  });
}

exports.find = function (roomID, userID, callback) {
  room.find({ room_id: roomID}, function(err, docs) {
    if (err) console.log(err);
    callback(docs.length !== 0 && docs[0].playerList.indexOf(userID) > 0);
  });
}

exports.newplayer = function (roomID, userID) {
  if (roomID) {
    room.findOne({ room_id: roomID}, function(err, old) {
      if (err) console.log(err);
      if (old) {
        old.players = parseInt(old.players) + 1;
        old.playerList.push(userID);
        old.save(function(err, docs) {
          if (err) console.log(err);
          // console.log('add finished.');
        });
      }
    });
  }
}

exports.playerLeft = function (roomID, userID) {
  if (roomID) {
    room.findOne({ room_id: roomID}, function(err, old) {
      if (err) console.log(err);
      if (old) {
        if (parseInt(old.players) > 0) old.players = parseInt(old.players) - 1;
        old.playerList.splice(old.playerList.indexOf(userID), 1);
        old.save(function(err, docs) {
          if (err) console.log(err);
          // console.log('del finished. ');
        });
      }
    });
  }
}

// debug

// mongoose.connect(url);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//   console.log("Database Connected.");
//   room = mongoose.model('room', roomSchema);
//   deleteRoom(111);
// });


//old

// function insert(roomID) {
//   MongoClient.connect(url,(err,database) =>{
//     const DB = database.db('chip-counter_heroku');
//     var collection = DB.collection('rooms');
//
//     data = [{room_id: parseInt(roomID)}];
//     collection.insert(data, function(err, result) {
//         assert.equal(err, null);
//         if (err) console.log('Error at loading database!!');
//         // assert.equal(2, result.result.n);
//         // assert.equal(2, result.ops.length);
//         console.log("Database insertion finished.");
//       });
//   });
// }
//
// exports.newplayer = function (roomID) {
//   room.update({room_id: roomID}, {players: 10}, function(err, docs){
//       if(err) console.log(err);
//       console.log(docs);
//   });
// }
