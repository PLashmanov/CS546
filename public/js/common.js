$(document).on('click', '#logout', function(e) {
    e.preventDefault(); // Prevent any default action if needed
    $.ajax({
        type: 'POST',
        url: '/auth/logout',
        success: function(response) {
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        },
        error: function(ex) {
            alert('Logout failed: ' + ex.responseText);
        }
    });
});



$(document).ready(function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.firstName) {
        $('#userName').text(user.firstName);
    }
});
//Navigation bar

 $(function(){
    $("#nav-placeholder").load("nav.html");
 });

 //report functions date mandatory and 1 other mandatory field,needs more validations for email and other stuff.

function validateReport(){
    const dateField = document.getElementById('rep-fraudDate');
    const restFields = ['rep-firstName', 'rep-lastName', 'rep-email', 'rep-website', 'rep-phoneNumber'];

    if(dateField.value.trim() === ''){
        alert('Date is required.');
        return false;
    }

    const oneFieldCompleted = restFields.some(fieldName => {
        const field = document.getElementById(fieldName);
        return field.value.trim() !== '';
    });
    if(!oneFieldCompleted) {
        alert('At least one field is required.');
        return false;
    }
    return true;
}

//Log out navbar test with server , not live server, throwing error.
/*
document.addEventListener('DOMContentLoaded', function () {
    const logout = document.getElementById('logout');
    if (logout) { 
        logout.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = 'index.html';
            alert('Thank you for your contributions. You have been logged out.');
        });
    } else {
        console.error('Element with id "logout" not found in the DOM.');
    }
});*/


$(document).ready(function() {
    $('#registrationForm').on('submit', function(event) {
        event.preventDefault();
            $.ajax({
                url: '/user/register',
                type: 'POST',
                contentType: 'application/json', 
                data: JSON.stringify({ 
                    firstName: $('#reg-firstName').val(),
                    lastName: $('#reg-lastName').val(),
                    email: $('#reg-email').val(),
                    companyName: $('#company-name').val(),
                    phoneNumber: $('#reg-phoneNumber').val(),
                    notifications: $('#reg-notificationEnabled').is(':checked'), 
                    password: $('#reg-password').val(),
                    confirmPassword: $('#reg-confirm-password').val()
                }),
                success: function(response) {
                    const user = response.message;
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = '/';
                },
                error: function(ex) {
                    $('#error-message').text('Registration failed: ' + JSON.parse(ex.responseText).error);
                }
            });
    });
});
$(document).ready(function() {
    $('#deleteAccount').on('click', function(event) { 
        event.preventDefault();
        if (confirm('Are you sure? Frap will sincerly miss you')) {
            $.ajax({
                url: '/user/delete',
                type: 'DELETE',
                contentType: 'application/json', 
                success: function(response) {
                    localStorage.removeItem('user');
                    alert('Account deleted');
                    window.location.href = '/login.html';
                },
                error: function(ex) {
                    $('#error-message').text('Account deletion failed: ' + JSON.parse(ex.responseText).error);
                }
            });
        }
    });
});
$(document).ready(function() {
    $('#updateProfileForm').on('submit', function(event) {
        event.preventDefault();
            $.ajax({
                url: '/user/update',
                type: 'PUT',
                contentType: 'application/json', 
                data: JSON.stringify({ 
                    firstName: $('#firstName').val(),
                    lastName: $('#lastName').val(),
                    email: $('#email').val(),
                    companyName: $('#company').val(),
                    phoneNumber: $('#phoneNumber').val(),
                    notifications: $('#notificationEnabled').is(':checked')
                }),
                success: function(response) {
                    const user = response.message;
                    localStorage.setItem('user', JSON.stringify(user));
                    alert("successfully update profile")
                    window.location.href = '/';
                },
                error: function(ex) {
                    $('#error-message').text('Update Profile failed: ' + JSON.parse(ex.responseText).error);
                }
            });
    });
});