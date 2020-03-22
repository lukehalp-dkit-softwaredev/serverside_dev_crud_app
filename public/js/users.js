function updateWebpage(response) {
    if(response.data) {
        $('#users').empty();
        for(let i=0;i<response.data.length;i++) {
            let user = response.data[i];
            let node = $('<tr></tr>');
            node.append($('<td></td>').text(user.name));
            node.append($('<td></td>').text(user.email));
            let edit = $('<i class="material-icons">create</i>').click(function() {
                showEditUserPopup(user.email);
            });
            node.append($('<td></td>').append(edit));
            let remove = $('<i class="material-icons">clear</i>').click(function () {
                showRemoveUserPopup(user.email);
            });
            node.append($('<td></td>').append(remove));
            $('#users').append(node);
        }
    } else {
        let error = createError("Could not fetch users!");
        $('#errors').append(error);
    }
}

async function getUsers() {
    let call_url = "api/users/list.php";
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

function showNewUserPopup() {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<label for="createEmail">Email</label>'))
            .append($('<input type="text" name="email" id="createEmail"/>'))
            .append($('<br>'))
            .append($('<label for="createName">Name</label>'))
            .append($('<input type="text" name="name" id="createName"/>'))
            .append($('<br>'))
            .append($('<label for="createPassword">Password</label>'))
            .append($('<input type="password" name="password" id="createPassword"/>'))
            .append($('<br>'))
            .append($('<button>Create</button>').click(function() {
                createUser().then(function() {
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

function showEditUserPopup(user) {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<label for="editName">Name</label>'))
            .append($('<input type="text" name="name" id="editName"/>'))
            .append($('<br>'))
            .append($('<label for="editPassword">Password</label>'))
            .append($('<input type="password" name="password" id="editPassword"/>'))
            .append($('<br>'))
            .append($('<button>Edit</button>').click(function() {
                editUser(user).then(function() {
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

function showRemoveUserPopup(user) {
    let form = $('<div class="popup"></div>')
        .append($('<div class="popup-content"></div>')
            .append($('<label for="removeEmail">Email</label>'))
            .append($('<input type="text" name="email" id="removeEmail"/>'))
            .append($('<br>'))
            .append($('<button>Remove</button>').click(function() {
                if(user === $('#removeEmail').val()) {
                    removeUser(user).then(function() {
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

async function createUser() {
    let call_url = "api/users/create.php";
    let values = {
        email: encodeURIComponent($('#createEmail').val()),
        name: encodeURIComponent($('#createName').val()),
        password: encodeURIComponent($('#createPassword').val())
    };
    let form = `email=${values.email}&name=${values.name}&password=${values.password}`;
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
            let info = createSuccess("Created user!");
            $('#errors').append(info);
            await getUsers();
        } else {
            let error = createError("Could not create user!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not create user!");
        $('#errors').append(error);
    }
}

async function editUser(email) {
    let call_url = "api/users/edit.php";
    let values = {
        email: encodeURIComponent(email),
        name: encodeURIComponent($('#editName').val()),
        password: encodeURIComponent($('#editPassword').val())
    };
    let form = `email=${values.email}&name=${values.name}&password=${values.password}`;
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
            let info = createSuccess("Edited user!");
            $('#errors').append(info);
            await getUsers();
        } else {
            let error = createError("Could not edit user!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not edit user!");
        $('#errors').append(error);
    }
}

async function removeUser(email) {
    let call_url = "api/users/delete.php";
    let form = `email=${encodeURIComponent(email)}`;
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
            let info = createSuccess("Removed user!");
            $('#errors').append(info);
            await getUsers();
        } else {
            let error = createError("Could not remove user!");
            $('#errors').append(error);
        }
    } catch (e) {
        let error = createError("Could not remove user!");
        $('#errors').append(error);
    }
}

window.onload = function() {
    getUsers().then();
};