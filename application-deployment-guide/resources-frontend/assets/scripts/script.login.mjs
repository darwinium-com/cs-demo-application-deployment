import coreServerRequest from "./core.server-request.js";
import coreSiteConfig from "./core.site-config.js";
import coreLocalStorageValues from "./core.local-storage-values.js";
import coreToasts from "./core.toasts.js";

document.addEventListener("DOMContentLoaded", function (event) {
    document.title = "Darwinium Demo: Login";
})
const navigation = function(_location){
    window.location.href = _location;
}
document.getElementById("homeNavButton").addEventListener("click", function (event) {
    navigation("/");
})
document.getElementById("loginNavButton").addEventListener("click", function (event) {
    navigation("/login");
})
document.getElementById("accountNavButton").addEventListener("click", function (event) {
    navigation("/account");
})
document.getElementById("loginForm").addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    const selectedLoginType = document.querySelector('input[name="loginType"]:checked').value;
    let postPayload = {
        type: "login-submit",
        data: {
            email: email,
            password: password,
        }
    }
    if(selectedLoginType === "success") {
        postPayload.result = {
            statusCode: 200,
            data: {
                message: "User is Authorized"
            }
        }
    } else {
        postPayload.result = {
            statusCode: 401,
            data: {
                message: "User Unauthorized"
            }
        }
    }
    coreServerRequest.postWithoutCreds(coreSiteConfig.apiUrl,postPayload,"login-submit").then(
        (response) => {
            const responseOutputCard = document.getElementById("responseOutputCard");
            const responseOutputContent = document.getElementById("responseOutput");
            responseOutputContent.textContent = JSON.stringify(response.body, null, 2);
            responseOutputCard.style.display = "block";
            if(response.statusCode === 200){
                coreLocalStorageValues.setLocal('isAuthenticated',true)
                coreLocalStorageValues.setLocal('authenticatedUser',email)
                coreToasts.toastWithColor('Login Successful!','green')
            } else {
                coreLocalStorageValues.deleteLocal('isAuthenticated');
                coreLocalStorageValues.deleteLocal('authenticatedUser');
                coreToasts.toastWithColor('Login Failed!', 'red')
            }
        },
        (error) => {console.log(error)}
    );
})