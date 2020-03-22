<?php

require_once "../../config/configuration.php";

$userInfo = new stdClass(); // Get logged in user data

$response = new stdClass();
if ($userInfo) {
    if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['max_capacity']) && isset($_POST['cost_per_kg'])) {
        $email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_STRING);
        $name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_STRING);
        $max_capacity = filter_input(INPUT_POST, "max_capacity", FILTER_SANITIZE_NUMBER_INT);
        $cost_per_kg = filter_input(INPUT_POST, "cost_per_kg", FILTER_SANITIZE_NUMBER_FLOAT);

        /* Connect to the database */
        $dbConnection = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   // set the PDO error mode to exception

        /* Perform Query */
        $query = "INSERT INTO companies(email, name, max_capacity, cost_per_kg) VALUES(:email, :name, :max_capacity, :cost_per_kg);";
        $statement = $dbConnection->prepare($query);
        $statement->bindParam(":email", $email, PDO::PARAM_STR);
        $statement->bindParam(":name", $name, PDO::PARAM_STR);
        $statement->bindParam(":max_capacity", $max_capacity, PDO::PARAM_INT);
        $statement->bindParam(":cost_per_kg", $cost_per_kg, PDO::PARAM_STR);
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
            $error = new stdClass();
            $error->code = 500;
            $error->msg = "Something went wrong.";

            $response->apiVersion = "1.0";
            $response->error = $error;

            http_response_code(500);
        }
    } else {
        $error = new stdClass();
        $error->code = 400;
        $error->msg = "Malformed data, please check url parameters and try again.";

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
