import axios from 'axios';


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
      systemPrompt = `#Analyze the following basic business information and provide advice in Korean, considering these key points:

Company Name: {company_name}
Industry: {industry}
Main Product/Service: {main_product_service}

##For each element, use this structure:
1. Observation: Describe what you notice.
2. Evaluation: Assess based on the given criteria.
3. Advice: Provide specific suggestions for improvement. PROVIDE USING '<ADVICE>' TAG

##Consider:
1. Is the company name memorable and easy to pronounce?
2. Is the industry description specific and immediately understandable?
3. Does the main product/service name convey core values or features?
4. How can this information be prominently displayed at the top of the landing page?

###Provide detailed advice on how to improve each element and explain how they should be integrated into the landing page's HTML structure for maximum impact.`;
      userPrompt = `
        다음 정보를 바탕으로 랜딩 페이지 전략을 위한 핵심 인사이트와 추천사항을 제공해주세요:
        
        회사명: ${formData.companyName}
        업종: ${formData.industry}
        주요 제품 또는 서비스: ${formData.mainProduct}

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 1500;
      temperature = 0.7;
      break;
    case 2:
      systemPrompt = `#Examine the target audience information using the ReAct framework. Respond in Korean.

Target Audience: {target_audience}

##1. Observe:
   - What demographic characteristics are mentioned?
   - Are behavioral patterns or lifestyle factors included?
   - Is there a clear definition of the audience's pain points?

##2. Think:
   - How well-defined is this target audience?
   - Are there any missing crucial details?
   - How might this audience information influence the page's language and tone?

##3. Act:
   - Suggest improvements to make the audience definition more specific and actionable.
   - Recommend ways to address the audience's pain points on the landing page.
   - Propose how to adjust the page's language and tone to resonate with this audience.

##4. Reflect:
   - Explain how a well-defined target audience can improve the overall effectiveness of the landing page.
   - Discuss how this information should guide content creation and design choices.

###Ensure all advice is specific, actionable, and tailored to creating an effective landing page for this audience.`;
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
      systemPrompt = `#Evaluate the product/service details provided. Use the following structure to give advice in Korean, referencing these examples:

##Effective: "Our AI-powered analytics tool increases marketing ROI by 35% on average, outperforming competitors by using proprietary machine learning algorithms."
##Less Effective: "We offer the best analytics tool with AI features."

Product/Service Details: {product_service_details}

###Analyze and advise on:
1. Benefit Focus: How well are the features translated into customer benefits?
2. Differentiation: Is the unique value proposition clear and measurable compared to competitors?
3. Pricing Transparency: Is pricing information provided clearly alongside value propositions?
4. Visual Presentation: How could this information be presented visually (e.g., images, icons, infographics)?

###For each point:
- Evaluate the current information
- Provide specific advice for improvement
- Suggest how to implement these improvements in the landing page's HTML and CSS structure

####Explain how these enhancements can make the product/service offering more compelling and clear to potential customers.`;
      userPrompt = `
        다음 정보를 바탕으로 제품/서비스의 강점을 부각시킬 수 있는 랜딩 페이지 전략과 콘텐츠 추천사항을 제공해주세요:
        
        제품/서비스 주요 특징: ${formData.productFeatures}
        경쟁사 대비 차별화 포인트: ${formData.uniqueSellingPoints}
        가격 정보: ${formData.priceInfo}

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 3000;
      temperature = 0.7;
      break;
    case 4:
      systemPrompt = `#Analyze the marketing goals and brand identity information. Provide advice in Korean using this structure:

Marketing Goal: {marketing_goal}
Brand Slogan: {brand_slogan}
Brand Colors: {brand_colors}
Brand Tone: {brand_tone}

##For each element:
1. Observation: Describe the current state.
2. Evaluation: Assess effectiveness and alignment with best practices.
3. Advice: Offer specific improvements.

##Consider:
1. Does the marketing goal align with an appropriate CTA? How can the CTA be optimized?
2. Is the brand slogan concise yet powerful? How can it be improved?
3. Do the chosen colors match the brand image and create visual impact?
4. Is the brand tone consistent and relatable to the target audience?

###Provide detailed suggestions on how to implement these elements in the landing page design, including specific HTML and CSS recommendations where appropriate.`;
      userPrompt = `
        다음 정보를 바탕으로 브랜드 아이덴티티를 강화하고 마케팅 목표를 달성할 수 있는 랜딩 페이지 전략과 디자인 추천사항을 제공해주세요:
        
        랜딩 페이지의 주요 목적: ${formData.marketingGoal}
        희망하는 주요 행동 유도 (CTA) 내용: ${formData.callToAction}
        브랜드 슬로건: ${formData.brandSlogan}
        브랜드 색상: ${formData.brandColors}
        브랜드 톤앤보이스: ${formData.brandTone}

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 1500;
      temperature = 0.7;
      break;
    case 5:
      systemPrompt = `#Evaluate the additional content elements. Use the following examples and structure to provide advice in Korean:

##Effective Review: "XYZ Tool increased our productivity by 40% within a month! The customer support team was always there when we needed them." - John Doe, CEO of ABC Corp (with logo)
##Effective FAQ: Q: "How quickly can I expect results?" A: "Most customers see significant improvements within 2-4 weeks of consistent use."

Customer Reviews: {customer_reviews}
FAQ: {faq_list}

###For each element:
1. Authenticity: Are the reviews genuine and detailed? Do they include customer names/logos?
2. Relevance: Do the FAQs address common customer concerns?
3. Clarity: Are the FAQ answers clear and concise?
4. Placement: Where could these elements be strategically placed on the landing page?

###Provide specific advice on:
- Improving the authenticity and impact of customer reviews
- Enhancing the FAQ to address potential customer objections
- Optimal placement of these elements to boost conversion rates

####Suggest HTML structures and CSS styles to effectively present these elements on the landing page.`;
      userPrompt = `
        다음 정보를 바탕으로 신뢰도를 높이고 고객의 궁금증을 해소할 수 있는 랜딩 페이지 콘텐츠 전략과 구성 추천사항을 제공해주세요:
        
        고객 후기 또는 추천사: ${formData.customerReviews}
        FAQ 항목: ${formData.faqItems}

        각 항목에 대해 구체적이고 실행 가능한 조언을 제공해주세요.
      `;
      model = 'gemma2-9b-it';
      max_tokens = 1500;
      temperature = 0.7;
      break;
    case 6:
      systemPrompt = `Analyze the contact and legal information provided. Give advice in Korean following this chain of considerations:

Contact Information: {contact_info}
Social Media Links: {social_media_links}
Legal Documents: {legal_docs}

1. Contact Method Diversity:
   - Are multiple contact methods provided?
   - How can these be presented to cater to different customer preferences?

2. Social Media Presence:
   - Are all listed social media accounts actively maintained?
   - How should these be displayed on the landing page?

3. Legal Information Accessibility:
   - Are privacy policy and terms of service easily accessible?
   - How can these be placed without disrupting the main content flow?

4. Response Time Expectations:
   - Is there information about expected response times?
   - How can this be effectively communicated?

For each point:
- Evaluate the current information
- Provide specific advice for improvement
- Suggest implementation in the landing page's HTML structure

Explain how these elements contribute to building trust and meeting legal requirements while maintaining a user-friendly design.`;
      userPrompt = `
        다음 정보를 바탕으로 고객과의 접점을 늘리고 신뢰를 구축할 수 있는 랜딩 페이지의 연락처 및 법적 정보 섹션 구성에 대한 추천사항을 제공해주세요:
        
        이메일 주소: ${formData.email}
        전화번호: ${formData.phone}
        소셜 미디어 링크: ${formData.socialMedia}
        개인정보 처리방침 링크: ${formData.privacyPolicyLink}
        이용약관 링크: ${formData.termsOfServiceLink}

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

export async function summarizeAdvice(allAdvice: string[]): Promise<string> {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'gemma2-9b-it',
        messages: [
          { 
            role: 'system', 
            content: `Synthesize the advice from the previous 6 stages to create a comprehensive landing page strategy. Provide your response in Korean. Follow this structure:

1. Review and summarize the key points from each stage:
   - Basic Business Information
   - Target Audience
   - Product/Service Details
   - Marketing Goals and Brand Identity
   - Additional Content Elements
   - Contact and Legal Information

2. Identify overarching themes or strategies that emerge from these points.

3. Create a cohesive landing page strategy that addresses:
   - Overall messaging and value proposition
   - Design and layout recommendations
   - Content hierarchy and flow
   - Call-to-action strategy
   - Trust-building elements

4. Provide a high-level outline of the landing page structure, including:
   - Key sections and their order
   - Critical elements to include in each section
   - Suggestions for visual elements or interactive features

5. Address any potential conflicts or inconsistencies in the advice from different stages, and suggest resolutions.

6. Offer 3-5 key actionable steps to implement this strategy, prioritized by potential impact.

7. Conclude with a brief statement on how this optimized landing page is expected to perform in meeting the stated business and marketing goals.

Ensure that your synthesis remains true to the insights and recommendations from each previous stage, without distorting their original intent or content. The goal is to create a unified, actionable strategy that leverages all the specific advice provided earlier.`
          },
          { 
            role: 'user', 
            content: `다음은 웹사이트 제작의 각 단계에서 받은 조언들입니다. 이를 종합하여 핵심 포인트를 요약해주세요:\n\n${allAdvice.join('\n\n')}`
          }
        ],
        max_tokens: 3000,
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
    console.error('조언 요약 중 오류 발생:', error);
    throw error;
  }
}

export async function generateHtmlContent(formData: FormData, summarizedAdvice: string): Promise<string> {
  try {
    console.log('HTML 생성 API 요청 데이터:', JSON.stringify(formData, null, 2));
    console.log('요약된 조언:', summarizedAdvice);

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.2-90b-text-preview',
        messages: [
          { 
            role: 'system', 
            content: `Here's the final prompt for creating a landing page based on the provided form data and summarized advice:

"Create a responsive landing page using HTML, Tailwind CSS, and JavaScript based on the following form data and summarized advice:

Form data: ${JSON.stringify(formData)}
Summarized advice: ${summarizedAdvice}

Follow these instructions to create the landing page:

1. Structure: Create a responsive layout that includes a header, main content area, and footer. Use CSS flexbox or grid for layout.

2. Content: Incorporate the form data and summarized advice into the page content. Create a compelling headline and subheadline that capture the main message.

3. Design:
   - Develop a cohesive color scheme and typography based on the form data or create a complementary scheme that aligns with the page's purpose.
   - Use SVG images to illustrate key concepts or features. Create these images inline and ensure they complement the overall design.
   - Position buttons strategically throughout the page to encourage user interaction. Style them to be visually appealing and consistent with the overall design.
   - Implement subtle animations to enhance user experience without overwhelming the content.

4. Key Sections:
   - Create a prominent call-to-action (CTA) section that aligns with the page's goals.
   - Develop a benefits or features section highlighting key points from the form data and summarized advice.
   - Implement social proof elements such as testimonials or client logos if applicable.

5. Functionality:
   - Add a simple navigation menu if required by the page's purpose.
   - Implement basic form functionality with JavaScript validation if user input is needed.
   - Include appropriate alt text for images and aria labels for interactive elements to ensure accessibility.
   - Add basic analytics tracking code (e.g., Google Analytics) to monitor page performance.

6. Optimization:
   - Optimize the page for fast loading times by minimizing file sizes and using efficient code.
   - Implement basic SEO best practices, including appropriate meta tags and heading structure.

7. Code Quality:
   - Organize the HTML, CSS, and JavaScript code logically and include helpful comments explaining key sections.

Ensure that the final landing page is visually appealing, persuasive, and effectively communicates the main message derived from the form data and summarized advice. The page should be fully responsive and function well on both desktop and mobile devices.`
          },
          { 
            role: 'user', 
            content: `Based on the following summarized advice, generate a complete HTML structure for a landing page. Include the Tailwind CSS CDN link and use Tailwind classes for styling. The summarized advice is as follows:

폼 데이터: ${JSON.stringify(formData)}

요약된 조언: ${summarizedAdvice}

Please provide:

Remember to write all explanations and comments in Korean, while keeping the HTML tags and attributes in English. Ensure the design is modern, responsive, and visually appealing.`
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