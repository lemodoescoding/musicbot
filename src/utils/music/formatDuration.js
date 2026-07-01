/**
 * @param {Number} seconds
 * @returns {String}
 * */
module.exports = (seconds) => {
    const hr = Math.floor(seconds / 3600);
    const mn = Math.floor((seconds % 3600) / 60);
    const sc = Math.floor(seconds % 60);

    return [
        hr && hr.toString().padStart(2, "0"),
        mn.toString().padStart(2, "0"),
        sc.toString().padStart(2, "0")
    ].filter(Boolean).join(":")
}
