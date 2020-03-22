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
            <h1>Deliveries</h1>
            <button onclick="getDeliveries()">Refresh</button>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Weight</th>
                    <th>Time Dispatched</th>
                    <th>Time Delivered</th>
                    <th>Weight Cost</th>
                    <th>Extra Cost</th>
                    <th>Total Cost</th>
                    <th>Company</th>
                    <th>Edit</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody id="deliveries">
                </tbody>
            </table>
            <button onclick="showNewDeliveryPopup()">Add Delivery</button>
        </main>
        <script src="js/deliveries.js"></script>
    </body>
</html>
