const prompts = {
  "historical":
    `
    Generate a historical quiz question for the current date, given {{currentDate}}. 
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
    - An example for an option is "[SHORT EVENT DESCRIPTION], [YEAR]". Follow this format for all options.
    `,
  "emoji": "Generate a fun emoji-based quiz about movies.",
  "icebreaker": `Create a light-hearted multiple choice icebreaker question for a workplace Slack bot. It should be fun, like 'Never have I ever' or 'Who is most likely to...'. Format the response as: { "quizText": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..." }`,
  "movie_quote": `Choose a famous movie or TV quote. Ask who said it and in which film or show. Provide 4 answer choices, and clearly mark the correct one. Respond in this format: { "quizText": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..." }`
}

export default prompts;
