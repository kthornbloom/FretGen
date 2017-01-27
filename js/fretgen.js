$(document).ready(function(){

	/* RUN ON INPUT
	==============================================================*/
	drawFretboard();
	$("#input input").on('change keyup paste', function () {

		// Make sure strings aren't wider than the board
		var nutWidth = $('#nut-width').val(),
				bridgeWidth = $('#bridge-width').val(),
				stringWidthNut = $('#string-width-nut').val(),
				stringWidthBridge = $('#string-width-bridge').val();
		if (nutWidth < stringWidthNut || bridgeWidth < stringWidthBridge) {
			$('.result').addClass('invalid-fretboard');
		// Check if form is valid
		} else if ($('#input')[0].checkValidity()){
			drawFretboard();
			$('.invalid-fretboard').removeClass('invalid-fretboard');
		// If form is not valid...
		} else {
			$('.result').addClass('invalid-fretboard');
		}
	});

	/* DRAW FRETBOARD FUNCTION
	==============================================================*/
	function drawFretboard(){
		// Clear previous render
		$('#render').empty();
		// Get user input
		var ratio = 90,
			firstScale = $('#top-scale').val(),
			lastScale = $('#bottom-scale').val(),
			perpDistance = $('#perp-distance').val(),
			nutWidth = $('#nut-width').val(),
			bridgeWidth = $('#bridge-width').val(),
			stringWidthNut = $('#string-width-nut').val(),
			stringWidthBridge = $('#string-width-bridge').val(),
			fretCount = $('#fret-count').val(),
			stringCount = $('#string-count').val(),			
			stringSpaceNut = stringWidthNut / (stringCount - 1),
			stringSpaceBridge = stringWidthBridge / (stringCount - 1),
			width = Math.max(nutWidth, bridgeWidth),
			center = width / 2,
			perpOffset = perpDistance * Math.abs(nutWidth - bridgeWidth),
			/*Set this to the actual height later */
			height = Math.max(firstScale, lastScale);

		

		/* CENTER LINE
		==============================================================*/
		$('#render').append('<line class="centerline" x1 = "'+center+'" y1 = "0" x2 = "'+center+'" y2 = "'+height+'" stroke = "black" stroke-dasharray=".1, .1"  stroke-width = ".0125"/>');

		/* STRINGS
		==============================================================*/

		for(var i = 0; i < stringCount; i++) {

			// Amount the strings step down on the Y axis (multiscale)
			var step = Math.abs(firstScale - lastScale) / (stringCount - 1);

			if (firstScale <= lastScale){
				var stringLength = (step * i) + Math.min(firstScale, lastScale);
			} else {
				var stringLength = Math.max(firstScale, lastScale) - (step * i);
			}
			var stringX1 = (i * stringSpaceNut) + (center - (stringWidthNut / 2)),
				stringY1 = (height - stringLength) * perpDistance,
				stringX2 = (i * stringSpaceBridge) + (center - (stringWidthBridge / 2)),
				// Pathagorean Therum, yo
				stringY2 = Math.pow(stringLength + stringY1, 2) - Math.pow(Math.abs(stringX1 - stringX2), 2),
				stringY2 = Math.sqrt(stringY2);

			$('#render').append('<line class="string" x1 = "'+stringX1+'" y1 = "'+stringY1+'" x2 = "'+stringX2+'" y2 = "'+stringY2+'" stroke = "black" stroke-width = ".0125"/>');
		}

		/* FRETBOARD EDGES
		==============================================================*/

		var	s1X1 = $('.string:first').attr('x1'),
			s1Y1 = $('.string:first').attr('y1'),
			s1X2 = $('.string:first').attr('x2'),
			s1Y2 = $('.string:first').attr('y2'),
			s2X1 = $('.string:last').attr('x1'),
			s2Y1 = $('.string:last').attr('y1'),
			s2X2 = $('.string:last').attr('x2'),
			s2Y2 = $('.string:last').attr('y2'),
			leftX1 = (width / 2) - (nutWidth /2),
			rightX1 = (width / 2) + (nutWidth /2),
			leftX2 = (width / 2) - (bridgeWidth /2),
			leftY1 = (s1Y1 * (center - leftX1)) / (center - s1X1),
			leftY2 = 10,
			rightX2 = (width / 2) + (bridgeWidth /2),
			rightY1 = (s2Y1 * (center - rightX1)) / (center - s2X1),
			rightY2 = 10;
		$('#render').append('<line class="leftedge" x1 = "'+leftX1+'" y1 = "'+leftY1+'" x2 = "'+leftX2+'" y2 = "'+leftY2+'" stroke = "black" stroke-width = ".0125"/>');
		$('#render').append('<line class="rightedge" x1 = "'+rightX1+'" y1 = "'+rightY1+'" x2 = "'+rightX2+'" y2 = "'+rightY2+'" stroke = "black" stroke-width = ".0125"/>');

	
		/* UPDATE RENDER SIZE
		==============================================================*/
		$('#render').attr('width',width+'in').attr('height',height+'in').attr('viewBox', '0, 0,' + width + ',' + height);
		$('.result').html($('.result').html());
	}

	/* CLICKY STUFF
	==============================================================*/
	$(document).on('click','#zoom-toggle', function(e){
		e.preventDefault();
		$(this).toggleClass('toggle-on');
		$('#render').toggleClass('render-fit');
	});

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
	$('.tip, .beta').on('click', function(){
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

