$(document).on('click', '#logout', function(e) {
    e.preventDefault(); // Prevent any default action if needed
    $.ajax({
        type: 'POST',
        url: '/auth/logout',
        success: function(response) {
            window.location.href = '/login.html';
        },
        error: function(ex) {
            alert('Logout failed: ' + ex.responseText);
        }
    });
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
                    alert("successfully update profile")
                    window.location.href = '/';
                },
                error: function(ex) {
                    $('#error-message').text('Update Profile failed: ' + JSON.parse(ex.responseText).error);
                }
            });
    });
});

$(document).ready(function() {
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        $.ajax({
            url: '/user/getuserinfo',
            type: 'GET',
            success: function(response) {
                if (response.user && response.user.firstName) {
                    $('#userName').text(response.user.firstName);
                }
            },
            error: function(ex) {
                $('#error-message').text('Getting user data failed: ' + JSON.parse(ex.responseText).error);
            }
        });
    }
});

