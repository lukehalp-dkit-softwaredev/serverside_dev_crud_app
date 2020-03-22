<?php

require_once "../../config/configuration.php";

$userInfo = new stdClass(); // Get logged in user data

$response = new stdClass();
if ($userInfo) {

    /* Connect to the database */
    $dbConnection = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
    $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   // set the PDO error mode to exception

    /* Perform Query */
    $query = "SELECT email, name FROM users;";
    $statement = $dbConnection->prepare($query);
    $statement->execute();

    /* echo "<br>---------DEBUG--------<br>";
      echo $statement->rowCount();
      echo "<br>-------END DEBUG------<br><br><br>"; */

    $result = $statement->fetchAll(PDO::FETCH_OBJ);

    $response->apiVersion = "1.0";
    $response->data = $result;
} else {
    // user must be logged in
    $error = new stdClass();
    $error->code = 401;
    $error->msg = "You must be logged in to use this!";

    $response->apiVersion = "1.0";
    $response->error = $error;

    http_response_code(400);
}
echo json_encode($response);
