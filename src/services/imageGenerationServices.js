import { fal } from '@fal-ai/client';

const GENERATION_PROMPT = `Using the provided picture of a profile picture of a human,
generate an image of the human as a king sitting on a throne.
If the image is not a human, create a poster image with the text: {{DISPLAY_NAME}}. 
`;

export const generateRewardImage = async ({ imageUrl, userDisplayName }) => {
  try {
    const result = await fal.subscribe(
      'fal-ai/flux-kontext/dev',
      {
        input: {
          prompt: GENERATION_PROMPT.replace('{{DISPLAY_NAME}}', userDisplayName),
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
    return result.data.images[0].url;

  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
};
