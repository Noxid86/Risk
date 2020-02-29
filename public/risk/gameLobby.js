// ------------- CREATE BUTTON ------------
$('.btn_create').on('click', function(){
  let new_game_data = {
    player_count: $('.player_count').text(),
    game_name: $('.new_game_name').val(),
  };
  // Ensure there is at least one player
  // and no more than 6
  if (new_game_data.player_count>0&&new_game_data.player_count<7) {
  // Ensure the game has a name
    if (new_game_data.game_name) {
      // Create the game in the database
      $.ajax({
        type: 'POST',
        url: '/createGame',
        data: new_game_data,
        success: function(msg){
          console.log(msg)
        }
      });
      location.reload();
    } else {
      alert('This game must have a name');
    }
  } else {
    // If there are 0 players alert the user
    alert('You must have at least two players and no more than 6');
  };
});

// ------------- DECREMENT BUTTON ------------
$('.player_decrement').on('click', function(){
  let count = parseInt($('.player_count').text());
  if (count>2) {
    $('.player_count').text(count-1)
  };
});

// ------------- INCREMENT BUTTON ------------
$('.player_increment').on('click', function(){
  let count = parseInt($('.player_count').text());
  if (count<6) {
    $('.player_count').text(count+1)
  };
});

// ------------- JOIN BUTTON ------------
$('.btn_join').on('click', function(){
  let game = $(this).parent().parent();
  let gameId = game.attr('data-gameid');
  $.ajax({type: 'POST', url: '/joinGame', data:{game:gameId}}).then(()=>{
    let $link = $('.play_btn');
    $link[0].click()
  });
})

// ------------- DELETE BUTTON ------------
$('.btn_delete').on('click', function(){
  let game = $(this).parent().parent();
  let gameId = game.attr('data-gameid');
  let sure = confirm('Are you sure you want to delete this game?');
  if (sure) {
    $.ajax({
      type:'POST',
      url:'/deleteGame',
      data: {game: gameId},
      success: function(msg){
        console.log(msg);
      }
    })
  }
  location.reload();
  console.log(gameId);
})
