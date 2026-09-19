const ALLOWED_HOSTS = new Set(["www.youtube.com", "youtube.com", "youtu.be", "music.youtube.com"]);

/**
 * @param {string} str
 * 
 * @returns {boolean}
 * */
function isAllowedUrl(str) {
  try {
    const u = new URL(str);
    return (u.protocol === "https:" || u.protocol === "http:") && ALLOWED_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

module.exports = isAllowedUrl;
