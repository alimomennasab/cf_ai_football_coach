### AI Assistant Logs
- This log includes every ChatGPT prompt I utilized during the development of this project.

---

#### Step 1: Setup
- Setup prompt: 
```
I want to develop a web application that acts as a football coach that offers playcall suggestions and explanations for varying game situations. I want to utilize: 

- sliders/text boxes for inputs: current down, distance, yard line, time in quarter, current quarter, current score, additional info (ex. our left tackle is injured, opposing cb1 is injured, etc.), handled by either pages or realtime 
- cloud flare workers/workflows/durable objects 
- Llama 3.3 on cloud flare Workers AI to provide the play results/explanation from the user input 
- some sort of memory/state 

please provide an overall structure for this project, and an ordered todo list of each part
```

#### Step 2: Basic frontend UI
- Input form UI prompt: 
```
for the input form ui: provide a sleek, simply, light-themed page that provides these user input options in this order: 
- down: slider 
- distance: text input (0 - 100)
- field position (slider) 
- quarter: slider 
- time remaining in quarter: text input for minutes (0-12), text input for seconds (0-59)
- score: 2 text inputs 
- weather: slider (fair, light rain, medium rain, heavy rain, light snow, heavy snow) 
- additional info (injuries, any context): text

All sliders should have accompanying ticks at their bottom, and all inputs should ensure their values are nonzero numeric values. 
```

---

#### Step 3: Backend
- Issue with calling model:
``` 
I am calling my LLM from cloudflare with 

const MODEL = '@cf/meta/llama-3.3-8b-instruct';
const result = await (env.AI as any).run(MODEL, { prompt });

, but I am receiving the error "{"error":"5007: No such model @cf/meta/llama-3.3-8b-instruct or task"}%". 
Why?
```

---

#### Step 4: Connecting backend & frontend
- Issue with displaying results:
``` 
After I generate and display my playcall with 

{playcall && (
          <div ref={playcallRef} style={styles.playcallDiv}>
            {playcall}
          </div>
        )}

how can I automatically scroll the page down to the playcall div? 
```

