
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.define("usersNearby", function(request, response) {
    // request.user.location

    var userLocation = new Parse.Query("UserLocations");
    userLocation.equalTo("user", request.user);
    userLocation.descending("currentTimeStamp");
				userLocation.find({
						success: function(locations) {
							var query = new Parse.Query("UserLocations");
    			query.withinKilometers("location", locations[0].get("location"), 0.01); // ~33ft
    			var date = new Date();
    			query.greaterThan("currentTimeStamp", date.getTime()/1000-30) // within last 30 sec
    			query.find({
    				success: function(locationsNearbyNow) {
    					response.success(locationsNearbyNow);
    				}
    			})
						},
						error: function(error) {
							console.error( "Error" + error.code + ":" + error.message );
						}

				})