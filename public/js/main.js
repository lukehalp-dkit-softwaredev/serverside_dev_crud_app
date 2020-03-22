function createError(message) {
    let span = $('<span></span>').text(message);
    let close = $('<i class="material-icons">clear</i>');
    let error = $('<div></div>').addClass('error').append(span);
    close.click(function() {
       error.remove();
    });
    error.append(close);
    return error;
}

function createWarning(message) {
    let span = $('<span></span>').text(message);
    let close = $('<i class="material-icons">clear</i>');
    let error = $('<div></div>').addClass('warning').append(span);
    close.click(function() {
        error.remove();
    });
    error.append(close);
    return error;
}

function createSuccess(message) {
    let span = $('<span></span>').text(message);
    let close = $('<i class="material-icons">clear</i>');
    let error = $('<div></div>').addClass('success').append(span);
    close.click(function() {
        error.remove();
    });
    error.append(close);
    return error;
}