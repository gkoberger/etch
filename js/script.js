var etch = $('#etch canvas')[0],
    context = etch.getContext('2d'),
    cur_x = 155.5,
    cur_y = 75.5,
    rot_x = rot_y = 0;

context.strokeStyle = "rgba(90,90,90,0.9)";
context.lineWidth = 0.5;

function drawLine(x, y) {
  context.beginPath();
  context.moveTo(cur_x, cur_y);
  cur_x += 2 * x;
  cur_y += 2 * y;

  rot_x += 1 * x;
  rot_y += 1 * y;

  $('.knob_l').css('-moz-transform', 'rotate(' + rot_x * 50 + 'deg)');
  $('.knob_r').css('-moz-transform', 'rotate(' + rot_y * 50 + 'deg)');

  context.lineTo(cur_x, cur_y);
  context.closePath();
  context.stroke();
}

$(window).keypress(function(e) {
  //right = 39, left = 37, up = 38, down = 40
  if(e.keyCode == 39) {
    drawLine(1, 0);
  } else if(e.keyCode == 37) {
    drawLine(-1, 0);
  } else if(e.keyCode == 38) {
    drawLine(0, -1);
  } else if(e.keyCode == 40) {
    drawLine(0, 1);
  } else {
    return;
  }
  e.preventDefault();
});

/* Shake and bake */
var pos_x = pos_y = false;
var direction_x = direction_y = 0;
var total_x = total_y = 0;
var timer = false;

$( "#etch" ).draggable({ revert: true, scroll:false, start: function(){
  timer = setInterval(function(){ total_x--; total_y--;

                      if(total_x < 0) total_x = 0;
                      if(total_y < 0) total_y = 0;
  }, 300);
},
drag: function(e){
  var new_direction_x = e.pageX - pos_x > 0 ? 1 : -1;
  var new_direction_y = e.pageY - pos_y > 0 ? 1 : -1;
  if(new_direction_x != direction_x) {
    direction_x = new_direction_x;
    total_x++;
  }
  if(new_direction_y != direction_y) {
    total_y++;
    direction_y = new_direction_y;
  }

  pos_x = e.pageX;
  pos_y = e.pageY;

  if(total_x >= 4 || total_y >= 4) {
    context.clearRect(0,0,1000,1000);
  }


}, stop: function() {
  pos_x = pos_y = false;
  direction_x = direction_y = 0;
  total_x = total_y = 0;
  clearInterval(timer);
}
});
