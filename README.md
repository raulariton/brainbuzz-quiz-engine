
# BrainBuzz Quiz Engine

This repository hosts the quiz engine (backend) for the BrainBuzz bot.

## Run Locally

1. Clone the project

```bash
  git clone https://github.com/raulariton/brainbuzz-quiz-engine.git
```

2. Go to the project directory

```bash
  cd brainbuzz-quiz-engine
```

3. Install dependencies. Ensure [Node.js](https://nodejs.org/en/download) is installed on your machine, and added to your PATH.

```bash
  npm install
```

4. Set `.env` variables

- See the `.env.example` file for the keys you will need.
    - `OLLAMA_URL`: The URL of the Ollama server used to make requests to the LLM.
    - `OLLAMA_API_KEY`: The API key for the Ollama server, if required.
    - `SUPABASE_URL`: The URL of the Supabase instance used to store quiz data. 
      You can get this URL from the Supabase Dashboard > Connect > App Frameworks > Framework: refine, Using: Supabase-js.
    - `SUPABASE_KEY`: Is obtained in the same way as `SUPABASE_URL`.
    - `FAL_KEY`: The API key for fal.ai (image generation service).
    - `NODE_ENV`: `dev` to enable some console logs for debugging, `prod` for production.
    - `API_KEY`: The API key that requests made to the server must include in order to gain access. This is a simple security measure to prevent unauthorized access.
    - `PORT`: Port number for the server to listen on (recommended 3001).
    - Paste the keys as they are, without any quotation marks (format example `OLLAMA_URL=http://localhost:9999`).

5. Start the Express server

```bash
  npm start
```

6. Try making requests to the Express server using a tool like [Postman](https://www.postman.com/).

---