import { fal } from '@fal-ai/client';
import dotenv from 'dotenv';

dotenv.config();

fal.config({
  credentials: process.env.FAL_KEY
});


const REWARD_IMAGE_GENERATION_PROMPT = `Using the provided picture of a profile picture of a human,
generate an image of the human as a king sitting on a throne.
If the image is not a human, create a poster image with the text: {{DISPLAY_NAME}}. 
`;

export const generateRewardImage = async ({ imageUrl, userDisplayName }) => {
  try {
    const result = await fal.subscribe(
      'fal-ai/flux-kontext/dev',
      {
        input: {
          prompt: REWARD_IMAGE_GENERATION_PROMPT.replace('{{DISPLAY_NAME}}', userDisplayName),
          image_url: imageUrl
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      }
    );

    // return generated image URL
    //console.log("URL imagine generată:", result.data.images[0].url);
    return result.data.images[0].url;



  } catch (error) {
    console.error('Error generating reward image:', error);
    throw new Error('Failed to generate reward image');
  }
};

export async function generateQuizImage({imagePrompt}) {
  try {
    const result = await fal.subscribe(
      "fal-ai/flux-1/schnell",
      {
        input: {
          num_inference_steps: 6, // default is 4
          prompt: imagePrompt,
          image_size: "square",
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      }
    );

    // return generated image URL
    return result.data.images[0].url;

  } catch (error) {
    console.error('Error generating quiz image:', error);
    throw new Error('Failed to generate quiz image');
  }
}
