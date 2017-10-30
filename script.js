const P_RADIUS = 4;
const P_COLOR = 'black';
const S_STROKE = 1;
var target;
var point;
var ctrlCurves = [[] , []];
var pointCounter = 0;


function drawSegment(){
	ctrlCurves.forEach(function(curve){

		curve.forEach(function(point, i){
			if(i < curve.length-1){
				var next = curve[i+1];
				path = new Path()
			  	.moveTo(point._attributes.x, point._attributes.y)
			  	.lineTo(next._attributes.x, next._attributes.y)
			  	.closePath()
				.addTo(stage);
				path.stroke('red', S_STROKE);
			}
		});
	});
}

stage.on('click', function(clickEvent){

	//creating points
	target = clickEvent.target;

	x = clickEvent.x;
	y = clickEvent.y;
	
	point = new Circle(x,y, P_RADIUS).fill(P_COLOR).addTo(stage);
	pointCounter++;
	
	if(pointCounter % 2 == 0) ctrlCurves[1].push(point); 
	else ctrlCurves[0].push(point);
	
	point.on('drag', function(dragEvent){
	//moving points
	
    	this.attr({"x": dragEvent.x, "y": dragEvent.y});
    	pointSelected = this.id;
		
		ctrlCurves.forEach(function(points, i){
			if(points.includes(pointSelected)){
	
		
			}
		});
	drawSegment();
	console.log(stage);

	});	
	
	drawSegment();

	point.on('doubleClick', function(dragEvent){
	//removing points

	
	});
});
		
