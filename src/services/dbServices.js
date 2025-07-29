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

}