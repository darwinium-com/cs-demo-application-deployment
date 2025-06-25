export function handler(event, context, callback) {
    const token = event.authorizationToken;
    if (typeof token === 'undefined' || token === null) {
        console.log("API Authorizer has the token as null");
    }

    const csvKeys = process.env.API_KEYS_CSV || '';
    const apiKeys = csvKeys
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length >= 12);

    console.log("API Keys loaded:", apiKeys.length);

    const outcome = apiKeys.includes(token) ? 'allow' : 'deny';

    switch (outcome) {
        case 'allow':
            callback(null, generatePolicy('user', 'Allow', event.methodArn));
            break;
        case 'deny':
            callback(null, generatePolicy('user', 'Deny', event.methodArn));
            break;
        case 'unauthorized':
            callback("Unauthorized");
            break;
        default:
            callback("Error: Invalid token");
    }
}

function generatePolicy(principalId, effect, resource) {
    const authResponse = { principalId };
    if (effect && resource) {
        authResponse.policyDocument = {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        };
    }
    return authResponse;
}
