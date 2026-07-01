const { Innertube } = require("youtubei.js");

let ytiClient = null;
let initPromise = null;

async function getYtIClient() {
    if (ytiClient) return ytiClient;
    if (!initPromise) {
        initPromise = Innertube.create().then((client) => {
            ytiClient = client;
            return client;
        });
    }
    return initPromise;
}

module.exports = { getYtIClient };
