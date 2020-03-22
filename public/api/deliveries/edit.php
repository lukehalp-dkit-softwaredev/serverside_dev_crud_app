<?php

require_once "../../config/configuration.php";

$userInfo = new stdClass(); // Get logged in user data

$response = new stdClass();
if ($userInfo) {
    if (isset($_POST['id']) && isset($_POST['company_id']) && isset($_POST['cost']) && isset($_POST['delivered'])) {
        $id = filter_input(INPUT_POST, "id", FILTER_SANITIZE_STRING);
        $company_id = filter_input(INPUT_POST, "company_id", FILTER_SANITIZE_STRING);
        $cost = filter_input(INPUT_POST, "cost", FILTER_SANITIZE_NUMBER_FLOAT);
        $delivered = filter_input(INPUT_POST, "delivered", FILTER_SANITIZE_NUMBER_INT);

        $time_delivered = $delivered == 1 ? "CURRENT_TIMESTAMP" : "NULL";

        /* Connect to the database */
        $dbConnection = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   // set the PDO error mode to exception

        /* Perform Query */
        $query = "UPDATE deliveries SET company_id = :company_id, cost = :cost, time_delivered = " . $time_delivered . " WHERE id = :id";
        $statement = $dbConnection->prepare($query);
        $statement->bindParam(":company_id", $company_id, PDO::PARAM_STR);
        $statement->bindParam(":cost", $cost, PDO::PARAM_STR);
        $statement->bindParam(":id", $id, PDO::PARAM_INT);
        $statement->execute();

        /* echo "<br>---------DEBUG--------<br>";
          echo $statement->rowCount();
          echo "<br>-------END DEBUG------<br><br><br>"; */

        if ($statement->rowCount() > 0) {
            $result = new stdClass();
            $result->message = "Edited";

            $response->apiVersion = "1.0";
            $response->data = $result;
        } else {
            $error = new stdClass();
            $error->code = 404;
            $error->msg = "Delivery not found.";

            $response->apiVersion = "1.0";
            $response->error = $error;

            http_response_code(404);
        }
    } else {
        $error = new stdClass();
        $error->code = 400;
        $error->msg = "Malformed URL, please check url parameters and try again.";

        $response->apiVersion = "1.0";
        $response->error = $error;

        http_response_code(400);
    }
} else {
    $error = new stdClass();
    $error->code = 401;
    $error->msg = "You must be logged in to use this!";

    $response->apiVersion = "1.0";
    $response->error = $error;

    http_response_code(401);
}
echo json_encode($response);
