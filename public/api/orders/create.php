<?php

require_once "../../config/configuration.php";

$userInfo = new stdClass(); // Get logged in user data

$response = new stdClass();
if ($userInfo) {
    if (isset($_POST['origin']) && isset($_POST['dest']) && isset($_POST['weight']) && isset($_POST['user'])) {
        $origin = filter_input(INPUT_POST, "origin", FILTER_SANITIZE_STRING);
        $dest = filter_input(INPUT_POST, "dest", FILTER_SANITIZE_STRING);
        $weight = filter_input(INPUT_POST, "weight", FILTER_SANITIZE_NUMBER_FLOAT);
        $user = filter_input(INPUT_POST, "user", FILTER_SANITIZE_STRING);

        /* Connect to the database */
        $dbConnection = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   // set the PDO error mode to exception

        /* Perform Query */
        $query = "INSERT INTO orders(origin, dest, weight, user_id) VALUES(:origin, :dest, :weight, :user);";
        $statement = $dbConnection->prepare($query);
        $statement->bindParam(":origin", $origin, PDO::PARAM_STR);
        $statement->bindParam(":dest", $dest, PDO::PARAM_STR);
        $statement->bindParam(":weight", $weight, PDO::PARAM_STR);
        $statement->bindParam(":user", $user, PDO::PARAM_STR);
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

            http_response_code(404);
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
