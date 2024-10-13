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
    case 2:
      systemPrompt = `당신은 타겟 오디언스 분석 및 콘텐츠 전략 수립 전문가입니다. 주어진 타겟 고객 정보를 바탕으로 효과적인 랜딩 페이지 콘텐츠 전략을 제안해야 합니다. 응답은 한국어로 작성하며, 마크다운 형식을 사용하여 가독성을 높여주세요.`;
      userPrompt = `
        다음 정보를 바탕으로 타겟 오디언스에 맞는 랜딩 페이지 전략과 콘텐츠 추천사항을 제공해주세요:
        
        주 타겟 고객층: ${formData.targetAudience}
        타겟 고객의 주요 관심사 또는 니즈: ${formData.customerInterests}

        1. 타겟 오디언스 상세 프로필 작성
        2. 주요 관심사 및 니즈 분석
        3. 효과적인 메시지 전달 방식 제안
        4. 콘텐츠 유형 및 구조 추천
        5. 고객 참여 유도 전략

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 1500;
      temperature = 0.7;
      break;
    case 3:
      systemPrompt = `당신은 제품/서비스 마케팅 전략 전문가입니다. 주어진 제품/서비스 정보를 바탕으로 효과적인 랜딩 페이지 전략을 제안해야 합니다. 응답은 한국어로 작성하며, 마크다운 형식을 사용하여 가독성을 높여주세요.`;
      userPrompt = `
        다음 정보를 바탕으로 제품/서비스의 강점을 부각시킬 수 있는 랜딩 페이지 전략과 콘텐츠 추천사항을 제공해주세요:
        
        제품/서비스 주요 특징: ${formData.productFeatures}
        경쟁사 대비 차별화 포인트: ${formData.uniqueSellingPoints}
        가격 정보: ${formData.priceInfo}

        1. 제품/서비스 핵심 가치 제안
        2. 주요 특징 및 장점 강조 방안
        3. 경쟁사 대비 차별화 전략
        4. 가격 정보 제시 방법
        5. 전환율 향상을 위한 콘텐츠 구성 제안

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 1500;
      temperature = 0.7;
      break;
    case 4:
      systemPrompt = `당신은 브랜드 아이덴티티 및 마케팅 전략 전문가입니다. 주어진 브랜드 정보를 바탕으로 효과적인 랜딩 페이지 전략을 제안해야 합니다. 응답은 한국어로 작성하며, 마크다운 형식을 사용하여 가독성을 높여주세요.`;
      userPrompt = `
        다음 정보를 바탕으로 브랜드 아이덴티티를 강화하고 마케팅 목표를 달성할 수 있는 랜딩 페이지 전략과 디자인 추천사항을 제공해주세요:
        
        랜딩 페이지의 주요 목적: ${formData.marketingGoal}
        희망하는 주요 행동 유도 (CTA) 내용: ${formData.callToAction}
        브랜드 슬로건: ${formData.brandSlogan}
        브랜드 색상: ${formData.brandColors}
        브랜드 톤앤보이스: ${formData.brandTone}

        1. 브랜드 아이덴티티 반영 방안
        2. 효과적인 CTA 설계 및 배치
        3. 시각적 디자인 요소 추천
        4. 브랜드 메시지 전달 전략
        5. 사용자 경험(UX) 최적화 방안

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 1500;
      temperature = 0.7;
      break;
    case 5:
      systemPrompt = `당신은 고객 신뢰도 구축 및 콘텐츠 전략 전문가입니다. 주어진 정보를 바탕으로 효과적인 랜딩 페이지 전략을 제안해야 합니다. 응답은 한국어로 작성하며, 마크다운 형식을 사용하여 가독성을 높여주세요.`;
      userPrompt = `
        다음 정보를 바탕으로 신뢰도를 높이고 고객의 궁금증을 해소할 수 있는 랜딩 페이지 콘텐츠 전략과 구성 추천사항을 제공해주세요:
        
        고객 후기 또는 추천사: ${formData.customerReviews}
        FAQ 항목: ${formData.faqItems}

        1. 고객 후기 활용 전략
        2. FAQ 섹션 구성 및 디자인 제안
        3. 신뢰도 향상을 위한 추가 콘텐츠 아이디어
        4. 사용자 질문 대응 전략
        5. 전환율 향상을 위한 신뢰 요소 배치

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 1500;
      temperature = 0.7;
      break;
    case 6:
      systemPrompt = `당신은 웹사이트 법적 준수사항 및 고객 소통 전략 전문가입니다. 주어진 정보를 바탕으로 효과적인 랜딩 페이지 전략을 제안해야 합니다. 응답은 한국어로 작성하며, 마크다운 형식을 사용하여 가독성을 높여주세요.`;
      userPrompt = `
        다음 정보를 바탕으로 고객과의 접점을 늘리고 신뢰를 구축할 수 있는 랜딩 페이지의 연락처 및 법적 정보 섹션 구성에 대한 추천사항을 제공해주세요:
        
        이메일 주소: ${formData.email}
        전화번호: ${formData.phone}
        소셜 미디어 링크: ${formData.socialMedia}
        개인정보 처리방침 링크: ${formData.privacyPolicyLink}
        이용약관 링크: ${formData.termsOfServiceLink}

        1. 연락처 정보 제시 방법
        2. 소셜 미디어 통합 전략
        3. 법적 정보 배치 및 접근성
        4. 고객 소통 채널 최적화
        5. 개인정보 보호 및 신뢰도 향상 방안

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 1500;
      temperature = 0.7;
      break;
    default:
      return '해당 단계에 대한 조언을 제공할 수 없습니다.';
  }

  return getAdviceFromLLM(systemPrompt, userPrompt, model, max_tokens, temperature);
}

export async function generateHtmlContent(formData: FormData): Promise<string> {
  try {
    console.log('HTML 생성 API 요청 데이터:', JSON.stringify(formData, null, 2));

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'You are an AI assistant that generates HTML content based on provided form data. Create a complete HTML document with appropriate styling. Your response should contain only the HTML code, without any additional explanations or markdown formatting. Start your response with <!DOCTYPE html> and end it with </html>. The HTML structure should include: 1. A header with navigation 2. A hero section with a main headline, subheadline, and a CTA button 3. A main content area with multiple sections (e.g., features, about us, testimonials) 4. A footer with contact information and links. Use modern CSS practices, including flexbox or grid for layout. Ensure the design is responsive and visually appealing. Include appropriate semantic HTML5 tags. Incorporate the following elements from the form data: Company name and industry in the header and hero section, Main product/service description in the hero and a dedicated section, Target audience information in an "Ideal For" section, Product features and unique selling points in a "Features" section, Pricing information if provided, Call-to-action buttons throughout the page, Customer reviews in a "Testimonials" section, FAQ section if data is provided, Contact information in the footer. Ensure the design aligns with the brand identity (colors, tone) provided in the form data.'
          },
          { 
            role: 'user', 
            content: `Generate an HTML page using the following data: ${JSON.stringify(formData)}`
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('HTML 생성 API 응답 전체:', JSON.stringify(response.data, null, 2));
    console.log('생성된 HTML 콘텐츠:', response.data.choices[0].message.content);

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('HTML 생성 API 호출 오류:', error);
    if (axios.isAxiosError(error)) {
      console.error('오류 응답 데이터:', error.response?.data);
      console.error('오류 상태 코드:', error.response?.status);
    }
    throw error;
  }
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