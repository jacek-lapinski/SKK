$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        margin: 0,
        animateOut: 'fadeOut',
        autoplay: true,
        autoplayTimeout: 1500,
        autoplayHoverPause: false
    });
});


$('#famax').famax({
	appId: '852602131447787',
	accessToken: 'EAAMHbZBctZCZBsBAJmWi3Pkr0ZCgBuDuzyJbFNZBZAddSB1eoaqlZA4XGWWKvEIvjzF4iC6RFZBE0ct82ZBpKUWbxHom4ZCy2UurvS2jAoYzjfEuaIlTpvtgpMZAk5Fe5FvJjZBi32vdZCh7F7DR4h18MC9G0WWLvmXIZBcW8ZD',
	fanPage: 'http://www.facebook.com/kendosopot',

	//NON MANDATORY
	maxResults: 12, //Maximum videos to display in one load
	innerOffset: 30, //Distance between video thumbnails
	minItemWidth: 300, //Minumum width of a video thumbnails
	maxItemWidth: 450, //Maximum width of a video thumbnails
	outerOffset: 30, //Distance between video thumbnails and plugin conatiner
	maxContainerWidth: 1000, //Maximum width of plugin container
	alwaysUseDropdown: false,
	notFoundImage: 'http://www.404notfound.fr/assets/images/pages/img/onsydney.jpg', //change this image link
	maxAttachments: 8,
	selectedTab: 'p',
	skin: 'none',
	displayMetricsForTags: false,
	displayMetricsForPosts: false,
	maxComments: 14,
	onClickAction: 'popup',
	refreshTimeout: 1000
});

$(window).scroll(function (event) {
	Scroll();
});


$('.slowscroll a').on('click', function (e) {
	e.preventDefault();
	$('html, body').animate({ scrollTop: $(this.hash).offset().top - 5 }, 1000);
	return false;
});

function Scroll() {
	var contentTop = [];
	var contentBottom = [];
	var winTop = $(window).scrollTop();
	var rangeTop = 200;
	var rangeBottom = 500;
	$('.navbar-collapse').find('.scroll a').each(function () {
		var offTop = $($(this).attr('href')).offset().top;
		contentTop.push(offTop);
		contentBottom.push(offTop + $($(this).attr('href')).height());
	})
	$.each(contentTop, function (i) {
		if (winTop > contentTop[i] - rangeTop) {
			$('.navbar-collapse li.scroll')
                .removeClass('active')
                .eq(i).addClass('active');
		}
	})
}
