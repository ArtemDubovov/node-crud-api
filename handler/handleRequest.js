import path from 'path';
import { storage } from '../storage/storage.js';
import { handleError } from '../errors/errors.js';
import {validate as uuidValidate, v4 as uuidv4 } from 'uuid';

function createAndGetNewUser(username, age, hobbies) {
    const newUser = {id: uuidv4(), username, age, hobbies};
    storage.push(newUser);
    return newUser;
}

function getUser(userId) {
    const result = storage.find(user => user.id === userId);
    return result;
}

function deleteUser(userId) {
    const findIndex = storage.findIndex(el => el.id === userId);
    storage.splice(findIndex, 1);
}

function updateUser(userId, newName, newAge, newHobbies) {
    storage.map(el => {
        if (el.id === userId) {
            if (newName) {
                el.username = newName;
            }
            if (newAge) {
                el.age = newAge;
            }
            if (newHobbies) {
                el.hobbies = newHobbies;
            }
        }
    });
}

export default function handleRequest(req,res) {
    try {
        const {url, method} = req;
        const {base: baseReq, dir: baseDir} = path.parse(url);        
        switch (baseDir) {
            case '/api':
                if (baseReq !== 'users') {
                    handleError(404, 'path', res);
                } else if (method === 'GET') {
                    res.statusCode = 200;
                    res.end(JSON.stringify(storage));
                } else if (method === 'POST') {
                    const reqList = [];
                    req.on('data', (chunk) => {
                        reqList.push(chunk);
                    });
                    req.on('end', () => {
                        try {
                            const reqBody = JSON.parse(Buffer.concat(reqList).toString());
                            let {username, age, hobbies} = reqBody;
                            hobbies = hobbies || [];
                            if (typeof username === 'string' && username.length > 3 && typeof age === 'number' && age > 0 && Array.isArray(hobbies)) {
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
                } else {
                    handleError(404, 'method', res);
                }
                break;
            case '/api/users':
                const userId = baseReq;
                const findUser = getUser(userId);
                const statusValidate = uuidValidate(userId);
                if (method === 'GET') {
                    if (!statusValidate) {
                        handleError(400, 'wrongId', res);
                    } else if (!findUser) {
                        handleError(404, 'missId', res);
                    } else {
                        res.end(JSON.stringify(findUser));
                    }
                } else if (method === 'DELETE') {
                    if (!statusValidate) {
                        handleError(400, 'wrongId', res);
                    } else if (!findUser) {
                        handleError(404, 'missId', res);
                    } else {
                        deleteUser(userId);
                        res.statusCode = 204;
                        res.end();
                    }
                } else if (method === 'PUT') {
                    if (!statusValidate) {
                        handleError(400, 'wrongId', res);
                    } else if (!findUser) {
                        handleError(404, 'missId', res);
                    } else {
                        const reqList = [];
                        req.on('data', (chunk) => {
                            reqList.push(chunk);
                        });
                        req.on('end', () => {
                            try {
                                const reqBody = JSON.parse(Buffer.concat(reqList).toString());
                                const {username, age, hobbies} = reqBody;
                                if (typeof username === 'string' && username.length > 3 || typeof age === 'number' && age > 0 || Array.isArray(hobbies)) {
                                    res.statusCode = 200;
                                    updateUser(userId, username, age, hobbies);
                                    res.end('User updated!');
                                } else {
                                    handleError(400, 'fill', res);
                                }
                            } catch (e) {
                                handleError(400, 'fill', res);
                            }
                        });
                    }
                } else {
                    handleError(404, 'method', res);
                }
                break;
            default:
                handleError(404, 'path', res);
        }
    } catch (e) {
        handleError(500, 'someError', res);
    }
}