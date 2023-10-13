const http = require('http');
const port = process.env.PORT || 5000;

http.createServer((req, res) => {
    if(req.method == 'POST') {
        req.on('data', data => {
            const rawRequest = {};
            let rawPair;
            Buffer.from(data).toString('utf8').split('&').forEach(pair => {
                rawPair = pair.split('=');
                rawRequest[rawPair[0]] = rawPair[1];
            });
            http.get(`http://api.weatherstack.com/forecast?access_key=${rawRequest.access_key}&query=${rawRequest.city}, 
            ${rawRequest.country}&hourly=${rawRequest.hourly}`, (resp) => {
                let data = '';
                resp.on('data', chunk => {
                    data += chunk;
                });
                resp.on('end', () => {
                    res.writeHead(200, {
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.write(data, (err) => {
                        if(err) {
                            console.error(err.message);
                            res.end();
                        } else {
                            res.end();
                        }
                    });
                });
            }).on('error', (error) => {
                console.error(error.message);
            });
        });
    }
}).listen(port, () => {
    console.log(`http://localhost:${port}`);
});