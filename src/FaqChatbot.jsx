import { useState, useRef, useEffect } from 'react';

// FAQ 데이터
const faqData = {
  ko: [
    {
      question: 'T:CURITY가 뭔가요?',
      keywords: ['뭐', '무엇', '소개', '설명', 'tcurity', '티큐리티'],
      answer: 'T:CURITY는 AI 기반 2-Phase CAPTCHA 서비스입니다. 행동 패턴 분석(Phase A)과 이미지 분류(Phase B)를 결합하여 99.7%의 봇 탐지율을 제공합니다.'
    },
    {
      question: '가격은 얼마인가요?',
      keywords: ['가격', '요금', '비용', '얼마', '플랜', '무료'],
      answer: 'Starter(무료): 월 10,000 요청\nGrowth: ₩39,000/월, 100,000 요청\nBusiness: ₩99,000/월, 500,000 요청\nEnterprise: 맞춤 견적\n\n자세한 내용은 가격 페이지를 확인해주세요!'
    },
    {
      question: '어떻게 연동하나요?',
      keywords: ['연동', '설치', '적용', '사용법', 'sdk', '코드', '개발'],
      answer: '3단계로 간단히 연동됩니다:\n\n1. SDK 추가: <script src="https://tcurity.com/sdk.js"></script>\n2. 초기화: TCurity.init({ clientId: "YOUR_ID" })\n3. 검증: TCurity.verify() 호출\n\n자세한 가이드는 문서를 참고해주세요.'
    },
    {
      question: '기존 CAPTCHA와 뭐가 다른가요?',
      keywords: ['차이', '다른', '비교', 'recaptcha', 'hcaptcha', '기존', '장점'],
      answer: 'T:CURITY의 차별점:\n\n✓ 2-Phase 검증: 행동 분석 + 이미지 인식\n✓ 빠른 속도: 평균 1-3초 (기존 5-10초)\n✓ AI 봇 탐지: 모든 플랜에서 제공\n✓ 개인정보 최소화: 브라우징 추적 없음\n✓ 합리적인 가격: 경쟁사 대비 97% 저렴'
    },
    {
      question: '보안은 안전한가요?',
      keywords: ['보안', '안전', '해킹', '보호', '신뢰'],
      answer: 'T:CURITY는 Zero-trust 아키텍처를 사용합니다:\n\n✓ 모든 토큰은 서버 간(S2S) 통신으로만 검증\n✓ IP 기반 적응형 레이트 리미팅\n✓ 암호화된 통신 (TLS 1.3)\n✓ 실시간 위협 모니터링'
    },
    {
      question: '지원하는 플랫폼은?',
      keywords: ['플랫폼', '지원', '웹', '앱', '모바일', '프레임워크', 'react', 'vue'],
      answer: '현재 지원 플랫폼:\n\n✓ 웹: JavaScript SDK (React, Vue, Angular 등)\n✓ 백엔드: REST API (Node.js, Python, Java 등)\n\n모바일 SDK는 준비 중입니다.'
    },
    {
      question: '문의는 어디로 하나요?',
      keywords: ['문의', '연락', '상담', '이메일', '지원', '고객'],
      answer: '문의 방법:\n\n📧 이메일: support@tcurity.com\n💬 카카오톡: @tcurity\n📞 전화: 02-XXX-XXXX (평일 09-18시)\n\nEnterprise 플랜은 전담 매니저가 배정됩니다.'
    },
    {
      question: '데모를 체험할 수 있나요?',
      keywords: ['데모', '체험', '테스트', '시연', '무료'],
      answer: '네! 상단의 "데모 체험" 버튼을 클릭하시면 바로 체험하실 수 있습니다.\n\n실제 SDK 모드와 데모 모드 중 선택 가능합니다.'
    }
  ],
  en: [
    {
      question: 'What is T:CURITY?',
      keywords: ['what', 'about', 'intro', 'explain', 'tcurity'],
      answer: 'T:CURITY is an AI-powered 2-Phase CAPTCHA service. It combines behavioral analysis (Phase A) and image classification (Phase B) to achieve 99.7% bot detection rate.'
    },
    {
      question: 'How much does it cost?',
      keywords: ['price', 'cost', 'pricing', 'plan', 'free'],
      answer: 'Starter (Free): 10,000 requests/mo\nGrowth: $29/mo, 100,000 requests\nBusiness: $79/mo, 500,000 requests\nEnterprise: Custom pricing\n\nCheck our pricing page for details!'
    },
    {
      question: 'How do I integrate?',
      keywords: ['integrate', 'install', 'setup', 'sdk', 'code', 'dev'],
      answer: 'Simple 3-step integration:\n\n1. Add SDK: <script src="https://tcurity.com/sdk.js"></script>\n2. Initialize: TCurity.init({ clientId: "YOUR_ID" })\n3. Verify: Call TCurity.verify()\n\nSee our docs for detailed guide.'
    },
    {
      question: 'How is it different from others?',
      keywords: ['different', 'compare', 'recaptcha', 'hcaptcha', 'better', 'advantage'],
      answer: 'T:CURITY advantages:\n\n✓ 2-Phase verification\n✓ Faster: 1-3 seconds avg\n✓ AI detection on all plans\n✓ Privacy-focused\n✓ 97% cheaper than competitors'
    },
    {
      question: 'Is it secure?',
      keywords: ['secure', 'security', 'safe', 'hack', 'protect'],
      answer: 'T:CURITY uses Zero-trust architecture:\n\n✓ S2S token verification only\n✓ Adaptive rate limiting\n✓ TLS 1.3 encryption\n✓ Real-time threat monitoring'
    },
    {
      question: 'What platforms are supported?',
      keywords: ['platform', 'support', 'web', 'mobile', 'framework', 'react', 'vue'],
      answer: 'Currently supported:\n\n✓ Web: JavaScript SDK (React, Vue, Angular, etc.)\n✓ Backend: REST API (Node.js, Python, Java, etc.)\n\nMobile SDK coming soon.'
    },
    {
      question: 'How can I contact you?',
      keywords: ['contact', 'support', 'email', 'help'],
      answer: 'Contact us:\n\n📧 Email: support@tcurity.com\n💬 Discord: discord.gg/tcurity\n\nEnterprise plans include dedicated support.'
    },
    {
      question: 'Can I try a demo?',
      keywords: ['demo', 'try', 'test', 'free'],
      answer: 'Yes! Click the "Try Demo" button at the top to experience it right away.\n\nYou can choose between Live SDK mode and Demo mode.'
    }
  ]
};

// 아이콘들
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/>
    <line x1="8" y1="16" x2="8" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

// 키워드 매칭으로 답변 찾기
function findAnswer(input, lang) {
  const data = faqData[lang] || faqData.ko;
  const lowerInput = input.toLowerCase();
  
  let bestMatch = null;
  let maxScore = 0;
  
  for (const faq of data) {
    let score = 0;
    for (const keyword of faq.keywords) {
      if (lowerInput.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = faq;
    }
  }
  
  if (bestMatch && maxScore > 0) {
    return bestMatch.answer;
  }
  
  return lang === 'ko' 
    ? '죄송합니다, 해당 질문에 대한 답변을 찾지 못했습니다. 아래 버튼 중 하나를 선택하시거나, support@tcurity.com으로 문의해주세요.'
    : "Sorry, I couldn't find an answer to that question. Please select one of the buttons below or contact support@tcurity.com.";
}

export default function FaqChatbot({ lang = 'ko' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const data = faqData[lang] || faqData.ko;
  const texts = {
    ko: {
      title: 'T:CURITY 도우미',
      subtitle: '무엇이 궁금하세요?',
      placeholder: '질문을 입력하세요...',
      greeting: '안녕하세요! 👋\nT:CURITY에 대해 궁금한 점이 있으시면 아래 버튼을 클릭하거나 직접 질문해주세요.',
    },
    en: {
      title: 'T:CURITY Helper',
      subtitle: 'How can I help you?',
      placeholder: 'Type your question...',
      greeting: 'Hello! 👋\nIf you have any questions about T:CURITY, click a button below or type your question.',
    }
  };
  const t = texts[lang] || texts.ko;
  
  // 초기 인사 메시지
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        type: 'bot',
        text: t.greeting,
        time: new Date()
      }]);
    }
  }, [isOpen]);
  
  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // FAQ 버튼 클릭
  const handleFaqClick = (faq) => {
    const userMsg = { type: 'user', text: faq.question, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    setIsTyping(true);
    setTimeout(() => {
      const botMsg = { type: 'bot', text: faq.answer, time: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };
  
  // 직접 입력 전송
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMsg = { type: 'user', text: inputValue, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    const answer = findAnswer(inputValue, lang);
    setInputValue('');
    
    setIsTyping(true);
    setTimeout(() => {
      const botMsg = { type: 'bot', text: answer, time: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };
  
  return (
    <>
      {/* 플로팅 버튼 */}
      <button 
        className={`chatbot-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="FAQ 챗봇"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
      
      {/* 챗봇 창 */}
      {isOpen && (
        <div className="chatbot-window">
          {/* 헤더 */}
          <div className="chatbot-header">
            <div className="chatbot-header-icon">
              <BotIcon />
            </div>
            <div className="chatbot-header-info">
              <h4>{t.title}</h4>
              <p>{t.subtitle}</p>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          
          {/* 메시지 영역 */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg ${msg.type}`}>
                {msg.type === 'bot' && (
                  <div className="chatbot-avatar">
                    <BotIcon />
                  </div>
                )}
                <div className="chatbot-bubble">
                  {msg.text.split('\n').map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="chatbot-msg bot">
                <div className="chatbot-avatar">
                  <BotIcon />
                </div>
                <div className="chatbot-bubble typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* FAQ 버튼들 */}
          <div className="chatbot-faq-buttons">
            {data.slice(0, 4).map((faq, i) => (
              <button 
                key={i} 
                className="chatbot-faq-btn"
                onClick={() => handleFaqClick(faq)}
              >
                {faq.question}
              </button>
            ))}
          </div>
          
          {/* 입력 영역 */}
          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.placeholder}
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send">
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
