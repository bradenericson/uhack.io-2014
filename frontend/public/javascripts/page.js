$(document).foundation({
	slider: {
		on_change: function(){
			var height = jQuery("#heightSlider").val();
			jQuery("#heightValue").html(Math.floor(height/12) + " feet, " + height%12 + " inches" );
			var waist = jQuery("#waistSlider").val();
			jQuery("#waistValue").html(waist + " inches" );
			var length = jQuery("#pantsSlider").val();
			jQuery("#pantsValue").html(length + " inches" );
		}
	}
});