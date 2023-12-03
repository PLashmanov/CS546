function validateEmailClient(email) {
    const validEmail = /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$)([a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*)@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})$/;
    return email.match(validEmail);
}

function validatePhoneNumberClient(phone) {
    const phonePattern = /^\+1\d{10}$/;
    return phonePattern.test(phone);
}

function validateNameClient(name) {
    return name.length >= 2 && name.length <= 20;
}

function validateCompanyNameClient(companyName) {
    return companyName.length === 0 || (companyName.length >= 3 && companyName.length <= 50);
}

function validatePasswordClient(password) {
    const minLength = 8;
    const maxLength = 15;
    const letters = /[A-Za-z]/;
    const numbers = /\d/g;
    const specialCharacters = /[!@#$%^&*(),?]/;
    return password.length >= minLength && password.length <= maxLength &&
           password.match(letters) && password.match(numbers) &&
           password.match(specialCharacters);
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    
    document.getElementById('reg-phoneNumber').addEventListener('input', function () { 
        if (!this.value.startsWith('+1')) {
            this.value = '+1' + this.value.replace(/[^\d]/g, '').slice(1);
        }
    });
    
    form.addEventListener('submit', function (event) {
        let isValid = true;
        const firstName = document.getElementById('reg-firstName').value;
        const lastName = document.getElementById('reg-lastName').value;
        const phoneNumber = document.getElementById('reg-phoneNumber').value;
        const email = document.getElementById('reg-email').value;
        const companyName = document.getElementById('company-name').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        // Validate first name
        if (!validateNameClient(firstName)) {
            const firstNameError = document.getElementById('first-name-error');
            firstNameError.textContent = 'Invalid first name';
            firstNameError.style.display = 'block'; 
        } else {
            document.getElementById('first-name-error').style.display = 'none';
            document.getElementById('first-name-error').textContent = '';
        }
        if (!validateNameClient(lastName)) {
            const lastNameError = document.getElementById('last-name-error');
            lastNameError.textContent = 'Invalid Last Name';
            lastNameError.style.display = 'block';
        } else {
            document.getElementById('last-name-error').style.display = 'none';
            document.getElementById('last-name-error').textContent = '';
        }
        if (!validateEmailClient(email)) {
            const emailError = document.getElementById('email-error');
            emailError.textContent = 'Invalid email';
            emailError.style.display = 'block';
        } else {
            document.getElementById('email-error').style.display = 'none';
            document.getElementById('email-error').textContent = '';
        }
        if (!validatePasswordClient(password)) {
            const passwordError = document.getElementById('password-error');
            passwordError.textContent = 'Invalid password';
            passwordError.style.display = 'block';
        } else {
            document.getElementById('password-error').style.display = 'none';
            document.getElementById('password-error').textContent = '';
        }
        if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
            document.getElementById('confirm-password-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('confirm-password-error').style.display = 'none';
            document.getElementById('confirm-password-error').textContent = '';
        }
        if (!validateCompanyNameClient(companyName)) {
            document.getElementById('company-name-error').textContent = 'Company name must be between 3 and 50 characters';
            document.getElementById('company-name-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('company-name-error').style.display = 'none';
            document.getElementById('company-name-error').textContent = '';
        }
        if (!validatePhoneNumberClient(phoneNumber)) {
            document.getElementById('phone-error').textContent = 'Invalid phone number';
            document.getElementById('phone-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('phone-error').style.display = 'none';
            document.getElementById('phone-error').textContent = '';
        }
       
        if (!isValid) {
            event.preventDefault();
        }
    });
});