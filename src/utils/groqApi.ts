import axios from 'axios';

// 환경 변수 타입 선언
interface ImportMetaEnv {
  VITE_GROQ_API_KEY: string;
  // 다른 환경 변수들도 여기에 추가할 수 있습니다.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API_URL = import.meta.env.PROD 
  ? 'https://your-vercel-deployment-url.vercel.app/api' 
  : 'http://localhost:3000/api';

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
  let systemPrompt = '';
  let userPrompt = '';
  let model = '';
  let max_tokens = 1000;
  let temperature = 0.7;

  switch (step) {
    case 1:
      systemPrompt = `당신은 랜딩 페이지 전략 수립을 돕는 전문 마케팅 컨설턴트입니다. 주어진 기업 정보를 바탕으로 효과적인 랜딩 페이지 전략을 제안해야 합니다. 응답은 한국어로 작성하며, 마크다운 형식을 사용하여 가독성을 높여주세요.`;
      userPrompt = `
        다음 정보를 바탕으로 랜딩 페이지 전략을 위한 핵심 인사이트와 추천사항을 제공해주세요:
        
        회사명: ${formData.companyName}
        업종: ${formData.industry}
        주요 제품 또는 서비스: ${formData.mainProduct}

        1. 제품/서비스 유형 분석
        2. 주요 타겟 고객 정의
        3. 핵심 가치 제안 도출
        4. 랜딩 페이지 주요 목표 설정
        5. 전략적 인사이트 및 추천사항 제시

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 1500;
      temperature = 0.7;
      break;
    // ... 다른 case들도 비슷한 방식으로 수정
    default:
      return '해당 단계에 대한 조언을 제공할 수 없습니다.';
  }

  return getAdviceFromLLM(systemPrompt, userPrompt, model, max_tokens, temperature);
}

export async function generateHtmlContent(formData: FormData): Promise<string> {
  // 이 함수의 구현은 그대로 유지합니다.
  // formData를 사용하여 HTML 콘텐츠를 생성하는 로직을 여기에 작성하세요.
  return '생성된 HTML 콘텐츠';
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
