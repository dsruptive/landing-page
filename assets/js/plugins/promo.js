$(function() {
	$(".fullscreen-static-image").backstretch(["assets/img-temp/promo.jpg"],{duration: 5000, fade:1500});

	var geolocationEl = $(".form-section .location-select");
	var selectCountryEl = $(".form-section .country-select");
	var videoBackground = document.getElementById('video-background');
	var fullVideo = document.getElementById('full-video');
	var playButton = document.getElementById('play');
	var close = document.getElementById('close');

	playButton.addEventListener('click', startVideo, false);
	close.addEventListener('click', stopVideo, false);



	// on load, hook up location
	if (navigator.geolocation) {
		var startPos;
	  var geoOptions = {
	    enableHighAccuracy: false
	  }

	  var geoSuccess = function(position) {
	    startPos = position;

			// do reverse geocoding
			var apiKey = "AIzaSyBHaEZsp6VDcrqc4A8iBsZEqo0rBlk68Mg";
			var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&key="+apiKey;

			// Assign handlers immediately after making the request,
			// and remember the jqxhr object for this request
			var jqxhr = $.post( url, function(data, status) {
				var res = data.results;

				var country = res[res.length-1].formatted_address;
				var countryCode = res[res.length-1].address_components[0].short_name;

				updateCountryFromGeolocation(country, countryCode);
			})
			.fail(function(error) {
			  //console.log( "error", error );
				// hide geolocation country
				geolocationEl.removeClass('active');

				// show select country
				selectCountryEl.addClass('active');
			});
		};

	  var geoError = function(error) {
	    console.log('Error occurred. Error code: ' + error.code);
	    // error.code can be:
	    //   0: unknown error
	    //   1: permission denied
	    //   2: position unavailable (error response from location provider)
	    //   3: timed out

			// hide geolocation country
			geolocationEl.removeClass('active');

			// show select country
			selectCountryEl.addClass('active');
	  };

	  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

	} else { // not supported
		// hide geolocation country
		geolocationEl.removeClass('active');

		// show select country
		selectCountryEl.addClass('active');
	}

	var updateCountryFromGeolocation = function(country, code) {
		// update text
		$(".form-section .formatted_address").text(country);

		// update selectedIndex
		$(".form-section .country-select select option").each(function(key, val){
			var optionValue = $(this).attr('value');
			if (optionValue === code) {
				$(this).parent().prop('selectedIndex',key);
				$(this).text(country);
				return false;
			}
		});

		// show geolocation country
		geolocationEl.addClass('active');

		// hide select country
		selectCountryEl.removeClass('active');
	};

	var positionPlayIcon = function() {
		var videoEl = $("#video-background");
		var playEl = $('.play-video');
		var t = videoEl.offset().top;


		playEl.css({
			top: 0.5 * (videoEl.height()-playEl.height()),
			left: 0.5 * (videoEl.width()-playEl.width())
		})
	};
	// on change location click, swap elements
	$('.change_country').on("click", function(event) {
			// hide geolocation country
			geolocationEl.removeClass('active');

			// show select country
			selectCountryEl.addClass('active');
	});

	// on resize, update play icon position with regards to the size of the video element
	$(window).on("resize", positionPlayIcon);

	positionPlayIcon();

	document.onkeydown = function(event) {
		event = event || window.event;
		var isEscape = false;
		if ("key" in event) {
			isEscape = (event.key == "Escape" || event.key == "Esc");
		} else {
			isEscape = (event.keyCode == 27);
		}
		if (isEscape) {
			stopVideo();
		}
	};

	function startVideo() {
		videoBackground.pause();
		overlay.style.display = 'flex';
		fullVideo.load();
		//fullVideo.play();
	}

	function stopVideo() {
		fullVideo.pause();
		overlay.style.display = 'none';
		videoBackground.play();
	}

	// on submit, fetch and validate data

	// setup listeners on facebook groups
	function forwardToGroup(event) {
		var target = event.currentTarget;
		var url = $(target).data('link');
		window.open(url)
	}
	$('.fb-group').on('click', forwardToGroup);
});
