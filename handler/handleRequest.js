import path from 'path';
import { storage } from '../storage/storage.js';
import { handleError } from '../errors/errors.js';
import {validate as uuidValidate, v4 as uuidv4 } from 'uuid';

function createAndGetNewUser(name, age, hobbies) {
    const newUser = {id: uuidv4(), name, age, hobbies};
    storage.push(newUser);
    return newUser;
}

function getUser(userId) {
    const result = storage.find(user => user.id === userId);
    return result;
}

export default function handleRequest(req,res) {
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
                        try {
                            const reqBody = JSON.parse(Buffer.concat(reqList).toString());
                            console.log(reqBody);
                            let {username, age, hobbies} = reqBody;
                            hobbies = hobbies || [];
                            console.log(typeof username === 'string', username.length > 3, typeof age === 'number', Array.isArray(hobbies));
                            if (typeof username === 'string' && username.length > 3 && typeof age === 'number' && Array.isArray(hobbies)) {
                                res.statusCode = 201;
                                const newUser = JSON.stringify(createAndGetNewUser(username, age, hobbies));
                                res.end(newUser);
                            } else {
                                handleError(400, 'fill', res);
                            }
                        } catch (e) {
                            handleError(400, 'fill', res);
                        }
                    });
                    break;
                } else {
                    handleError(404, 'method', res);
                }

            case '/api/users':
                const userId = baseReq;
                if (method === 'GET') {

                    const findUser = getUser(userId);
                    const statusValidate = uuidValidate(userId);
                    if (findUser && !statusValidate) {
                        handleError(400, 'wrongId', res);
                    } else if (!findUser && !statusValidate || !findUser) {
                        handleError(404, 'missId', res);
                    } else if (findUser && statusValidate) {
                        res.end(JSON.stringify(findUser));
                    }
                }
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