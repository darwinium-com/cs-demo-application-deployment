import coreToastsSource from "./core.toasts-source.js";

export default {
    standardToast: function(_message){
        return coreToastsSource({
            text: _message,
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            style: {
                background: "#4086e4"
            }
        }).showToast();
    },
    toastWithColor: function(_message,_color){
        return coreToastsSource({
            text: _message,
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            style: {
                background: _color
            }
        }).showToast();
    }
}