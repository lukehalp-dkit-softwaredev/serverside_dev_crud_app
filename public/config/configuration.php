<?php

/* * ************************ You need to set the values below to match your project ************************ */

// localhost website and localhost database
$localHostSiteFolderName = "crateway";

$localhostDatabaseName = "fswd_Y2S1_project2db";
$localHostDatabaseHostAddress = "localhost";
$localHostDatabaseUserName = "D00219060";
$localHostDatabasePassword = "abcdefg";

// remotely hosted website and remotely hosted database       /* you will need to get the server details below from your host provider */
$serverWebsiteName = "http://mysql02.comp.dkit.ie/D00219060/ecommerce"; /* use this address if hosting website on the college students' website server */

$serverDatabaseName = "D00219060";
$serverDatabaseHostAddress = "mysql02.comp.dkit.ie";         /* use this address if hosting database on the college computing department database server */
$serverDatabaseUserName = "D00219060";
$serverDatabasePassword = "O648u1JG";

//Docker host
$dockerWebsiteName = "http://localhost:8080";

$dockerDatabaseName = "crateway";
$dockerDatabaseHostAddress = "mysql";
$dockerDatabaseUserName = "root";
$dockerDatabasePassword = "abcdefg";




$useLocalHost = false;      /* set to false if your database is NOT hosted on localhost */
$useDocker = true;


/* * ******************************* WARNING                                 ******************************** */
/* * ******************************* Do not modify any code BELOW this point ******************************** */

if ($useLocalHost) {
    $siteName = "http://localhost/" . $localHostSiteFolderName;
    $dbName = $localhostDatabaseName;
    $dbHost = $localHostDatabaseHostAddress;
    $dbUsername = $localHostDatabaseUserName;
    $dbPassword = $localHostDatabasePassword;
} else if ($useDocker) {
    $siteName = $dockerWebsiteName;
    $dbName = $dockerDatabaseName;
    $dbHost = $dockerDatabaseHostAddress;
    $dbUsername = $dockerDatabaseUserName;
    $dbPassword = $dockerDatabasePassword;
} else {  // using remote host
    $siteName = $serverWebsiteName;
    $dbName = $serverDatabaseName;
    $dbHost = $serverDatabaseHostAddress;
    $dbUsername = $serverDatabaseUserName;
    $dbPassword = $serverDatabasePassword;
}