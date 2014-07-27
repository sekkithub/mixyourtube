// Window load event used just in case window height is dependant upon images
$(window).bind("load", function() { 
	// setup the height depends on the screen size
	var winHeight = $(window).height();

	//Search Box ON OFF Animation
	var search = ".searchBoxLeft, .searchBoxRight";
	var searchLeft = ".searchBoxLeft";
	var searchRight = ".searchBoxRight";
	
	$(".tubeTitleLeft").click(function() {
		$(searchLeft).animate({ 
			opacity: 1
		}, 1, function(){
			$(this).css('visibility', 'visible').hide().fadeIn(300);
		});
	});

	$(".cancelButton").click(function() {
		$(search).animate({
			opacity: 0
		}, 300, function() {
			$(this).css('visibility', 'hidden');
		});
	});
	

	// fader
	$( "#faderSlider" ).slider();

});