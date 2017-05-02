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

facebookGallery({
	appId: '1270801512983487',
	accessToken: '1270801512983487|21c21db8b582aa474f30bea9b73edc0b',
	fbPage: 'kendosopot',
	galleryOptions: {
		elementId: 'sfp-galeria',
		imagesCountLimit: 99,
		excludeAlbums: ['Timeline Photos', 'Mobile Uploads', 'Cover Photos', 'Profile Pictures', 'Untitled Album']
	},
	postsOptions: {
		elementId: 'sfp-news',
		postsCountLimit: 12,
		defaultPostImageUrl: './images/pzk.png'
	}
});

lightbox.option({
	'alwaysShowNavOnTouchDevices': true,
	'albumLabel': 'Zdjęcie %1 z %2',
	'maxHeight': 500
});

$(function () {
	$('#motto').textillate({
		loop: false,
		autoStart: true,
		type: 'char',
		in: {
			effect: 'fadeInRight',
			sync: false,
			shuffle: false,
			reverse: false,
		},
		out: {}
	});
})

$(window).scroll(function (event) {
	Scroll();
});

$('.scrolling a').on('click', function (e) {
	e.preventDefault();
	$('html, body').animate({ scrollTop: $(this.hash).offset().top - 5 }, 1000);
	return false;
});

new WOW().init();

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
