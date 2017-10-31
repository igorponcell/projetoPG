const P_RADIUS = 4;
const P_COLOR = 'black';
const S_STROKE = 1;
var target;
var point;
var ctrlCurves = [[],[]];
var curveCounter = 0;
var paths = [];
var j = 0;
var draw = false;
var bezierCurves = [];
var evaluation = 100;
var tEvaluation = 50;
var cBezierCurves = [];
var sb = 5;
var degree = {
	curve1: -1,
	curve2: -1
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
bezierCurves.push(new Path().stroke('pink', S_STROKE).addTo(stage));
bezierCurves.push(new Path().stroke('purple', S_STROKE).addTo(stage));

function drawSegment(point){
		ctrlCurves.forEach(function(points, i){
      if(points.includes(point.id)) {
        if(paths[i].segments().length === 0) paths[i].moveTo(x, y);
        else paths[i].lineTo(x, y);
      }
  });
}
function drawBezierC(i){
	if (i) i = 1;
	else i = 0;

	if(paths[i].segments().length < 2) return;
	var points = paths[i].segments();

	bezierCurves[i].segments(Array(0));

	var x = 0;
	var y = 0;

	bezierCurves[i].moveTo(points[0][1], points[0][2]);

 	for(t = 1/evaluation; t < 1 ; t += 1/evaluation, x = 0, y = 0){
		for(p = 1; p < points.length; p++){
			for(c = 0; c < points.length -p ; c++){
					points[c][1] = (1 - t) * points[c][1] + t * points[c + 1][1];
					points[c][2] = (1 - t) * points[c][2] + t * points[c + 1][2];
			}
		}
		x = points[0][1];
		y = points[0][2];

		bezierCurves[i].lineTo(x,y);
	}

	bezierCurves[i].lineTo(points[i][1], points[i][2]);
}

stage.on('click', function(clickEvent){

	//creating points
	target = clickEvent.target;

	if(target.id <= 2){
		x = clickEvent.x;
		y = clickEvent.y;

		point = new Circle(x,y, P_RADIUS).fill(P_COLOR).addTo(stage);
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
					drawBezierC(i);
				}
			});
		});



		point.on('doubleclick', function(dragEvent){

			var target = this.id;
			ctrlCurves.forEach(function(points, i){
				if(points.includes(target)){
					if(i == 0) turn = false;
					else turn = true;

					var index = points.indexOf(target);
					if (index > -1) {
    				points.splice(index, 1);
					}

					console.log(ctrlCurves);
				}



			});

			stage.children().forEach(function(child){
				if(child.id == target) {
					stage.removeChild(child);

				}
			});
		});

		drawSegment(point);
		drawBezierC(turn);

		if (!turn) degree.curve1++;
		else degree.curve2++;
		console.log(degree);

		var diff = degree.curve1 - degree.curve2;
		if(diff <= 1 && diff >= -1) turn = !turn;

	}


});

stage.on('message:draw', function(data) {
  draw = true;
  stage.sendMessage('draw', {bool: draw});
  sb = parseInt(data.t);
  //removeCurves();
  //draw_by_points();
});
