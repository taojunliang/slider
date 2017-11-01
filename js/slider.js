var Slider = function( wrapper, config ) {
	this.wrapper    = document.querySelector( wrapper );
	this.container  = this.wrapper.querySelector( '.slider-container' );
	this.imgs       = this.container.querySelectorAll( 'li' );
	this.config     = config;
	this.config.pagination && this.pagination();
	this.init();
	this.bindEvent();
};

Slider.prototype = {
	init: function() {
		var container  = this.container;
		var imgs       = this.imgs;
		var len        = imgs.length;
		var totalWidth = container.style.width = len * 100 + '%';

		for( var i = 0; i < len; i++ ) {
			imgs[i].style.width = parseInt(totalWidth) / len + '%';
		}
	},
	pagination: function() {
		var wrapper    = this.wrapper;
		var len        = this.imgs.length;
		var template   = ['<ol class="slider-pagination">'];

		for( var i = 0; i < len; i++ ) {
			i === 0
				?
				template.push('<li class="on"></li>')
				:
				template.push('<li></li>');
		}

		template.push('</ol>');

		var parser = new DOMParser();
		var doc = parser.parseFromString( template.join(''), 'text/html' ).querySelector( '.slider-pagination' );

		wrapper.appendChild( doc );
	},
	bindEvent: function() {
		var self       = this;
		var container  = this.container;
		var len        = this.imgs.length;
		var winWid     = window.innerWidth;
		var startX     = 0;
		var moveX      = 0;
		var endX       = 0;
		var moveD      = 0;
		var offset     = 0;
		var i          = 0;

		var touch = function(e) {
			switch( e.type ) {
				case 'touchstart':
					startX = e.touches[0].pageX;
					break;
				case 'touchmove':
					moveX   = e.touches[0].pageX;
					moveD   = moveX - startX;

					container.style.webkitTransform  = 'translate3d('+ (-offset + moveD) +'px,0,0)';
					container.style.transform        = 'translate3d('+ (-offset + moveD) +'px,0,0)';
					container.style.webkitTransition = '';
					container.style.transition       = '';
					break;
				case 'touchend':
					endX = e.changedTouches[0].pageX;
					
					if( moveD > 0 ) {
						// 向右滑
						if( i === 0 ) {
							i = 0;
						} else {
							i--;
						}

						offset = winWid * i;
					} else {
						// 向左滑
						if( i === len - 1 ) {
							i = len - 1;
						} else {
							i++;
						}

						offset = winWid * i;
					}

					if( self.config.pagination ) {
						var pagination = document.querySelector( '.slider-pagination' ); 
						var pages      = pagination.getElementsByTagName( 'li' );

						for( var j = 0; j < len; j++ ) {
							pages[j].className = '';
						}

						pages[i].className = 'on';
					}

					container.style.webkitTransform  = 'translate3d('+ (-winWid * i) +'px,0,0)';
					container.style.transform        = 'translate3d('+ (-winWid * i) +'px,0,0)';
					container.style.webkitTransition = 'all 300ms ease-in-out'; 
					container.style.transition       = 'all 300ms ease-in-out'; 
					break;
				default:
					break;
			}
		};

		container.addEventListener('touchstart', touch, false);
		container.addEventListener('touchmove', touch, false);
		container.addEventListener('touchend', touch, false);
	}
};