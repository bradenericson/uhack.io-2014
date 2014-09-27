var loggedInUser;
var cart = [];

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
	
	jQuery(".menuItems").click(function(){
		var categoryNumber = jQuery(this).attr("id");
        console.log("categoryNumber: " + categoryNumber);
		jQuery.ajax({
			url: "/productlist?category=",
			data: categoryNumber,
			type: "GET",
			success: function(result){
               jQuery(".featuredItem").each(function(ele, index) {
                   $(this).attr("id", result[index].id);
                   $(this).attr("src", result[index].fullImage);
               });
			}
		});
	});
	
	jQuery("#cart").click(function(){
		jQuery("#cartLink").colorbox({open:true, inline:true, width:"40%", height:"75%", fixed:true});
		var cartTable = "<table><tr><td>Product</td><td>Price</td></tr>";
		for(var i=0;i<cart.length;i++){
			cartTable = cartTable + "<tr><td>" + cart[i].name + "</td><td>" + cart[i].price + "</td></tr>";
		}
		cartTable = cartTable + "</table>";
		jQuery("#cartTable").html(cartTable);
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
		url: "/login",
		data: loginCredentials,
		type: "GET",
		success: function(result){
			var user = {};
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
		var registrationInfo = {password:password, firstName:firstName, lastName:lastName, email:email, gender:gender, height:height, shirtSize:shirt, pantsLength:pants, waist:waist};
		jQuery.ajax({
			url: "/register",
			data: registrationInfo,
			type: "POST",
			success: function(){
				doLogin(email,password);
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
		url: "/productDetails",
		data: {dpci:productId},
		type: "GET",
		success: function(result){

            result = result[0];
			jQuery("#itemPic").html("<img src='" + result.PrimaryImage + "'>");
			jQuery("#productColor1").html(result.Color);
			jQuery("#reviews").append(result.review);
			jQuery("#productName").html(result.Name);
			jQuery("#productPrice").html(result.Price);
			/* jQuery("#buyItem").html("<button id='addToCart' type='button'>Add to Cart.</button>"); */
			
			jQuery("#addToCart").click(function(){
				cart.push({name:result.Name,price:result.Price});
			});



            // This will get the first returned node in the jQuery collection.

			var radicalData = [result.Rating.Ease,result.Rating.FabricFeel,result.Rating.QualityOfFit,result.Rating.Coolness,result.Rating.Design];
			console.log(radicalData);
            var radicalGraph = {
				labels: ["Ease of Washing", "Fabric Feel", "Quality of Fit", "Coolness", "Design"],
				datasets: [
					{
						label: "Product's ratings",
						fillColor: "rgba(181, 0, 0, 0.7)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#b50000",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: radicalData
					}
				]
			}
            // Get the context of the canvas element we want to select
            var ctx = document.getElementById("radar").getContext("2d");
            //var ctx = $("#radar").get(0).getContext("2d");
            var option = {
                //Boolean - Whether to show lines for each scale point
                scaleShowLine : true,

                //Boolean - Whether we show the angle lines out of the radar
                angleShowLineOut : true,

                //Boolean - Whether to show labels on the scale
                scaleShowLabels : false,

                // Boolean - Whether the scale should begin at zero
                scaleBeginAtZero : true,

                //String - Colour of the angle line
                angleLineColor : "rgba(0,0,0,.1)",

                //Number - Pixel width of the angle line
                angleLineWidth : 1,

                //String - Point label font declaration
                pointLabelFontFamily : "'Arial'",

                //String - Point label font weight
                pointLabelFontStyle : "normal",

                //Number - Point label font size in pixels
                pointLabelFontSize : 10,

                //String - Point label font colour
                pointLabelFontColor : "#666",

                //Boolean - Whether to show a dot for each point
                pointDot : true,

                //Number - Radius of each point dot in pixels
                pointDotRadius : 3,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth : 1,

                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius : 20,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke : true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth : 2,

                //Boolean - Whether to fill the dataset with a colour
                datasetFill : true,

                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

            };
            var myNewChart = new Chart(ctx).Radar(radicalGraph, option);
		}
	});
}