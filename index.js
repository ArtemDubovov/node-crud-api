import * as dotenv from 'dotenv'
import http from 'node:http';

import handleRequest from './handler/handleRequest.js';

try {
    const {PORT, HOST} = dotenv.config().parsed;
    const SERVER = http.createServer(handleRequest);

    SERVER.listen(PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${PORT}`);
    });
} catch (e) {
    console.log(e);
}