/**
 * @param {Number} current
 * @param {Number} total
 * @param {Number} size
 * @returns {String}
 * */
module.exports = (current, total, size = 15) => {
    const progress = Math.round((current / total) * size);

    return Array.from({ length: size }, (_, i) => {
        return i === progress ? "🔘" : "▬";
    }).join("");
}
