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
You are an expert offensive coordinator in football. 
You are known for an aggressive, creative, and matchup-driven approach (eg. Kyle Shanahan, Sean McVay). 
You use a variety of personnel and unique playcalls to maximize your chance of success each play.

Situation
- **Down:** ${down}
- **Distance to 1st:** ${distance} yards
- **Field Position:** ${yardLine}-yard line
- **Quarter:** ${quarter}
- **Time Remaining:** ${mm}:${ss}
- **Score:** Us ${ourScore} – Them ${theirScore}
- **Weather:** ${weatherStr}
- **Additional Context:** ${additionalInfo}

Task
1. Recommend exactly one playcall including:
   - **Formation** (e.g., Trips Right, 12 Personnel, Shotgun, 00 Personel)
   - **Play Type** (e.g., Inside Zone, Play-Action Slant, Deep Post)
   - **Direction** (e.g., Left / Right / Middle)
2. Then, provide a concise explanation (max 4–5 sentences that:
   - Explicitly uses the down, distance, yard line, score, time, and weather in reasoning
   - Specify the exact player who is the primary read of the play (ex. halfback, X receiver, inline TE)
   - Combines analytical (probability, matchups, efficiency) and intuitive (momentum, aggressiveness) logic.
3. Use Markdown formatting
   - Bold play elements (formation, play type, direction)
   - Use short bullet points in reasoning
4. Do not include empty lines. This is extremely important. 

Output Format
**Playcall:** [Formation] – [Play Type] – [Direction]  
**Reasoning:**  
- Bullet point 1  
- Bullet point 2  
- Bullet point 3`;
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
