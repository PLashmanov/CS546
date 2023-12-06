function validateNameClient(name) {
    const validFormat = /^[A-Za-z ]+$/;
    return (name.trim().length >= 2 && name.trim().length <= 20) && validFormat.test(name.trim());
}

function validateEmailClient(email) {
    const validEmail = /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$)([a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*)@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})$/;
    return email.trim() === '' || validEmail.test(email);
}

function validateFeedbackText(feedbackText) {
    const minLength = 10;
    const maxLength = 250;
    const minLetterPercentage = 0.6;

    if (!feedbackText || feedbackText.trim().length < minLength || feedbackText.trim().length > maxLength) {
        
        return false;
    }

    const lettersCount = feedbackText.split('').filter(char => char.match(/[A-Za-z]/)).length;
    const letterPercentage = lettersCount / feedbackText.trim().length;
    if (letterPercentage < minLetterPercentage) {
        return false;
    }
    return feedbackText;
}


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('feedbackForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;

        const feedbackName = document.getElementById('feed-name').value;
        const feedbackEmail = document.getElementById('feed-email').value;
        const feedbackText = document.getElementById('feedbackText').value;

        if (!validateNameClient(feedbackName)) {
            const nameError = document.getElementById('name-error');
            nameError.textContent = 'Invalid Name';
            nameError.style.display = 'block';
        }else {
            document.getElementById('name-error').style.display = 'none';
            document.getElementById('name-error').textContent = '';
        }

        if (!validateEmailClient(feedbackEmail)) {
            const emailError = document.getElementById('email-error');
            emailError.textContent = 'Invalid Email';
            emailError.style.display = 'block';
        }else {
            document.getElementById('email-error').style.display = 'none';
            document.getElementById('email-error').textContent = '';
        }


        if (!validateFeedbackText(feedbackText)) {
            const feedbackTextError = document.getElementById('text-error');
            feedbackTextError.textContent = 'Feedback text must be 10 to 250 characters long and at least 80% letters.';
            feedbackTextError.style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('text-error').style.display = 'none';
            document.getElementById('text-error').textContent = '';
        }
        if (isValid) {
            $.ajax({
                url: '/feedback/submit-feedback',
                type: 'POST',
                contentType: 'application/json', 
                data: JSON.stringify({ 
                    name: feedbackName,
                    email: feedbackEmail,
                    feedback: feedbackText
                }),
                success: function(response) {
                    alert("Feedback Submitted!");
                    window.location.href = '/';
                },
                error: function(ex) {
                    $('#error-message').text('Feedback failed: ' + JSON.parse(ex.responseText).error);
                }
            });
        }
    });
});