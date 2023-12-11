
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-bar').addEventListener('submit', searchValidation);
    const searchCriteria = document.getElementById('search-criteria');
    const searchQuery = document.getElementById('search-query');

    searchQuery.addEventListener('focus', function() {
        if (searchCriteria.value === 'phone' && !this.value.startsWith('+1')) {
            this.value = '+1' + this.value.replace(/[^\d]/g, '').slice(1);
        }
    });
    searchQuery.addEventListener('blur', function() {
        if (searchCriteria.value === 'phone' && this.value === '+1') {
            this.value = '';
        }
    });
});


function searchValidation(event) {
    const lookupForm = document.getElementById('search-bar');
    const searchCriteria = document.getElementById('search-criteria').value;
    const searchQuery = document.getElementById('search-query').value;
    let isValid = true;
    let errorMessage = '';

    switch (searchCriteria) {
        case 'EIN':
            const einP =  /^\d{2}-\d{7}$/;
            if(!einP.test(searchQuery)){
                errorMessage = 'Invalid EIN format - 9 digits required';
                isValid = false;
            }
            break;
        case 'ITIN':
            const itinP =/^9\d{2}-\d{2}-\d{4}$/;
            if(!itinP.test(searchQuery)){
                errorMessage = 'Invalid ITIN format - 9 digits required';
                isValid = false;
            }
            break;
        case 'SSN':
            const ssnP =/^(?!666|000|9\d\d)\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
            if(!ssnP.test(searchQuery)){
                errorMessage = 'Invalid SSN format - 9 digits required';
                isValid = false;
            }
            break;
        case 'name':
            const nameP = /^[A-Za-z\s]+$/;
            if(!nameP.test(searchQuery)){
                errorMessage = 'Invalid name format';
                isValid = false;
            }else if (searchQuery.length < 2 || searchQuery.length > 20) {
                errorMessage = 'error: name length must be between 2 and 20'
                isValid = false;
            }
            break;
        case 'email':
            const emailP = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if(!emailP.test(searchQuery)) {
                errorMessage = 'Invalid email format';
                isValid = false;
            }
            break;
        case 'phone':
            const phoneP =/^\+1\d{10}$/;
            if(!phoneP.test(searchQuery)){
                errorMessage = 'Invalid Phone number format';
                isValid = false;
        }
            break;
    }

    if (!isValid) {
        event.preventDefault();
        alert(errorMessage);
        lookupForm.reset()
    }
}
