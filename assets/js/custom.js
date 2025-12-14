(function ($) {
	
	"use strict";

	// Page loading animation
	$(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	})

	var width = $(window).width();
		$(window).resize(function() {
		if (width > 767 && $(window).width() < 767) {
			location.reload();
		}
		else if (width < 767 && $(window).width() > 767) {
			location.reload();
		}
	})

    const elem = document.querySelector('.event_box');
    const filtersElem = document.querySelector('.event_filter');
    if (elem && typeof Isotope !== 'undefined') {
        const initIsotope = function() {
            const rdn_events_list = new Isotope(elem, {
                itemSelector: '.event_outer',
                layoutMode: 'masonry'
            });
            if (filtersElem) {
                filtersElem.addEventListener('click', function(event) {
                    const link = event.target.closest('a');
                    if (!link) { return; }
                    event.preventDefault();
                    const filterValue = link.getAttribute('data-filter');
                    rdn_events_list.arrange({ filter: filterValue });
                    const active = filtersElem.querySelector('.is_active');
                    if (active) { active.classList.remove('is_active'); }
                    link.classList.add('is_active');
                });
            }
        };
        if (document.readyState === 'complete') {
            initIsotope();
        } else {
            window.addEventListener('load', initIsotope);
        }
    }


	$('.owl-banner').owlCarousel({
		center: true,
      items:1,
      loop:true,
      nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
		  navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
      smartSpeed: 600,
      margin:30,
      responsive:{
        992:{
            items:1
        },
			1200:{
				items:1
			}
      }
	});

	var banner = $('.owl-banner');
	function animateHeader($el){
		var items = [$el.find('h2'), $el.find('p'), $el.find('.buttons')];
		items.forEach(function($node, i){
			$node.css('animation-delay', (i*0.1)+'s').addClass('animated fadeInUp');
		});
		setTimeout(function(){
			items.forEach(function($node){ $node.removeClass('animated fadeInUp').css('animation-delay',''); });
		}, 1000);
	}

	banner.on('initialized.owl.carousel translated.owl.carousel', function(){
		var $current = banner.find('.owl-item.active .header-text');
		if($current.length){ animateHeader($current); }
	});

	$('.owl-testimonials').owlCarousel({
	  center: true,
      items:1,
      loop:true,
      nav: true,
	  navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
      margin:30,
      responsive:{
        992:{
            items:1
        },
		1200:{
			items:1
		}
      }
	});


	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	// Menu elevator animation
	$('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 767) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);	
				}				
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});

	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('.scroll-to-section a[href^="#"]').on('click', function (e) {
	        e.preventDefault();
	        $(document).off("scroll");
	        
	        $('.scroll-to-section a').each(function () {
	            $(this).removeClass('active');
	        })
	        $(this).addClass('active');
	      
	        var target = this.hash,
	        menu = target;
	       	var target = $(this.hash);
	        $('html, body').stop().animate({
	            scrollTop: (target.offset().top) - 79
	        }, 500, 'swing', function () {
	            window.location.hash = target;
	            $(document).on("scroll", onScroll);
	        });
	    });
	});

	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        var currLink = $(this);
	        var refElement = $(currLink.attr("href"));
	        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}

	// Scroll reveal animations (uses animate.css)
	function initScrollAnimations(){
		var mapping = [
			{ selector: '.main-banner .header-text', animation: 'fadeInUp' },
			{ selector: '.section-heading', animation: 'fadeInUp' },
			{ selector: '.service-item', animation: 'fadeInUp' },
			{ selector: '.events_item', animation: 'fadeInUp' },
			{ selector: '.accordion', animation: 'fadeInUp' },
			{ selector: '.team-member .main-content', animation: 'fadeInUp' },
			{ selector: '.contact-us-content', animation: 'fadeInUp' },
			{ selector: '.fun-facts .counter', animation: 'fadeInUp' },
			{ selector: '.event_filter li a', animation: 'fadeInUp' }
		];

		mapping.forEach(function(entry){
			var nodes = document.querySelectorAll(entry.selector);
			nodes.forEach(function(el, idx){
				el.classList.add('sr-item');
				el.setAttribute('data-animate', entry.animation);
				el.setAttribute('data-animate-delay', ((idx % 3) * 0.1).toFixed(1) + 's');
			});
		});

		var observer = new IntersectionObserver(function(entries){
			entries.forEach(function(entry){
				if(entry.isIntersecting){
					var el = entry.target;
					var anim = el.getAttribute('data-animate') || 'fadeInUp';
					var delay = el.getAttribute('data-animate-delay');
					if(delay){ el.style.animationDelay = delay; }
					el.classList.add('animated', anim, 'sr-visible');
					observer.unobserve(el);
				}
			});
		}, { threshold: 0.2 });

		document.querySelectorAll('.sr-item').forEach(function(el){ observer.observe(el); });
	}

	$(function(){
		initScrollAnimations();

		var contactForm = document.getElementById('contact-form');
		if(contactForm){
			contactForm.addEventListener('submit', function(e){
				e.preventDefault();
				var statusEl = document.getElementById('contact-status');
				if(statusEl){ statusEl.textContent = 'Sending...'; }
				var data = new URLSearchParams(new FormData(contactForm));
				fetch('/api/contact', {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: data
				}).then(function(res){ return res.json(); })
				.then(function(json){
					if(json && json.ok){
						if(statusEl){ statusEl.textContent = 'Thanks! We have received your message.'; }
						contactForm.reset();
					} else {
						if(statusEl){ statusEl.textContent = 'Please fill all fields correctly.'; }
					}
				}).catch(function(){
					if(statusEl){ statusEl.textContent = 'Something went wrong. Please try again.'; }
				});
			});
		}

		// Initialize hero background videos from data-video-src
		document.querySelectorAll('.main-banner .video-bg video').forEach(function(v){
			var src = v.getAttribute('data-video-src');
			if(src){
				v.src = src;
				v.muted = true;
				v.loop = true;
				v.playsInline = true;
				var playAttempt = function(){
					var p = v.play();
					if(p && typeof p.catch === 'function'){
						p.catch(function(){ /* ignore autoplay block */ });
					}
				};
				v.addEventListener('canplay', playAttempt, { once: true });
				setTimeout(playAttempt, 500);
			}
		});
	});


	// Page loading animation
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});

	const dropdownOpener = $('.main-nav ul.nav .has-sub > a');

    // Open/Close Submenus
    if (dropdownOpener.length) {
        dropdownOpener.each(function () {
            var _this = $(this);

            _this.on('tap click', function (e) {
                var thisItemParent = _this.parent('li'),
                    thisItemParentSiblingsWithDrop = thisItemParent.siblings('.has-sub');

                if (thisItemParent.hasClass('has-sub')) {
                    var submenu = thisItemParent.find('> ul.sub-menu');

                    if (submenu.is(':visible')) {
                        submenu.slideUp(450, 'easeInOutQuad');
                        thisItemParent.removeClass('is-open-sub');
                    } else {
                        thisItemParent.addClass('is-open-sub');

                        if (thisItemParentSiblingsWithDrop.length === 0) {
                            thisItemParent.find('.sub-menu').slideUp(400, 'easeInOutQuad', function () {
                                submenu.slideDown(250, 'easeInOutQuad');
                            });
                        } else {
                            thisItemParent.siblings().removeClass('is-open-sub').find('.sub-menu').slideUp(250, 'easeInOutQuad', function () {
                                submenu.slideDown(250, 'easeInOutQuad');
                            });
                        }
                    }
                }

                e.preventDefault();
            });
        });
    }

})(window.jQuery);
