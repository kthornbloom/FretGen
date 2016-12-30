$(document).ready(function(){

	/* RUN THE FUNCTION
	==============================================================*/
	drawFrets();
	$("#input input").on('change keyup paste', function () {
		if ($('#input')[0].checkValidity()) {
			drawFrets();
			$('.problem').removeClass('problem');
		} else {
			$('.result').addClass('problem');
		}
	});

	function drawFrets(){
		$('#render').empty();
		//amt to enlarge 1px
		var ratio = 96, 
			// string width nut
			swn = $('#swn').val() * ratio,
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
			center = parseInt(width / 2),
			// perpendicular fret
			perpFret = $('#perp').val(),
			// number of strings
			stringCount = $('#stringcount').val(),
			// number of frets
			fretCount = $('#fretcount').val(),
			stringSpacenut = swn / (stringCount - 1),
			stringSpacebridge = swb / (stringCount - 1);

		$('#render').attr('viewBox','0, 0, '+width+', '+height+'');

		/* CENTER LINE
		==============================================================*/
		$('#render').append('<line class="centerline" x1 = "'+center+'" y1 = "0" x2 = "'+center+'" y2 = "'+height+'" stroke = "black" stroke-dasharray="10, 10"  stroke-width = "1"/>');

		/* STRINGS
		==============================================================*/
		for(var i = 0; i < stringCount; i++) {

			var step = Math.abs(scale1 - scale2) / (stringCount - 1);
			if (scale1 <= scale2){
				var stringLength = (step * i) + Math.min(scale1, scale2);
			} else {
				var stringLength = Math.max(scale1, scale2) - (step * i);
			}
			var stringY1 = (height - stringLength) * perpFret,
				 stringY2 = stringY1 + stringLength,
				 stringX1 = (i * stringSpacenut) + (center - (swn / 2)),
				 stringX2 = (i * stringSpacebridge) + (center - (swb / 2));

			$('#render').append('<line class="string" x1 = "'+stringX1+'" y1 = "'+stringY1+'" x2 = "'+stringX2+'" y2 = "'+stringY2+'" stroke = "black" stroke-width = "1"/>');
		}

		/* FRETBOARD EDGES
		==============================================================*/
		var firststringX1 = parseInt($('.string:first').attr('x1')),
			firststringY1 = parseInt($('.string:first').attr('y1')),
			firststringX2 = parseInt($('.string:first').attr('x2')),
			firststringY2 = parseInt($('.string:first').attr('y2')),
			laststringX1 = parseInt($('.string:last').attr('x1')),
			laststringY1 = parseInt($('.string:last').attr('y1')),
			laststringX2 = parseInt($('.string:last').attr('x2')),
			laststringY2 = parseInt($('.string:last').attr('y2')),

			a = Math.abs(firststringX1 - laststringX1),
			b = Math.abs(firststringY1 - laststringY1),
			c = offsetN,
			d = parseInt((c*b)/a);

			e = Math.abs(firststringX2 - laststringX2),
			f = Math.abs(firststringY2 - laststringY2),
			g = offsetB,
			h = parseInt((g*f)/e);

			/* Top L Form is (st1x - st2x)    (st1Y) - (st2Y)
							-------------- = ---------------
						     overhang           ??  -> add to st1Y
			*/
		var	leftedgeX1 = (width / 2) - (swn/2 + offsetN),
			leftedgeX2 = (width / 2) - (swb/2 + offsetB),
			rightedgeX1 = (width / 2) + (swn/2 + offsetN),
			rightedgeX2 = (width / 2) + (swb/2 + offsetB);

			// calculate depending on which side is longer
		if ((firststringY1 - firststringY2) >= (laststringY1 - laststringY2)){
			var leftedgeY1 = (firststringY1 + d),
			leftedgeY2 = (firststringY2 - h),
			rightedgeY1 = (laststringY1 - d),
			rightedgeY2 = (laststringY2 + h);
		} else {
			var leftedgeY1 = (firststringY1 - d),
			leftedgeY2 = (firststringY2 + h),
			rightedgeY1 = (laststringY1 + d),
			rightedgeY2 = (laststringY2 - h);
		}

		$('#render').append('<line class="leftedge" x1 = "'+leftedgeX1+'" y1 = "'+leftedgeY1+'" x2 = "'+leftedgeX2+'" y2 = "'+leftedgeY2+'" stroke = "black" stroke-width = "1"/>');
		$('#render').append('<line class="rightedge" x1 = "'+rightedgeX1+'" y1 = "'+rightedgeY1+'" x2 = "'+rightedgeX2+'" y2 = "'+rightedgeY2+'" stroke = "black" stroke-width = "1"/>');

		/* NUT & BRIDGE
		==============================================================*/

		$('#render').append('<line class="nut" x1 = "'+leftedgeX1+'" y1 = "'+leftedgeY1+'" x2 = "'+rightedgeX1+'" y2 = "'+rightedgeY1+'" stroke = "black" stroke-width = "1"/>');

		$('#render').append('<line class="bridge" x1 = "'+leftedgeX2+'" y1 = "'+leftedgeY2+'" x2 = "'+rightedgeX2+'" y2 = "'+rightedgeY2+'" stroke = "black" stroke-width = "1"/>');
		
		/* FRETS
		==============================================================*/
		var a = Math.abs(leftedgeY1 - leftedgeY2),
			b = Math.abs(leftedgeX1 - leftedgeX2),
			c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
			// c is the left sides's length
			d = Math.abs(rightedgeY1 - rightedgeY2),
			e = Math.abs(rightedgeX1 - rightedgeX2),
			f = Math.sqrt(Math.pow(d, 2) + Math.pow(e, 2)),
			// f is right sides's length,
			leftRemainder =  c * .943878,
			rightRemainder = f * .943878;

		var perpOffset = perpFret * (Math.abs(c - f));

		for(var i = 0; i < fretCount; i++) {
			var	lefthypotenuse = (c - leftRemainder),
				lefthypotenuseInvert = (leftRemainder),
				righthypotenuse = (f - rightRemainder),
				righthypotenuseInvert = (rightRemainder);

			if (perpFret > 0 && c < f){
				var fretX1 = (b * lefthypotenuseInvert) / c,
					fretY1 = (a * lefthypotenuse) / c + perpOffset,
					fretX2 = rightedgeX1 + ((e * righthypotenuse) / f),
					fretY2 = (d * righthypotenuse) / f ;
				console.log('A');
			} else if (perpFret > 0 && rightedgeY1 > leftedgeY1){
				/* FIX DIS */
				var fretX1 = (b * lefthypotenuseInvert) / c,
					fretY1 = (a * lefthypotenuse) / c,
					fretX2 = rightedgeX1 + ((e * righthypotenuse) / f),
					fretY2 = ((d * righthypotenuse) / f) + perpOffset;
					console.log('B');
			} else if (perpFret == 0) {
				var fretX1 = (b * lefthypotenuseInvert) / c,
					fretY1 = (a * lefthypotenuse) / c,
					fretX2 = rightedgeX1 + ((e * righthypotenuse) / f),
					fretY2 = (d * righthypotenuse) / f;
					console.log('C');
			}

			$('#render').append('<line rel="'+i+'" class="fret" x1 = "'+fretX1+'" y1 = "'+fretY1+'" x2 = "'+fretX2+'" y2 = "'+fretY2+'" stroke = "black" stroke-width = "1"/>');
			var leftRemainder = (leftRemainder * .943878),
				rightRemainder = (rightRemainder * .943878);
		}

		// Refresh dat page to update SVG
		$('.result').html($('.result').html());
	}

	$("#printable").on("click", function () {
		var w = window.open();
		var content = $('.result').html();
		$(w.document.body).html(content);
	});

	$("#download").on("click", function () {
		var content = $('.result').html();
		downloadFile("fretboard.svg", content);
	});

	var downloadFile = function(filename, content) {
		var blob = new Blob([content]);
		var event = new MouseEvent('click', {
		'view': window,
		'bubbles': true,
		'cancelable': true
		});
		var a = document.createElement("a");
		a.download = filename;
		a.href = URL.createObjectURL(blob);
		a.dispatchEvent(event);
	};

	/* Modal stuff */
	$('.tip').on('click', function(){
		var info = $(this).attr('data-tip');
		$('body').append('<div class="modal-wrap"><div class="modal">'+info+'<br><a href="#" class="button button-primary close-modal">OK</div></div></div>');
		$('.modal-wrap').offset();
		$('.modal-wrap').addClass('modal-visible');
	});
	$(document).on('click','.close-modal',function(){
		$('.modal-wrap').removeClass('modal-visible');
		setTimeout(function(){
			$('.modal-wrap').remove();
		}, 400);
	});

});

