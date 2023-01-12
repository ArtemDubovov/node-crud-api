import path from 'path';
import { storage } from '../storage/storage.js';
import { handleError } from '../errors/errors.js';
import { v4 as uuidv4 } from 'uuid';

async function createNewUser(name, age, hobbies) {
    storage.push({id: uuidv4(), name, age, hobbies});
    return storage.at(-1);
}

export default async function handleRequest(req,res) {
    try {
        const {url, method} = req;
        const {base: baseReq, dir: baseDir} = path.parse(url);        
        switch (baseDir) {
            case '/api':
                if (baseReq !== 'users') {
                    handleError(404, 'path', res);
                    break;
                } else if (method === 'GET') {
                    res.statusCode = 200;
                    res.end(JSON.stringify(storage));
                    break;
                } else if (method === 'POST') {
                    const reqList = [];
                    req.on('data', (chunk) => {
                        reqList.push(chunk);
                    });
                    req.on('end', () => {
                        const reqBody = JSON.parse(Buffer.concat(reqList).toString());
                        console.log(reqBody);
                        let {username, age, hobbies} = reqBody;
                        hobbies = hobbies || [];
                        if (username && age) {
                            const newUser = createNewUser(username, age, hobbies);
                            res.statusCode = 200;
                            res.end(JSON.stringify(newUser));
                        } else {
                            handleError(400, 'fill', res);
                        }
                    });
                    break;
                } else {
                    handleError(404, 'method', res);
                }

            case '/api/users':
                // if (method === 'GET') {

                // } else if (method === 'POST') {

                // } else if (method === 'DELETE') {

                // } else if (method === 'PUT') {

                // }
                res.end(`You try to get id ${baseReq}`);
                break;
            default:
                handleError(404, 'path', res);
        }
    } catch (e) {
        console.log('Error');
        res.write(e);
        res.end();
    }
}