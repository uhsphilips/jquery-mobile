//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: scroll-link form widget
//>>label: scroll
//>>group: widgets

define( [ "jquery", "../../jquery.mobile.core", "../../jquery.mobile.widget"], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {
	$.widget( "mobile.scrolllink", $.mobile.widget, {
		options: {
			initSelector: ":jqmData(scrolllink='true')"
		},
		_create: function(){
			this.element.attr('data-ajax',false);
			this._on({
				"click":function(event){
					var id = this.element.attr('href'),
						pos = $(id).offset().top;

					$.mobile.silentScroll( pos );
					return false;
				}
			});
		},
		_destroy:function(){
			this.element.removeAttr("data-ajax");
		}
	});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.scrolllink.prototype.enhanceWithin( e.target );
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");