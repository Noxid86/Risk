// LOAD THE SVG
var s = Snap("#view");
s.attr({viewBox: "0 0 400 300"})
Snap.load("./animalSvgs/iguanajaw.svg", onSVGLoaded);

// GUI BUTTONS
var menu = Snap("#menu");
menu.attr({viewBox: "0 0 50 50"})
Snap.load("./icons/menu.svg", function(data){menu.append(data)});

var reset = Snap("#reset");
reset.attr({viewBox: "0 0 50 50"})
Snap.load("./icons/reset.svg", function(data){reset.append(data)});

$('#reset').on('click',function(){
  quiz.resetQuiz();
})
// ---------------------------------------------------------------------
// SHUFFLE FUNCTION
// ---------------------------------------------------------------------
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


// ---------------------------------------------------------------------
// OBJECT: Quiz
// ---------------------------------------------------------------------
var quiz = {
    parts : [],
    unscored_parts : [],
    scored_parts   : [],

    //::METHOD::
    // Args: The name of a part
    // Returns: a reference to the path of the given part
    get_path : function(part){
      for (var i = 0; i < this.parts.length; i++) {
        if(this.parts[i].name==part){
          return this.parts[i].path;
        }
      }
    },

    //::METHOD:: --
    // Sets the opacity of all parts to 0
    clear_all : function(){
      for (var i = 0; i < this.parts.length; i++) {
        if (this.parts[i].path.attr('opacity')>0) {
          this.parts[i].path.attr('opacity', 0);
        }
      }
    },

    //::METHOD:: --
    // Flash the opacity of the given part
    flash : function(part){
      this.get_path(part).animate({opacity: 1}, 300, mina.easeInOut, function(){
        this.animate({opacity: 0}, 300, mina.easeInOut, function(){
          this.animate({opacity: 1}, 300, mina.easeInOut, function(){
            this.animate({opacity: 0}, 300, mina.easeInOut);
          });
        });
      });
    },

    //::METHOD:: --
    flash_incorrect : function(){
      this.get_path(quiz.unscored_parts[0]).attr('fill', 'rgb(255, 71, 71)')
      this.flash(quiz.unscored_parts[0]);
    },

    //::METHOD:: --
    flash_correct : function(part){
      this.get_path(part).attr('fill', 'rgb(103, 255, 84)')
      this.flash(part);
    },

    //::METHOD:: --
    banner_switch : function(part){
      $('.part ').addClass('animate-out');
      setTimeout(function(){
        $('.part').text(part);
        $('.part').addClass('animate-in');
        setTimeout(function(){
          $('.part').attr('class','part');
        }, 600)
      }, 600)
    },

    banner_wrong : function(){
      $('.part').addClass('animate-wrong');
      setTimeout(function(){
        $('.part').attr('class','part');
      }, 300);
    },

    view_wipe : function(){
              $('.part').attr('class','part');
      $('.part').addClass('fadeOut');
      console.log('fading');
      setTimeout(function(){
        $('.part').attr('class','part');
      }, 3000);
    },

    //::METHOD:: --
    checkClick : function(part) {
      if (part == this.unscored_parts[0]) {
        this.flash_correct(part);
        this.scored_parts.push(part);
        this.unscored_parts.shift();
        if (this.unscored_parts.length==0) {
          this.victory();
        } else {
          this.banner_switch(this.unscored_parts[0]);
        }
      } else {
        this.banner_wrong();
        this.flash_incorrect(part);
        console.log('incorrect');
      }
    },

    //::METHOD:: --
    victory : function() {
      $('.part').addClass('rainbow');
      this.view_wipe();
      setTimeout(function(){
            $('.part').attr('class','part');
            quiz.resetQuiz();
      }, 2000);
      console.log('victory!')
    },

    //::METHOD:: --
    resetQuiz : function() {
      console.log('resetting quiz')
      this.unscored_parts = shuffle(this.unscored_parts.concat(this.scored_parts));
      $('.part').text(this.unscored_parts[0]);
      this.clear_all();
    }

};

// ---------------------------------------------------------------------
// FUNCTION: setupQuiz
// args: an array of area objects
// ---------------------------------------------------------------------
function setupQuiz(areas){
    quiz.parts=areas;
    var list = [];
    for (var i = 0; i < areas.length; i++) {
      list.push(areas[i].name);
    };
    quiz.clear_all();
    shuffle(list);
    quiz.unscored_parts = list;
    quiz.current_part = list[0];
    $('.part').text(list[0]);
}


// ---------------------------------------------------------------------
// FUNCTION: setupParts(svg, callback)
// returns: an array of objects with {name : path}
// args: a snap object svg
// ---------------------------------------------------------------------
function setupParts(svg){
  // Define the array to contain all paths with an inkscape label
  var areas = [];
  // Select all paths then loop through finding any that have an inkscape label
  var paths = svg.selectAll('path');
  for (var i = 0; i < paths.length; i++) {
    let currAttr = paths[i].attr('inkscape:label');
    if (currAttr !== null) {
      // Push an object containing the label and element into <areas>
      areas.push({
        'name':currAttr,
        'path':paths[i]
      });
    }
  }
  return areas
}

// ---------------------------------------------------------------------
// FUNCTION: setupClicks
// ARGS: list of parts
// ---------------------------------------------------------------------
function setupClicks(areas){
  for (var i = 0; i < areas.length; i++) {
    let the_area = areas[i];
    areas[i].path.click(
      function(area){
        quiz.checkClick(the_area.name);
      }
    );
  }
  return areas
}



// ---------------------------------------------------------------------
// FUNCTION: onSVGLoaded
// ---------------------------------------------------------------------
function onSVGLoaded(data) {
    // Append the image to the view
    s.append(data);
    // Prepare the Quiz
    setupQuiz(setupClicks(setupParts(s)));
}
