const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";
const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN;

export async function generateImage(prompt: string): Promise<Blob> {
  if (!HF_API_TOKEN) {
    throw new Error("Hugging Face API 토큰이 설정되지 않았습니다.");
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`이미지 생성 실패 (${response.status}): ${errorText}`);
    }

    const imageBlob = await response.blob();
    return imageBlob;
  } catch (error) {
    console.error("이미지 생성 중 오류:", error);
    throw error;
  }
}

// 테스트용 더미 이미지 생성 함수
export async function generateDummyImage(prompt: string): Promise<Blob> {
  // Base64로 인코딩된 1x1 픽셀 투명 PNG 이미지
  const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
  
  const response = await fetch(transparentPixel);
  if (!response.ok) {
    throw new Error(`더미 이미지 생성 실패: ${response.statusText}`);
  }
  
  return await response.blob();
}
