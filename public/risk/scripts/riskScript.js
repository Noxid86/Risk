//-----------------------------------
//        GLOBAL VARIABLES
//-----------------------------------
var gamestate = {};
var regionList = [];
var socket = io.connect('http://localhost:3000');

//-----------------------------------
//   BOARD MANAGEMENT FUNCTIONS
//-----------------------------------

//------ { getPlayer } ------
// args: STRING, name of a player
// returns: the player object
function getPlayer(player){
  let data = {}
  for (var i = 0; i < gamestate.players.length; i++) {
    if(gamestate.players[i].name==player){data = gamestate.players[i]};
  }
  return data;
};

//------ { getRegion } ------
// args: STRING the name of a region
// returns: a reference to the svg path for that region
function getRegion(region){
  let paths = board.selectAll('path');
  for (var i = 0; i < paths.length; i++) {
    let label = paths[i].attr('id');
    if (label.indexOf('region_'+region) >= 0){
      return paths[i];
    };
  };
};

//------ { roomEcho } ------
// args: STRING a message to display to the room
function roomEcho(msg){
  socket.emit('chat', {
    room: gamestate._id,
    message: msg,
    handle:'SYSTEM'
  });
};

//------ { getCenter } ------
// args: STRING the name of a region
// returns: a reference to the center of that region
function getCenter(region){
  let paths = board.selectAll('ellipse');
  let product = '';
  for (var i = 0; i < paths.length; i++) {
    let label = paths[i].attr('id');
    if (label.indexOf('center_'+region) >= 0){
      product = paths[i];
    }
  }
  if (product) {
    return product
  } else {
    console.log('could not find ' + region);
  }
}

//------ { diffObjects } ------
// args: two objects with identical structures
// returns: an array of keys representing values that did not match
function diffObjects(ob_A, ob_B) {
  var differences = [];
  for (var key in ob_A) {
    if (JSON.stringify(ob_A[key]) !== JSON.stringify(ob_B[key])) {
      differences.push(key);
    };
  };
  return differences
};

//------ { turnHandler } ------
// args: STRING the name of a region
// returns: a reference to the center of that region
var turnHandler = {
  end:()=>{
    // ensure it is the client's turn
    if (currUser.username == gamestate.current_player) {
      // Enable the proper actions based on the next turn phase
      switch (gamestate.current_phase) {
        case 'setup':
          turnHandler.setup();
          break
        case 'troops':
          turnHandler.troops();
          break;
        case 'attack':
          turnHandler.attack();
          break;
        case 'reinforce':
          turnHandler.reinforce();
          break;
        case 'endTurn':
          turnHandler.endTurn();
          break;
        default:
          roomEcho('error, invalid game phase');
          roomEcho(gamestate.current_phase);
      };
    } else { turnHandler.wait()};
    socket.emit('updateGame', gamestate);
  },

  setup:()=>{
    roomEcho('setup unimplemented, moving to troop placement');
    turnHandler.troops();
  },

  troops:()=>{
    roomEcho(gamestate.current_player + 'may now place new troops');
    gamestate.current_phase = 'attack';
  },

  attack:()=>{
    $('.btn_attack').css('display','block');
    roomEcho(gamestate.current_player+" may now attack");
    gamestate.current_phase = 'reinforce';
  },

  reinforce:()=>{
    $('.btn_attack').css('display','none');
    $('.btn_move').css('display','block');
    roomEcho(gamestate.current_player+' may now reinforce');
    gamestate.current_phase = 'endTurn';
  },

  wait:()=>{
    roomEcho("it's "+gamestate.current_player+"'s turn");
    roomEcho(gamestate.current_phase);
    console.log(currUser);
  },

  endTurn:()=>{
    roomEcho(' finding next player ')
    for (var i = 0; i < gamestate.players.length; i++) {
      if (gamestate.players[i].name==gamestate.current_player) {
        (i==gamestate.players.length-1) ? gamestate.current_player = gamestate.players[0].name : gamestate.current_player = gamestate.players[i+1].name;
      };
    };
    gamestate.current_phase = 'troops';
  }
};
//-----------------------------------
//      BOARD DISPLAY FUNCTIONS
//-----------------------------------

//------ { highlightRegion } ------
// args: STRING the name of a region, STRING a color value
// action: creates a semi-opaque clone of that regions path
// with the given color
function highlightRegion(region, color){
  let clone = getRegion(region).clone().attr({'opacity':0.2,'fill':color, 'id':'highlight_'+region});
};

//------ { killHighlight } ------
// args: STRING the name of a region
// action: removes any highlights from that region
function killHighlight (region) {
  board.selectAll('#highlight_'+region).remove();
};

//------ { highlightConnections } ------
// args: STRING the name of a region, STRING a color
// action: highlights all connected regions the given color
function highlightConnections(region, color) {
  let connections = gamestate['region_'+region].connected_regions;
  for (var i = 0; i < connections.length; i++) {
    highlightRegion(connections[i], color);
  }
};

//------ { hideConnections } ------
// args: STRING the name of a region
// action: removes all highlights on connected regions
function hideConnections(region) {
  let connections = gamestate['region_'+region].connected_regions;
  for (var i = 0; i < connections.length; i++) {
    killHighlight(connections[i]);
  }
};

//------ { printTroops } ------
// args: STRING the name of a region
// action: prints troops for the given region based on gamestate
function printTroops(region){
  // remove any existing label
  board.selectAll('.'+region+'Circle').remove();
  board.selectAll('.'+region+'Txt').remove();
  // label it with the number of troops currently stored in the client gamestate
  var num = gamestate['region_'+region].troops;
  var center = getCenter(region).getBBox();
  var owner = getPlayer(gamestate['region_'+region].owner);
  if (num>0) {
    board.circle(center.cx, center.cy, 17).attr({'fill':'white','opacity':1, 'class':region+'Circle'});
    board.circle(center.cx, center.cy, 15).attr({'fill':owner.color,'opacity':1, 'class':region+'Circle'});
    board.circle(center.cx, center.cy, 10).attr({'fill':'white','opacity':0.95, 'class':region+'Circle'});
    board.text(center.cx, center.cy+5, num).attr({'fill':'rgb(37, 37, 37)', 'class':region+'Txt', 'text-anchor':'middle'})
    // set up click and hover functions to simulate click through of label
    $('.'+region+'Circle').css({'pointer-events':'none'})
    $('.'+region+'Txt').css({'pointer-events':'none'})
  };
}

function printDisplay(){
  $('.message_bar').text(gamestate.game_name+': '+gamestate.current_player);
}

//-----------------------------------
//      REGION HANDLER
//-----------------------------------
// regionhandler controls what happens when a region is clicked or hovered.
var regionHandler = {
  actionFlag  : 'add',
  hoverFlag   : 'connections',
  activeRegion: 'none',
  own: (region)=>{
    gamestate['region_'+region].owner = currUser.username;
  },
  add:(region)=>{
    regionHandler.own(region);
    gamestate['region_'+region].troops += 1;
    socket.emit('updateGame', gamestate);
    printTroops(region);
  },
  remove:(region)=>{
    if (gamestate['region_'+region].troops>0) {
      gamestate['region_'+region].troops -= 1;
      socket.emit('updateGame', gamestate);
      printTroops(region);
    };
  },
  move:(region)=>{
    regionHandler.activeRegion = region;
    regionHandler.actionFlag = 'reinforce';
  },
  reinforce:(region)=>{
    if (gamestate['region_'+regionHandler.activeRegion].connected_regions.includes(region)) {
      if (gamestate['region_'+regionHandler.activeRegion].troops>1) {
        regionHandler.remove(regionHandler.activeRegion);
        regionHandler.add(region);
      };
    } else {
      console.log(region+' is not a connected region of '+ regionHandler.activeRegion);
      regionHandler.activeFlag = 'none';
    }
  },
  start_attack:(region)=>{
    regionHandler.activeRegion = region;
    highlightRegion(region,'green')
    regionHandler.actionFlag = 'attack';
  },
  attack:(region)=>{
    if (gamestate['region_'+regionHandler.activeRegion].connected_regions.includes(region)) {
      if (gamestate['region_'+regionHandler.activeRegion].troops>1) {
        regionHandler.remove(regionHandler.activeRegion);
        regionHandler.add(region);
      };
    } else {
      console.log(region+' is not a connected region of '+ regionHandler.activeRegion);
      regionHandler.activeFlag = 'none';
    }
  },
  handle:(region)=>{
    switch (regionHandler.actionFlag) {
      case 'add':
        regionHandler.add(region);
        break;
      case 'remove':
        regionHandler.remove(region);
        break;
      case 'attack':
        regionHandler.start_attack(region);
        break;
      case 'move':
        regionHandler.move(region);
        break;
      case 'reinforce':
        regionHandler.reinforce(region);
        break;
      default:
    }
  },

  // HOVER METHODS
  hover:(region)=>{
    switch (regionHandler.hoverFlag) {
      case 'connections':
        highlightConnections(region, 'rgb(103, 190, 5)');
        break;
      case 'alternate':
        //regionHandler.remove(region);
        break;
      default:
    }
  },
  unhover:(region)=>{
    switch (regionHandler.hoverFlag) {
      case 'connections':
        hideConnections(region);
        break;
      case 'alternate':
        //regionHandler.remove(region);
        break;
      default:
    }
  }
};

//-----------------------------------
//          BOARD SETUP
//-----------------------------------
// Risk Socket Handlers
socket.on('loadGame', function(result){
  gamestate = result
  // build the region list
  for ( var key in gamestate ){
    if (!key.indexOf('region_')) {
      regionList.push(key.replace('region_',''));
    };
  };
  // print the troops at every region
  for (var i = 0; i < regionList.length; i++) {
    printTroops(regionList[i]);
  };
  // add players to the gui
  $('.gui_players').empty();
  for (var i = 0; i < gamestate.players.length; i++) {
    let logged = '';
    if (gamestate.players[i].name==currUser.username){logged='logged'};
    let img = "<img style='border:1px solid "+gamestate.players[i].color+"' src="+gamestate.players[i].thumbnail+"></img>";
    let name = "<h1 class='playername'>"+gamestate.players[i].name+"</h1>";
    let troops = "<h1 class='troops' style='color: white; background-color:"+gamestate.players[i].color+"'>"+gamestate.players[i].troops+"</h1>";
    console.log(gamestate.players[i]);
    console.log(gamestate.players[i].troops);
    let html = "<div style='border:3px solid "+gamestate.players[i].color+"'class='player "+logged+"'>"+img+name+troops+"</div>";
    $('.gui_players').append(html);
   };
});

socket.on('chat', function(data){
  output.innerHTML+='<p>'+data.handle+': '+data.message+'</p>';
  updateScroll();
});


// fetch the gamestate based on the current user
// Declare the canvas and use Snap to load the board SVG
var board = Snap('#game_board');
board.attr({viewBox: "0 0 900 600"});
Snap.load("./RiskMap.svg", function(data){
  board.append(data);
  // Loop through and find all regions
  let RiskMap = board.select('svg>svg');
  let paths = board.selectAll('path');
  for (var i = 0; i < paths.length; i++) {
    let label = paths[i].attr('id');
    // Set territory colors according to continent
    // all regions
    // Continent affiliation is stored via the 'contXX' suffix
    if (label.indexOf('region_')>=0) {
      if (label.indexOf('contNA')>=0) {
        paths[i].attr('fill','#c8c0bf');
      } else if (label.indexOf('contSA')>=0) {
        paths[i].attr('fill','#4B5358');
      } else if (label.indexOf('contEU')>=0) {
        paths[i].attr('fill','#727072');
      } else if (label.indexOf('contAF')>=0) {
        paths[i].attr('fill','#AF929D');
      } else if (label.indexOf('contAS')>=0) {
        paths[i].attr('fill','#D2D6EF');
      } else if (label.indexOf('contOC')>=0) {
        paths[i].attr('fill','#EACBD2');
      }
      // remove prefix from label
      let name = label.replace('region_','').replace(/_cont../,'');
      // Attach Triggers to regions
      // Mouse click and hover states are handled via the regionHandler
      $('#'+label).on('click', function(e){
        regionHandler.handle(name);
      });
      $('#'+label).on('mouseenter', function(e){
        getRegion(name).attr('opacity','0.5');
        regionHandler.hover(name);
      });
      $('#'+label).on('mouseleave', function(e){
        getRegion(name).attr('opacity','1');
        regionHandler.unhover(name);
      });
    };
  };
  // hide center markers
  let centers = board.selectAll('ellipse');
  for (var i = 0; i < centers.length; i++) {
    centers[i].attr({'pointer-events':'none', 'opacity':0});
  };
  socket.emit('loadGame',{user:currUser._id, username:currUser.username});
});

//-----------------------------------
//        CHAT FUNCTIONALITY
//-----------------------------------
var message = document.getElementById('message');
var output = document.getElementById('output');
$('#handle').text(currUser.username);
function updateScroll(){
  var output = document.getElementById('output');
  output.scrollTop = output.scrollHeight;
}

$('#message').keypress(function(e){
  if (e.which==13) { $('#send').click(); }
})
$('#send').on('click', function(){
  socket.emit('chat', {
    room: gamestate._id,
    message:message.value,
    handle:currUser.username
  });
  $('#message').val('');
});


//-----------------------------------
//        GUI INTERACTIONS
//-----------------------------------
$('.btn_add').on('click', function(){
  regionHandler.actionFlag = 'add';
});

$('.btn_remove').on('click', function(){
  regionHandler.actionFlag = 'remove';
});

$('.btn_end_turn').on('click', function(){
  turnHandler.end();
});
