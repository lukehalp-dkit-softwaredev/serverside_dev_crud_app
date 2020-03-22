<?php

require_once "../../config/configuration.php";

$userInfo = new stdClass(); // Get logged in user data

$response = new stdClass();
if ($userInfo) {

    /* Connect to the database */
    $dbConnection = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
    $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   // set the PDO error mode to exception

    /* Perform Query */
    $query = "SELECT d.id, origin, dest, weight, time_dispatched, time_delivered, c.cost_per_kg * o.weight as weight_cost, d.cost as extra_cost, (c.cost_per_kg * o.weight) + d.cost as total_cost, name FROM orders o, deliveries d, companies c WHERE o.id = d.order_id AND c.id = d.company_id;";
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
