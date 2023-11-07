

document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
   
    //const searchResults = document.getElementById('search-results');

    searchBar.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const selectedCriteria = searchCriteria.value;
        const query = searchQuery.value;
    //return the results
        
       
    });
});
// ********** Work in Progress. Ignore for now********* validation for the input here*/

const einLook = document.getElementById('look-ein').value;
const tinLook = document.getElementById('look-tin').value;
const ssnLook = document.getElementById('look-ssn').value;
const nameLook = document.getElementById('look-name').value;
const emailLook = document.getElementById('look-email').value;
const phoneLook = document.getElementById('look-phone').value;


export function searchValidation() {
    const searchCriteria = document.getElementById('search-criteria');
    const searchQuery = document.getElementById('search-query');

    if(searchCriteria === 'phone'){
        const phoneP =  /^\d{10}$/;
        if(!phoneP.test(searchQuery)){
            errorMessage.textContent = 'Invalid Phone number format';
            return false;
        }
    } else if (searchCriteria === 'email') {
        const emailP = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!emailP.test(searchQuery)) {
            errorMessage.textContent = 'Invalid email format';
            return false;
        }
    } else if (searchCriteria === 'name') {
        const nameP = /^[A-Za-z\s]+$/;
        if(!nameP.test(searchQuery)){
            errorMessage.textContent = 'Invalid name format';
            return false;
        }
    } else if (searchCriteria === 'ein') {
        const einP = /^\d{9}$/;
        if(!einP.test(searchQuery)){
            errorMessage.textContent = 'Invalid name EIN format - 9 digits required';
            return false;
        }
    } else if (searchCriteria === 'itin') {
        const itinP = /^\d{9}$/;
        if(!itinP.test(searchQuery)){
            errorMessage.textContent = 'Invalid name ITIN format - 9 digits required';
            return false;
        }
    }else if (searchCriteria === 'ssn') {
        const ssnP = /^\d{9}$/;
        if(!ssnP.test(searchQuery)){
            errorMessage.textContent = 'Invalid name SSN format - 9 digits required';
            return false;
        }
    }
    return true;
}


