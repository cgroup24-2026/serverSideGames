let currentForm = 'login';
if (localStorage.getItem("loggedInUser") !== null)
    window.location.href = "index.html";

$(document).ready(function () {
    $(".register-link a").click(toggleForms);
    $("#login-form .login-btn").click(authenticate);
    $("#register-form .login-btn").click(registerUser);

})

function registerUser() {
    const name = $("#reg-name").val();
    const email = $("#reg-email").val();
    const password = $("#reg-password").val();

    if (!isValidName(name)) {
        $("#register-error").text("Name must contain only letters and at least 2 characters").show();
        return
    }
    else if (!isValidEmail(email)) {
        $("#register-error").text("Email format is incorrect!").show();
        return
    }
    else if (!isValidPassword(password)) {
        $("#register-error").text("Password must be at least 8 characters, include 1 uppercase letter and 1 number!").show();
        return
    }
    else {
        $("#register-error").text("").hide();
    }

    const user = {
        name: name,
        email: email,
        password: password
    };

    ajaxCall("POST", API_ROUTES.usersApi + '/Register', JSON.stringify(user),
        function (data) {
            if (data) {
                console.log(data);
                window.location.href = "login.html";
            }
            else {
                $("#register-error").text("User registration failed. Email already exists").show();
            }
        },
        function (data) {
            $("#register-error").text(data).show();
        }
    );
}

function authenticate() {
    const email = $("#email").val();
    const password = $("#password").val();

    if (!isValidEmail(email)) {
        $("#login-error").text("Email format is incorrect!").show();
        return
    }
    else if (!isValidPassword(password)) {
        $("#login-error").text("Password must be at least 8 characters, include 1 uppercase letter and 1 number!").show();
        return
    }
    else {
        $("#login-error").hide();
    }

    const LoginInfo = {
        email: email,
        password: password
    };

    ajaxCall("POST", API_ROUTES.usersApi+'/login', JSON.stringify(LoginInfo),
        function (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            window.location.href = "index.html";
        },
        function () {
            $("#login-error").text("Invalid email or password. Please try again.").show();
        }
    );
}

function toggleForms(event) {
    event.preventDefault();
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    if (currentForm === 'login') {
        loginSection.style.display = 'none';
        registerSection.style.display = 'flex';
        currentForm = 'register'
    } else {
        registerSection.style.display = 'none';
        loginSection.style.display = 'flex';
        currentForm = 'login'
    }
}
function isValidName(name) {
    const regex = /^[A-Za-z]{2,}$/;
    return regex.test(name);
}
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
}

