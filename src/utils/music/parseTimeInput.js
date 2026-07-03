/**
 * @param {String} input
 * @returns {Number | null}
 * */
function parseTimeInput(input) {
    if(/^\d+$/.test(input)) { return parseInt(input, 10) }

    const parts = input.split(":").map(Number);
    if (parts.some(p => isNaN(p))) { return null; }

    if (parts.length === 2) {
        let [m, s] = parts;
        if (s >= 60) {
            m += Math.floor(s / 60)
            s = s % 60;
        }
        return m * 60 + s;
    }

    if (parts.length === 3) {
        let [h, m, s] = parts;
        if (s >= 60) {
            m += Math.floor(s / 60)
            s = s % 60;
        }

        if (m >= 60) {
            h += Math.floor(m / 60)
            m = m % 60;
        }
        return h * 3600 + m * 60 + s;
    }

    return null;
}

module.exports = parseTimeInput;
