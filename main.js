$(document).ready(function () {
  //Toggle sidebar button
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
    $(this).toggleClass("active");
  });

  //Declare table metadata array.
  hospitalsTableMetadata = [];

  //Declare hospitals array.
  hamiltonHospitals = [];

  //Get data from the hamilton_hospitals table on csunix, parses it into a
  //JavaScript object, and sets attributes accordingly.
  $.ajax({
    type: "post",
    url: "update.php",
    data: "JSON",
    success: function (data) {
      hospitalsTableMetadata = JSON.parse(data);

      for (
        i = 0; i < hospitalsTableMetadata["hospitalsTableMetadata"][0].length; i++
      ) {
        hamiltonHospitals.push({
          OBJECTID: hospitalsTableMetadata["hospitalsTableMetadata"][0][i],
          ADDRESS: hospitalsTableMetadata["hospitalsTableMetadata"][1][i],
          COMMUNITY: hospitalsTableMetadata["hospitalsTableMetadata"][2][i],
          LATITUDE: hospitalsTableMetadata["hospitalsTableMetadata"][3][i],
          LONGITUDE: hospitalsTableMetadata["hospitalsTableMetadata"][4][i],
          NAME: hospitalsTableMetadata["hospitalsTableMetadata"][5][i],
          PHONE: hospitalsTableMetadata["hospitalsTableMetadata"][6][i]
        });
      }
    }
  });

  //Instantiate an array for pushpins.
  pushArray = [];

  // listHospitalsJSON = JSON.stringify(hamiltonHospitals, null, "\t");



  /**
   * Prompts the user to allow the use of their location - stores and displays their location if they agree,
   * handles errors if they disagree.
   * @param {type} error
   */
  navigator.geolocation.getCurrentPosition(
    //Success function
    function (p) {
      currentLat = p.coords.latitude;
      currentLong = p.coords.longitude;

      loadMap();
    },

    //Error function
    function showError(error) {
      var x = document.getElementById("loc");
      switch (error.code) {
        case error.PERMISSION_DENIED:
          x.innerHTML = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          x.innerHTML = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          x.innerHTML = "The request to get user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
          x.innerHTML = "An unknown error occurred.";
          break;
      }
    }
  );

  //Loads the map and default pushpins to the screen
  function loadMap() {
    map = new Microsoft.Maps.Map(document.getElementById("mapcontainer"), {
      center: new Microsoft.Maps.Location(currentLat, currentLong)
    });
    currentPosition = new Microsoft.Maps.Location(currentLat, currentLong);
    centerPushpin = new Microsoft.Maps.Pushpin(currentPosition, {
      color: 'red'
    });
    var infobox = new Microsoft.Maps.Infobox(centerPushpin.getLocation(), {
      visible: false,
      autoAlignment: true
    });
    infobox.setMap(map);

    map.entities.push(centerPushpin);

    //Generate array of default pushpins
    for (var i = 0; i < hamiltonHospitals.length; i++) {
      //Generate location object for the long and lat of the current Hospital
      var location = new Microsoft.Maps.Location(
        hamiltonHospitals[i].LATITUDE,
        hamiltonHospitals[i].LONGITUDE
      );

      //Generate a pushpin for the current Hospital
      var pushpin = new Microsoft.Maps.Pushpin(location, {
        color: 'blue'
      });

      //Store metadata about the pushpin
      pushpin.metadata = {
        title: hamiltonHospitals[i].NAME,

        description: "<strong>" +
          hamiltonHospitals[i].ADDRESS +
          "</strong>" +
          ", " +
          hamiltonHospitals[i].COMMUNITY +
          "</br>" +
          hamiltonHospitals[i].PHONE,

        phone: hamiltonHospitals[i].PHONE,

        community: hamiltonHospitals[i].COMMUNITY,

        type: hamiltonHospitals[i].TYPE,

        latitude: hamiltonHospitals[i].LATITUDE,

        longitude: hamiltonHospitals[i].LONGITUDE
      };

      Microsoft.Maps.Events.addHandler(pushpin, "click", function (args) {

        for (i = 0; i < pushArray.length; i++) {

          pushArray[i].setOptions({
            color: 'blue'
          })

        }

        args.target.setOptions({
          color: 'green'
        });

        infobox.setOptions({
          location: args.target.getLocation(),
          title: args.target.metadata.title,
          description: args.target.metadata.description,
          city: args.target.metadata.city,
          phone: args.target.metadata.phone,
          visible: true,
        });

        dirLocation = args.target.getLocation();
        dirName = args.target.metadata.title;

      });

      //Stores each created pushpin and their respective metadata in an
      //array of pushpins.
      pushArray.push(pushpin);

      //Adds pushpins to the map.
      map.entities.push(pushpin);

      //Add centerPushpin to the map.
      map.entities.push(centerPushpin);

      //centerPushpin infobox
      Microsoft.Maps.Events.addHandler(centerPushpin, "click", function (args) {
        infobox.setOptions({
          location: args.target.getLocation(),
          title: "Current Location",
          description: "You are here.",
          visible: true
        });
      });
    }
  }

  $("#getdirections").click(function (e) {

    e.preventDefault();

    loadMap();

    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {

      directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

      // Set Route Mode to driving
      directionsManager.setRequestOptions({
        routeMode: Microsoft.Maps.Directions.RouteMode.driving
      });
      var waypoint1 = new Microsoft.Maps.Directions.Waypoint({
        address: dirName,
        location: dirLocation
      });
      var waypoint2 = new Microsoft.Maps.Directions.Waypoint({
        address: 'Current Location',
        location: new Microsoft.Maps.Location(currentLat, currentLong)
      });
      directionsManager.addWaypoint(waypoint1);
      directionsManager.addWaypoint(waypoint2);

      // Set the element in which the itinerary will be rendered
      // directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('printoutPanel') });

      directionsManager.calculateDirections();
    });

  });







  /* ----------------------------------------------------------------------------- */

  //Duplicate "getLocation" code - for reference when moving the
  //infoboxes by calling a function to get the current location.
  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      //Success function
      function (p) {
        currentLat = p.coords.latitude;
        currentLong = p.coords.longitude;

        loadMap();
      },

      //Error function
      function showError(error) {
        var x = document.getElementById("loc");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out.";
            break;
          case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred.";
            break;
        }
      }
    );

    //Loads the map and default pushpins to the screen
    function loadMap() {
      var map = new Microsoft.Maps.Map(
        document.getElementById("mapcontainer"), {
          center: new Microsoft.Maps.Location(currentLat, currentLong)
        }
      );
      currentPosition = new Microsoft.Maps.Location(currentLat, currentLong);
      centerPushpin = new Microsoft.Maps.Pushpin(currentPosition, {
        color: "red"
      });
      var infobox = new Microsoft.Maps.Infobox(centerPushpin.getLocation(), {
        visible: false,
        autoAlignment: true
      });
      infobox.setMap(map);

      map.entities.push(centerPushpin);

      //Generate array of default pushpins
      for (var i = 0; i < hamiltonHospitals.length; i++) {
        //Generate location object for the long and lat of the current Hospital
        var location = new Microsoft.Maps.Location(
          hamiltonHospitals[i].LATITUDE,
          hamiltonHospitals[i].LONGITUDE
        );

        //Generate a pushping for the current Hospital
        var pushpin = new Microsoft.Maps.Pushpin(location, null);

        //Store metadata about the pushpin
        pushpin.metadata = {
          title: hamiltonHospitals[i].NAME,

          description: "<strong>" +
            hamiltonHospitals[i].ADDRESS +
            "</strong>" +
            ", " +
            hamiltonHospitals[i].COMMUNITY +
            "</br>" +
            hamiltonHospitals[i].PHONE +
            "</br>" +
            '<a href = "#" id="link">Get directions</a>',

          phone: hamiltonHospitals[i].PHONE,

          community: hamiltonHospitals[i].COMMUNITY,

          type: hamiltonHospitals[i].TYPE,

          latitude: hamiltonHospitals[i].LATITUDE,

          longitude: hamiltonHospitals[i].LONGITUDE
        };

        Microsoft.Maps.Events.addHandler(pushpin, "click", function (args) {
          infobox.setOptions({
            location: args.target.getLocation(),
            title: args.target.metadata.title,
            description: args.target.metadata.description,
            city: args.target.metadata.city,
            phone: args.target.metadata.phone,
            visible: true
          });
        });

        //Stores each created pushpin and their respective metadata in an
        //array of pushpins.
        pushArray.push(pushpin);

        //Adds pushpins to the map.
        map.entities.push(pushpin);

        //Add centerPushpin to the map.
        map.entities.push(centerPushpin);

        //centerPushpin infobox
        Microsoft.Maps.Events.addHandler(centerPushpin, "click", function (
          args
        ) {
          infobox.setOptions({
            location: args.target.getLocation(),
            title: "Current Location",
            description: "You are here.",
            visible: true
          });
        });
      }
    }
  }
});