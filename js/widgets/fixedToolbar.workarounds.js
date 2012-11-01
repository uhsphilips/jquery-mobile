//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Browser specific workarounds for "fixed" headers and footers
//>>label: Toolbars: Fixed: Workarounds
//>>group: Widgets
//>>css.structure: ../css/structure/jquery.mobile.fixedToolbar.css
define( [ "jquery", "../jquery.mobile.widget", "../jquery.mobile.core", "../jquery.mobile.navigation", "./page", "./page.sections", "../jquery.mobile.zoom", "./fixedToolbar" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {
	$.widget( "mobile.fixedtoolbar", $.mobile.fixedtoolbar, {

			_create: function() {
				this._super();
				this._workarounds();
			},

			//check the browser and version and run needed workarounds
			_workarounds: function() {
				var ua = navigator.userAgent,
				platform = navigator.platform,
				// Rendering engine is Webkit, and capture major version
				wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ ),
				wkversion = !!wkmatch && wkmatch[ 1 ],
				os = null,
				self = this;
				//set the os we are working in if it dosent match one with workarounds return
				if( platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ){
					os = "ios";
				} else if( ua.indexOf( "Android" ) > -1 ){
					os = "android";
				} else {
					return
				}
				//check os version if it dosent match one with workarounds return
				if( os === "ios" && wkversion && wkversion > 533 && wkversion < 536 ) {
					//iOS 5 run all workarounds for iOS 5
					self._bindScrollWorkaround();
					self._bindTransitionFooterWorkaround();					
				} else if ( os === "ios" && wkversion && wkversion < 537 ) {
					//iOS 6 run workarounds for iOS 6
					self._bindTransitionFooterWorkaround();
				} else if( os === "android" && wkversion && wkversion < 534 ) {
					//Android 2.3 run all Android 2.3 workaround
					self._bindScrollWorkaround();
					self._bindListThumbWorkaround();
				} else {
					return
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

			//bind events for _triggerRedraw() function 
			_bindScrollWorkaround: function() {
				var self = this,
				viewportOffset = self._viewportOffset();
				//bind to scrollstop and check if the toolbars are correctly positioned
				this._on( $( window ), { scrollstop: function() {
					//check if the header is visible and if its in the right place
					if( viewportOffset !== 0 && self._visible) {
						self._triggerRedraw();
					}
				}});
			},

			//this addresses issue #4250 Persistent footer instability in v1.1 with long select lists in Android 2.3.3
			//and issue #3748 Android 2.x: Page transitions broken when fixed toolbars used
			//the absolutely positioned thumbnail in a list view causes problems with fixed position buttons above in a nav bar
			//setting the li's to -webkit-transform:translate3d(0,0,0); solves this problem to avoide potential issues in other
			//platforms we scope this with the class ui-android-2x-fix
			_bindListThumbWorkaround: function() {
				this.element.closest(".ui-page-active").addClass( "ui-android-2x-fix" );
			},
			
			//this addresses issue #4259 Fixed toolbars change position when navigating between tabs.
			//this is needed on both iOS 5 and iOS 6
			//when the transition starts make the page position:fixed; bottom:0;
			//this ensurace the footer stays at the bottom.
			_bindTransitionFooterWorkaround: function() {
				var self = this,
				$el = self.element;
				//add class when transition starts
				self._on( $el.closest( ".ui-page" ), {
					"webkitAnimationStart animationstart updatelayout": function() {
						$el.closest( ".ui-page" ).addClass( "ui-ios-footer-fix" );
					},
					//remove the class when the transition completes 
					pageshow: function() {
						$el.closest( ".ui-page" ).removeClass( "ui-ios-footer-fix" );
					}

				});

			},
			//this addresses issues #4337 Fixed header problem after scrolling content on iOS and Android
			//and device bugs project issue #1 Form elements can lose click hit area in position: fixed containers.
			//this also addresses not on fixed toolbars page in docs
			//adding 1px of padding to the bottom then removing it causes a "redraw"
			//which positions the toolbars correctly (they will always be visually correct) 
			_triggerRedraw: function() {
				var paddingBottom = parseFloat( $( "body" ).css( "padding-bottom" ) );

				//trigger page redraw to fix incorrectly positioned fixed elements
				$( "body" ).css( "padding-bottom", ( paddingBottom + 1 ) +"px" );
				//if the padding is reset with out a timeout the reposition will not occure.
				//this is independant of JQM the browser seems to need the time to react.
				setTimeout( function() {
					$( "body" ).css( "padding-bottom", paddingBottom + "px" );
				}, 0 );
			},

			destroy: function() {
				this._super();
				//Remove the class we added to the page previously in android 2.x 
				this.element.closest(".ui-page-active").removeClass( "ui-android-2x-fix" );
			}
	});

	})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");