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
	var ratio = 20; //amt to enlarge 1px
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
		// Get the non negative difference between scales, divide by # strings, times iteration
		var stringLength = (Math.abs(scale1 - scale2) / stringCount) * i,
			// Add to the smaller of the scale sizes
			stringLength = stringLength + Math.min(scale1, scale2);

		// If current string is the middle string
		if (i == Math.ceil(stringCount / 2)) {
			var nutX = center;
		// or if it's above the middle & even # strings
		} else if (i > stringCount / 2 && stringCount % 2 === 0) {
			var nutX = 0;
		}

		ctx.beginPath();
		ctx.moveTo(((i * stringSpacenut)/2) + center, 0);
		ctx.lineTo(0 + (stringSpacebridge * i), stringLength);
		ctx.strokeStyle = 'red';
		ctx.stroke();
	}
}

/*
// draw outer fretboard lines
	for(var i = 0; i < stringCount; i++) {
		var stringLength = (Math.abs(scale1 - scale2) / stringCount) * i,
			stringLength = stringLength + Math.min(scale1, scale2);
		ctx.beginPath();
		ctx.moveTo(0 + (stringSpacenut * i), 0);
		ctx.lineTo(0 + (stringSpacebridge * i), stringLength);
		ctx.strokeStyle = 'red';
		ctx.stroke();
	}
*/