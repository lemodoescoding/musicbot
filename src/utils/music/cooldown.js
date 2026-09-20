/**
 * @type {Map<string, Map<string, number>>}
 * */
const buckets = new Map();

/**
 * @param {string} command
 * @param {string} userId
 * @param {number} windowMs
 * @returns {{ok: boolean, remainingMs: number}}
 * */
function check(command, userId, windowMs) {
    if(!buckets.has(command)) {
        buckets.set(command, new Map())
    }

    const bucket = buckets.get(command)

    const now = Date.now()
    const last = buckets.get(userId)

    if(last !== undefined && now - last < windowMs) {
        return { ok: false, remainingMs: windowMs - now + last }
    }

    bucket.set(userId, now)

    return { ok: true, remainingMs: 0 }
}

/**
 * @param {number} maxAgeMs
 * @returns {void}
 * */
function sweep(maxAgeMs = 10 * 60 * 100) {
    const now = Date.now()

    for (const bucket of buckets.values()) {
        for (const [userId, t] of bucket) {
            if(now - t > maxAgeMs) 
                bucket.delete(userId)
        }
    }
}

setInterval(() => {
    sweep()
}, 5 * 60 * 1000).unref()

module.exports = {check,sweep}
