<?php
include 'connect.php';

try {

    $dbh = new PDO("mysql:host=localhost;dbname=000325920", "000325920", "19940829");

} 

catch (Exception $e) {

    die("ERROR: Sorry couldn't connect. ");

}

    //Declare variables for easier use in SQL statements.
    $name = $_POST['inputName'];
    $address = $_POST['inputAddress'];
    $community = strtoupper($_POST['inputCity']);
    $phone = $_POST['inputPhone'];
    $latitude = $_POST['inputLatitude'];
    $longitude = $_POST['inputLongitude'];

    // echo $name . $address . $community . $phone . $latitude . $longitude;

    $sql = "INSERT INTO hamilton_hospitals(address, community, latitude, longitude, name, phone) VALUES ('$address', '$community', '$latitude', '$longitude', '$name', '$phone')";

    $stmt = $dbh->prepare($sql);
    $result = $stmt->execute();


    if ($result) {

        $message = "Success";

    } 

    else {

        $message = "Fail";
        echo $sql;
        echo "new id: {$dbh->lastInsertID()}";

    }

    echo $message;

 