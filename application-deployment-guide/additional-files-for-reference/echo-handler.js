export async function handler(event) {
    console.log("Received event:", JSON.stringify(event));

    let responsePayload = {
        statusCode: 200,
        headers: {
            "content-type": "application/json"
        },
        body: {
            originalRequest: event
        }
    }

    if (typeof event.body?.result !== 'undefined') {
        const result = event.body.result;
        if (typeof result.data !== 'undefined') {
            responsePayload.body.result = result.data;
        }
        if (typeof result.statusCode !== 'undefined') {
            responsePayload.statusCode = result.statusCode;
        }
    }

    return responsePayload;
}
