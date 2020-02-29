const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    userId: String,
    thumbnail: String,
    current_game: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;
