/**
 * using search LRCLIB API for lyrics matching a query.
 * @param {string} query - e.g. "alan walker faded" or a song title
 * @returns {Promise<{ trackName: string, artistName: string, plainLyrics: string | null } | null>}
 */
module.exports = async (query) => {
	const url = `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`;
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`LRCLIB request failed: ${res.status}`);
	}

	const results = await res.json();
	const match = results.find((r) => r.plainLyrics) ?? results[0];

	if (!match) return null;

	return {
		trackName: match.trackName,
		artistName: match.artistName,
		plainLyrics: match.plainLyrics || null,
	};
};
