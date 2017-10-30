const P_RADIUS = 4;
const P_COLOR = 'black';

var target;
var point;
var ctrlCurves = [[] , []];
var pointCounter = 0;

stage.on('click', function(clickEvent){

	//creating points
	target = clickEvent.target;

	x = clickEvent.x;
	y = clickEvent.y;
	
	point = new Circle(x,y, P_RADIUS).fill(P_COLOR).addTo(stage);
	
	pointCounter++;
	
	if(pointCounter % 2 == 0) ctrlCurves[1].push(point); 
	else ctrlCurves[0].push(point);
	
	
});

stage.on('drag', function(dragEvent){
	//moving points

	
});
