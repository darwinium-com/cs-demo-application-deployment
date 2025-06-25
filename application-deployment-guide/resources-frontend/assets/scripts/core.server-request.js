import serverRequestsErrors from "./core.server-request-errors.js";
const fetchRequest = function(_url,_body,_withCredentials,_requestName){
    return new Promise((resolve,reject)=>{
        let init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_body)
        }
        if(typeof _withCredentials !== 'undefined' && _withCredentials){
            init.credentials = 'include'
        }
        fetch(_url,init)
            .then( (response) => {
                resolve(response)
            })
            .catch( () => reject(serverRequestsErrors.unavailableAlert(_requestName)) )
    })
}

const handleResponseStatus = function(response){
    return new Promise((resolve,reject)=>{
        if(response.status === 200){
            response.json().then( body => resolve(body))
        } else {
            response.json().then( body => reject(body))
        }
    })
}

export default {
    postWithCreds: function(_url,_body,_requestName){
        return new Promise( (resolve,reject)=>{
            fetchRequest(_url,_body,true,_requestName)
                .then(response => handleResponseStatus(response))
                .then(responseData => resolve(responseData))
                .catch(errors => reject(errors))
        })
    },
    postWithoutCreds: function(_url,_body,_requestName){
        return new Promise( (resolve,reject)=>{
            fetchRequest(_url,_body,false,_requestName)
                .then(response => handleResponseStatus(response))
                .then(responseData => resolve(responseData))
                .catch(errors => reject(errors))
        })
    }
}