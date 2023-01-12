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
                res.end(`Wrong body! You must specify the name, age. Hobby - optional. Code error is ${numberError}!`);
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(e);
    }
};
