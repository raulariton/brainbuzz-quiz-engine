import { supabaseClient } from '../config/supabaseClient.js';

export const storeQuiz = async (quiz) => {
  try {
    const { error } = await supabaseClient
      .from('quizzes')
      .insert({ quiz });

    if (error) {
      throw new Error(error.message);
    }

  } catch (error) {
    console.error('Error storing quiz in DB: ', error);
    throw new Error('Failed to store quiz in database.');
  }
};

export const storeUserAnswer = async ({ user_id, quiz_id, correct }) => {
  try {
    const { error } = await supabaseClient
      .from('user_answers')
      .insert([
        { user_id, quiz_id, correct }
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error('Failed to store user answer');
    }

  } catch (err) {
    console.error('Unexpected error storing user answer:', err);
    throw err;
  }
};
