import axios from 'axios';
import { API_URL } from './api';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

interface FormData {
  [key: string]: string;
}

async function getAdviceFromLLM(systemPrompt: string, userPrompt: string, model: string, max_tokens: number = 1000, temperature: number = 0.7): Promise<string> {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: max_tokens,
        temperature: temperature,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0]?.message?.content || '응답을 받지 못했습니다.';
  } catch (error) {
    console.error('GROQ API 오류:', error);
    return '오류가 발생했습니다. 다시 시도해 주세요.';
  }
}

export async function getAdviceForStep(step: number, formData: FormData): Promise<string> {
  // ... (기존 코드 유지)
}

export async function summarizeAdvice(allAdvice: string[]): Promise<string> {
  // ... (기존 코드 유지)
}

export async function generateHtmlContent(formData: FormData, summarizedAdvice: string): Promise<string> {
  // ... (기존 코드 유지)
}

export const getGroqResponse = async (
  userMessage: string,
  currentStep: number,
  conversationHistory: { role: string; content: string }[]
): Promise<string> => {
  const systemMessage = `You are an AI assistant helping with website creation. The user is currently at step ${currentStep}. Provide specific advice and guidance appropriate for this step. Respond in Korean.`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'gemma2-9b-it',
        messages: [
          { role: 'system', content: systemMessage },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('GROQ API 호출 오류:', error);
    throw error;
  }
};
