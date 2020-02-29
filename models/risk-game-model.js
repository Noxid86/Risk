const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// CREATE PLAYER SCHEMA
const playerSchema = new Schema({
  user_id: String,
  name: String,
  troops: {type: Number, default: 0},
  color: String,
  thumbnail: String
})
// CREATE GAME SCHEMA
const gameSchema = new Schema({
  game_name: {type: String, default: 'unnamed game'},
  owner: {type: String, default:'neutral'},
  current_player: String,
  current_phase : {type: String, default:'setup'},
  max_players: {type: Number, default:6},
  players: [playerSchema],
  player_colors: {type: Array, default:['#c8c0bf','#4B5358','#727072','#AF929D','#D2D6EF','#EACBD2']},
  //----== REGIONS ==----
  region_eastern_australia : {
      connected_regions : {type: Array, default:[
          "new_guinea",
          "western_australia"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_western_australia : {
      connected_regions : {type: Array, default:[
          "eastern_australia",
          "indonesia"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_indonesia : {
      connected_regions : {type: Array, default:[
          "siam",
          "new_guinea",
          "western_australia"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_new_guinea : {
      connected_regions : {type: Array, default:[
          "indonesia",
          "eastern_australia"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_ontario : {
      connected_regions : {type: Array, default:[
          "northwest_territory",
          "alberta",
          "western_united_states",
          "eastern_united_states",
          "quebec",
          "greenland"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_northwest_territory : {
      connected_regions : {type: Array, default:[
          "alaska",
          "alberta",
          "ontario",
          "greenland"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_alaska : {
      connected_regions : {type: Array, default:[
          "northwest_territory",
          "alberta",
          "western_united_states",
          "kamchatka"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_madagascar : {
      connected_regions : {type: Array, default:[
          "east_africa",
          "south_africa"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_brazil : {
      connected_regions : {type: Array, default:[
          "peru",
          "venezuela",
          "argentina",
          "north_africa"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_north_africa : {
      connected_regions : {type: Array, default:[
          "western_europe",
          "egypt",
          "east_africa",
          "congo",
          "southern_europe"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_greenland : {
      connected_regions : {type: Array, default:[
          "quebec",
          "ontario",
          "northwest_territory",
          "iceland"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_venezuela : {
      connected_regions : {type: Array, default:[
          "central_america",
          "brazil",
          "peru"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_great_britain : {
      connected_regions : {type: Array, default:[
          "northern_europe",
          "western_europe",
          "iceland"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_ural : {
      connected_regions : {type: Array, default:[
          "ukraine",
          "afghanistan",
          "china",
          "siberia"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_china : {
      connected_regions : {type: Array, default:[
          "siam",
          "india",
          "afghanistan",
          "ural",
          "siberia",
          "mongolia"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_northern_europe : {
      connected_regions : {type: Array, default:[
          "great_britain",
          "western_europe",
          "southern_europe",
          "ukraine",
          "scandanavia"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_southern_europe : {
      connected_regions : {type: Array, default:[
          "ukraine",
          "northern_europe",
          "western_europe",
          "middle_east",
          "egypt",
          "north_africa"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_western_europe : {
      connected_regions : {type: Array, default:[
          "north_africa",
          "southern_europe",
          "northern_europe",
          "great_britain"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_congo : {
      connected_regions : {type: Array, default:[
          "north_africa",
          "east_africa",
          "madagascar",
          "south_africa"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_scandanavia : {
      connected_regions : {type: Array, default:[
          "iceland",
          "northern_europe",
          "ukraine",
          "great_britain"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_iceland : {
      connected_regions : {type: Array, default:[
          "greenland",
          "scandanavia",
          "great_britain"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_india : {
      connected_regions : {type: Array, default:[
          "afghanistan",
          "china",
          "siam",
          "middle_east"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_siberia : {
      connected_regions : {type: Array, default:[
          "ural",
          "china",
          "mongolia",
          "irkutsk",
          "yakutsk"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_irkutsk : {
      connected_regions : {type: Array, default:[
          "mongolia",
          "siberia",
          "yakutsk",
          "kamchatka"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_yakutsk : {
      connected_regions : {type: Array, default:[
          "siberia",
          "irkutsk",
          "kamchatka"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_kamchatka : {
      connected_regions : {type: Array, default:[
          "yakutsk",
          "irkutsk",
          "japan",
          "alaska"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_siam : {
      connected_regions : {type: Array, default:[
          "india",
          "china",
          "indonesia"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_egypt : {
      connected_regions : {type: Array, default:[
          "middle_east",
          "southern_europe",
          "north_africa",
          "congo",
          "east_africa"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_ukraine : {
      connected_regions : {type: Array, default:[
          "scandanavia",
          "northern_europe",
          "southern_europe",
          "middle_east",
          "afghanistan",
          "ural"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_argentina : {
      connected_regions : {type: Array, default:[
          "peru",
          "brazil"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_east_africa : {
      connected_regions : {type: Array, default:[
          "congo",
          "north_africa",
          "egypt",
          "south_africa",
          "middle_east",
          "madagascar"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_afghanistan : {
      connected_regions : {type: Array, default:[
          "ural",
          "ukraine",
          "middle_east",
          "india",
          "china"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_peru : {
      connected_regions : {type: Array, default:[
          "brazil",
          "venezuela",
          "argentina"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_japan : {
      connected_regions : {type: Array, default:[
          "kamchatka",
          "mongolia"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_western_united_states : {
      connected_regions : {type: Array, default:[
          "alberta",
          "ontario",
          "eastern_united_states",
          "central_america"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_eastern_united_states : {
      connected_regions : {type: Array, default:[
          "western_united_states",
          "ontario",
          "quebec",
          "central_america"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_central_america : {
      connected_regions : {type: Array, default:[
          "venezuela",
          "eastern_united_states",
          "western_united_states"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_middle_east : {
      connected_regions : {type: Array, default:[
          "ukraine",
          "southern_europe",
          "egypt",
          "india",
          "afghanistan",
          "east_africa"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_alberta : {
      connected_regions : {type: Array, default:[
          "alaska",
          "northwest_territory",
          "ontario",
          "western_united_states"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_south_africa : {
      connected_regions : {type: Array, default:[
          "madagascar",
          "east_africa",
          "congo"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_quebec : {
      connected_regions : {type: Array, default:[
          "greenland",
          "northwest_territory",
          "ontario",
          "eastern_united_states"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },
  region_mongolia : {
      connected_regions : {type: Array, default:[
          "china",
          "siberia",
          "irkutsk",
          "kamchatka",
          "japan"
      ]},
      troops: {type: Number, default:0},
      owner: {type: String, default:'neutral'}
  },

});

const Game = mongoose.model('Game', gameSchema)
module.exports = Game;
