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
    image_prompt: `Cartoon-style collage with thick strokes, showcasing pop culture through the decades. Include colorful illustrations of iconic items and styles: a vinyl record, cassette tape, boombox, Rubik’s cube, floppy disk, flip phone, early MP3 player, disco ball, VHS tape, lava lamp, retro video game console, and fashion styles like platform shoes, neon windbreakers, and skinny jeans. Bright, nostalgic, and playful atmosphere. No real people or logos or text, just symbolic objects representing the eras.`
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
    image_prompt: `Cartoon-style image with thick strokes showing a playful icebreaker game in progress: a spinning bottle surrounded by colorful question cards, a whiteboard with doodles like 'Who is more likely to...', party snacks on a table, and balloons tied to office chairs. No people or faces. Vivid, energetic, with an easy-going and humorous tone.`
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
    `,
    image_prompt: `Cartoon-style collage with thick strokes featuring iconic movie and TV elements: popcorn bucket, classic cinema clapperboard, retro TV set, film reels. Include silhouette-style or generic representations of globally recognized movie/TV characters (e.g., wizard with glasses, sci-fi soldier, superhero cape), avoiding direct likeness to copyrighted characters. Use bright, cinematic colors—reds, yellows, dark blues—and add sparkles or light flares to evoke a theater atmosphere.`
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
    image_prompt: `Cartoon-style illustration with thick strokes featuring a colorful cluster of oversized emojis arranged like a puzzle or riddle. Include classic emojis like the thinking face 🤔, magnifying glass 🔍, sunglasses 😎, rocket 🚀, heart ❤️, pizza 🍕, etc., floating around or stacked playfully. Place a cartoon speech bubble with a question mark inside or a chalkboard with emojis written on it. Bright, fun, and slightly mysterious to evoke the idea of solving an emoji puzzle. No humans or animals.`
  },


};

export default quizTypes;
