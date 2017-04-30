$(document).ready(function(){
	var latitude = "";//"24.8667861";
	var longitude = "";//"67.02613509999999";
	var end_latitude = lat;//"24.8668";
	var end_longitude = lng;//"67.0255";
	var customerPhone = document.getElementById("phone_number").value;//"03245879785";

	var bookingId = "";
	var EstimatedPrice = "";

	var captainPhone = "";
	var captainName = "";
	var status = "";
	var carModel = "";
	var carMake = "";
	var carNumber = "";

	var products = new Array();
	var pickupTimes = new Array();
	var minTimeBookLater = new Array();
	var cancelPrices = new Array();
	var maxTimeCancel = new Array();
	var currencyCode = new Array();
	$.ajax({
		type : 'GET',
		headers: {"Authorization": "crl54u6cj8f3a7hkc304359lhg"},
		dataType: 'json',
		data: { "latitude": latitude, "longitude":longitude },
		crossDomain:true,
		async:true,
		url: "http://qa-interface.careem-engineering.com/v1/products",
		success: function(result){ 
			if(result.products != null) {
				console.log(result);
				var select = document.getElementById("type");
				for(var i=0; i<result.products.length; i++) {
					var availibility = [];
					var basePrice = [];
					var cancelPrice = [];
					var maxTimeToCancel = [];
					
					if(result.products[i].availibility_now) { 
						availibility.push("Now"); 
						basePrice.push((result.products[i].price_details.base_now+result.products[i].price_details.minimum_now)); 
						cancelPrice.push(result.products[i].price_details.cancellation_fee_now); 
						cancelPrice.push(result.products[i].price_details.cancellation_fee_now); 
						maxTimeToCancel.push(result.products[i].maximum_time_to_cancel_now); 
					}
					if(result.products[i].availibility_later) { 
						availibility.push("LATER"); 
						basePrice.push((result.products[i].price_details.base_later+result.products[i].price_details.minimum_later)); 
						cancelPrice.push(result.products[i].price_details.cancellation_fee_later); 
						maxTimeToCancel.push(result.products[i].maximum_time_to_cancel_later); 
					}

					if(!(jQuery.isEmptyObject(availibility))) {

						/*console.log("CAPTAIN INFO");
						console.log("Car Type: " + result.products[i].display_name);
						console.log("Availability: " + availibility);
						console.log("Estimated Price: " + basePrice);
						console.log("Estimated Time: " + "5 Minutes");*/
						
						
						pickupTimes.push(((new Date())/1000)+(1000*result.products[i].minimum_time_to_book));
						minTimeBookLater.push(result.products[i].minimum_time_to_book);
						cancelPrices.push(cancelPrice[0]);
						maxTimeCancel.push(maxTimeToCancel[0]);
						currencyCode.push(result.products[i].price_details.currency_code);
						products.push(result.products[i].product_id);
						
						console.log("picup_time: " + ((new Date())/1000)+(1000*result.products[i].minimum_time_to_book));
						console.log("min_time_to_book_later: " + result.products[i].minimum_time_to_book);
						console.log("cancel_price_details: " + cancelPrice);
						console.log("max_time_to_cancel: " + maxTimeToCancel);
						console.log("currency_code: " + result.products[i].price_details.currency_code);
						console.log("product_id: " + result.products[i].product_id);
						console.log("");

						var option = document.createElement("option");
						option.text = result.products[i].display_name;
						option.value = result.products[i].display_name;
						select.add(option);

						/*
						var output = "<h3>CAPTAIN " + (i+1) + " INFO</h3>"
						output += "<p>Car Type: " + result.products[i].display_name + "</p>";
						output += "<p>Availability (Now): " + availibility[0] + "</p>";
						output += "<p>Estimated Price (Now): " + basePrice[0] + "</p>";
						output += "<p>Estimated Time: " + "5 Minutes" + "</p>";
						
						var div = document.createElement("div");
						div.id="out_"+i;
						div.innerHTML = output;
						
						document.getElementById("output").appendChild(div);
						*/
					}
				}
			}
		}, 
		error: function (xhr, ajaxOptions, thrownError) {
			console.log("error");
			console.log("xhr: " + xhr);
			console.log("ajaxOptions: " + ajaxOptions);
			console.log("thrownError: " + thrownError);
		}
	});

	$("#submit").bind("click", function() {

		console.log(products);
		console.log(pickupTimes);
		console.log(minTimeBookLater);
		console.log(cancelPrices);
		console.log(maxTimeCancel);
		console.log(currencyCode);

		var index = 1;
		var notes = "asd";
		var data = "{" + 
					"'product_id':" + products[index ] + "," + 
					"'booking_type':'NOW'," + 
					"'promo_code':''," + 
					"'driver_notes':'" + notes + "'," + 
					"'pickup_time':" + pickupTimes[index] + "," + 
					"'pickup_details':{" + 
						"'longitude':" + longitude + "," +  
						"'latitude':" + latitude + "," + 
						"'nickname':'pickup'" + 
					"}," + 
					"'dropoff_details':{" + 
						"'longitude':" + end_longitude + "," +  
						"'latitude':" + end_latitude + "," + 
						"'nickname':'drop-off'" + 
					"}," + 
					"'customer_details':{" + 
						"'uuid':'newbooking" + count + "team28" + "'," + 
						"'name':'Test_User_" + count + "team28" + "'," + 
						"'email':'a" + count + "team28" + "@gmail.com'," + 
						"'phone_number':'" + customerPhone + "'" + 
					"}," + 
					"'surge_confirmation_id':'" + count + "'" + 
				"}";

		$.ajax({
			type : 'POST',
			headers: {"Authorization": "crl54u6cj8f3a7hkc304359lhg", "Content-Type":"application/json"},
			//dataType: 'json',
			data: data,
			crossDomain:true,
			async:true,
			url: "http://qa-interface.careem-engineering.com/v1/bookings",
			success: function(result){ 

				if(result.booking_id !== null) {
					bookingId = result.booking_id;
					EstimatedPrice = basePrice[index]*result.surge_multiplier;
					
					console.log(result.booking_id);
					console.log(result.surge_multiplier);
			
					if(bookingId !== null) {
						$.ajax({
							type : 'GET',
							headers: {"Authorization": "crl54u6cj8f3a7hkc304359lhg"},
							dataType: 'json',
							//data: { "latitude": latitude, "longitude":longitude },
							crossDomain:true,
							async:true,
							url: "http://qa-interface.careem-engineering.com/v1/bookings/"+bookingId.toString(),
							success: function(response){ 
								captainPhone = response.driver_details.driver_name;
								captainName = response.driver_details.driver_number;
								status = response.status;
								carModel = response.vehicle_details.model;
								carMake = response.vehicle_details.make;
								carNumber = response.vehicle_details.license_plate;

							}, 
							error: function (xhr, ajaxOptions, thrownError) {
								console.log("error-post-get");
								console.log("xhr: " + xhr);
								console.log("ajaxOptions: " + ajaxOptions);
								console.log("thrownError: " + thrownError);
							}
						});
					}
				}

			}, 
			error: function (xhr, ajaxOptions, thrownError) {
				console.log("error-post");
				console.log("xhr: " + xhr);
				console.log("ajaxOptions: " + ajaxOptions);
				console.log("thrownError: " + thrownError);
			}
		});
		count++;

		console.log(data);
	});
});

