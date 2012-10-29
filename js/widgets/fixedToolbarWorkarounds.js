define( [ "jquery", "../jquery.mobile.widget", "../jquery.mobile.core", "../jquery.mobile.navigation", "./page", "./page.sections", "../jquery.mobile.zoom" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {
	$.widget( "mobile.fixedtoolbar", $.mobile.fixedtoolbar, {

			_create: function() {
				this._super();
				this._workarounds();
			},

			_workarounds: function() {
				var w = window,
				ua = navigator.userAgent,
				platform = navigator.platform,
				// Rendering engine is Webkit, and capture major version
				wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ ),
				wkversion = !!wkmatch && wkmatch[ 1 ],
				os = null;
				alert('Workarounds');
				if( platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ){
					os = "ios";
					alert('ios webkit '+ wkversion);
				} else if( ua.indexOf( "Android" ) > -1 ){
					os = "android";
				}
				if( os === "ios" && wkversion && wkversion > 534 && wkversion < 536 ){
					//iOS 5 run all workarounds for iOS 5
					alert('ios5');
					
				} else if( os === "android" && wkversion && wkversion < 534 ){
					//Android 2.3 run all Android 2.3 workaround
					self._bindScrollWorkaround();
					console.log('android 2.x');
				}
			},

			//Utility class for checking header and footer positions relative to viewport
			_viewportOffset: function() {
				var $el = this.element,
					header = $el.is( ".ui-header" ),
					offset = $el.offset().top - $( window ).scrollTop();
				if( !header ) {
					offset = Math.round(offset - $( window ).height() + $el.outerHeight());
				}

				return offset;
			},

			_bindScrollWorkaround: function() {
				var self = this,
				viewportOffset = self._viewportOffset();

				this._on( $( window ), { scrollstop: function() {
					//check if the header is visible and if its in the right place
					if( viewportOffset !== 0 && self._visible && self.ios6 === true) {
						self._triggerRedraw();
					}
				}});
			},

			_bindTransitionFooterWorkaround: function() {
				var self = this,
				o = self.options,
				$el = self.element;

				self._on( $el.closest( ".ui-page" ), {
					"webkitAnimationStart animationstart updatelayout": function() {
						$el.closest( ".ui-page" ).addClass( "ui-ios-footer-fix" );
					},
					pageshow: function() {
						$el.closest( ".ui-page" ).removeClass( "ui-ios-footer-fix" );
					}

				});

			},

			_triggerRedraw: function() {
				var self = this,
					paddingBottom = parseFloat( $( "body" ).css( "padding-bottom" ) );

				//trigger page redraw to fix incorrectly positioned fixed elements
				$( "body" ).css( "padding-bottom", ( paddingBottom + 1 ) +"px" );
				//if the padding is reset with out a timeout the reposition will not occure.
				//this is independant of JQM the browser seems to need the time to react.
				setTimeout( function() {
					$( "body" ).css( "padding-bottom", paddingBottom + "px" );
				}, 0 );
			}
	});

	})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");