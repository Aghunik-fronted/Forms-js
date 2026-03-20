const form = document.querySelector('form');
const userInput = document.querySelector('[name="username"]');
const emailInput = document.querySelector('[name="email"]');
const userAlert = document.querySelector('.username-error');
const emailAlert = document.querySelector('.email-error');

const showError = (input, container, message) => {
    input.style.border = '2px solid red';
    container.textContent = message;
};

const showSuccess = (input, container) => {
    input.style.border = '2px solid green';
    container.textContent = '';
};

const validateEmail = (email) => {
    const regex = /^[\w.-]+@[a-z]+\.[a-z]{2,6}$/;
    return regex.test(email);
};

// Функция валидации username
const validateUsername = (username) => {
    if (!username) {
        return 'Поле обязательно';
    } else if (username.length <= 2) {
        return 'Поле должно быть больше 2 символов';
    }
    return null;
};

// Функция валидации email
const validateEmailInput = (email) => {
    if (!email) {
        return 'Email обязателен';
    } else if (!validateEmail(email)) {
        return 'Email введен некорректно';
    }
    return null;
};

// Валидация при потере фокуса (Live)
userInput.addEventListener('blur', () => {
    const errorMessage = validateUsername(userInput.value);
    if (errorMessage) {
        showError(userInput, userAlert, errorMessage);
    } else {
        showSuccess(userInput, userAlert);
    }
});

emailInput.addEventListener('blur', () => {
    const errorMessage = validateEmailInput(emailInput.value);
    if (errorMessage) {
        showError(emailInput, emailAlert, errorMessage);
    } else {
        showSuccess(emailInput, emailAlert);
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Повторная валидация при отправке формы
    const usernameError = validateUsername(data.username);
    if (usernameError) {
        showError(userInput, userAlert, usernameError);
        isValid = false;
    }

    const emailError = validateEmailInput(data.email);
    if (emailError) {
        showError(emailInput, emailAlert, emailError);
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            alert('Произошла ошибка, попробуйте ещё');
        }
        return response.json();
    })
    .then(() => {
        alert('Форма отправлена');
        form.reset();
        showSuccess(userInput, userAlert);
        showSuccess(emailInput, emailAlert);
    })
    .catch(() => {
        alert('Произошла ошибка сети, попробуйте ещё');
    });
});