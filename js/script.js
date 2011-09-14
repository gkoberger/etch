var etch = $('#etch canvas')[0],
    context = etch.getContext('2d'),
    cur_x = 155.5, cur_y = 75.5, /* Center-ish */
    rot_x = rot_y = 0,
    path = {0: [cur_x, cur_y]}, i = 0,
    current_direction = false;

context.strokeStyle = "rgba(90,90,90,0.9)";
context.lineWidth = 0.5;

function getURL() {
  encoded = Base64.encode(JSON.stringify(path))
  return "http://localhost:8001/#" + encoded;
}

function drawLine(x, y) {
  context.beginPath();
  context.moveTo(cur_x, cur_y);

  cur_x += 2 * x;
  cur_y += 2 * y;

  rot_x += 1 * x;
  rot_y += 1 * y;

  var new_direction = x + "--" + y;
  if(current_direction != new_direction) {
    i++;
    console.log('pivot!');
    current_direction = new_direction;
  }
  path[i] = [cur_x, cur_y];

  $('.knob_l').css('-moz-transform', 'rotate(' + rot_x * 50 + 'deg)');
  $('.knob_r').css('-moz-transform', 'rotate(' + rot_y * 50 + 'deg)');

  context.lineTo(cur_x, cur_y);
  context.closePath();
  context.stroke();
}

$(function() {
  $(document).keydown(function(e) {
    if(e.keyCode == jQuery.ui.keyCode.RIGHT) {
      drawLine(1, 0);
    } else if(e.keyCode == jQuery.ui.keyCode.LEFT) {
      drawLine(-1, 0);
    } else if(e.keyCode == jQuery.ui.keyCode.UP) {
      drawLine(0, -1);
    } else if(e.keyCode == jQuery.ui.keyCode.DOWN) {
      drawLine(0, 1);
    } else {
      // Not an arrow key; carry on!
      return;
    }
    e.preventDefault();
  });

  /* Saved one? */
  var existing = location.hash.replace(/#/, '')
  if(existing) {
    var existing_json = JSON.parse(Base64.decode(existing)),
        go_x, go_y;

    $.each(existing_json, function(k, v) {
      context.beginPath();
      context.moveTo(go_x, go_y);

      context.lineTo(v[0], v[1]);
      context.closePath();
      context.stroke();

      go_x = v[0];
      go_y = v[1];
    });

    /* Set the defaults */
    path = existing_json;
    cur_x = go_x;
    cur_y = go_y;
  }
});

/* Shake and bake */
var pos_x = pos_y = false;
var direction_x = direction_y = 0;
var total_x = total_y = 0;
var timer = false;

$( "#etch" ).draggable({ revert: true, scroll:false, start: function(){
  timer = setInterval(function(){
    total_x--;
    total_y--;
    if(total_x < 0) total_x = 0;
    if(total_y < 0) total_y = 0;
  }, 300);
},
drag: function(e){
  var new_direction_x = e.pageX - pos_x > 0 ? 1 : -1,
      new_direction_y = e.pageY - pos_y > 0 ? 1 : -1;
  if(Math.abs(e.pageX - pos_x) > 10 && new_direction_x != direction_x) {
    direction_x = new_direction_x;
    total_x++;
  }
  if(Math.abs(e.pageY - pos_y) > 10 && new_direction_y != direction_y) {
    direction_y = new_direction_y;
    total_y++;
  }

  pos_x = e.pageX;
  pos_y = e.pageY;

  if(total_x >= 4 || total_y >= 4) {
    context.clearRect(0,0,1000,1000);
    path = {0: [cur_x, cur_y]};
    i = 0;
  }


}, stop: function() {
  pos_x = pos_y = false;
  direction_x = direction_y = 0;
  total_x = total_y = 0;
  clearInterval(timer);
}
});
