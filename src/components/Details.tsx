import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Layout, Palette, Bot, FileText, Clock, DollarSign, TrendingUp, Globe, Puzzle as Puzzle } from 'lucide-react';

const Details: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
      <Link to="/" className="inline-flex items-center text-white hover:text-blue-200 mb-8">
        <ArrowLeft className="mr-2" /> 홈으로 돌아가기
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">LLM 랜딩페이지 생성기 상세 정보</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon={<Layout className="w-12 h-12 mb-4" />}
          title="맞춤형 디자인"
          description="귀하의 브랜드와 목표에 맞는 독특하고 현대적인 디자인을 제공합니다."
        />
        <FeatureCard
          icon={<Palette className="w-12 h-12 mb-4" />}
          title="다양한 템플릿"
          description="다양한 산업과 목적에 맞는 광범위한 템플릿 라이브러리를 제공합니다."
        />
        <FeatureCard
          icon={<Bot className="w-12 h-12 mb-4" />}
          title="AI 기반 최적화"
          description="AI가 컨텐츠와 레이아웃을 분석하여 전환율을 최적화합니다."
        />
        <FeatureCard
          icon={<Zap className="w-12 h-12 mb-4" />}
          title="빠른 제작 속도"
          description="AI의 도움으로 몇 분 만에 전문적인 랜딩 페이지를 만들 수 있습니다."
        />
      </div>
      
      <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-lg mb-12">
        <div className="flex items-center mb-4">
          <FileText className="w-8 h-8 mr-4 text-yellow-300" />
          <h2 className="text-2xl font-semibold">마케터의 비밀 노트</h2>
        </div>
        <p className="text-lg mb-4">
          "랜딩 페이지 만들기, 정말 골치 아프죠? 콘텐츠는 어떻게 구성해야 할지, 디자인은 또 어떻게 해야 할지... 
          그리고 그 모든 걸 다 만들고 나면 '이게 정말 효과가 있을까?' 하는 의문이 듭니다. 게다가 A/B 테스트는 또 어떻게 해야 하나, 전환율은 어떻게 높일 수 있을까, SEO 최적화는 어떻게 해야 할까 등 끝없는 고민의 연속이죠."
        </p>
        <p className="text-lg mb-4">
          "시간은 부족하고, 전문 지식은 제한적이며, 효과적인 랜딩 페이지를 만들기 위한 리소스는 항상 모자라게 느껴집니다. 이 모든 것이 비즈니스 성장에 큰 장애물이 되고 있다는 걸 잘 알고 계시겠죠?"
        </p>
        <p className="text-lg mb-4">
          저희 LLM 랜딩페이지 생성기는 이런 고민을 완벽히 이해하고 있습니다. 
          AI 기술을 활용해 귀하의 비즈니스 목표, 타겟 고객, 그리고 업계 트렌드를 분석하여 
          최적화된 랜딩 페이지를 제안해 드립니다.
        </p>
        <p className="text-lg mb-4">
          "우리의 AI는 수백만 개의 성공적인 랜딩 페이지를 학습했습니다. 귀하가 입력한 정보를 바탕으로, AI는 가장 효과적인 콘텐츠 구조, 설득력 있는 카피라이팅, 그리고 시선을 사로잡는 디자인 요소를 제안합니다. 더 나아가 SEO 최적화, 모바일 반응형 디자인, 그리고 빠른 로딩 속도까지 모두 고려하여 완벽한 랜딩 페이지를 만들어냅니다."
        </p>
        <p className="text-lg font-semibold">
          "한번 써보세요. 랜딩 페이지 제작이 이렇게 쉬울 줄 몰랐다!!! 말씀하실 겁니다!"
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">LLM 랜딩페이지 생성기의 특별한 가치</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ValueItem icon={<Clock />} text="시간 절약: 몇 시간이 걸리던 작업을 몇 분 만에 완료" />
          <ValueItem icon={<DollarSign />} text="비용 효율: 전문가를 고용하는 것보다 훨씬 저렴한 비용" />
          <ValueItem icon={<TrendingUp />} text="지속적인 최적화: AI가 성과를 분석하고 자동으로 개선점을 제안" />
          <ValueItem icon={<Globe />} text="다국어 지원: 글로벌 시장을 겨냥한 다양한 언어의 랜딩 페이지 생성" />
          <ValueItem icon={<Puzzle />} text="맞춤형 솔루션: 귀하의 비즈니스와 목표에 완벽히 부합하는 랜딩 페이지" />
        </div>
      </div>

      <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">보안 및 데이터 프라이버시</h2>
        <p className="text-lg mb-4">
          "우리는 귀하의 데이터 보안을 최우선으로 생각합니다. LLM 랜딩페이지 생성기는 최고 수준의 암호화 기술을 사용하며, 모든 데이터는 안전하게 보호됩니다. 또한, 우리는 GDPR을 준수하여 귀하의 개인정보를 철저히 관리합니다."
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">AI의 지속적인 학습과 업데이트</h2>
        <p className="text-lg mb-4">
          "우리의 AI는 지속적으로 학습하고 발전합니다. 최신 마케팅 트렌드와 성공적인 랜딩 페이지 사례를 실시간으로 분석하여 항상 최적의 결과를 제공합니다. 정기적인 업데이트를 통해 귀하는 항상 최신 기술의 혜택을 받으실 수 있습니다."
        </p>
      </div>

      <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">고객 지원</h2>
        <p className="text-lg mb-4">
          "질문이 있으신가요? 저희 전문 고객 지원팀이 24/7 대기하고 있습니다. 채팅, 이메일, 전화 등 편리한 방법으로 언제든지 문의해 주세요. 또한, 상세한 사용 가이드와 비디오 튜토리얼을 제공하여 귀하가 LLM 랜딩페이지 생성기를 최대한 활용할 수 있도록 돕고 있습니다."
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">유연한 가격 정책</h2>
        <p className="text-lg mb-4">
          "다양한 요구사항에 맞춘 유연한 가격 정책을 제공합니다. 무료 체험부터 시작해 소규모 비즈니스를 위한 기본 플랜, 대규모 기업을 위한 프리미엄 플랜까지 선택의 폭이 넓습니다. 지금 무료로 시작하고, 필요에 따라 언든지 업그레이드하세요."
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">자주 묻는 질문</h2>
        <FAQ question="AI가 만든 랜 페이지를 수정할 수 있나요?" answer="물론입니다! AI가 제안한 내용을 기반으로 언제든지 자유롭게 수정하고 개선할 수 있습니다." />
        <FAQ question="기술에 대한 전문 지식이 없어도 사용할 수 있나요?" answer="네, 전혀 문제없습니다. 우리의 직관적인 인터페이스는 기술 지식이 없는 분들도 쉽게 사용할 수 있도록 설계되었습니다." />
        <FAQ question="생성된 랜딩 페이지의 소유권은 누구에게 있나요?" answer="생성된 모든 콘텐츠의 소유권은 전적으로 고객님께 있습니다. 자유롭게 사용하고 수정할 수 있습니다." />
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">신뢰할 수 있는 서비스</h2>
        <p className="text-lg mb-4">
          "이미 1,000개 이상의 기업이 LLM 랜딩페이지 생성기를 신뢰하고 있습니다. 평균적으로 고객들은 전환율 35% 상승, 페이지 체류 시간 50% 증가를 경험했습니다."
        </p>
        <div className="bg-white bg-opacity-10 p-4 rounded-lg">
          <div className="flex justify-around items-center">
            <CompanyLogo name="TechNova" industry="tech" />
            <CompanyLogo name="블루오션 금융" industry="finance" />
            <CompanyLogo name="ShopEase" industry="ecommerce" />
            <CompanyLogo name="헬스케어플러스" industry="health" />
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Link
          to="/auth"
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold inline-flex items-center hover:bg-blue-100 transition duration-300"
        >
          무료로 시작하기 <ArrowLeft className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-lg">
    {icon}
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p>{description}</p>
  </div>
);

const ValueItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center">
    <div className="mr-4">{icon}</div>
    <p>{text}</p>
  </div>
);

const FAQ: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="mb-4">
    <p className="font-semibold">{question}</p>
    <p>{answer}</p>
  </div>
);

interface CompanyLogoProps {
  name: string;
  industry: 'tech' | 'finance' | 'ecommerce' | 'health';
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ name, industry }) => (
  <div className="flex flex-col items-center">
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="60" rx="5" fill="white" fillOpacity="0.1"/>
      {industry === 'tech' && (
        <>
          <circle cx="30" cy="30" r="15" fill="#4CAF50"/>
          <path d="M70 20L80 30L70 40" stroke="#4CAF50" strokeWidth="4"/>
          <path d="M60 30H80" stroke="#4CAF50" strokeWidth="4"/>
        </>
      )}
      {industry === 'finance' && (
        <>
          <path d="M20 40V20L40 40V20" stroke="#2196F3" strokeWidth="4"/>
          <circle cx="70" cy="30" r="15" stroke="#2196F3" strokeWidth="4"/>
        </>
      )}
      {industry === 'ecommerce' && (
        <>
          <path d="M20 25H30L35 40H75L80 25H40" stroke="#FFC107" strokeWidth="4"/>
          <circle cx="40" cy="50" r="5" fill="#FFC107"/>
          <circle cx="70" cy="50" r="5" fill="#FFC107"/>
        </>
      )}
      {industry === 'health' && (
        <>
          <path d="M30 15V45M15 30H45" stroke="#E91E63" strokeWidth="4"/>
          <path d="M60 30C60 20 65 15 70 15C75 15 80 20 80 30C80 40 70 45 70 45C70 45 60 40 60 30Z" stroke="#E91E63" strokeWidth="4"/>
        </>
      )}
    </svg>
    <p className="mt-2 text-sm font-semibold">{name}</p>
  </div>
);

export default Details;