const { getYtIClient } = require("./getYtIClient");

/**
 * parses a "H:MM:SS" / "MM:SS" duration string into seconds. Returns 0 if the string is missing or unparsable.
 * 
 * @param {String | undefined} text
 * @returns {Number}
 */
function parseDurationText(text) {
	if (!text) return 0;
	const parts = text.split(":").map((p) => parseInt(p, 10));
	if (parts.some((p) => Number.isNaN(p))) return 0;
	return parts.reduce((acc, part) => acc * 60 + part, 0);
}

/**
 * reads duration/live status off a youtubei.js search result item without
 * relying on its `.duration` getter
 *
 * @param {any} item
 * @returns {{ seconds: Number, isLive: Boolean }}
 */
function readDurationInfo(item) {
	const isLive = Boolean(item?.is_live);

	const lengthText =
		item?.length_text?.toString?.() ??
		item?.duration?.text ??
		undefined;

	const seconds = item?.duration?.seconds ?? parseDurationText(lengthText);

	return { seconds, isLive };
}

/**
 * maximum allowed track duration, in seconds. 
 *
 */
const MAX_DURATION_SECONDS = Number(process.env.MAX_TRACK_DURATION_SECONDS || 30 * 60); // 30 min default

/**
 * xxtracts a YouTube video ID from a watch URL, youtu.be short link, or shorts URL. Returns null if the URL doesn't look like a YouTube link.
 * 
 * @param {String} url
 * @returns {String | null}
 */
function extractVideoId(url) {
	try {
		const parsed = new URL(url);

		if (parsed.hostname.includes("youtu.be")) {
			return parsed.pathname.slice(1) || null;
		}

		if (parsed.hostname.includes("youtube.com")) {
			if (parsed.pathname.startsWith("/shorts/")) {
				return parsed.pathname.split("/")[2] || null;
			}
			return parsed.searchParams.get("v");
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * checks whether a track is allowed to be queued, based on duration and
 * live-stream status. 
 *
 * @param {{ url?: String, durationSeconds?: Number, isLive?: Boolean }} input
 * @returns {Promise<{ allowed: true } | { allowed: false, reason: string }>}
 */
async function checkPlaybackSafety({ url, durationSeconds, isLive }) {
	let duration = durationSeconds;
	let live = isLive;

	if (duration === undefined && url) {
		const videoId = extractVideoId(url);

		if (!videoId) {
			// not a recognized YouTube URL shape
			return { allowed: true };
		}

		try {
			const yt = await getYtIClient();
			const info = await yt.getBasicInfo(videoId);

			duration = info.basic_info.duration ?? 0;
			live = info.basic_info.is_live ?? false;
		} catch {
			// If the lookup itself fails, don't block playback on that 
            return { allowed: true };
		}
	}

	if (live) {
		return {
			allowed: false,
			reason: "Livestreams can't be played — they have no fixed end and would tie up playback indefinitely.",
		};
	}

	if (!duration || duration <= 0) {
		// Unknown/zero duration is often also a live or premiere broadcast
		// that hasn't reported a normal length yet.
		return {
			allowed: false,
			reason: "This track's duration couldn't be determined, so it can't be queued (likely a live broadcast or premiere).",
		};
	}

	if (duration > MAX_DURATION_SECONDS) {
		const maxMinutes = Math.floor(MAX_DURATION_SECONDS / 60);
		const trackMinutes = Math.floor(duration / 60);
		return {
			allowed: false,
			reason: `This track is ${trackMinutes} minutes long, which exceeds the ${maxMinutes}-minute limit.`,
		};
	}

	return { allowed: true };
}

module.exports = { checkPlaybackSafety, extractVideoId, readDurationInfo, MAX_DURATION_SECONDS };
