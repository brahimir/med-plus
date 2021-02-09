nameValid = false;      //institution name valid flag
addressValid = false;   //address valid flag
cityValid = false;      //city valid flag
phoneValid = false;     //phone number valid flag

//US and CAD phone number regex
regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;

//Get form and inputs.
var form = $('#ajax');

// var inputName = $('#inputName');
// var inputAddress = $('#inputName');
// var inputCity = $('#inputName');
// var inputPhone = $('#inputName');

// Event listener for the form.
$('form.ajax').on('submit', function() {

    //Sets each of the attributes of the current (this) form.
    var 
        that = $(this),
        url = that.attr('action'),
        type = that.attr('method'),
        data = {};

    //Sets up values for anything with an attribute of 'name'.
    that.find('[name]').each(function(index, value) {

        var 
            that = $(this),
            name = that.attr('name'),
            value = that.val();

        data[name] = value;

    });

    $.ajax({

        type: type,
        url: url,
        data: data,
        success: function (response) {

            //addlocation.php will update the table on the server, and
            //will send a success message to indicate that the record was
            //added successfully.

            //TODO: Clear the input fields after a successful addition.
            $('#success').html("institution added!");
            $('#inputName').attr('value', "");
            $('#inputAddress').attr('value', "");
            $('#inputCity').attr('value', "choose a city...");
            $('#inputPhone').attr('value', "");


            console.log(response);
        }

    }); 
    
    //Stops the form from submitting in the default fashion.
    return false;

});



//Sets "add" button to disabled by default.
$('#addbutton').prop('disabled', true);

/**
 * Keyup function for institution name validation - accepts anything that isn't ""
 * or null.
 */
$("#inputName").keyup(function() { 

    if ($('#inputName').val() == "" || $('#inputName').val() == null) {
        
        nameValid = false;

    }

    else {

        nameValid = true;

    }

    //Checks all flags - enables/disables "add" button accordingly.
    if (nameValid && addressValid && cityValid && phoneValid) {

        $('#addbutton').prop('disabled', false);
        
    }

    else {

        $('#addbutton').prop('disabled', true);

    }

});


/**
 * Keyup function for address name validation - accepts anything that isnt "" or null.
 */
$("#inputAddress").keyup(function() {

    if ($('#inputAddress').val() == "" || $('#inputAddress').val() == null) {
        
        addressValid = false;

    }

    else {

        addressValid = true;

    }

    //Checks all flags - enables/disables "add" button accordingly.
    if (nameValid && addressValid && cityValid && phoneValid) {

        $('#addbutton').prop('disabled', false);
        
    }

    else {

        $('#addbutton').prop('disabled', true);

    }

});

/**
 * Change function for city validation - accepts any option that isnt the default.
 */
$('#inputCity').change(function() {

    if ($('#inputCity').val() == "choose a city...") {

        cityValid = false;

    }

    else {

        cityValid = true;

    }

    //Checks all flags - enables/disables "add" button accordingly.
    if (nameValid && addressValid && cityValid && phoneValid) {

        $('#addbutton').prop('disabled', false);
        
    }

    else {

        $('#addbutton').prop('disabled', true);

    }
    

})

/**
 * Keyup function for phone number validation - only accepts a 10 digit 
 * US or CAD phone number based on the defined regex above.
 */
$("#inputPhone").keyup(function() {

    if ($('#inputPhone').val().match(regex) !== null) {

        phoneValid = true;

    }

    else {

        phoneValid = false;

    }

    //Checks all flags - enables/disables "add" button accordingly.
    if (nameValid && addressValid && cityValid && phoneValid) {

        $('#addbutton').prop('disabled', false);
        
    }

    else {

        $('#addbutton').prop('disabled', true);

    }
    

});

//Get the user's current lat and long.
navigator.geolocation.getCurrentPosition(

    //Success function
    function(p) {
        
      currentLat = p.coords.latitude;
      currentLong = p.coords.longitude;

      $('#inputLatitude').attr('value', currentLat)
      $('#inputLongitude').attr('value', currentLong)

    },

    //Error function
    function showError(error) {
      
        var x = document.getElementById("success");
      
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
