import coreServerRequest from "./core.server-request.js";
import coreSiteConfig from "./core.site-config.js";
import coreLocalStorageValues from "./core.local-storage-values.js";
import coreToasts from "./core.toasts.js";
document.addEventListener("DOMContentLoaded", function (event) {
    document.title = "Darwinium Demo: Account";
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
document.getElementById("logoutButton").addEventListener('click', function (event) {
    event.preventDefault();
    const email = coreLocalStorageValues.getKey('authenticatedUser');
    if(email){
        let postPayload = {
            type: "logout",
            data: {
                email: email
            },
            result: {
                statusCode: 200,
                data: {
                    message: "User is logged out."
                }
            }
        }
        coreServerRequest.postWithoutCreds(coreSiteConfig.apiUrl,postPayload,"logout").then(
            (response) => {
                const responseOutputCard = document.getElementById("responseOutputCard");
                const responseOutputContent = document.getElementById("responseOutput");
                responseOutputContent.textContent = JSON.stringify(response.body, null, 2);
                responseOutputCard.style.display = "block";
                if(response.statusCode === 200){
                    coreLocalStorageValues.deleteLocal('isAuthenticated');
                    coreLocalStorageValues.deleteLocal('authenticatedUser');
                    coreToasts.toastWithColor('Logout Successful!','green')
                } else {
                    coreToasts.toastWithColor('Logout Failed!', 'red')
                }
            },
            (error) => {console.log(error)}
        );
    } else {
        coreToasts.toastWithColor('There is no authenticated user!', 'red')
    }

})