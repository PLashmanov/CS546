
function validateNameClient(name) {
    const validFormat = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    if (!name || name.trim().length === 0) {
        return true;
    }
    if (name.trim().length < 2 || name.trim().length > 20) {
        return false;
    }
    if (!validFormat.test(name.trim())) {
        return false;
    }
    return true;
}
function validateEmailClient(email) {
    const validEmail = /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$)([a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*)@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})$/;
    return email.trim() === '' || validEmail.test(email);
}
function validatePhoneNumberClient(phone) {
    if (phone.trim() === '' || phone.trim() === '+1') {
        return true;
    }

    const phonePattern = /^\+1\d{10}$/;
    return phonePattern.test(phone);
}
function validateEINClient(ein) {
    const einPattern = /^\d{2}-\d{7}$/;
    return einPattern.test(ein) || ein.trim() === '';
}
function validateITINClient(itin) {
    const itinPattern = /^9\d{2}-\d{2}-\d{4}$/;
    return itinPattern.test(itin) || itin.trim() === '';
}
function validateSSNClient(ssn) {
    const ssnPattern = /^(?!666|000|9\d\d)\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
    return ssnPattern.test(ssn) || ssn.trim() === '';
}
function validateReport() {
    const reportIds = ['rep-ein', 'rep-itin', 'rep-ssn', 'rep-email', 'rep-phoneNumber'];
    const oneFilled = reportIds.some(fieldId => {
        const field = document.getElementById(fieldId);
        return field && (field.value.trim() !== '' || field.value.trim() === '+1');
    });


    const reportError = document.getElementById('report-error');
    if (!oneFilled) {
        reportError.textContent = 'Report failed: one of the following must be provided: EIN, ITIN, SSN, email or phone.';
        reportError.style.display = 'block';
        return false;
    } else {
        reportError.style.display = 'none';
    }

    return true;
}



document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('reportForm');
    document.getElementById('rep-phoneNumber').addEventListener('focus', function () {
        if (this.value.trim() === '') {
            this.value = '+1';
        }
    });
    document.getElementById('rep-phoneNumber').addEventListener('blur', function () {
        if (this.value.trim() === '+1') {
            this.value = '';
        }
    });
    document.getElementById('rep-phoneNumber').addEventListener('input', function () {
        if (!this.value.startsWith('+1')) {
            this.value = '+1' + this.value.replace(/[^\d]/g, '').slice(1);
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;
        const ein = document.getElementById('rep-ein').value;
        const itin = document.getElementById('rep-itin').value;
        const ssn = document.getElementById('rep-ssn').value;
        const email = document.getElementById('rep-email').value;
        const phoneNumber = document.getElementById('rep-phoneNumber').value;
        const name = document.getElementById('rep-name').value;

        if (!validateNameClient(name)) {
            const nameError = document.getElementById('name-error');
            nameError.textContent = 'Invalid Name';
            nameError.style.display = 'block';
        } else {
            document.getElementById('name-error').style.display = 'none';
            document.getElementById('name-error').textContent = '';
        }

        if (!validateEINClient(ein)) {
            const einError = document.getElementById('ein-error');
            einError.textContent = 'Invalid EIN'
            einError.style.display = 'block';
        } else {
            document.getElementById('ein-error').style.display = 'none';
            document.getElementById('ein-error').textContent = '';
        }

        if (!validateITINClient(itin)) {
            const itinError = document.getElementById('itin-error');
            itinError.textContent = 'Invalid ITIN'
            itinError.style.display = 'block';
        } else {
            document.getElementById('itin-error').style.display = 'none';
            document.getElementById('itin-error').textContent = '';
        }

        if (!validateSSNClient(ssn)) {
            const ssnError = document.getElementById('ssn-error');
            ssnError.textContent = 'Invalid SSN'
            ssnError.style.display = 'block';
        } else {
            document.getElementById('ssn-error').style.display = 'none';
            document.getElementById('ssn-error').textContent = '';
        }

        if (!validateEmailClient(email)) {
            const emailError = document.getElementById('email-error');
            emailError.textContent = 'Invalid E-Mail'
            emailError.style.display = 'block';
        } else {
            document.getElementById('email-error').style.display = 'none';
            document.getElementById('email-error').textContent = '';
        }

        if (!validatePhoneNumberClient(phoneNumber)) {
            const phoneError = document.getElementById('phone-error');
            phoneError.textContent = 'Invalid Phone Number'
            phoneError.style.display = 'block';
        } else {
            document.getElementById('phone-error').style.display = 'none';
            document.getElementById('phone-error').textContent = '';
        }

        if (!validateReport()) {
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();

        } else {
        }
    });
});




