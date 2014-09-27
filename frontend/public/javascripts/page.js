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
		var validates = true;
		var email = jQuery("#loginEmail").val();
		var password = jQuery("#loginPassword").val();
		var errorMessages = "<a href='#' class='close'>&times;</a>";
		
		if(password == ""){
			validates = false;
			errorMessages = "The Password field can't be empty.<br/>" + errorMessages;
		}
		if(email == ""){
			validates = false;
			errorMessages = "The Email field can't be empty.<br/>" + errorMessages;
		}
		if(validates == true){
			doLogin(email,password);
		} else {
			jQuery("#loginErrors").html(errorMessages);
			jQuery("#loginErrors").show();
		}		
	});
	
	jQuery("#newUser").click(function(){
		doRegister();
	});
	
	jQuery("#openRegister").click(function(){
		jQuery("#loginLink").colorbox.remove();
		jQuery("#registerLink").colorbox({open:true, inline:true, escKey:false, overlayClose:false, trapFocus:true, width:"75%", height:"75%", fixed:true});
		jQuery(document).resize();
	});
});

function doLogin(email,password){
	var loginCredentials = {email:email,password:password};
	jQuery.ajax({
		url: "localhost:8080/login",
		data: loginCredentials,
		type: "GET",
		success: function(){
			//TODO set the logged in user
			jQuery("#loginLink").colorbox.remove();
		}
	});
}

function doRegister(){
	var email = jQuery("#registerEmail").val();
	var password = jQuery("#registerPassword").val();
	var firstName = jQuery("#registerFirstName").val();
	var lastName = jQuery("#registerLastName").val();
	var gender = jQuery("#registerGender").val();
	var height = jQuery("#heightSlider").val();
	var waist = jQuery("#waistSlider").val();
	var pants = jQuery("#pantsSlider").val();
	var shirt = jQuery("#registerShirtSize").val();
	
	var validates = true;
	var errorMessages = "<a href='#' class='close'>&times;</a>";

	if(shirt == ""){
		validates = false;
		errorMessages = "A Shirt Size must be selected.<br/>" + errorMessages;
	}
	if(gender == ""){
		validates = false;
		errorMessages = "A Gender must be selected.<br/>" + errorMessages;
	}
	if(lastName == ""){
		validates = false;
		errorMessages = "The Last Name field can't be empty.<br/>" + errorMessages;
	}
	if(firstName == ""){
		validates = false;
		errorMessages = "The First Name field can't be empty.<br/>" + errorMessages;
	}
	if(password == ""){
		validates = false;
		errorMessages = "The Password field can't be empty.<br/>" + errorMessages;
	}
	if(password != jQuery("#registerConfirm").val()){
		validates = false;
		errorMessages = "The passwords don't match.<br/>" + errorMessages;
	}
	if(email == ""){
		validates = false;
		errorMessages = "The Email field can't be empty.<br/>" + errorMessages;
	}
	
	if(validates == true){
		var registrationInfo = {firstName:firstName, lastName:lastName, email:email, gender:gender, height:height, shirtSize:shirt, pantsLength:pants, waist:waist};
		jQuery.ajax({
			url: "localhost:8080/register",
			data: registrationInfo,
			type: "POST",
			success: function(){
				doLogin(username,password);
			}
		});
		jQuery("#registerLink").colorbox.remove();
	} else {
		jQuery("#registerErrors").html(errorMessages);
		jQuery("#registerErrors").show();
	}
}