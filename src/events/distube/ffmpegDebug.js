/**
 * @param {String} debug
 * */
module.exports = (debug) => {
    if(Boolean(process.env.DISTUBE_DEBUG ?? false) === true) {
        console.log(`[FFMPEG DEBUG] ${debug}`);
    }
}
