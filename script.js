const P_RADIUS = 4;
const P_COLOR = 'black';
const S_STROKE = 1;
var target;
var point;
var ctrlCurves = [[],[]];
var curveCounter = 0;
var pointCounter = 0;
var paths = [];
var j = 0;
var draw = false;
var bezierCurves = [];
var evaluation = 300;
var tEvaluation = 50;
var cBezierCurves = [];
var sb = 5;
var degree = {
	curve1: 0,
	curve2: 0
}

/*
 * Each turn represents which curve the next
 * point belongs to.
 * turn = false -> Curve 1 (red)
 * turn = true -> Curve 2 (blue)
*/
var turn = false;

/*
 * The paths array holds the segments for which
 * the segments between the controll points.
 * We initialize them empty here.
*/
paths.push(new Path().stroke('red', S_STROKE).addTo(stage));
paths.push(new Path().stroke('blue', S_STROKE).addTo(stage));


function drawSegment(point){
	ctrlCurves.forEach(function(points, i){
      if(points.includes(point.id)) {
        if(paths[i].segments().length === 0) paths[i].moveTo(x, y);
        else paths[i].lineTo(x, y);
      }
  });
}

function drawBezierC(i){
	var n, x, y;
	if(paths[i].segments().length() <2) return;

	bezierCurves[i].segments(Array(0));


}


stage.on('click', function(clickEvent){

	//creating points
	target = clickEvent.target;

	if(target.id <= 2){
		x = clickEvent.x;
		y = clickEvent.y;

		point = new Circle(x,y, P_RADIUS).fill(P_COLOR).addTo(stage);
		pointCounter++;

		if(!turn) ctrlCurves[0].push(point.id);
		else ctrlCurves[1].push(point.id);

		point.on('drag', function(dragEvent){
			disableDrawSegment = true;
			this.attr({"x": dragEvent.x, "y": dragEvent.y});
			point_id = this.id;
			var aux = this;
			ctrlCurves.forEach(function(points, i){
				if(points.includes(point_id)){
					segments = paths[i].segments();
					segments[points.indexOf(point_id)][1] = aux.attr("x");
					segments[points.indexOf(point_id)][2] = aux.attr("y");
					paths[i].segments(segments);
				}
			});
		});

		drawSegment(point);
		if (!turn) degree.curve1++;
		else degree.curve2++;
		console.log(degree);
		turn = !turn;
	}
});

stage.on('message:draw', function(data) {
  draw = true;
  stage.sendMessage('draw', {bool: draw});
  sb = parseInt(data.t);
  //removeCurves();
  //draw_by_points();
});
