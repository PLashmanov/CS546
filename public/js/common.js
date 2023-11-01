$(function(){
    $("#nav-placeholder").load("nav.html", function() {
        $('#logout').click(function() {
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
    const dateField = document.getElementById('FraudDate');
    const restFields = ['firstName', 'lastName', 'email', 'website', 'phoneNumber'];

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

//Log out navbar

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
});



