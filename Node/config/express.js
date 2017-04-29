// Express Validator
// Copied from express-validator documentation https://github.com/ctavan/express-validator
// {
module.exports.errorFormatter = function(param, msg, value) {
    let namespace = param.split('.');
    let root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param: formParam,
        msg: msg,
        value: value,
    };
};
// }
