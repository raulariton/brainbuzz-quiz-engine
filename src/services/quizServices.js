import quizTypes from '../quizTypes.js';
import axios from 'axios';
import moment from 'moment';
import logger from '../utils/logger.js';

export async function generateQuiz(type) {
  // if type matches regex opentdb.\d+
  if (/^opentdb\.\d+/.test(type)) {

    // extract the number after the dot
    const categoryIndex = type.split('.')[1];

    const quiz = await getTriviaQuiz(categoryIndex);

    if (!quiz) {
      logger.error('Failed to generate trivia quiz');
      return null; // return null to signify that the quiz could not be generated
    }

    return {
      quizText: quiz.quizText,
      options: quiz.options,
      answer: quiz.answer
    };
  }

  // get the prompt from the type
  let prompt = quizTypes[type].prompt;

  // if the type is 'historical',
  // replace the {{currentDate}} placeholder with the current date
  if (type === 'historical') {
    const currentDate = new Date().toISOString().split('T')[0];
    prompt = prompt.replace('{{currentDate}}', currentDate);
  }

  let validResponse = false;
  let requestsMade = 0;
  const maxRequests = 5; // limit the number of requests to avoid infinite loop
  let quizJson = {};

  while (!validResponse && requestsMade < maxRequests) {
    // make request to the Ollama server
    let response;

    try {
      response = await axios.post(
        'http://ollama.vsp.dev/api/generate',
        {
          model: 'magistral:latest',
          prompt: prompt,
          stream: false,
          think: false
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`
          }
        }
      );
    } catch (error) {
      // increment either way
      requestsMade++;

      logger.error('Error making request to Ollama:', error.message);

      // in case of error, make another request
      continue;

      // TODO: if requestsMade exceeds maxRequests, exit the loop and throw error
    }

    const responseQuiz = response.data.response;
    requestsMade++;

    // parse the quiz from the response
    quizJson = parseQuiz(responseQuiz);

    if (!quizJson) {
      logger.error('Failed to parse quiz from response:', responseQuiz);

      // in case of error, make another request
      continue;
    }

    validResponse = true;
  } // end of while loop

  if (requestsMade >= maxRequests) {
    logger.error('Unable to generate a valid quiz after multiple attempts.');

    // return null to signify that the quiz could not be generated
    return null;
  }

  // otherwise, the quiz is valid
  // return the parsed quiz
  return {
    quizText: quizJson.quizText,
    options: quizJson.options,
    answer: quizJson.answer
  };
}

function parseQuiz(responseQuiz) {
  // replace literal newlines with \n
  responseQuiz = responseQuiz.replace(/"((?:[^"\\]|\\.)*)"/gs, (m, group) =>
    `"${group.replace(/\r?\n/g, '\\n')}"`
  );

  const match = responseQuiz.match(
    /\{\s*"quizText"\s*:\s*".+?",\s*"options"\s*:\s*\[.*?\],\s*"(answer|correctAnswer)"\s*:\s*".*?"\s*\}/s
  );

  if (!match) {
    logger.error('Unable to find RegEx match.');

    // return null to signify that the quiz could not be parsed
    return null;
  }

  const quizJson = JSON.parse(match[0]);

  // fix naming of the answer field
  //  sometimes the LLM returns "answer" and sometimes "correctAnswer"
  if (quizJson.correctAnswer && !quizJson.answer) {
    quizJson.answer = quizJson.correctAnswer;

    // delete the correctAnswer field from quizJson object
    delete quizJson.correctAnswer;
  }

  return quizJson;
}

async function getHistoricalQuiz(provider, numberOfOptions) {

  const currentDate = new Date();
  const dates = [currentDate]
  const options = []

  for (let i = 0; i < numberOfOptions - 1; i++) {
    const randomDate = getRandomDate();

    // check if the random date is the same as the current date
    if (randomDate === currentDate) {
      i--; // try current iteration again
      continue; // skip this iteration
    }

    // add to dates array
    dates.push(getRandomDate());
  }

  switch (provider) {
    case 'wikimedia':
      for (const date of dates) {
        const event = await getWikimediaEvent(date);

        // TODO: better handling in case of random date (or current date)
        //  not having an event
        if (event) {
          options.push(event);
        }
      }
      break;
    case 'zenquotes':
      break;
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }

  // now that all the options are fetched
  // save the first option as the correct answer
  const correctAnswer = options[0];

  // and now shuffle the options
  options.sort(() => Math.random() - 0.5);

  return {
    quizText: `What happened today, ${moment().format('MMMM Qo')}, in history?`,
    options: options,
    answer: options.find(option => option === correctAnswer)
  }
}

function getRandomDate() {
  const start = new Date(2000, 0, 1); // January 1, 2000
  const end = new Date(); // Current date
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate;
}

async function getWikimediaEvent(date) {
  const paddedMonth = String(date.getMonth() + 1).padStart(2, '0');
  const paddedDay = String(date.getDate()).padStart(2, '0');

  try {
    const response = await axios.get(
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${paddedMonth}/${paddedDay}`,
    );

    const events = response.data.events;

    if (!events || events.length === 0) {
      throw new Error(`No events found for the given date (${date.toDateString()}).`);
    }

    // select a random event
    const randomEvent = events[Math.floor(Math.random() * events.length)].text;

    return randomEvent;

  } catch (error) {
    logger.error('Error fetching data from Wikimedia API:', error.message);

    return null; // Return null in case of error
  }
}

async function getTriviaQuiz(categoryIndex) {
  try {
    const response = await axios.get(
      `https://opentdb.com/api.php`,{
        params: {
          amount: 1,
          category: categoryIndex,
          difficulty: 'easy',
          type: 'multiple',
          encode: 'url3986'
        }
      }
    )

    if (response.data.response_code !== 0) {
      throw new Error(`Failed to fetch trivia quiz (response code ${response.data.response_code})`);
    }

    const returnedQuiz = response.data.results[0];
    const quizText = decodeURIComponent(returnedQuiz.question);
    const answer = decodeURIComponent(returnedQuiz.correct_answer);
    const options = returnedQuiz.incorrect_answers.map(option => decodeURIComponent(option));
    options.push(answer); // add the correct answer to the options
    options.sort(() => Math.random() - 0.5); // shuffle the options

    return {
      quizText: quizText,
      options: options,
      answer: answer
    };

  } catch (error) {
    logger.error('Error fetching trivia quiz:', error.message);
    return null; // Return null in case of error
  }



}
