$(document).ready(function() {
	//Resize
	function resize() {
		var height = $(window).height();
		$('header').height(height);
	}
	resize();
	$(window).resize(function() {
		resize();
	});

	//Video
	var myVideo = document.getElementById("dejavu-video");
	myVideo.onended = function() {
		$('.js-hero').removeClass('play');
	};
	var myVideoFlag = false;

	function playPause() {
		if (myVideo.paused) {
			$('.js-hero').addClass('play');
			myVideo.play();
			myVideoFlag = true;
		} else {
			$('.js-hero').removeClass('play');
			myVideo.pause();
			myVideoFlag = false;
		}
	}
	$('.video-play').on('click', playPause);

	//Onscroll
	$(window).on('scroll', function() {
		var top = $(window).scrollTop();
		if (top > 120) {
			$('.dejaVu-icon-strip').addClass('fixed');
			$('.js-hero').removeClass('play');
		} else {
			$('.dejaVu-icon-strip').removeClass('fixed');
			if (myVideoFlag)
				$('.js-hero').addClass('play');
		}
	});
});