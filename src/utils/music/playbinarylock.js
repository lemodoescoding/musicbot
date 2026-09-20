/**
 * this is used to track userId to prevent invoking some command too fast
 * */
const locked = new Set()

/**
 * @param {string} key
 * @returns {boolean}
 * */
function isLocked(key) {
    return locked.has(key)
}

/**
 * @param {string} key
 * @returns {void}
 * */
function acquire(key) {
    locked.add(key)
}

/**
 * @param {string} key
 * @returns {void}
 * */
function release(key) {
    locked.delete(key)
}

module.exports = { isLocked, acquire, release }
