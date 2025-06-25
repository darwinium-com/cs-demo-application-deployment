import coreLocalStorage from "./core.local-storage.js";

let defaultValues = {};

export default {
    setDefault: function(_key,_value){
        defaultValues[_key] = _value
    },
    getKey: function(_key){
        let result = defaultValues[_key]
        let storedValue = coreLocalStorage.get(_key)
        if(storedValue){
            result = storedValue
        }
        return result
    },
    setLocal: function(_key,_value){
        coreLocalStorage.write(_key,_value)
    },
    deleteLocal: function(_key){
        coreLocalStorage.delete(_key)
    }
}