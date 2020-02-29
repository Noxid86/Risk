const Game = require('../models/risk-game-model');
const User = require('../models/user-model');
const router = require('express').Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};


// create page routes
router.get('/', (req, res) => {
    res.render('home', {user: req.user});
});

router.get('/roomGen', (req, res) => {
    res.render('roomGen', {user: req.user});
});

router.get('/chatApp', (req,res) => {
    res.render('chatApp', { user: req.user });
});

router.get('/resume', (req,res) => {
    res.render('resume', { user: req.user });
});

router.get('/projects', (req,res) => {
    res.render('projects', { user: req.user });
});

router.get('/about', (req,res) => {
    res.render('about', { user: req.user });
});

router.get('/anatomyQuiz', (req,res) => {
    res.render('anatomyQuiz', { user: req.user });
});

// ----------- RISK APP PAGES ---------------
router.get('/gameLobby', authCheck, (req,res) => {
    Game.find({}).then((results)=>{
      res.render('gameLobby', { RiskData: results, user: req.user });
    });
});

router.get('/risk', authCheck, urlencodedParser, (req,res) => {
    res.render('risk', { user: req.user });
});

router.post('/joinGame', authCheck, urlencodedParser, (req, res)=> {
    User.findOneAndUpdate({_id: req.user._id}, {current_game:req.body.game}).then((result)=>{
      Game.findOne({_id: req.body.game}).then((result)=>{
        var isNew = true;
        for (var i = 0; i < result.players.length; i++) {
          if (result.players[i].user_id == req.user._id) {
            console.log('player '+req.user._id+' already in current game');
            isNew = false;
          }
        };
        if (result.players.length<result.max_players && isNew) {
          let r = Math.floor(Math.random() * Math.floor(result.player_colors.length));
          player = {
            user_id: req.user._id,
            name: req.user.username,
            thumbnail: req.user.thumbnail,
            color: result.player_colors[r]
          };
          result.player_colors.splice(r, 1);
          result.players.push(player);
          result.save();
        };
        res.sendStatus(200);
      });
    });
});

router.post('/createGame', urlencodedParser,(req, res)=>{
    let newGame = new Game({
      game_name     :req.body.game_name,
      current_phase :'setup',
      max_players   :req.body.player_count,
      current_player:req.user.username
    }).save();
});

router.post('/deleteGame',urlencodedParser,(req, res)=>{
  console.log('deleting game:'+req.body.game);
    Game.deleteOne({_id:req.body.game}).then((res)=>{
      console.log('game deletion:'+res);
    });
});
module.exports = router;
