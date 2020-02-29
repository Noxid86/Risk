module.exports = function(server){
  const socket = require('socket.io');
  const mongoose = require('mongoose');
  const keys = require('./config/keys');
  const risk = require('./risk');

  const Game = require('./models/risk-game-model');
  const Users = require('./models/user-model');

  // set up socket.io
  var io = socket(server);
  io.on('connection', function(socket){
    socket.on('loadGame',function(data){
      let userId = data.user;
      Users.findOne({_id: userId}).then((userData)=>{
        socket.join(userData.current_game);
        Game.findOne({_id: userData.current_game}).then((result)=>{
          socket.emit('loadGame', result);
          socket.to(userData.current_game).emit('chat', {handle: 'SYSTEM', message: userData.username+' has joined the game'})
        });
      });
    });

    socket.on('chat',function(data){
      io.sockets.to(data.room).emit('chat', data);
    })

    socket.on('updateGame',function(newData){
      Game.findOneAndUpdate({_id: newData._id}, newData).then((result)=>{
        socket.to(result._id).emit('loadGame', newData)
      });
    });
  });
};
