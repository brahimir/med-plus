<?php
include 'connect.php';

//Selects all values from the table in the database.
$command = "SELECT * FROM hamilton_hospitals";
$stmt = $dbh -> prepare($command);
$result = $stmt -> execute();

//Declare array variables of column names.
$OBJECTID = [];
$ADDRESS = [];
$COMMUNITY = [];
$LATITUDE = [];
$LONGITUDE = [];
$NAME = [];
$PHONE = [];

//Array that will hold all of the arrays of column values.
$hospitals_array = [];

//While there are stil rows in the database to fetch, assign values 
//from columns to their respective array variables.
while ($row = $stmt -> fetch()) {

    array_push($OBJECTID, $row['object_id']);
    array_push($ADDRESS, $row['address']);
    array_push($COMMUNITY, $row['community']);
    array_push($LATITUDE, $row['latitude']);
    array_push($LONGITUDE, $row['longitude']);
    array_push($NAME, $row['name']);
    array_push($PHONE, $row['phone']);

}

//Store each array of column values in the hospital_array.
$hospitals_array[0] = $OBJECTID;
$hospitals_array[1] = $ADDRESS;
$hospitals_array[2] = $COMMUNITY;
$hospitals_array[3] = $LATITUDE;
$hospitals_array[4] = $LONGITUDE;
$hospitals_array[5] = $NAME;
$hospitals_array[6] = $PHONE;


//Store the PHP hospital array as a json object in a JavaScript variable
//called hamiltonHospitals
if ($result) {

    echo json_encode(array('hospitalsTableMetadata' => $hospitals_array));

}

//This will echo something back to the JavaScript if the connection failed.
else {

    echo $command;
    echo "new ID: {$dbh->lastInsertID()}";

}


?>
 