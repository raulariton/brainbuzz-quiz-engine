import { supabaseClient } from '../config/supabaseClient.js';
import crypto from 'crypto';
import logger from '../utils/logger.js';

export const storeQuiz = async ({ type, quiz, duration }) => {
  // TODO: automatically create UUID in supabase
  const quizId = crypto.randomUUID();

  try {
    const { data, error } = await supabaseClient
      .from('quizzes')
      .insert([
        {
          quiz_id: quizId,
          type: type,
          quiz: quiz,
          answers: 0,
          is_active: true,
          start_time: new Date().toISOString()
        }
      ])
      .select('quiz_id');

    if (error) throw new Error(error.message);

    // Dezactivează automat după 15 secunde
    setTimeout(async () => {
      const { error: updErr } = await supabaseClient
        .from('quizzes')
        .update({ is_active: false })
        .eq('quiz_id', quizId);

      if (updErr) logger.error("Error updating quiz to become inactive");

    }, duration * 1000);

    return quizId;
  } catch (err) {
    logger.error('Error storing quiz in DB:', err);
    throw new Error('Failed to store quiz in database.');
  }
};



export const storeUserAnswer = async ({ user_id, quiz_id, correct, user_data }) => {
  try {
    // 1. Inserează răspunsul în user_answers
    const { data: answerData, error: insertError } = await supabaseClient
      .from('user_answers')
      .insert([{ user_id, quiz_id, correct, user_data }])
      .select('user_answer_id');

    if (insertError) {
      logger.error("Error inserting into user_answers:", insertError);
      throw new Error(insertError.message);
    }

    // 2. Incrementează coloana answers din quizzes
    const { data: current, error: readError } = await supabaseClient
      .from('quizzes')
      .select('answers')
      .eq('quiz_id', quiz_id)
      .single();

    if (readError) {
      logger.error("Error reading current answers count:", readError);
      throw new Error(readError.message);
    }

    const { data: updatedQuiz, error: updateError } = await supabaseClient
      .from('quizzes')
      .update({ answers: (current.answers || 0) + 1 })
      .eq('quiz_id', quiz_id)
      .select('answers')
      .single();

    if (updateError) {
      logger.error("Error inserting into user_answers:", updateError);
      throw new Error(updateError.message);
    }


    return {
      user_answer_id: answerData[0]?.user_answer_id,
      updated_answers: updatedQuiz[0]?.answers
    };
  } catch (err) {
    logger.error('❌ Unexpected error storing user answer:', err);
    throw err;
  }
};

/**
 * Get the most recent active quiz of a specific type.
 * @return The quiz, if there is already an active quiz of the specified, type,
 * or null if there is no active quiz.
 */
export const getActiveQuiz = async (type, duration) => {
  const { data: activeQuiz, error } = await supabaseClient
    .from('quizzes')
    .select('*')
    .eq('is_active', true)
    .eq('type', type)
    .order('start_time', { ascending: false })
    .limit(1);

  if (error || !activeQuiz || activeQuiz.length === 0) return null;

  const quiz = activeQuiz[0];
  const started = new Date(quiz.start_time);
  const now = new Date();
  const elapsed = (now - started) / 1000;

  if (elapsed < duration) {
    return quiz;
  }


  await supabaseClient
    .from('quizzes')
    .update({ is_active: false })
    .eq('quiz_id', quiz.quiz_id);

  return null;
};

export const getQuizCorrectCompletions = async (quiz_id) => {
  try {
    const { data, error } = await supabaseClient
      .from('user_answers')
      .select('user_id, user_data, correct, completion_date')
      .eq('quiz_id', quiz_id)
      .eq('correct', true);

    if (error) {
      throw new Error(error.message);
    }

    return data;

  } catch (error) {
    logger.error('Error getting quiz completions from DB: ', error);
    throw new Error('Failed to get quiz completions.');
  }
}

export const getQuizTypes = async (lang) => {
  try {
    const { data, error } = await supabaseClient
      .from('quiz_types')
      .select('key, value')
      .eq('lang', lang);

    if (error) {
      throw new Error(error.message);
    }

    return data;

  } catch (error) {
    logger.error('Error getting quiz types from DB: ', error);
    throw new Error(error);
  }
}
