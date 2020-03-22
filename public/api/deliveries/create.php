<?php

require_once "../../config/configuration.php";

$userInfo = new stdClass(); // Get logged in user data

$response = new stdClass();
if ($userInfo) {
    if (isset($_POST['order_id']) && isset($_POST['company_id']) && isset($_POST['cost'])) {
        $order_id = filter_input(INPUT_POST, "order_id", FILTER_SANITIZE_NUMBER_INT);
        $company_id = filter_input(INPUT_POST, "company_id", FILTER_SANITIZE_NUMBER_INT);
        $cost = filter_input(INPUT_POST, "cost", FILTER_SANITIZE_NUMBER_FLOAT);

        /* Connect to the database */
        $dbConnection = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   // set the PDO error mode to exception

        /* Perform Query */
        $query = "INSERT INTO deliveries(order_id, company_id, cost) VALUES(:order_id, :company_id, :cost);";
        $statement = $dbConnection->prepare($query);
        $statement->bindParam(":order_id", $order_id, PDO::PARAM_STR);
        $statement->bindParam(":company_id", $company_id, PDO::PARAM_STR);
        $statement->bindParam(":cost", $cost, PDO::PARAM_STR);
        $statement->execute();

        /* echo "<br>---------DEBUG--------<br>";
          echo $statement->rowCount();
          echo "<br>-------END DEBUG------<br><br><br>"; */

        if ($statement->rowCount() > 0) {
            $result = new stdClass();
            $result->message = "Added";

            $response->apiVersion = "1.0";
            $response->data = $result;
        } else {
            // Order not found
            $error = new stdClass();
            $error->code = 500;
            $error->msg = "Something went wrong.";

            $response->apiVersion = "1.0";
            $response->error = $error;

            http_response_code(500);
        }
    } else {
        // Order not in url
        $error = new stdClass();
        $error->code = 400;
        $error->msg = "Malformed data, please check url parameters and try again.";

        $response->apiVersion = "1.0";
        $response->error = $error;

        http_response_code(400);
    }
} else {
    // user must be logged in
    $error = new stdClass();
    $error->code = 401;
    $error->msg = "You must be logged in to use this!";

    $response->apiVersion = "1.0";
    $response->error = $error;

    http_response_code(401);
}
echo json_encode($response);
