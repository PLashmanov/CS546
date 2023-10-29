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