/*import * as validations from '../src/validations/Validations.js'
 we will need to add the server side and the ajax requests also routes and validations

document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
    const searchCriteria = document.getElementById('search-criteria');
    //const searchQuery = document.getElementById('search-query');
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


/*function searchInputValidation() {

    if(searchCriteria === 'phone'){
        const phonePatt = validations.validatePhoneNumber();
        if(!phonePatt.test(searchQuery)){
            errorMessage.textContent = 'Invalid Phone number format';
            return false;
        }
    }
}*/

