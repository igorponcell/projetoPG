
const P_COLOR = 'yellow';
const P_RADIUS = 5;
const P_STROKE = 1;
const B_STROKE = 2;
const T_B_COLOR = 'purple';
const T_B_STROKE = 2;
const invisible = new color.RGBAColor(0, 0, 0, 0.0);
var B_COLOR = 'pink';
var pathColors = ['red', 'blue'];


// Chance this var to chance original curve's degree
var degree = 5;


var evaluations = 300; //default value
var tEvaluations = 30; //default value
var sb = 20; //default value
var countPoints = 0;
var paths = [];
var bezierCurves = [];
var cBezierCurves = [];
var allCPoints = [[], []];
var draw = false;
for(i = 0; i < 2; i++){
  paths.push(new Path().stroke(pathColors[i], P_STROKE).addTo(stage));
  bezierCurves.push(new Path().stroke(B_COLOR, B_STROKE).addTo(stage));
}

function generateCBezierCurve(){
  for(i = 0; i <= sb; i++){
    if(draw) cBezierCurves.push(new Path().stroke('#2fac66', T_B_STROKE).addTo(stage));
    else cBezierCurves.push(new Path().stroke(invisible, T_B_STROKE).addTo(stage));
  }
}

// Drawing the original curves
function drawBezierCurve(i) {
  var n, x, y;
  if(paths[i].segments().length < 2) return;
  var points = paths[i].segments();

  bezierCurves[i].segments(Array(0));

  bezierCurves[i].moveTo(points[0][1], points[0][2]);
  n = points.length - 1;
  x = 0, y = 0;

  for(t = 1/evaluations; t < 1; t += 1/evaluations, x = 0, y = 0) {
    for(p = 1; p < points.length; p++){
      for(c = 0; c < points.length - p; c++){
        points[c][1] = (1 - t) * points[c][1] + t * points[c + 1][1];
        points[c][2] = (1 - t) * points[c][2] + t * points[c + 1][2];
      }
    }
    x = points[0][1];
    y = points[0][2];

    bezierCurves[i].lineTo(x, y);
  }

  bezierCurves[i].lineTo(points[n][1], points[n][2]);
}

//Draws the tBezierCurves based on the points of the original curves
function drawTCurve(){
  generateCBezierCurve();
  var count = 0;
  var controlPoints = [];
  var aux = paths[1].segments();

  console.log(paths[0].segments());
  console.log(paths[1].segments());
  for (q = 0; q < 1.001; q += 1/sb) {
    
    var tpoints = [];
    
    for (i = 0; i < countPoints/2; i++){
    
      controlPoints[0] = paths[0].segments()[i];
      controlPoints[1] = paths[1].segments()[i];

      for(var pt = 1; pt < controlPoints.length; pt++) {
    
        for(var ct = 0; ct < controlPoints.length - pt; ct++) {
          //calculating the new points
          controlPoints[ct][1] = (1 - q) * controlPoints[ct][1] + q * controlPoints[ct + 1][1];
          controlPoints[ct][2] = (1 - q) * controlPoints[ct][2] + q * controlPoints[ct + 1][2];
    
        }
      }

      tpoints.push(controlPoints[0]);
    }
  drawTBezierCurve(count, tpoints);
  count++;
  }
}

// function to draw T curves
function drawTBezierCurve(i, points) {
  
  var n = 0;
  var x = 0;
  var y = 0;

  cBezierCurves[i].segments(Array(0));
  cBezierCurves[i].moveTo(points[0][1], points[0][2]);
  
  n = points.length - 1;
  

  for(t = 1/tEvaluations; t < 1; t += 1/tEvaluations, x = 0, y = 0) {
    for(p = 1; p < points.length; p++){
      for(c = 0; c < points.length - p; c++){
        points[c][1] = (1 - t) * points[c][1] + t * points[c + 1][1];
        points[c][2] = (1 - t) * points[c][2] + t * points[c + 1][2];
      }
    }
    x = points[0][1];
    y = points[0][2];

    cBezierCurves[i].lineTo(x, y);
  }
   cBezierCurves[i].moveTo(points[n][1], points[n][2]);
}

//removing curves from stage
function removeCurves() {
  var arr = cBezierCurves;
  arr.forEach(function(cb){
    stage.removeChild(cb);
  });
  cBezierCurves = [];
}



// Setting values on index
stage.sendMessage('backValue', {eval: evaluations, tEvaluations: tEvaluations, degree: degree});


stage.on('click', function(clickEvent) {

  target = clickEvent.target;

  if(countPoints < degree*2){
    if(target.id <= 2 && 'id' in target && countPoints < degree*2){
      x = clickEvent.x;
      y = clickEvent.y;

      point = new Circle(x, y, P_RADIUS).fill(P_COLOR).addTo(stage);

      if(allCPoints[0].length < degree) allCPoints[0].push(point.id);
      else allCPoints[1].push(point.id);
      
      countPoints++;
  }

    point.on('doubleclick', function(dragEvent){
      var owner_num, num_of_points;
      var point_clicked = this.id;

      allCPoints.forEach(function(points, i){
        if(points.includes(point_clicked)){
          owner_num = i;
          console.log(owner_num);
          countPoints -= points.length;
          stage.removeChild(paths[i]);
          stage.removeChild(bezierCurves[i]);
          stage.children().forEach(function(ch){
            if(points.includes(ch.id)){
              stage.removeChild(ch);
            }
          });
        }
      });
      removeCurves();
      for(i = owner_num; i < 2; i++){
        if(i < 1) {
          allCPoints[i] = allCPoints[i + 1];
          paths[i] = paths[i+1];
          paths[i].stroke(pathColors[i], P_STROKE);
          bezierCurves[i] = bezierCurves[i + 1];
        } else{
          allCPoints[i] = [];
          paths[i] = new Path().stroke(pathColors[i], P_STROKE).addTo(stage);
          bezierCurves[i] = new Path().stroke(B_COLOR, B_STROKE).addTo(stage);
        }

      }
    });

    point.on('drag', function(dragEvent){
      this.attr({"x": dragEvent.x, "y": dragEvent.y});
      point_id = this.id;
      var aux = this;
      allCPoints.forEach(function(points, i){
        if(points.includes(point_id)){
          segments = paths[i].segments();
          segments[points.indexOf(point_id)][1] = aux.attr("x");
          segments[points.indexOf(point_id)][2] = aux.attr("y");
          paths[i].segments(segments);
          drawBezierCurve(i);
        }
      });
      if(countPoints == degree *2) {
        var arr = cBezierCurves;
        removeCurves();
        drawTCurve();
      }
    });

    allCPoints.forEach(function(points, i){
      if(points.includes(point.id)) {
        if(paths[i].segments().length === 0) paths[i].moveTo(x, y);
        else paths[i].lineTo(x, y);
        drawBezierCurve(i);
      }
    });

    // Activate draw button when the counter of points reach (2*degree)
    if(countPoints == degree*2) stage.sendMessage("enableDrawButton", {});
  }
});

// Gets values from the front

stage.on('message:getEval', function(data){

  degree =  parseInt(data.degree);
  evaluations = parseInt(data.eval);
  bezierCurves.forEach(function(bc,i){
      drawBezierCurve(i);
  });
  tEvaluations = parseInt(data.tEval);
  sb = parseInt(data.t);
  var arr = cBezierCurves;
  removeCurves();
  if(countPoints == degree * 2 && draw) drawTCurve();
});

// Gets when the button was pressed to draw tBezierCurves

stage.on('message:draw', function(data) {
  draw = true;
  stage.sendMessage('draw', {bool: draw});
  sb = parseInt(data.t);
  removeCurves();
  drawTCurve();
});

//function to hide the elements (points, segments, etc)
stage.on('message:hideElement', function(data){
  var arr, col, stroke;
  if(data.id == 'points'){
    allCPoints.forEach(function(points){
      points.forEach(function(point){
        stage.children().forEach(function(e){
          if(e.id == point) {
            if(!data.boxChecked) e.fill(invisible);
            else e.fill(P_COLOR);
          }
        });
      });
    });
  } else if(data.id != "tCurves"){
    if (data.id == 'segments') {
      arr = paths; col = pathColors; stroke = P_STROKE;
      arr.forEach(function(el,i){
        if(!data.boxChecked) el.stroke(invisible, stroke).addTo(stage);
        else el.stroke(col[i], stroke).addTo(stage);
      });
    }
    else if(data.id == 'curves') {
      arr = bezierCurves; col = B_COLOR;
      stroke = B_STROKE;
      arr.forEach(function(el){
      if(!data.boxChecked) el.stroke(invisible, stroke).addTo(stage);
      else el.stroke(col, stroke).addTo(stage);
      });
    }
  } else {
    arr = cBezierCurves; stroke = T_B_STROKE;
    arr.forEach(function(el,i){
      if(!data.boxChecked){
        draw = false;
        el.stroke(invisible, stroke).addTo(stage);
      }
      else {
        draw = true;
        el.stroke('#2fac66', stroke).addTo(stage);
      }
    });
  }

});
