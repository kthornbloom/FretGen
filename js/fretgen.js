var canvas = document.getElementById("render");

if (canvas.getContext){
	drawFrets();
} else {
	// no canvas support
	$('.result').html('<div class="error">Your browser must be old. Like <i><b>Jurassic Period</b></i> old. Please upgrade or replace with a modern browser to use FretGen.</div>');
}

function drawFrets(){
	var ratio = 40; //amt to enlarge 1px
	var	swn = $('#swn').val() * ratio,
		swb = $('#swb').val() * ratio,
		son = $('#son').val() * ratio,
		sob = $('#sob').val() * ratio,
		scale1 = $('#scale1').val() * ratio,
		scale2 = $('#scale2').val() * ratio,
		height = Math.max(scale1, scale2),
		width = swb + (sob * 2);

	// Set overall width/height
	$('#render').attr('height',height);
	$('#render').attr('width',width);

	var	ctx = canvas.getContext('2d');

	// draw center line
	ctx.beginPath();
	ctx.moveTo(width / 2,0);
	ctx.lineTo(width / 2, height);
	ctx.strokeStyle = '#ccc';
	ctx.stroke();
}