const prompts = {
  "historical":
    `
    Generate a historical quiz question for the current date, given {{currentDate}}. 
    The quiz should be in the following format:
    { 
      "options": ["(Option 1)", "(Option 2)", "(Option 3)", "(Option 4)"],
      "answer": "(Correct answer)"
    }
    - Only include events that are significant and well-known.
    - Ensure the options are plausible and related to the question.
    - The answer must be one of the options provided.
    - The correct answer must be an event that strictly corresponds to the date.
    - Fact-check the events to ensure accuracy.
    - Respect the JSON format strictly. Do not include any additional text or explanations.
    - An example for an option is "[SHORT EVENT DESCRIPTION], [YEAR]". Follow this format for all options.
    `,
  "emoji": "Generate a fun emoji-based quiz about movies."
}

export default prompts;
