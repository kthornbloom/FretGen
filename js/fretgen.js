$(document).ready(function(){

	/* RUN THE FUNCTION
	==============================================================*/
	drawFrets();
	$(".settings input").on('change keyup paste', function () {
		drawFrets();
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
		$('#render').append('<line class="centerline" x1 = "'+center+'" y1 = "0" x2 = "'+center+'" y2 = "'+height+'" stroke = "black" stroke-dasharray="20, 5"  stroke-width = "1"/>');

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

		if (firststringY1 >= laststringY1){
			var leftedgeY1 = (firststringY1 + d),
			leftedgeY2 = (firststringY2 + h),
			rightedgeY1 = (laststringY1 - d),
			rightedgeY2 = (laststringY2 - h);
		} else {
			var leftedgeY1 = (firststringY1 - d),
			leftedgeY2 = (firststringY2 + h),
			rightedgeY1 = (laststringY1 + d),
			rightedgeY2 = (laststringY2 - h);
		}

		$('#render').append('<line class="leftedge" x1 = "'+leftedgeX1+'" y1 = "'+leftedgeY1+'" x2 = "'+leftedgeX2+'" y2 = "'+leftedgeY2+'" stroke = "black" stroke-width = "1"/>');
		$('#render').append('<line class="rightedge" x1 = "'+rightedgeX1+'" y1 = "'+rightedgeY1+'" x2 = "'+rightedgeX2+'" y2 = "'+rightedgeY2+'" stroke = "black" stroke-width = "1"/>');
		
		/* FRETS
		==============================================================*/
		var a = Math.abs(leftedgeY1 - leftedgeY2),
			b = Math.abs(leftedgeX1 - leftedgeX2),
			c = offsetN,
			d = parseInt((c*b)/a);

		for(var i = 0; i < fretCount; i++) {

		}

		/*

		var previousFret = (scale1 * .943878);

		for(var i = 0; i < fretCount; i++) {
			var fretX1 = ,
				 fretY1 = ,
				 fretX2 = ,
				 fretY2 = ;
			$('#render').append('<line class="fret" x1 = "'+fretX1+'" y1 = "'+fretY1+'" x2 = "'+fretX2+'" y2 = "'+fretY2+'" stroke = "black" stroke-width = "1"/>');
		}
		*/

		// Refresh dat page to update SVG
		$('.result').html($('.result').html());
	}

});

