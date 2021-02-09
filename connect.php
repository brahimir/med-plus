<?php

try {

    $dbh = new PDO("mysql:host=localhost;dbname=000325920", "000325920", "19940829");

} 

catch (Exception $e) {

    die("ERROR: Sorry couldn't connect. ");

}

?>