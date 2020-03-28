function updateWebpage(response) {
    if(response.data) {
        $('#orders').empty();
        for(let i=0;i<response.data.length;i++) {
            let order = response.data[i];
            let node = $('<tr></tr>');
            node.append($('<td></td>').text(order.id));
            node.append($('<td></td>').text(order.origin));
            node.append($('<td></td>').text(order.dest));
            node.append($('<td></td>').text(order.weight));
            node.append($('<td></td>').text(order.time_created));
            node.append($('<td></td>').text(order.name));
            let edit = $('<i class="material-icons">create</i>').click(function() {
                showEditOrderPopup(order.id);
            });
            node.append($('<td></td>').append(edit));
            let remove = $('<i class="material-icons">clear</i>').click(function () {
                showRemoveOrderPopup(order.id);
            });
            node.append($('<td></td>').append(remove));
            $('#orders').append(node);
        }
    } else {
        let error = createError("Could not fetch orders!");
        $('#errors').append(error);
    }
}

async function getOrders() {
    let call_url = "api/orders/list.php";
    try
    {
        const response = await fetch(call_url,
            {
                method: "GET",
                headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });

        updateWebpage(await response.json());
    } catch (error)
    {
        console.log("Fetch failed: ", error);
    }
}

function showNewOrderPopup() {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<h2>Add New Order</h2>'))
            .append($('<br>'))
            .append($('<label for="createOrigin">Origin</label>'))
            .append($('<input type="text" name="origin" id="createOrigin"/>'))
            .append($('<br>'))
            .append($('<label for="createDestination">Destination</label>'))
            .append($('<input type="text" name="destination" id="createDestination"/>'))
            .append($('<br>'))
            .append($('<label for="createWeight">Weight</label>'))
            .append($('<input type="text" name="weight" id="createWeight"/>'))
            .append($('<br>'))
            .append($('<label for="createUser">User</label>'))
            .append($('<input type="text" name="user" id="createUser"/>'))
            .append($('<br>'))
            .append($('<button>Create</button>').click(function() {
                createOrder().then(function() {
                    form.remove();
                });
            }))
            .append($('<button>Cancel</button>').click(function() {
                form.remove();
            }))
        );
    $('main').append(form);
}

function showEditOrderPopup(order) {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<h2>Edit Order</h2>'))
            .append($('<br>'))
            .append($('<label for="editOrigin">Origin</label>'))
            .append($('<input type="text" name="origin" id="editOrigin"/>'))
            .append($('<br>'))
            .append($('<label for="editDestination">Destination</label>'))
            .append($('<input type="text" name="destination" id="editDestination"/>'))
            .append($('<br>'))
            .append($('<label for="editWeight">Weight</label>'))
            .append($('<input type="text" name="weight" id="editWeight"/>'))
            .append($('<br>'))
            .append($('<button>Edit</button>').click(function() {
                editOrder(order).then(function() {
                    form.remove();
                });
            }))
            .append($('<button>Cancel</button>').click(function() {
                form.remove();
            }))
        );
    $('main').append(form);
}

function showRemoveOrderPopup(order) {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<h2>Remove Order</h2>'))
            .append($('<br>'))
            .append($('<label for="removeId">ID</label>'))
            .append($('<input type="text" name="id" id="removeId"/>'))
            .append($('<br>'))
            .append($('<button>Remove</button>').click(function() {
                if(order === $('#removeId').val()) {
                    removeOrder(order).then(function() {
                        form.remove();
                    });
                }
            }))
            .append($('<button>Cancel</button>').click(function() {
                form.remove();
            }))
        );
    $('main').append(form);
}

async function createOrder() {
    let call_url = "api/orders/create.php";
    let values = {
        origin: encodeURIComponent($('#createOrigin').val()),
        destination: encodeURIComponent($('#createDestination').val()),
        weight: encodeURIComponent($('#createWeight').val()),
        user: encodeURIComponent($('#createUser').val())
    };
    let form = `origin=${values.origin}&dest=${values.destination}&weight=${values.weight}&user=${values.user}`;
    try {
        let response = await fetch(call_url,
            {
                method: "POST",
                headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: form
            });
        let json = await response.json();
        console.log(json);
        if(json.data) {
            let info = createSuccess("Created order!");
            $('#errors').append(info);
            await getOrders();
        } else {
            let error = createError("Could not create order!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not create order!");
        $('#errors').append(error);
    }
}

async function editOrder(id) {
    let call_url = "api/orders/edit.php";
    let values = {
        id: encodeURIComponent(id),
        origin: encodeURIComponent($('#editOrigin').val()),
        destination: encodeURIComponent($('#editDestination').val()),
        weight: encodeURIComponent($('#editWeight').val())
    };
    let form = `id=${values.id}&origin=${values.origin}&dest=${values.destination}&weight=${values.weight}`;
    try {
        let response = await fetch(call_url,
            {
                method: "POST",
                headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: form
            });
        let json = await response.json();
        console.log(json);
        if(json.data) {
            let info = createSuccess("Edited order!");
            $('#errors').append(info);
            await getOrders();
        } else {
            let error = createError("Could not edit order!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not edit order!");
        $('#errors').append(error);
    }
}

async function removeOrder(id) {
    console.log(id);
    let call_url = "api/orders/delete.php";
    let form = `id=${encodeURIComponent(id)}`;
    try {
        let response = await fetch(call_url,
            {
                method: "POST",
                headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: form
            });
        let json = await response.json();
        console.log(json);
        if(json.data) {
            let info = createSuccess("Removed order!");
            $('#errors').append(info);
            await getOrders();
        } else {
            let error = createError("Could not remove order!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not remove order!");
        $('#errors').append(error);
    }
}

window.onload = function() {
    getOrders().then();
};