var canvas = document.getElementById("render");

if (canvas.getContext){
	drawFrets();
} else {
	// no canvas support
	$('.result').html('<div class="error">Your browser must be old. Like <i><b>Jurassic Period</b></i> old. Please upgrade or replace with a modern browser to use FretGen.</div>');
}

$(".settings input").change(function () {
	drawFrets();
	console.log('ran');
});

function drawFrets(){
	var ratio = 96; //amt to enlarge 1px
		// string width nut
	var	swn = $('#swn').val() * ratio,
		// string width bridge
		swb = $('#swb').val() * ratio,
		maxStringwidth = Math.max(swn, swb),
		// offset at nut
		offsetN = $('#son').val() * ratio,
		// offset at bridge
		offsetB = $('#sob').val() * ratio,
		maxOffset = Math.max(offsetN, offsetB),
		// scale length 1
		scale1 = $('#scale1').val() * ratio,
		// scale length 2
		scale2 = $('#scale2').val() * ratio,
		// overall height
		height = Math.max(scale1, scale2),
		// overall width
		width = maxStringwidth + (maxOffset * 2),
		// half width
		center = width / 2,
		// perpendicular fret
		perpFret = $('#perp').val(),
		// number of strings
		stringCount = $('#stringcount').val(),
		stringSpacenut = swn / (stringCount - 1),
		stringSpacebridge = swb / (stringCount - 1);

	// Set overall width/height
	$('#render').attr('height',height);
	$('#render').attr('width',width);

	var	ctx = canvas.getContext('2d');

	// draw center line
	ctx.beginPath();
	ctx.moveTo(center,0);
	ctx.lineTo(center, height);
	ctx.strokeStyle = '#ccc';
	ctx.stroke();

	// Draw Strings
	for(var i = 0; i < stringCount; i++) {

		if (scale1 <= scale2){
			var step = Math.abs(scale1 - scale2) / (stringCount - 1),
			stringLength = (step * i) + Math.min(scale1, scale2);
		} else {
			var step = Math.abs(scale1 - scale2) / (stringCount - 1),
			stringLength = Math.max(scale1, scale2) - (step * i);
		}
		

		var	stringY = (height - stringLength) * perpFret;
		ctx.beginPath();
		ctx.moveTo((i * stringSpacenut) + (center - (swn / 2)), stringY);
		ctx.lineTo((i * stringSpacebridge) + (center - (swb / 2)), stringLength + stringY);
		ctx.strokeStyle = 'red';
		ctx.stroke();
	}

	// Draw left fretboard edge
	if (scale1 <= scale2){
			var step = Math.abs(scale1 - scale2) / (stringCount - 1),
			stringLength = Math.min(scale1, scale2) - step;
		} else {
			var step = Math.abs(scale1 - scale2) / (stringCount - 1),
			stringLength = Math.max(scale1, scale2) + step;
		}
		
		/*
			^ mk  v not mk
		*/

		var	stringY = (height - stringLength) * perpFret;
		ctx.beginPath();
		ctx.moveTo((i * stringSpacenut) + (center - (swn / 2)), stringY);
		ctx.lineTo((i * stringSpacebridge) + (center - (swb / 2)), stringLength + stringY);
		ctx.strokeStyle = 'purple';
		ctx.stroke();

	// Draw left fretboard edge

	// Draw Frets
}