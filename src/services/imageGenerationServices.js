import { fal } from '@fal-ai/client';
import dotenv from 'dotenv';

dotenv.config();

fal.config({
  credentials: process.env.FAL_KEY
});


const REWARD_IMAGE_GENERATION_PROMPT = `A realistic, high-resolution image of a person sitting on an ornate throne in a majestic setting, wearing a large gold medal on a ribbon around their neck. The person looks powerful and confident, dressed in elegant royal attire (e.g., a modern twist on a regal outfit or a luxurious suit/dress). The throne should be grand, with intricate carvings and velvet cushions, placed in a bright hall with soft golden lighting. Make the medal shine and be clearly visible. The person’s face should match the provided profile picture, blended naturally for a lifelike result. Overall tone: celebratory, majestic, and prestigious.`;

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
