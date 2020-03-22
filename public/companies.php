<!DOCTYPE html>
<html>
    <head>
        <title>Crateway Logistics</title>
        <?php
            include('head.php');
        ?>
    </head>
    <body>
        <?php
            include('navbar.php');
        ?>
        <main>
            <div id="errors"></div>
            <h1>Companies</h1>
            <button onclick="getCompanies()">Refresh</button>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Max Capacity</th>
                    <th>Cost Per Kg</th>
                    <th>Edit</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody id="companies">
                </tbody>
            </table>
            <button onclick="showNewCompanyPopup()">Add Company</button>
        </main>
        <script src="js/companies.js"></script>
    </body>
</html>
