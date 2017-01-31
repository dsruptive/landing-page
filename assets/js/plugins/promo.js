(function() {
	// fetch uid
	var geolocationEl = $(".form-section .location-select");
	var selectCountryEl = $(".form-section .country-select");
	var videoBackground = document.getElementById('video-background');
	var fullVideo = document.getElementById('full-video');
	var playButton = document.getElementById('play');
	var close = document.getElementById('close');

	var uid = getParameterByName('uid');
	if (uid) {
		var uidEl = $('.sky-form [name=uid]');
		uidEl.val(uid);
		$('.visual-uid').text(uid);

		// check for uid in database
		var inDatabase = false;

		var database = firebase.database();
		var user;
		var ref = database.ref('users/'+uid).once('value').then(function(snap) {
			user = snap.val();
			if (!user) {
				userRegistration();
				$('.sky-form').removeClass('hidden');
			}	else {
				// register visit
				var visitDate = new Date().toJSON();
				var setVisit = {};
				var key = firebase.database().ref().child('users/'+uid).push().key;
				setVisit['users/'+uid+'/visits/'+key] = visitDate;
				firebase.database().ref().update(setVisit);

				// already registered, show message
				$('.sky-form').remove();
				$('.registered').removeClass('hidden');
			}
		}, function(error){
			// don't handle error
			return;
		});
		var userRegistration = function() {
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

					var jqxhr = $.post( url, function(data, status) {
						var res = data.results;

						var country = res[res.length-1].formatted_address;
						var countryCode = res[res.length-1].address_components[0].short_name;

						updateCountryFromGeolocation(country, countryCode);
					})
					.fail(function(error) {
						showCountryInput();
					});
				};

			  var geoError = function(error) {
					showCountryInput();
			  };

			  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

			} else { // location not supported or disabled
				showCountryInput();
			}
		}

		var showCountryInput = function() {
			// hide geolocation country
			geolocationEl.removeClass('active');
			// show select country
			selectCountryEl.addClass('active');
		};

		var showGeolocation = function() {
			// show geolocation country
			geolocationEl.addClass('active');
			// hide select country
			selectCountryEl.removeClass('active');
		};

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

			showGeolocation();
		};
	} else {
		// no uid available, show message
		$('.sky-form').remove();
		$('.missing-uid').removeClass('hidden');
	}

	/* GOECODING END */

	playButton.addEventListener('click', startVideo, false);
	close.addEventListener('click', stopVideo, false);

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
		showCountryInput();
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

	function getParameterByName(name, url) {
		if (!url) {
		  url = window.location.href;
		}
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		    results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

})();
