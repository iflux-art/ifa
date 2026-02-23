import pinyin from "pinyin";

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

const translationCache = new Map<string, string>();

async function translateWithDeepL(text: string): Promise<string> {
	if (!DEEPL_API_KEY) {
		throw new Error("DEEPL_API_KEY is not configured");
	}

	const response = await fetch(DEEPL_API_URL, {
		method: "POST",
		headers: {
			Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			text: [text],
			source_lang: "ZH",
			target_lang: "EN",
		}),
	});

	if (!response.ok) {
		throw new Error(`DeepL API error: ${response.status}`);
	}

	const data = (await response.json()) as {
		translations: { text: string }[];
	};

	return data.translations[0]?.text ?? text;
}

async function translateToPinyin(text: string): Promise<string> {
	const pinyinResult = await pinyin(text, {
		style: "normal",
		heteronym: false,
		segment: true,
	});
	return pinyinResult.flat().join("");
}

export async function translateText(text: string): Promise<string> {
	if (!text || /^[a-zA-Z0-9-]+$/.test(text)) {
		return text;
	}

	const cached = translationCache.get(text);
	if (cached) {
		return cached;
	}

	let translated: string;

	try {
		translated = await translateWithDeepL(text);
	} catch {
		translated = await translateToPinyin(text);
	}

	translationCache.set(text, translated);
	return translated;
}

export async function translateBatch(
	texts: string[],
): Promise<Map<string, string>> {
	const results = new Map<string, string>();
	const uncached: string[] = [];

	for (const text of texts) {
		if (!text || /^[a-zA-Z0-9-]+$/.test(text)) {
			results.set(text, text);
			continue;
		}

		const cached = translationCache.get(text);
		if (cached) {
			results.set(text, cached);
		} else {
			uncached.push(text);
		}
	}

	if (uncached.length === 0) {
		return results;
	}

	const batches: string[][] = [];
	for (let i = 0; i < uncached.length; i += 50) {
		batches.push(uncached.slice(i, i + 50));
	}

	for (const batch of batches) {
		try {
			if (DEEPL_API_KEY) {
				const response = await fetch(DEEPL_API_URL, {
					method: "POST",
					headers: {
						Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						text: batch,
						source_lang: "ZH",
						target_lang: "EN",
					}),
				});

				if (response.ok) {
					const data = (await response.json()) as {
						translations: { text: string }[];
					};

					for (let i = 0; i < batch.length; i++) {
						const original = batch[i];
						const translated =
							data.translations[i]?.text ?? (await translateToPinyin(original));
						translationCache.set(original, translated);
						results.set(original, translated);
					}
					continue;
				}
			}
		} catch {}

		for (const text of batch) {
			const translated = await translateToPinyin(text);
			translationCache.set(text, translated);
			results.set(text, translated);
		}
	}

	return results;
}

export function toSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
