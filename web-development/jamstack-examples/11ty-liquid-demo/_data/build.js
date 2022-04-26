module.exports = function () {
    let buildTime = new Date();
    let randomNumber = Math.random();
    return {
        buildTime,
        randomNumber,
    };
};
