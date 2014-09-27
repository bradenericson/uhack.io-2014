var loggedInUser;

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
	if(loggedInUser == null){
		jQuery("#loginLink").colorbox({open:true, inline:true, escKey:false, overlayClose:false, trapFocus:true, width:"75%", height:"75%", fixed:true});
	}
	
	jQuery("#guestSkip").click(function(){
		setLoggedInUser(null);
		jQuery("#loginLink").colorbox.remove();
	});
	
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
	
	jQuery(".featuredItem").click(function(){
		var productId = jQuery(this).attr("id");
		loadItem(productId);
	});
	
	jQuery("#logo").click(function(){
		returnHome();
	});
});

function setLoggedInUser(userInfo){
	var user = "Guest";
	if(userInfo != null) {
		user = userInfo.email;
	}
	jQuery("#displayUsername").html(user);
}

function doLogin(email,password){
	var loginCredentials = {email:email,password:password};
	jQuery.ajax({
		url: "10.20.159.210:8080/login",
		data: loginCredentials,
		type: "GET",
		success: function(result){
			var user;
			user.firstName = result.name.first;
			user.LastName = result.name.last;
			user.email = result.email;
			user.gender = result.gender;
			user.height = result.height;
			user.shirt = result.shirtSize;
			user.pants = result.pantsLength;
			user.waist = result.waist;
			setLoggedInUser(user);
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
			url: "10.20.159.210:8080/register",
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

function returnHome(){
	jQuery("#itemDetails").hide();
	jQuery("#featuredContent").show();
}

function loadItem(productId){
	jQuery("#featuredContent").hide();
	jQuery("#itemDetails").show();
	jQuery.ajax({
		url: "10.20.159.210:8080/login",
		data: productId,
		type: "GET",
		success: function(result){
			jQuery("#itemPic").html(result.itemPicture);
			jQuery("#productColor1").html(result.itemColor1);
			jQuery("#productColor2").html(result.itemColor2);
			jQuery("#productColor3").html(result.itemColor3);
			jQuery("#productColor4").html(result.itemColor4);
			jQuery("#reviews").html(result.review);
			jQuery("#productName").html(result.productName);
			jQuery("#productDesigner").html(result.designer);
			jQuery("#productPrice").html(result.price);
			jQuery("#productDescription").html(result.description);
			
			var radicalData = [result.radical.data1,result.radical.data2,result.radical.data3,result.radical.data4,result.radical.data5];
			var radicalGraph = {
				labels: ["Data1", "Data2", "Data3", "Data4", "Data5"],
				datasets: [
					{
						label: "Product's ratings",
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: radicalData
					}
				]
			}
			window.myRadar = new Chart(jQuery("#radicalMenu").getContext("2d")).Radar(radicalGraph, {
				responsive: true
			});
		}
	});
}