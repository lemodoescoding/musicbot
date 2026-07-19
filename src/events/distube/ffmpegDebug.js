/**
 * @param {String} debug
 * */
module.exports = (debug) => {
    if(String(process.env.DISTUBE_DEBUG).toLowerCase() === "true") {
        console.log(`[${new Date().toISOString()}] [FFMPEG DEBUG] ${debug}`);
    }
}
