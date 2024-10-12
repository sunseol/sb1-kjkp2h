import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY; // Vite 환경 변수 사용

const getSystemMessage = (currentStep: number) => {
  const stepDescriptions = [
    "Basic business information input",
    "Target audience information input",
    "Detailed product/service information writing",
    "Marketing goals and brand identity definition",
    "Additional content elements input",
    "Contact and legal information input",
    "Final project result review"
  ];

  return `You are an AI assistant helping with website creation. The user is currently at step ${currentStep} (${stepDescriptions[currentStep - 1]}). Provide specific advice and guidance appropriate for this step. Respond in Korean. You can use markdown formatting in your responses to enhance readability.`;
};

export const getGroqResponse = async (
  userMessage: string,
  currentStep: number,
  conversationHistory: { role: string; content: string }[]
) => {
  try {
    console.log('API 요청:', userMessage, currentStep);
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'gemma2-9b-it',
        messages: [
          { role: 'system', content: getSystemMessage(currentStep) },
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
    console.log('API 응답:', response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('GROQ API 호출 오류:', error);
    throw error;
  }
};

export const generateHtmlContent = async (formData: any) => {
  try {
    console.log('HTML 생성 API 요청 데이터:', JSON.stringify(formData, null, 2));

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: `You are an AI assistant that generates HTML content based on provided form data. Create a complete HTML document with appropriate styling. Your response should contain only the HTML code, without any additional explanations or markdown formatting. Start your response with <!DOCTYPE html> and end it with </html>.

            The HTML structure should include:
            1. A header with navigation
            2. A hero section with a main headline, subheadline, and a CTA button
            3. A main content area with multiple sections (e.g., features, about us, testimonials)
            4. A footer with contact information and links

            Use modern CSS practices, including flexbox or grid for layout. Ensure the design is responsive and visually appealing. Include appropriate semantic HTML5 tags.

            Incorporate the following elements from the form data:
            - Company name and industry in the header and hero section
            - Main product/service description in the hero and a dedicated section
            - Target audience information in an 'Ideal For' section
            - Product features and unique selling points in a 'Features' section
            - Pricing information if provided
            - Call-to-action buttons throughout the page
            - Customer reviews in a 'Testimonials' section
            - FAQ section if data is provided
            - Contact information in the footer

            Ensure the design aligns with the brand identity (colors, tone) provided in the form data.`
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
};
