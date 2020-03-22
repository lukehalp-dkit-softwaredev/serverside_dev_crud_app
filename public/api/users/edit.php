<?php

require_once "../../config/configuration.php";

$userInfo = new stdClass(); // Get logged in user data

$response = new stdClass();
if ($userInfo) {
    if (isset($_POST['email']) && isset($_POST['name']) && isset($_POST['password'])) {
        $email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_STRING);
        $name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_STRING);
        $password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

        $salt = "";
        $hash = password_hash($password, PASSWORD_DEFAULT);

        /* Connect to the database */
        $dbConnection = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   // set the PDO error mode to exception

        /* Perform Query */
        $query = "UPDATE users SET name = :name, password_salt = :salt, password_hash = :hash WHERE email = :email";
        $statement = $dbConnection->prepare($query);
        $statement->bindParam(":name", $name, PDO::PARAM_STR);
        $statement->bindParam(":salt", $salt, PDO::PARAM_STR);
        $statement->bindParam(":hash", $hash, PDO::PARAM_STR);
        $statement->bindParam(":email", $email, PDO::PARAM_STR);
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
            // Order not found
            $error = new stdClass();
            $error->code = 404;
            $error->msg = "User not found.";

            $response->apiVersion = "1.0";
            $response->error = $error;

            http_response_code(404);
        }
    } else {
        // Order id not in url
        $error = new stdClass();
        $error->code = 400;
        $error->msg = "Malformed URL, please check url parameters and try again.";

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

    http_response_code(400);
}
echo json_encode($response);
