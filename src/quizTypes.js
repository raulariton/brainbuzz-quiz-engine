const quizTypes = {
  historical: {
    prompt: `Generate a historical quiz question for the current date, given {{currentDate}}. 
    The quiz should be in the following format:
    { 
      "quizText": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "..."
    }
    - Only include events that are significant and well-known.
    - Ensure the options are plausible and related to the question.
    - The answer must be one of the options provided.
    - The correct answer must be an event that strictly corresponds to the date.
    - Fact-check the events to ensure accuracy.
    - Respect the JSON format strictly. Do not include any additional text or explanations.
    - An example for an option is "[SHORT EVENT DESCRIPTION], [YEAR]". Follow this format for all options.`,
  },

  icebreaker: {
    prompt: `Create a light-hearted multiple choice icebreaker question for a workplace Slack bot. It should be fun, like 'Never have I ever' or 'Who is most likely to...'. Format the response as: { "quizText": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..." }`,
  },

  movie_quote: {
    prompt: `
Create a movie quote quiz question in strict JSON format. Structure it like this:

{
  "quizText": "Who said the following quote, and in what movie? \\"You're gonna need a bigger boat\\"",
  "options": [
    "Roy Scheider in Jaws",
    "Harrison Ford in Star Wars",
    "Tom Hanks in Cast Away",
    "Robert Shaw in Jaws"
  ],
  "answer": "Robert Shaw in Jaws"
}

 Important:
- Only respond with a **single JSON object** (no extra text, no explanation).
- Keys must be: "quizText", "options", "answer"
- Use **double quotes** for all strings.
- Escape any internal quotes correctly.
- Do NOT include headings like "Quote:", "Options:", "Correct answer:" — only the JSON.
- The quiz should focus on famous quotes and correct attribution (actor + movie).
`
  }


};

export default quizTypes;
