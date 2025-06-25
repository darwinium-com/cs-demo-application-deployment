export default {
    unavailableAlert: function(_requestName){
        return {
            type: 'unavailable',
            apiRequest: typeof(_requestName) !== 'undefined' ? _requestName : 'unknown',
            announce: true,
            toast: false,
            alertMessage: {
                title: 'Server API Unavailable',
                message: 'It looks like the API Server is unavailable',
            },
            logout: true
        }
    }
}