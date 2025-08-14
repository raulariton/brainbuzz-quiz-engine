const quizTypes = {
  historical: {
    prompt: `Create a single "On This Day" multiple-choice question for a workplace Slack bot. Use the current date ({{currentDate}}).

Return ONLY this JSON (no extra text, no markdown):
{
  "quizText": "...",
  "options": ["...", "...", "...", "..."],
  "answer": "..."
}

SCOPE:
- Search ACROSS ALL DOMAINS tied strictly to this month/day:
  • Global history (wars/politics/space/treaties).
  • Elite sports (World Cup/UEFA CL/Super Bowl/Grand Slams/NBA Finals; Olympic world records/landmarks).
  • Music (iconic albums/singles, major chart records; globally known artists’ births/deaths).
  • Film/TV & celebrities (blockbuster releases, Academy Awards milestones, globally famous births/deaths).
- Choose the MOST internationally recognizable single-day item. Avoid local/niche topics.

DATE RULES (mandatory):
- The correct event MUST have an undisputed month/day equal to {{currentDate}} (ignore the year).
- If you are not 100% certain about the exact month/day, choose a different event.


QUESTION:
- ONE clear question about that exact-date event; ≤ 200 characters; include the YEAR in the question; avoid trick/negative phrasing.

OPTIONS:
- EXACTLY 4 distinct options, each formatted "[SHORT EVENT DESCRIPTION], [YEAR]".
- Only ONE option is correct and strictly matches {{currentDate}} (same month/day; year is the historical year).
- The other 3 are believable distractors from a similar domain/era but NOT on {{currentDate}}.
- No letters/bullets; just the strings. Randomize order.
- "answer" must be EXACTLY one of the options (character-for-character).

GUARDRAILS:
- Fact-check names/titles/years; use correct spelling/diacritics.
- Return STRICT JSON only—no explanations, no extra keys.`,
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

  computer_trivia: {
    // no prompt since the trivia quiz is fetched from an external API
    prompt: ``,
    image_prompt: `Cartoon-style thick-stroke image of a retro computer (CRT monitor, floppy disk) and a sleek modern laptop on opposite sides of the image, facing off like rivals, with lightning bolts between them. Surround them with quirky tech icons like a Wi-Fi symbol, old mouse, smartphone, and code snippets. Fun and bold colors, no humans.`
  }
};

export default quizTypes;
