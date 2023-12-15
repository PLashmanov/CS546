
document.addEventListener('DOMContentLoaded', function() {
    const detectForm = document.getElementById('detect-form');
    const detectFile = document.getElementById('detectFile');

    detectForm.addEventListener('submit', function (event) {
        var file = detectFile.files[0];
        if (!file || file.type != 'application/pdf'){
            event.preventDefault();
            detectFile.value = '';
            alert("Please upload a pdf file")
        }
    });

});