// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
	$('#search-button').attr('disabled', false);
}

// Search for a specified string.
$(function() {
	$('#search').click(function() {
		var url = "https://gdata.youtube.com/feeds/api/videos?";
		var options = {
			'q': encodeURIComponent($('#q').val()),
			'alt': 'json',
			'max-results': 5,
			'v': 2
		};

		$.get(url, options, function(rs) {
			console.log(rs);
			$('#list').empty();
			for (var i=0; i<rs.feed.entry.length; i++) {
				var f = rs.feed.entry[i];
				$('#list').append(
					$('<li class="movie">').append(
						$('<img>').attr('src', f['media$group']['media$thumbnail'][0]['url'])
					).data('video-id', f['media$group']['yt$videoid']['$t'])
				);
			}
		}, "json");
	});
	
	$(document).on('click', 'li.movie', function() {
		player.cueVideoById($(this).data('video-id'));
		player.setVolume(100);
	});

	
});


function onYouTubePlayerAPIReady() {

	player = new YT.Player('playerLeft', {
		playerVars: {
			showinfo: 0,
			modestbranding: 0,
			controls: 0, // 0:hide 1:show(default)
			rel: 0 //related video 0:hide 1:show(default)
		},
		events: {'onStateChange': onPlayerStateChange},
	});
	
	player2 = new YT.Player('playerRight', {
		playerVars: {
			showinfo: 0,
			modestbranding: 0,
			controls: 0, // 0:hide 1:show(default)
			rel: 0 //related video 0:hide 1:show(default)
		},
		events: {'onStateChange': onPlayerStateChange},
	});

}


function onPlayerStateChange(e){
	if (e.data == YT.PlayerState.PLAYING) { // if video is playing
		$('.playLeftIcon').css('background-position-x','-60px'); // change the play icon
		$(".playLeft").on('click', function() {
			player.pauseVideo();
		});
	} else {
		$('.playLeftIcon').css('background-position-x','-90px');
		$(".playLeft").on('click', function() {
			player.playVideo();
		});
	}
}
