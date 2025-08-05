import { supabaseClient } from '../config/supabaseClient.js';
import crypto from 'crypto';

export const storeQuiz = async ({ type, quiz, duration }) => {
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

    console.log('✅ Quiz salvat cu succes în Supabase!', quizId);

    // Dezactivează automat după 15 secunde
    setTimeout(async () => {
      const { error: updErr } = await supabaseClient
        .from('quizzes')
        .update({ is_active: false })
        .eq('quiz_id', quizId);

      if (updErr) console.error('❌ Eroare dezactivare quiz:', updErr);
      else console.log(`🔕 Quiz ${quizId} inactiv acum.`);
    }, duration * 1000);

    return quizId;
  } catch (err) {
    console.error('❌ Error storing quiz in DB:', err);
    throw new Error('Failed to store quiz in database.');
  }
};



export const storeUserAnswer = async ({ user_id, quiz_id, correct, user_data }) => {
  try {
    console.log('📦 Inserare în Supabase:', {
      user_id,
      quiz_id,
      correct,
      user_data
    });

    // 1. Inserează răspunsul în user_answers
    const { data: answerData, error: insertError } = await supabaseClient
      .from('user_answers')
      .insert([{ user_id, quiz_id, correct, user_data }])
      .select('user_answer_id');

    if (insertError) {
      console.error('❌ Supabase insert error:', insertError);
      throw new Error(insertError.message);
    }

    // 2. Incrementează coloana answers din quizzes
    const { data: current, error: readError } = await supabaseClient
      .from('quizzes')
      .select('answers')
      .eq('quiz_id', quiz_id)
      .single();

    if (readError) {
      console.error('❌ Supabase select error:', readError);
      throw new Error(readError.message);
    }

    const { data: updatedQuiz, error: updateError } = await supabaseClient
      .from('quizzes')
      .update({ answers: (current.answers || 0) + 1 })
      .eq('quiz_id', quiz_id)
      .select('answers')
      .single();

    if (updateError) {
      console.error('❌ Supabase update error:', updateError);
      throw new Error(updateError.message);
    }


    console.log('✅ Răspuns salvat și counter incrementat:', answerData[0]?.user_answer_id);
    return {
      user_answer_id: answerData[0]?.user_answer_id,
      updated_answers: updatedQuiz[0]?.answers
    };
  } catch (err) {
    console.error('❌ Unexpected error storing user answer:', err);
    throw err;
  }
};


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
    console.error('Error getting quiz completions from DB: ', error);
    throw new Error('Failed to get quiz completions.');
  }
}
