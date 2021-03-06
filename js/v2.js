// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
	$('#search-button').attr('disabled', false);
}

// Time culculator
function secondsToHMS(s) {
	var h = Math.floor(s/3600); //Get whole hours
	s -= h*3600;
	var m = Math.floor(s/60); //Get remaining minutes
	s -= m*60;
	var s = Math.floor(s);
	if(h == 0){
		if(m < 10) {
			return m+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
		} else {
			return (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
		}
	} else {
		return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
	}
}

// Search for a specified string.
$(function() {
	var url = "https://gdata.youtube.com/feeds/api/videos?";
	// Left Search List
	$('#searchLeft').click(function() {
		var options = {
			'q': $('#qLeft').val(),
			'alt': 'json',
			'start-index': 1,
			'max-results': 50,
			'v': 2
		};
		$.get(url, options, function(rs) {
			//console.log(rs);
			$('.searchListLeft').empty();
			for (var i=0; i<rs.feed.entry.length; i++) {
				var f = rs.feed.entry[i];
				var totalTimeLeftCal = secondsToHMS($(this).data('video-duration'));

				$('.searchListLeft').append(
					$('<li class="movieLeft">').append(
						$('<img>').attr('src', f['media$group']['media$thumbnail'][0]['url']),
						$('<div class="youtubeInfo">').append(
							$('<h3>').text(f['title']['$t']),
							$('<p>').text('by ' + f['author'][0]['name']['$t'] + ' • ' + secondsToHMS(f['media$group']['yt$duration']['seconds'] - 1)),
							$('<div class="checked selected">').append(
								$('<span data-label="selected">').append(
									$('<img>').attr('src', 'images/searchChecked.png')
								)
							)
						)
					).data({
						'video-id': f['media$group']['yt$videoid']['$t'],
						'video-title': f['title']['$t'],
						'video-duration': f['media$group']['yt$duration']['seconds'] - 1
					})
				);
			}
			$('.searchBoxLeft ul.nav').empty();
			$('.searchBoxLeft ul.nav').append(
				$('<li class="prev">').text('PREV'),
				$('<li class="slash">').text('/'),
				$('<li class="next">').text('NEXT')
			).fadeIn(500);

			// NEXT & PREV button
			var list = $("li.movieLeft").hide();
			list.slice(0, 5).fadeIn(500);
			var maxList = list.length;
			var x = 5,
				start = 0;
			$('.next').click(function () {
				if (start + x < maxList) {
					list.slice(start, start + x).hide();
					start += x;
					list.slice(start, start + x).fadeIn(500);
					$('.prev').css({
						'color': '#000',
						'cursor': 'pointer'
					});
					$('.prev').addClass('blink');
				} 
				if ( start + x == maxList ) {
					$('.next').css({
						'color': '#ccc',
						'cursor': 'inherit'
					});
					$('.next').removeClass('blink');
				}
			});
			if (start + x <= 5) {
				$('.prev').css({
					'color': '#ccc',
					'cursor': 'inherit'
				});
				$('.next').addClass('blink');
			}
			$('.prev').click(function () {
				if (start - x >= 0) {
					list.slice(start, start + x).hide();
					start -= x;
					list.slice(start, start + x).fadeIn(500);
				}
				if ( start + x !== maxList ) {
					$('.next').css('color', '#000');
					$('.next').addClass('blink');
				}
				if (start + x <= 5) {
					$('.prev').css({
						'color': '#ccc',
						'cursor': 'inherit'
					});
					$('.prev').removeClass('blink');
				}
			});
		}, "json");
	});

	// Insert video into playerLeft
	$(document).on('click', 'li.movieLeft', function() {
		playerLeft.cueVideoById($(this).data('video-id'));
		playerLeft.setVolume(100);
		var totalTimeLeft = $(this).data('video-duration');
		var totalTimeLeftCal = secondsToHMS($(this).data('video-duration'));
		var currentTimeLeft = playerLeft.getCurrentTime();
		
		var cssTotalTimeLeft = $('<div class="totalTimeLeft"></div>');
		var cssSlashLeft = $('<div class="slashLeft"></div>');
		var cssCurrentTimeLeft = $('<div class="currentTimeLeft"></div>');
		
		$('.timeLeft').empty();
		$('.seekBarLeft').after(
			$('<div class="timeLeft">').append(
				cssTotalTimeLeft.text(totalTimeLeftCal),
				cssSlashLeft.text(' / '),
				cssCurrentTimeLeft.text('0:00')
			)
		)

		$('.tubeTitleLeft').text($(this).data('video-title'));
		//$('.totalTimeLeft').text(totalTimeLeftCal);

		$('.seekBarLeft').slider({
			max: totalTimeLeft,
			min: 0,
			value: 0,
			slide: function( event, ui ) {
				$( "#slider-value" ).html( ui.value );
			}
		});
		$('.seekBarLeft').bind('slide', function(event, ui) {
			var currentPositionLeft = Math.max(Math.min(parseInt(
				$('.seekBarLeft').slider('option','value')
			), totalTimeLeft + 100), 0);
			//console.log(currentPositionLeft);
			playerLeft.seekTo(currentPositionLeft);
		});
		$("#searchWrapperLeft").animate({
			opacity: 0
		}, 300, function() {
			$(this).css('visibility', 'hidden');
		});

		var ControlWidth = $( '.tubeControlLeft' ).width();
		var ControlTimeWidth = $( '.timeLeft' ).width();
		$('.seekBarLeft').css('width', (ControlWidth - ControlTimeWidth) - 10);

	});

	// Right Search List
	$('#searchRight').click(function() {
		var options = {
			'q': $('#qRight').val(),
			'alt': 'json',
			'start-index': 1,
			'max-results': 50,
			'v': 2
		};
		$.get(url, options, function(rs) {
			//console.log(rs);
			$('.searchListRight').empty();
			for (var i=0; i<rs.feed.entry.length; i++) {
				var f = rs.feed.entry[i];
				var totalTimeRightCal = secondsToHMS($(this).data('video-duration'));

				$('.searchListRight').append(
					$('<li class="movieRight">').append(
						$('<img>').attr('src', f['media$group']['media$thumbnail'][0]['url']),
						$('<div class="youtubeInfo">').append(
							$('<h3>').text(f['title']['$t']),
							$('<p>').text('by ' + f['author'][0]['name']['$t'] + ' • ' + secondsToHMS(f['media$group']['yt$duration']['seconds'] - 1)),
							$('<div class="checked selected">').append(
								$('<span data-label="selected">').append(
									$('<img>').attr('src', 'images/searchChecked.png')
								)
							)
						)
					).data({
						'video-id': f['media$group']['yt$videoid']['$t'],
						'video-title': f['title']['$t'],
						'video-duration': f['media$group']['yt$duration']['seconds'] - 1
					})
				);
			}
			$('.searchBoxRight ul.nav').empty();
			$('.searchBoxRight ul.nav').append(
				$('<li class="prev">').text('PREV'),
				$('<li class="slash">').text('/'),
				$('<li class="next">').text('NEXT')
			).fadeIn(500);

			// NEXT & PREV button
			var list = $("li.movieRight").hide();
			list.slice(0, 5).fadeIn(500);
			var maxList = list.length;
			var x = 5,
				start = 0;
			$('.next').click(function () {
				if (start + x < maxList) {
					list.slice(start, start + x).hide();
					start += x;
					list.slice(start, start + x).fadeIn(500);
					$('.prev').css({
						'color': '#000',
						'cursor': 'pointer'
					});
					$('.prev').addClass('blink');
				} 
				if ( start + x == maxList ) {
					$('.next').css({
						'color': '#ccc',
						'cursor': 'inherit'
					});
					$('.next').removeClass('blink');
				}
			});
			if (start + x <= 5) {
				$('.prev').css({
					'color': '#ccc',
					'cursor': 'inherit'
				});
				$('.next').addClass('blink');
			}
			$('.prev').click(function () {
				if (start - x >= 0) {
					list.slice(start, start + x).hide();
					start -= x;
					list.slice(start, start + x).fadeIn(500);
				}
				if ( start + x !== maxList ) {
					$('.next').css('color', '#000');
					$('.next').addClass('blink');
				}
				if (start + x <= 5) {
					$('.prev').css({
						'color': '#ccc',
						'cursor': 'inherit'
					});
					$('.prev').removeClass('blink');
				}
			});
		}, "json");
	});

	// Insert video into playerRight
	$(document).on('click', 'li.movieRight', function() {
		playerRight.cueVideoById($(this).data('video-id'));
		playerRight.setVolume(100);
		var totalTimeRight = $(this).data('video-duration');
		var totalTimeRightCal = secondsToHMS($(this).data('video-duration'));
		var currentTimeRight = playerRight.getCurrentTime();
		
		var cssTotalTimeRight = $('<div class="totalTimeRight"></div>');
		var cssSlashRight = $('<div class="slashRight"></div>');
		var cssCurrentTimeRight = $('<div class="currentTimeRight"></div>');
		$('.timeRight').empty();
		$('.seekBarRight').after(
			$('<div class="timeRight">').append(
				cssTotalTimeRight.text(totalTimeRightCal),
				cssSlashRight.text(' / '),
				cssCurrentTimeRight.text('0:00')
			)
		)

		$('.tubeTitleRight').text($(this).data('video-title'));
		$('.totalTimeRight').text(totalTimeRightCal);

		$('.seekBarRight').slider({
			max: totalTimeRight,
			min: 0,
			value: 0,
			slide: function( event, ui ) {
				$( "#slider-value" ).html( ui.value );
			}
		});
		$('.seekBarRight').bind('slide', function(event, ui) {
			var currentPositionRight = Math.max(Math.min(parseInt(
				$('.seekBarRight').slider('option','value')
			), totalTimeRight + 100), 0);
			//console.log(currentPositionRight);
			playerRight.seekTo(currentPositionRight);
		});

		$("#searchWrapperRight").animate({
			opacity: 0
		}, 300, function() {
			$(this).css('visibility', 'hidden');
		});

		var ControlWidth = $( '.tubeControlRight' ).width();
		var ControlTimeWidth = $( '.timeRight' ).width();
		$('.seekBarRight').css('width', (ControlWidth - ControlTimeWidth) - 10);

	});

	// Fader Slider
	$('#faderSlider').slider({max: 200, min: 0, value: 100});
	$('#faderSlider').bind('slide', function(event, ui) {
		var left_val = Math.max(Math.min(190 - parseInt(
			$('#faderSlider').slider('option', 'value')
		), 100), 0);
		var right_val = Math.max(Math.min(parseInt(
			$('#faderSlider').slider('option', 'value')
		), 110) - 10, 0);
		playerLeft.setVolume(left_val);
		playerRight.setVolume(right_val);	
	});
	
});

function onYouTubePlayerAPIReady() {

	var numInitialVideo = 9;
	var randomInitial = Math.ceil(numInitialVideo * Math.random());
	switch(randomInitial) {
		case 1: initialVideo =  'yGBIMyc6uck';
		break;
		case 2: initialVideo = 'eiYcBP258lE';
		break;
		case 3: initialVideo =  'NWaodSpCMZg';
		break;
		case 4: initialVideo = '9mkL1BuYMx4';
		break;
		case 5: initialVideo =  '40JxymeRIPQ';
		break;
		case 6: initialVideo = 'q_leCgXgYho';
		break;
		case 7: initialVideo =  'iXzy_h73Sd8';
		break;
		case 8: initialVideo = 'peF3IkcSMtg';
		break;
		case 9: initialVideo =  'S-rDKwx--8I';
		break;
		default: initialVideo = "";
	}

	playerLeft = new YT.Player('playerLeft', {
		// Left initial track
		videoId: initialVideo,
		playerVars: {
			autoplay: 1,
			showinfo: 0,
			modestbranding: 0,
			controls: 0, // 0:hide 1:show(default)
			rel: 0 //related video 0:hide 1:show(default)
		},
		events: {'onStateChange': onPlayerStateChange},
	});
	
	playerRight = new YT.Player('playerRight', {
		// Right initial track
		videoId: initialVideo,
		playerVars: {
			autoplay: 1,
			showinfo: 0,
			modestbranding: 0,
			controls: 0, // 0:hide 1:show(default)
			rel: 0 //related video 0:hide 1:show(default)
		},
		events: {'onStateChange': onPlayerStateChange},
	});
}

function onPlayerStateChange(e){
	if(e.data == YT.PlayerState.PLAYING) { // if video is playing
		$(".playLeft, .playRight").on('click', function() {
			player.pauseVideo();
		});
		setInterval(function(){
			// leftPlayer
			var totalTimeLeft = playerLeft.getDuration();
			var currentTimeLeft = playerLeft.getCurrentTime();
			var currentTimeLeftCal = secondsToHMS(currentTimeLeft);
			$('.currentTimeLeft').text(currentTimeLeftCal);
			$('.seekBarLeft').bind('value', currentTimeLeft);

			// seekBar width calculate & percentage
			var seekLeftCurrentPer = 100*currentTimeLeft/totalTimeLeft;
			$('.seekBarLeft .ui-state-default').css('width', seekLeftCurrentPer + '%');
			
			// Flexible width seek bar and time
			var ControlLeftWidth = $('.tubeControlLeft').width();
			var ControlTimeLeftWidth = $('.timeLeft').width();
			$('.seekBarLeft').css('width', (ControlLeftWidth - ControlTimeLeftWidth) - 10);

			// rightPlayer
			var totalTimeRight = playerRight.getDuration();
			var currentTimeRight = playerRight.getCurrentTime();
			var currentTimeRightCal = secondsToHMS(currentTimeRight);
			$('.currentTimeRight').text(currentTimeRightCal);
			$('.seekBarRight').bind('value', currentTimeRight);

			// seekBar width calculate & percentage
			var seekRightCurrentPer = 100*currentTimeRight/totalTimeRight;
			$('.seekBarRight .ui-state-default').css('width', seekRightCurrentPer + '%');
			
			// Flexible width seek bar and time
			var ControlRightWidth = $('.tubeControlRight').width();
			var ControlTimeRightWidth = $('.timeRight').width();
			$('.seekBarRight').css('width', (ControlRightWidth - ControlTimeRightWidth) - 10);
		}, 1000);
	} else {
		$(".playLeft, .playRight").on('click', function() {
			player.playVideo();
		});
	}
}