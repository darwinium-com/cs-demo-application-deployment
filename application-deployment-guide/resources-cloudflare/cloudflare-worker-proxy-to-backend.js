export default {
    async fetch(request,env){
        const url = new URL(request.url);
        const targetPath = url.pathname;
        const baseUrl = env.API_BASE_URL;
        let targetUrl;
        if(targetPath.startsWith('/api')){
            targetUrl = `${baseUrl}${targetPath}`;
        } else {
            return new Response('Invalid URL',{status: 404});
        }
        try{
            const response = await fetch(targetUrl,{
                method: request.method,
                headers: request.headers,
                body: request.body
            });
            let body = await response.json();
            if(typeof body.body !== 'undefined' && body.body.originalRequest !== 'undefined'){
                body.body.originalRequest.headers['dwn-api-auth'] = 'REDACTED'
            }
            return new Response(JSON.stringify(body),{
                headers:{
                    'content-type': 'application/json',
                    'access-control-allow-origin': '*',
                    'access-control-allow-headers': '*'
                }
            });
        } catch (error){
            return new Response(JSON.stringify(error), {
                    status: 500,
                    headers: {
                        'content-type': 'application/json',
                        'access-control-allow-origin': '*',
                        'access-control-allow-headers': '*'
                    }
                }
            );
        }

    }
};