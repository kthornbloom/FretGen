$(document).ready(function(){

	/* RUN THE FUNCTION
	==============================================================*/
	drawFrets();
	$("#input input").on('change keyup paste', function () {
		if ($('#input')[0].checkValidity()) {
			drawFrets();
			$('.invalid-fretboard').removeClass('invalid-fretboard');
		} else {
			$('.result').addClass('invalid-fretboard');
		}
	});

	function drawFrets(){
		// Clear previous render
		$('#render').empty();
		// Get user input
		var ratio = 90,
			topScale = $('#top-scale').val() * ratio,
			bottomScale = $('#bottom-scale').val() * ratio,
			perpDistance = $('#perp-distance').val() * ratio,
			nutWidth = $('#nut-width').val() * ratio,
			bridgeWidth = $('#bridge-width').val() * ratio,
			stringWidthNut = $('#string-width-nut').val() * ratio,
			stringWidthBridge = $('#string-width-bridge').val() * ratio,
			fretCount = $('#fret-count').val() * ratio,
			stringCount = $('#string-count').val() * ratio,
			width = Math.max(nutWidth, bridgeWidth),
			center = width / 2;
			perpOffset = perpDistance * Math.abs(nutWidth - bridgeWidth),
			height = Math.max(topScale, bottomScale) + (perpOffset);


		/* FRETBOARD EDGES
		==============================================================*/
		var leftX1 = center - (nutWidth / 2),
			leftX2 = center - (bridgeWidth / 2),
			rightX1 = center + (nutWidth / 2),
			rightX2 = center + (bridgeWidth / 2);

		if (topScale == bottomScale || perpDistance == 0) {
			var leftY1 = 0,
				leftY2 = topScale,
				rightY1 = 0,
				rightY2 = bottomScale;
		} else if (topScale > bottomScale && perpDistance > 0) {
			var leftY1 = perpOffset * perpDistance,
				leftY2 = 100,
				rightY1 = 0,
				rightY2 = 100;
		} else if (topScale < bottomScale) {
			var leftY1 = 1,
				leftY2 = 1,
				rightY1 = 1,
				rightY2 = 1;
		}

		$('#render').append('<line class="leftedge" x1 = "'+leftX1+'" y1 = "'+leftY1+'" x2 = "'+leftX2+'" y2 = "'+leftY2+'" stroke = "black" stroke-width = "1"/>');
		$('#render').append('<line class="rightedge" x1 = "'+rightX1+'" y1 = "'+rightY1+'" x2 = "'+rightX2+'" y2 = "'+rightY2+'" stroke = "black" stroke-width = "1"/>');

		/* CENTER LINE
		==============================================================*/

		/* STRINGS
		==============================================================*/
	
		// update viewport
		$('#render').attr('viewBox','0, 0, '+width+', '+height+'');
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

