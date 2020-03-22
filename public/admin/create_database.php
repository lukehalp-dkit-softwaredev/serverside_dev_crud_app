<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PHP Create Database</title>
    </head>
    <body>

        <?php
        /* Include "configuration.php" file */
        require_once "../config/configuration.php";


        /* Connect to the database */
        $dbConnection = new PDO("mysql:host=$dbHost", $dbUsername, $dbPassword);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   // set the PDO error mode to exception



        /* Create the database */
        $query = "CREATE DATABASE IF NOT EXISTS $dbName;";
        $statement = $dbConnection->prepare($query);
        $statement->execute();

        $dbConnection = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   // set the PDO error mode to exception

        $users = "
            create table if not exists users
            (
                email varchar(255) not null,
                password_salt varchar(255) not null,
                password_hash varchar(255) not null,
                name varchar(255) null,
                constraint users_pk
                    primary key (email)
            );
        ";

        $orders = "
            create table if not exists orders
            (
                id int auto_increment,
                origin text not null,
                dest text not null,
                priority int not null,
                weight double not null,
                time_created timestamp default CURRENT_TIMESTAMP not null,
                user_id varchar(255) not null,
                constraint orders_pk
                    primary key (id),
                constraint orders_users_user_id_fk
                    foreign key (user_id) references users (email)
            );
        ";

        $companies = "
            create table if not exists companies
            (
                id int auto_increment,
                name varchar(255) not null,
                email varchar(255) not null,
                max_capacity double not null,
                cost_per_kg double not null,
                constraint companies_pk
                    primary key (id)
            );

            create unique index companies_email_uindex
                on companies (email);
        ";

        $deliveries = "
            create table if not exists deliveries
            (
                id int not null,
                company_id int not null,
                time_dispatched timestamp default CURRENT_TIMESTAMP not null,
                time_delivered timestamp null,
                cost double not null,
                order_id int not null,
                constraint deliveries_pk
                    primary key (id),
                constraint deliveries_companies_id_fk
                    foreign key (company_id) references companies (id),
                constraint deliveries_orders_id_fk
                    foreign key (order_id) references orders (id) 
            );
        ";

        /* Create table */
        $query = $users . $orders . $companies . $deliveries;
        $statement = $dbConnection->prepare($query);
        $statement->execute();

        $statement = $dbConnection->prepare("SHOW TABLES;");
        $statement->execute();

        echo json_encode($statement->fetchAll(PDO::FETCH_OBJ));

        /* Provide feedback to the user */
        echo "<br>Database '$dbName' created.";
        ?>
    </body>
</html>