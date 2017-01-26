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

			var step = Math.abs(firstScale - lastScale) / (stringCount - 1);

			if (firstScale <= lastScale){
				var stringLength = (step * i) + Math.min(firstScale, lastScale);
			} else {
				var stringLength = Math.max(firstScale, lastScale) - (step * i);
			}
			var stringX1 = (i * stringSpaceNut) + (center - (stringWidthNut / 2)),
					stringY1 = (height - stringLength) * perpDistance,
					stringX2 = (i * stringSpaceBridge) + (center - (stringWidthBridge / 2)),
					stringY2 = Math.pow(stringLength + stringY1, 2) - Math.pow(Math.abs(stringX1 - stringX2), 2),
					stringY2 = Math.sqrt(stringY2);

			$('#render').append('<line class="string" x1 = "'+stringX1+'" y1 = "'+stringY1+'" x2 = "'+stringX2+'" y2 = "'+stringY2+'" stroke = "black" stroke-width = ".0125"/>');
		}

		/* FRETBOARD EDGES
		==============================================================*/
		var leftX1 = 0,
			leftX2 = 0,
			leftY1 = 0,
			leftY2 = 0,
			rightX1 = 0,
			rightX2 = 0,
			rightY1 = 0,
			rightY2 = 0;
		$('#render').append('<line class="leftedge" x1 = "'+leftX1+'" y1 = "'+leftY1+'" x2 = "'+leftX2+'" y2 = "'+leftY2+'" stroke = "black" stroke-width = "1"/>');
		$('#render').append('<line class="rightedge" x1 = "'+rightX1+'" y1 = "'+rightY1+'" x2 = "'+rightX2+'" y2 = "'+rightY2+'" stroke = "black" stroke-width = "1"/>');

	
		// update viewport
		$('#render').attr('width',width+'in').attr('height',height+'in').attr('viewBox', '0, 0,' + width + ',' + height);
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

