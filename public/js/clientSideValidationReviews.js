function validateNickname(name) {
    const validFormat = /^[A-Za-z]+$/;

    if (!name || name.trim().length === 0 || !validFormat.test(name.trim())) {
        return "Nickname should be 2 to 20 characters long and only contain letters.";
    }
    if (name.trim().length < 2 || name.trim().length > 20) {
        return "Nickname should be 2 to 20 characters long and only contain letters.";
    }
    return '';
}

function validateBody(body) {
    if (!body || body.trim().length === 0) {
        return "Review text must be 10 to 250 characters long.";
    }
    if (body.trim().length < 10 || body.trim().length > 250) {
        return "Review text must be 10 to 250 characters long.";
    }
    const lettersCount = body.split('').filter(char => char.match(/[A-Za-z]/)).length;

    if ((lettersCount / body.length) < 0.8) {
        return "At least 80% of the characters in Review text must be letters.";
    }
    return '';
}

let reviewForm = document.getElementById('reviews-form');

if (reviewForm) {
    const reviewError = document.getElementById("reviewError");
    const nickName = document.getElementById("nickName");
    const reviewBody = document.getElementById("reviewBody");

    reviewForm.addEventListener('submit', (event) => {
        reviewError.innerHTML = '';
        let errors = [];
        const nickNameError = validateNickname(nickName.value);
        if (nickNameError) errors.push(nickNameError);
        const bodyError = validateBody(reviewBody.value);
        if (bodyError) errors.push(bodyError);

        if (errors.length > 0) {
            event.preventDefault();
            reviewError.innerHTML = errors.join(' ');
            reviewError.style.display = 'block';
        }
    })
}