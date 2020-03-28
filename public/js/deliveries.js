function updateWebpage(response) {
    if(response.data) {
        $('#deliveries').empty();
        for(let i=0;i<response.data.length;i++) {
            let delivery = response.data[i];
            let node = $('<tr></tr>');
            node.append($('<td></td>').text(delivery.id));
            node.append($('<td></td>').text(delivery.origin));
            node.append($('<td></td>').text(delivery.dest));
            node.append($('<td></td>').text(delivery.weight));
            node.append($('<td></td>').text(delivery.time_dispatched));
            node.append($('<td></td>').text(delivery.time_delivered));
            node.append($('<td></td>').text(delivery.weight_cost));
            node.append($('<td></td>').text(delivery.extra_cost));
            node.append($('<td></td>').text(delivery.total_cost));
            node.append($('<td></td>').text(delivery.name));
            let edit = $('<i class="material-icons">create</i>').click(function() {
                showEditDeliveryPopup(delivery.id);
            });
            node.append($('<td></td>').append(edit));
            let remove = $('<i class="material-icons">clear</i>').click(function () {
                showRemoveDeliveryPopup(delivery.id);
            });
            node.append($('<td></td>').append(remove));
            $('#deliveries').append(node);
        }
    } else {
        let error = createError("Could not fetch deliveries!");
        $('#errors').append(error);
    }
}

async function getDeliveries() {
    let call_url = "api/deliveries/list.php";
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

function showNewDeliveryPopup() {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<h2>Add New Delivery</h2>'))
            .append($('<br>'))
            .append($('<label for="createOrderId">Order ID</label>'))
            .append($('<input type="text" name="order_id" id="createOrderId"/>'))
            .append($('<br>'))
            .append($('<label for="createCompanyId">Company ID</label>'))
            .append($('<input type="text" name="company_id" id="createCompanyId"/>'))
            .append($('<br>'))
            .append($('<label for="createCost">Extra Cost</label>'))
            .append($('<input type="text" name="cost" id="createCost"/>'))
            .append($('<br>'))
            .append($('<button>Create</button>').click(function() {
                createDelivery().then(function() {
                    form.remove();
                });
            }))
            .append($('<button>Cancel</button>').click(function() {
                form.remove();
            }))
        );
    $('main').append(form);
}

function showEditDeliveryPopup(delivery) {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<h2>Edit Delivery</h2>'))
            .append($('<br>'))
            .append($('<label for="editCompanyId">Company ID</label>'))
            .append($('<input type="text" name="company_id" id="editCompanyId"/>'))
            .append($('<br>'))
            .append($('<label for="editCost">Extra Cost</label>'))
            .append($('<input type="text" name="cost" id="editCost"/>'))
            .append($('<br>'))
            .append($('<label for="editDelivered">Delivered?</label>'))
            .append($('<input type="checkbox" name="delivered" id="editDelivered"/>'))
            .append($('<br>'))
            .append($('<button>Edit</button>').click(function() {
                editDelivery(delivery).then(function() {
                    form.remove();
                });
            }))
            .append($('<button>Cancel</button>').click(function() {
                form.remove();
            }))
        );
    $('main').append(form);
}

function showRemoveDeliveryPopup(delivery) {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<h2>Remove Delivery</h2>'))
            .append($('<br>'))
            .append($('<label for="removeId">ID</label>'))
            .append($('<input type="text" name="id" id="removeId"/>'))
            .append($('<br>'))
            .append($('<button>Remove</button>').click(function() {
                if(delivery === $('#removeId').val()) {
                    removeDelivery(delivery).then(function() {
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

async function createDelivery() {
    let call_url = "api/deliveries/create.php";
    let values = {
        order_id: encodeURIComponent($('#createOrderId').val()),
        company_id: encodeURIComponent($('#createCompanyId').val()),
        cost: encodeURIComponent($('#createCost').val())
    };
    let form = `order_id=${values.order_id}&company_id=${values.company_id}&cost=${values.cost}`;
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
            let info = createSuccess("Created delivery!");
            $('#errors').append(info);
            await getDeliveries();
        } else {
            let error = createError("Could not create delivery!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not create delivery!");
        $('#errors').append(error);
    }
}

async function editDelivery(id) {
    let call_url = "api/deliveries/edit.php";
    let values = {
        id: encodeURIComponent(id),
        company_id: encodeURIComponent($('#editCompanyId').val()),
        cost: encodeURIComponent($('#editCost').val()),
        delivered: encodeURIComponent(($('#editDelivered').prop('checked') ? 1 : 0))
    };
    let form = `id=${values.id}&company_id=${values.company_id}&cost=${values.cost}&delivered=${values.delivered}`;
    try {
        let response = await fetch(call_url,
            {
                method: "POST",
                headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: form
            });
        let json = await response.json();
        if(json.data) {
            let info = createSuccess("Edited delivery!");
            $('#errors').append(info);
            await getDeliveries();
        } else {
            let error = createError("Could not edit delivery!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not edit delivery!");
        $('#errors').append(error);
    }
}

async function removeDelivery(id) {
    console.log(id);
    let call_url = "api/deliveries/delete.php";
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
            let info = createSuccess("Removed delivery!");
            $('#errors').append(info);
            await getDeliveries();
        } else {
            let error = createError("Could not remove delivery!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not remove delivery!");
        $('#errors').append(error);
    }
}

window.onload = function() {
    getDeliveries().then();
};