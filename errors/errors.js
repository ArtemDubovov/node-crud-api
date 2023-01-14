export const handleError = async (numberError, type, res) => {
    try {
        res.statusCode = numberError;
        switch (type) {
            case 'path':
                res.end(`Throw error, incorrect path! Code error is ${numberError}!`);
                break;
            case 'method':
                res.end(`Wrong method! Code error is ${numberError}!`);
                break;
            case 'fill':
                res.end(`Wrong body! You must specify the name (min length 3 symbols), age (must be more 0). Hobby - optional, must be an array. Code error is ${numberError}!`);
                break;
            case 'wrongId':
                res.end(`ID is not valid! Code error is ${numberError}!`);
                break;
            case 'missId':
                res.end(`User with this id does not exist! Code error is ${numberError}!`);
                break;
            case 'someError':
                res.end(`Internal processing error! Code error is ${numberError}!`);
                break;
            default:
                break;
        }
    } catch (e) {
        res.end(`Internal processing error! Code error is ${numberError}!`);
    }
};
