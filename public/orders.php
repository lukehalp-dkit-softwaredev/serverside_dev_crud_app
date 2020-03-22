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
            <h1>Orders</h1>
            <button onclick="getOrders()">Refresh</button>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Weight</th>
                    <th>Time Created</th>
                    <th>User</th>
                    <th>Edit</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody id="orders">
                </tbody>
            </table>
            <button onclick="showNewOrderPopup()">Add Order</button>
        </main>
        <script src="js/orders.js"></script>
    </body>
</html>
