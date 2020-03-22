function updateWebpage(response) {
    if(response.data) {
        $('#companies').empty();
        for(let i=0;i<response.data.length;i++) {
            let company = response.data[i];
            let node = $('<tr></tr>');
            node.append($('<td></td>').text(company.id));
            node.append($('<td></td>').text(company.name));
            node.append($('<td></td>').text(company.email));
            node.append($('<td></td>').text(company.max_capacity));
            node.append($('<td></td>').text(company.cost_per_kg));
            let edit = $('<i class="material-icons">create</i>').click(function() {
                showEditCompanyPopup(company.id);
            });
            node.append($('<td></td>').append(edit));
            let remove = $('<i class="material-icons">clear</i>').click(function () {
                showRemoveCompanyPopup(company);
            });
            node.append($('<td></td>').append(remove));
            $('#companies').append(node);
        }
    } else {
        let error = createError("Could not fetch companies!");
        $('#errors').append(error);
    }
}

async function getCompanies() {
    let call_url = "api/companies/list.php";
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

function showNewCompanyPopup() {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<label for="createEmail">Email</label>'))
            .append($('<input type="text" name="email" id="createEmail"/>'))
            .append($('<br>'))
            .append($('<label for="createName">Name</label>'))
            .append($('<input type="text" name="name" id="createName"/>'))
            .append($('<br>'))
            .append($('<label for="createMaxCapacity">Max Capacity</label>'))
            .append($('<input type="text" name="max_capacity" id="createMaxCapacity"/>'))
            .append($('<br>'))
            .append($('<label for="createCostPerKg">Cost Per Kg</label>'))
            .append($('<input type="text" name="cost_per_kg" id="createCostPerKg"/>'))
            .append($('<br>'))
            .append($('<button>Create</button>').click(function() {
                createCompany().then(function() {
                    form.remove();
                });
            }))
            .append($('<br>'))
            .append($('<button>Cancel</button>').click(function() {
                form.remove();
            }))
        );
    $('main').append(form);
}

function showEditCompanyPopup(company) {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<label for="editEmail">Email</label>'))
            .append($('<input type="text" name="email" id="editEmail"/>'))
            .append($('<br>'))
            .append($('<label for="editName">Name</label>'))
            .append($('<input type="text" name="name" id="editName"/>'))
            .append($('<br>'))
            .append($('<label for="editMaxCapacity">Max Capacity</label>'))
            .append($('<input type="text" name="max_capacity" id="editMaxCapacity"/>'))
            .append($('<br>'))
            .append($('<label for="editCostPerKg">Cost Per Kg</label>'))
            .append($('<input type="text" name="cost_per_kg" id="editCostPerKg"/>'))
            .append($('<br>'))
            .append($('<button>Edit</button>').click(function() {
                editCompany(company).then(function() {
                    form.remove();
                });
            }))
            .append($('<br>'))
            .append($('<button>Cancel</button>').click(function() {
                form.remove();
            }))
        );
    $('main').append(form);
}

function showRemoveCompanyPopup(company) {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<label for="removeEmail">Email</label>'))
            .append($('<input type="text" name="email" id="removeEmail"/>'))
            .append($('<br>'))
            .append($('<button>Remove</button>').click(function() {
                if(company.email === $('#removeEmail').val()) {
                    removeCompany(company).then(function() {
                        form.remove();
                    });
                }
            }))
            .append($('<br>'))
            .append($('<button>Cancel</button>').click(function() {
                form.remove();
            }))
        );
    $('main').append(form);
}

async function createCompany() {
    let call_url = "api/companies/create.php";
    let values = {
        email: encodeURIComponent($('#createEmail').val()),
        name: encodeURIComponent($('#createName').val()),
        max_capacity: encodeURIComponent($('#createMaxCapacity').val()),
        cost_per_kg: encodeURIComponent($('#createCostPerKg').val())
    };
    let form = `email=${values.email}&name=${values.name}&max_capacity=${values.max_capacity}&cost_per_kg=${values.cost_per_kg}`;
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
            let info = createSuccess("Created company!");
            $('#errors').append(info);
            await getCompanies();
        } else {
            let error = createError("Could not create company!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not create company!");
        $('#errors').append(error);
    }
}

async function editCompany(id) {
    let call_url = "api/companies/edit.php";
    let values = {
        id: encodeURIComponent(id),
        email: encodeURIComponent($('#editEmail').val()),
        name: encodeURIComponent($('#editName').val()),
        max_capacity: encodeURIComponent($('#editMaxCapacity').val()),
        cost_per_kg: encodeURIComponent($('#editCostPerKg').val())
    };
    let form = `id=${values.id}&email=${values.email}&name=${values.name}&max_capacity=${values.max_capacity}&cost_per_kg=${values.cost_per_kg}`;
    try {
        let response = await fetch(call_url,
            {
                method: "POST",
                headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: form
            });
        if(response.status === 200) {
            let json = await response.json();
            console.log(json);
            if(json.data) {
                let info = createSuccess("Edited company!");
                $('#errors').append(info);
                await getCompanies();
            } else {
                let error = createError("Could not edit company!");
                $('#errors').append(error);
            }
        } else {
            let text = await response.text();
            console.log(text);
            let error = createError("Could not edit company!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not edit company!");
        $('#errors').append(error);
    }
}

async function removeCompany(company) {
    let call_url = "api/companies/delete.php";
    let form = `id=${encodeURIComponent(company.id)}`;
    try {
        let response = await fetch(call_url,
            {
                method: "POST",
                headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: form
            });
        let json = await response.json();
        if(json.data) {
            let info = createSuccess("Removed company!");
            $('#errors').append(info);
            await getCompanies();
        } else {
            let error = createError("Could not remove company!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not remove company!");
        $('#errors').append(error);
    }
}

window.onload = function() {
    getCompanies().then();
};