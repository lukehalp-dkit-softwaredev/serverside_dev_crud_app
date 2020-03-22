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
            <h1>Users</h1>
            <button onclick="getUsers()">Refresh</button>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Edit</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody id="users">
                </tbody>
            </table>
            <button onclick="showNewUserPopup()">Add User</button>
        </main>
        <script src="js/users.js"></script>
    </body>
</html>
