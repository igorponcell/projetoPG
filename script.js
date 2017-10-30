const P_RADIUS = 4;
const P_COLOR = 'black';

var target;
var point;


stage.on('click', function(clickEvent){
	target = clickEvent.target;

	x = clickEvent.x;
	y = clickEvent.y;
	
	point = new Circle(x,y, P_RADIUS).fill(P_COLOR).addTo(stage);

});

stage.on('drag', function(dragEvent){
});
