jQuery(document).foundation({
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

jQuery(document).ready(function(){
	jQuery("#loginLink").colorbox({open:true, inline:true, escKey:false, overlayClose:false, trapFocus:true, width:"75%", height:"75%", fixed:true});
	
	jQuery("#loginButton").click(function(){
		doLogin();
	});
	jQuery("#openRegister").click(function(){
		jQuery("#loginLink").colorbox.remove();
		jQuery("#registerLink").colorbox({open:true, inline:true, escKey:false, overlayClose:false, trapFocus:true, width:"75%", height:"75%", fixed:true});
		jQuery(document).resize();
	});
});

function doLogin(){
	
}