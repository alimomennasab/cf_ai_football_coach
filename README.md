# cf_ai_football_coach

This project is an AI-powered football coaching assistant built entirely on Cloudflare that generates offensive play suggestions based on in-game scenarios.

---


## Features

- **LLM Integration**: Uses Llama 3.1 8b Instruct on Cloudflare Workers AI for playcall generation.  
- **Workflow / Coordination**: Implemented through a Cloudflare Worker handling prompt construction, API routing, and model inference.  
- **User Input**: Interactive frontend built with React (Pages-ready) for entering down, distance, field position, score, and game context.  
- **Memory / State**: Frontend React state manages form data, playcall history, and response display within the current session.

---

## Running Locally

### Backend
```
cd backend
npm install
wrangler dev --local
```

### Frontend
- Create a frontend/.env file, and set VITE_API_URL=http://localhost:8787

```
cd frontend
npm install
npm run dev
```

### Example output
#### Playcall: Trips Right, 11 Personnel, Shotgun – Counter Trey – Right
#### Reasoning:

Given the 2nd down and 1 yard to go, we need to be aggressive and try to gain a first down. The Counter Trey play is a great option as it has a high success rate in goal-line situations.

The fair weather and 50-yard line position allow us to be more aggressive with our play-calling. We can take a shot at the end zone and try to score a touchdown.

The primary read of this play is the ****Tailback**** who will be taking the handoff and running the Counter Trey. We need to make sure he reads the block of the right tackle and has a clear path to the end zone. The matchup between the tailback and the defender is in our favor, as the defender is likely to be a linebacker who is not as effective in the hole.

