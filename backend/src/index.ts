import type { Ai } from '@cloudflare/workers-types';

export interface Env {
	AI: Ai;
}

const worker = {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return cors(new Response(null, { status: 204 }));
		}

		if (url.pathname === '/api/health') {
			return cors(json({ ok: true }));
		}

		if (url.pathname === '/api/predict' && request.method === 'POST') {
			try {
				const data = await request.json();
				const prompt = buildPrompt(data);

				const MODEL = '@cf/meta/llama-3.1-8b-instruct' as const;
				const result = await (env.AI as any).run(MODEL, { prompt });
				const message = (result as any)?.response ?? 'No response generated.';

				console.log(message);

				return cors(json({ playcall: message }));
			} catch (err) {
				return cors(json({ error: (err as Error).message }, 500));
			}
		}

		return cors(new Response('Not found', { status: 404 }));
	},
};

export default worker;

// Prompt function
function buildPrompt(data: any) {
	const { down, distance, yardLine, quarter, timeMinutes, timeSeconds, ourScore, theirScore, weather, additionalInfo } = data;

	const weatherOptions = ['Fair', 'Light Rain', 'Medium Rain', 'Heavy Rain', 'Light Snow', 'Heavy Snow'];
	const weatherStr = weatherOptions?.[Number(weather)] ?? 'Unknown';
	const mm = String(timeMinutes ?? 0);
	const ss = String(timeSeconds ?? 0).padStart(2, '0');

	return `
You are an expert football offensive coordinator. You prefer an aggressive approach, and employ many personnel varieties.

Current situation:
- Down: ${down}
- Distance to 1st down: ${distance} yards
- Field position (yard line): ${yardLine}
- Quarter: ${quarter}
- Time remaining in quarter: ${mm}:${ss}
- Score: Us ${ourScore} – Them ${theirScore}
- Weather: ${weatherStr}
- Additional context: ${additionalInfo}

Recommend exactly ONE playcall (formation + play type + direction).
Explain briefly with both analytical (data-driven) and intuitive reasoning.
When you explain, you have to show how every piece of information drives your decision.
Keep it concise and practical for an in-game decision.`;
}

function json(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

function cors(res: Response) {
	const headers = new Headers(res.headers);
	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
	headers.set('Access-Control-Allow-Headers', 'Content-Type');
	return new Response(res.body, { status: res.status, headers });
}
