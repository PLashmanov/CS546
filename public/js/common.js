$(document).on('click', '#logout', function(e) {
    e.preventDefault();
    $(this).prop('disabled', true); 
    $.ajax({
        type: 'POST',
        url: '/auth/logout',
        success: function(response) {
            window.location.href = '/user/login';
        },
        error: function(ex) {
            alert('Logout failed: ' + ex.responseText);
            $(this).prop('disabled', false); 
        }
    });
});

$(document).ready(function() {
    $('#registrationForm').on('submit', function(event) {
        event.preventDefault();
        $('#registrationForm button[type="submit"]').prop('disabled', true);
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
                    $('#registrationForm button[type="submit"]').prop('disabled', false);
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
                    window.location.href = '/user/login';
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
        $('#updateProfileForm button[type="submit"]').prop('disabled', true);
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
                    $('#updateProfileForm button[type="submit"]').prop('disabled', false);
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
$(document).ready(function() {
    $('#loginForm').submit(function(e) {
        e.preventDefault(); 
        $('#loginForm button[type="submit"]').prop('disabled', true);
        const formData = {
            email: $('#email').val(),
            password: $('#password').val()
        };
        $.ajax({
            type: 'POST',
            url: '/auth/login',
            data: JSON.stringify(formData), 
            contentType: 'application/json', 
            success: function(response) {
                const user = response.message;
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/';
            },
            error: function(ex) {
                $('#error-message').text('Login failed: ' + JSON.parse(ex.responseText).error);
                $('#loginForm button[type="submit"]').prop('disabled', false);
            }
        });
    });
});
$(document).ready(function() {
    $('#reportForm').on('submit', function(event) {
        event.preventDefault();
        $('#reportForm button[type="submit"]').prop('disabled', true);
            $.ajax({
                url: '/fraudster/report',
                type: 'POST',
                contentType: 'application/json', 
                data: JSON.stringify({ 
                    firstName: $('#rep-name').val(),
                    email: $('#rep-email').val(),
                    ein: $('#rep-ein').val(),
                    ssn: $('#rep-ssn').val(),
                    itin: $('#rep-itin').val(),
                    phoneNumber: $('#rep-phoneNumber').val(),
                    fraudType: $('#rep-fraudType').val()
                }),
                success: function(response) {
                    alert("Fraudster Reported! ")
                    window.location.href = '/';
                },
                error: function(ex) {
                    $('#error-message').text('Report failed: ' + JSON.parse(ex.responseText).error);
                    $('#reportForm button[type="submit"]').prop('disabled', false);
                }
            });
    });
});

