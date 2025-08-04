const quizTypes = {
  historical: {
    prompt: `Create a historical quiz question for a workplace Slack bot. Use the current date ({{currentDate}}). 
    The quiz should be in the following format:
    \`\`\`
    { 
      "quizText": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "..."
    }
    \`\`\`
    GUIDELINES:
    - Fact-check the events to ensure accuracy.
    - Only include events that are significant and well-known.
    - Ensure the options are plausible and related to the question.
    - The answer must be one of the options provided.
    - The correct answer must be an event that strictly corresponds to the date.
    - Respect the JSON format strictly. Do not include any additional text or explanations.
    - An example for an option is "[SHORT EVENT DESCRIPTION], [YEAR]". Follow this format for all options.`,
  },

  icebreaker: {
    prompt: `Create a light-hearted multiple choice icebreaker question for a workplace Slack bot. 
    It should be fun, like 'Never have I ever' or 'Who is most likely to...'. 
    Your response must be in the following format: 
    \`\`\`
    { 
    "quizText": "...", 
    "options": ["...", "...", "...", "..."], 
    "correctAnswer": "..." 
    }
    \`\`\`
    GUIDELINES:
    - The question should be engaging and suitable for a workplace environment.
    - The options should be humorous or relatable.
    - The correct answer should be one of the options provided.
    - Respect the JSON format strictly. Do not include any additional text or explanations.`,
  },

  movie_quote: {
    prompt: `Create a movie quote quiz question for a workplace Slack bot. Ensure the movie the quote is from is well-known.
    Your response must be in the following format:
    \`\`\`
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
    \`\`\`
     GUIDELINES:
    - Only respond with a **single JSON object** (no extra text, no explanation).
    - Keys must be: "quizText", "options", "answer"
    - Use **double quotes** for all strings.
    - Escape any internal quotes correctly.
    - Do NOT include headings like "Quote:", "Options:", "Correct answer:", only the JSON.
    - The quiz should focus on famous quotes and correct attribution (actor + movie).
    `
  },

  emoji_riddle: {
    prompt: `Create an emoji riddle quiz question.
    Give a combination of emojis that represent a funny well-known concept, object, or phrase.
    Your response must be in the following format:
    \`\`\`
    { 
      "quizText": "What do these emojis represent? 🔎🐟", 
      "options": ["Finding Nemo", "Dory", "Glass Fish", "Fish Tank"], 
      "correctAnswer": "Finding Nemo" 
    }
    \`\`\`
    GUIDELINES:
    - It should be a fun and engaging riddle.
    - The question should be clear and concise, and should contain about 3-5 emojis.
    - The options should be plausible and related to the emoji.
    - The correct answer should be one of the options provided.
    - Respect the JSON format strictly. Do not include any additional text or explanations.`,
  },


};

export default quizTypes;
