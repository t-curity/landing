import { useState, useRef, useEffect } from 'react';
import './App.css';
import FaqChatbot from './FaqChatbot';
import './FaqChatbot.css';

// ============================================
// SVG Icons (Lucide-style, MIT License)
// ============================================
const Icons = {
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>,
  globe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  ticket: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>,
  dog: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.344-2.5"/><path d="M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/></svg>,
  apple: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>,
  car: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>,
  github: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
};

// ============================================
// 다국어 지원
// ============================================
const translations = {
  ko: {
    nav: { home: '홈', pricing: '가격', dashboard: '대시보드' },
    hero: {
      badge: '차세대 CAPTCHA 보안',
      title1: '봇은 막고,',
      title2: '사람은 통과',
      desc: '행동 패턴 분석과 이미지 인식을 결합한 2-Phase 검증으로 99.7%의 봇 탐지율',
      tryDemo: '데모 체험',
      docs: '설치 가이드',
      stat1: '탐지율',
      stat2: '평균 시간',
      stat3: '이중 검증'
    },
    features: {
      title: 'T:CURITY를 선택해야 하는 이유',
      desc: 'AI 기반 행동 분석과 이미지 검증으로 빠르고 정확한 봇 탐지를 제공합니다.',
      items: [
        { tag: 'Ticket Slice', title: '행동 패턴 분석', text: 'Isolation Forest 알고리즘으로 마우스 드래그 궤적과 속도 변화를 실시간 분석합니다.' },
        { tag: 'Drag & Drop', title: '이미지 정렬', text: 'Random Forest 기반 드래그 행동 분석으로 2차 검증을 수행합니다.' },
        { tag: '보안', title: '서버 검증', text: 'Zero-trust 아키텍처로 모든 토큰은 서버 간(S2S) 통신으로만 검증됩니다.' },
        { tag: '보호', title: '요청 제한', text: 'IP 기반 적응형 Rate Limiting으로 무차별 대입 공격을 방어합니다.' },
      ]
    },
    demo: { title: '직접 체험해보세요', desc: '2-Phase 검증이 어떻게 작동하는지 경험해보세요.', phase1: '드래그 분석', phase2: '이미지 선택', launch: '데모 시작' },
    install: { title: '몇 분만에 설치 완료', desc: '몇 줄의 코드로 T:CURITY를 추가하세요.', step1: 'SDK 추가', step2: '초기화', step3: '검증' },
    pricing: {
      title: '오픈런도 견디는 CAPTCHA',
      desc: '숨겨진 비용 없이, 사용한 만큼만 지불하세요',
      monthly: '월간 결제',
      annual: '연간 결제',
      discount: '20% 할인',
      popular: '가장 인기',
      cta: '지금 바로 시작하세요',
      ctaDesc: '무료로 테스트하고, 필요할 때 확장하세요',
      start: '무료로 시작하기',
      contact: '데모 요청',
      compare: '타사 서비스 비교',
      compareNote: '* T:CURITY 초과 요금은 경쟁사 대비 약 97% 저렴',
      perMonth: '/월',
      requests: '요청',
      concurrent: '동시 접속',
      negotiate: '협의',
      unlimited: '무제한',
      plans: [
        { name: 'Starter', desc: '소규모 서비스 & 테스트용', requests: '10,000', concurrent: '50명', features: ['월 10,000 요청', '동시 접속 50명', '기본 봇 탐지 (AI 기반)', '기본 대시보드'], limitations: ['T:CURITY 워터마크', '오토스케일링 미지원'], cta: '무료로 시작' },
        { name: 'Growth', desc: '성장하는 서비스에 적합', requests: '100,000', concurrent: '500명', features: ['월 100,000 요청', '동시 접속 500명', '오토스케일링 (최대 1,000명)', '프리미엄 봇 탐지', '고급 대시보드', '이메일 지원', '워터마크 제거'], limitations: [], cta: '시작하기' },
        { name: 'Business', desc: '티켓/예약 서비스 최적화', requests: '500,000', concurrent: '2,000명', features: ['월 500,000 요청', '동시 접속 2,000명', '오토스케일링 (최대 5,000명)', '프리미엄+ 봇 탐지', '실시간 대시보드', 'Slack/웹훅 알림', '커스텀 브랜딩', 'SLA 99.5%'], limitations: [], cta: '가장 인기' },
        { name: 'Enterprise', desc: '대규모 오픈런 완벽 대응', requests: '무제한', concurrent: '무제한', features: ['무제한 요청', '무제한 동시 접속', '전담 기술 매니저', '24/7 긴급 지원', 'SLA 99.9%', '온프레미스 옵션'], limitations: [], cta: '문의하기' },
      ],
      competitor: {
        headers: ['기능', '글로벌 A사', '글로벌 B사', 'T:CURITY'],
        rows: [
          ['무료 티어', '10,000/월', '100,000/월', '10,000/월'],
          ['유료 시작', '$8/월', '$99/월', '₩39,000/월'],
          ['초과 요금', '$1/1,000건', '$0.99/1,000건', '₩30~50/1,000건'],
          ['AI 봇 탐지', 'Enterprise만', 'Enterprise만', '전 플랜'],
          ['2-Phase 인증', '—', '—', '✓'],
        ]
      }
    },
    dashboard: {
      title: '실시간 모니터링',
      desc: '봇 차단 현황과 트래픽을 한눈에 확인하세요',
      requests: '총 요청',
      blocked: '차단됨',
      rate: '성공률',
      latency: '평균 지연',
      region: '지역별 트래픽',
      activity: '최근 활동',
      country: '국가',
      healthy: '정상'
    },
    footer: { copyright: '© 2026 T:CURITY. All rights reserved.' },
    captcha: {
      title: '사람 인증',
      desc: '2단계 인증을 완료하세요',
      begin: '시작',
      drag: '드래그',
      select: '선택',
      phase1: '선을 따라 드래그하세요',
      phase2: '순서대로 선택하세요',
      hint: '위에서 아래로',
      verified: '인증 완료',
      done: '완료',
      reset: '초기화',
      easy: '쉬움',
      medium: '보통',
      hard: '어려움',
      questions: ['원을 순서대로 선택하세요', '삼각형을 순서대로 선택하세요', '사각형을 순서대로 선택하세요']
    },
    selector: { title: '모드 선택', live: '실제 SDK', liveDesc: '실제 인증 체험', demo: '데모', demoDesc: '노이즈 레벨 테스트', ticket: '예매 데모', ticketDesc: '실제 예매 플로우 체험' },
    contactForm: {
      title: '문의하기',
      desc: '아래 양식을 작성해주시면 빠르게 연락드리겠습니다.',
      name: '이름',
      company: '회사명',
      email: '이메일',
      plan: '관심 플랜',
      planOptions: ['Starter', 'Growth', 'Business', 'Enterprise'],
      message: '문의 내용',
      submit: '문의하기',
      sending: '전송 중...',
      success: '문의가 접수되었습니다!',
      successDesc: '빠른 시일 내에 답변드리겠습니다.',
      error: '전송에 실패했습니다. 다시 시도해주세요.',
      close: '닫기'
    }
  },
  en: {
    nav: { home: 'Home', pricing: 'Pricing', dashboard: 'Dashboard' },
    hero: {
      badge: 'Next-Gen CAPTCHA Security',
      title1: 'Block Bots.',
      title2: 'Pass Humans.',
      desc: '2-Phase behavioral analysis and image recognition with 99.7% bot detection rate.',
      tryDemo: 'Try Demo',
      docs: 'Documentation',
      stat1: 'Detection',
      stat2: 'Avg Time',
      stat3: 'Verification'
    },
    features: {
      title: 'Why T:CURITY?',
      desc: 'Fast and accurate bot detection powered by AI-based behavioral analysis and image verification.',
      items: [
        { tag: 'Ticket Slice', title: 'Behavioral Analysis', text: 'Isolation Forest algorithm analyzes mouse drag trajectories and speed variations in real-time.' },
        { tag: 'Drag & Drop', title: 'Image Sorting', text: 'Random Forest based drag behavior analysis for secondary verification.' },
        { tag: 'Security', title: 'Server Validation', text: 'Zero-trust architecture with mandatory server-to-server (S2S) token verification.' },
        { tag: 'Protection', title: 'Rate Limiting', text: 'IP-based adaptive rate limiting against brute force attacks.' },
      ]
    },
    demo: { title: 'Try it yourself', desc: 'Experience the 2-phase verification flow.', phase1: 'Drag Analysis', phase2: 'Image Selection', launch: 'Launch Demo' },
    install: { title: 'Integration in minutes', desc: 'Add T:CURITY with just a few lines of code.', step1: 'Add SDK', step2: 'Initialize', step3: 'Verify' },
    pricing: {
      title: 'CAPTCHA that survives rush hour',
      desc: 'No hidden costs. Pay only for what you use.',
      monthly: 'Monthly',
      annual: 'Annual',
      discount: '20% OFF',
      popular: 'Most Popular',
      cta: 'Get started now',
      ctaDesc: 'Test for free, scale when needed',
      start: 'Start Free',
      contact: 'Request Demo',
      compare: 'Compare with Competitors',
      compareNote: '* T:CURITY overage is ~97% cheaper than competitors',
      perMonth: '/mo',
      requests: 'requests',
      concurrent: 'concurrent',
      negotiate: 'Contact',
      unlimited: 'Unlimited',
      plans: [
        { name: 'Starter', desc: 'For small projects & testing', requests: '10,000', concurrent: '50', features: ['10,000 requests/mo', '50 concurrent users', 'Basic AI bot detection', 'Basic dashboard'], limitations: ['T:CURITY watermark', 'No auto-scaling'], cta: 'Start Free' },
        { name: 'Growth', desc: 'For growing services', requests: '100,000', concurrent: '500', features: ['100,000 requests/mo', '500 concurrent users', 'Auto-scaling (up to 1,000)', 'Premium bot detection', 'Advanced dashboard', 'Email support', 'No watermark'], limitations: [], cta: 'Get Started' },
        { name: 'Business', desc: 'For ticketing & reservations', requests: '500,000', concurrent: '2,000', features: ['500,000 requests/mo', '2,000 concurrent users', 'Auto-scaling (up to 5,000)', 'Premium+ bot detection', 'Real-time dashboard', 'Slack/Webhook alerts', 'Custom branding', 'SLA 99.5%'], limitations: [], cta: 'Most Popular' },
        { name: 'Enterprise', desc: 'For large-scale events', requests: 'Unlimited', concurrent: 'Unlimited', features: ['Unlimited requests', 'Unlimited concurrent', 'Dedicated manager', '24/7 support', 'SLA 99.9%', 'On-premise option'], limitations: [], cta: 'Contact Us' },
      ],
      competitor: {
        headers: ['Feature', 'Global A', 'Global B', 'T:CURITY'],
        rows: [
          ['Free tier', '10,000/mo', '100,000/mo', '10,000/mo'],
          ['Paid starts', '$8/mo', '$99/mo', '₩39,000/mo'],
          ['Overage', '$1/1,000', '$0.99/1,000', '₩30~50/1,000'],
          ['AI Detection', 'Enterprise only', 'Enterprise only', 'All plans'],
          ['2-Phase', '—', '—', '✓'],
        ]
      }
    },
    dashboard: {
      title: 'Real-time Monitoring',
      desc: 'Monitor bot blocking and traffic at a glance',
      requests: 'Total Requests',
      blocked: 'Blocked',
      rate: 'Success Rate',
      latency: 'Avg Latency',
      region: 'Traffic by Region',
      activity: 'Recent Activity',
      country: 'Country',
      healthy: 'Healthy'
    },
    footer: { copyright: '© 2026 T:CURITY. All rights reserved.' },
    captcha: {
      title: 'Human Verification',
      desc: 'Complete 2-phase verification',
      begin: 'Begin',
      drag: 'Drag',
      select: 'Select',
      phase1: 'Drag along the line',
      phase2: 'Select in order',
      hint: 'Top to bottom',
      verified: 'Verified',
      done: 'Done',
      reset: 'Reset',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      questions: ['Select all circles in order', 'Select all triangles in order', 'Select all squares in order']
    },
    selector: { title: 'Choose Mode', live: 'Live SDK', liveDesc: 'Real verification', demo: 'Demo', demoDesc: 'Test noise levels', ticket: 'Ticket Demo', ticketDesc: 'Try booking flow' },
    contactForm: {
      title: 'Contact Us',
      desc: 'Fill out the form below and we\'ll get back to you shortly.',
      name: 'Name',
      company: 'Company',
      email: 'Email',
      plan: 'Interested Plan',
      planOptions: ['Starter', 'Growth', 'Business', 'Enterprise'],
      message: 'Message',
      submit: 'Submit',
      sending: 'Sending...',
      success: 'Message sent!',
      successDesc: 'We\'ll get back to you soon.',
      error: 'Failed to send. Please try again.',
      close: 'Close'
    }
  }
};

const DIFFICULTY_CONFIG = {
  NORMAL: { noiseLevel: 0, colorShift: 0, brightnessRange: 0, color: '#10b981' },
  MEDIUM: { noiseLevel: 10, colorShift: 5, brightnessRange: 0.1, color: '#f59e0b' },
  HIGH: { noiseLevel: 25, colorShift: 15, brightnessRange: 0.2, color: '#ef4444' },
};

// 스크롤 애니메이션
function useScrollAnimation(activeTab) {
  useEffect(() => {
    // 약간의 딜레이 후 애니메이션 시작 (DOM 렌더링 완료 대기)
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      // 먼저 모든 요소에서 visible 제거
      elements.forEach(el => el.classList.remove('visible'));
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.05, rootMargin: '50px 0px -20px 0px' }
      );
      
      elements.forEach(el => observer.observe(el));
      
      // 클린업 함수를 저장
      return () => observer.disconnect();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [activeTab]);
}

// ============================================
// Demo CAPTCHA
// ============================================
function DemoCaptcha({ onClose, onComplete, t }) {
  const [phase, setPhase] = useState('intro');
  const [isDragging, setIsDragging] = useState(false);
  const [dragPath, setDragPath] = useState([]);
  const [phaseAResult, setPhaseAResult] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [droppedItems, setDroppedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [difficulty, setDifficulty] = useState('NORMAL');
  const canvasRef = useRef(null);
  const imageCanvasRefs = useRef([]);

  // 질문별 이미지 구성: 심플한 도형 사용
  const demoQuestions = [
    { 
      // 원을 순서대로 선택하세요
      answers: [0, 3, 5, 8],
      icons: ['circle', 'triangle', 'square', 'circle', 'diamond', 'circle', 'triangle', 'square', 'circle']
    },
    { 
      // 삼각형을 순서대로 선택하세요
      answers: [1, 4, 6, 7],
      icons: ['circle', 'triangle', 'square', 'diamond', 'triangle', 'circle', 'triangle', 'triangle', 'square']
    },
    { 
      // 사각형을 순서대로 선택하세요
      answers: [2, 3, 5, 8],
      icons: ['circle', 'triangle', 'square', 'square', 'diamond', 'square', 'circle', 'triangle', 'square']
    },
  ];

  // 아이콘 그리기 함수 - 심플한 도형
  const drawIcon = (ctx, type, size) => {
    const c = size / 2;
    const r = size * 0.32;
    ctx.strokeStyle = '#FFE103';
    ctx.fillStyle = '#FFE103';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch(type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(c, c, r, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(c, c - r);
        ctx.lineTo(c + r * 0.95, c + r * 0.75);
        ctx.lineTo(c - r * 0.95, c + r * 0.75);
        ctx.closePath();
        ctx.stroke();
        break;

      case 'square':
        const half = r * 0.8;
        ctx.strokeRect(c - half, c - half, half * 2, half * 2);
        break;

      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(c, c - r);
        ctx.lineTo(c + r * 0.75, c);
        ctx.lineTo(c, c + r);
        ctx.lineTo(c - r * 0.75, c);
        ctx.closePath();
        ctx.stroke();
        break;

      default:
        ctx.beginPath();
        ctx.arc(c, c, r * 0.5, 0, Math.PI * 2);
        ctx.stroke();
    }
  };

  const startPhaseA = () => { setPhase('phaseA'); setDragPath([]); setPhaseAResult(null); };
  
  const handlePhaseAStart = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (y < 0.25) { setIsDragging(true); setDragPath([{ x, y, t: Date.now() }]); }
  };

  const handlePhaseAMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragPath(prev => [...prev, { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height, t: Date.now() }]);
  };

  const handlePhaseAEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragPath.length > 10 && dragPath[dragPath.length - 1].y > 0.75) {
      setPhaseAResult('success');
      setTimeout(() => startPhaseB(), 1000);
    } else if (dragPath.length > 5) {
      setPhaseAResult('fail');
      setTimeout(() => { setDragPath([]); setPhaseAResult(null); }, 1500);
    }
  };

  useEffect(() => {
    if (phase !== 'phaseA') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.fillStyle = '#080810'; ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.02)';
    for (let i = 0; i < rect.width; i += 24) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, rect.height); ctx.stroke(); }
    for (let i = 0; i < rect.height; i += 24) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(rect.width, i); ctx.stroke(); }
    const centerX = rect.width / 2;
    ctx.strokeStyle = 'rgba(255,214,0,0.3)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(centerX, rect.height * 0.08); ctx.lineTo(centerX, rect.height * 0.92); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,214,0,0.2)';
    ctx.beginPath(); ctx.arc(centerX, rect.height * 0.08, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(centerX, rect.height * 0.92, 10, 0, Math.PI * 2); ctx.fill();
    if (dragPath.length > 1) {
      ctx.strokeStyle = '#FFE103'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(dragPath[0].x * rect.width, dragPath[0].y * rect.height);
      dragPath.forEach(p => ctx.lineTo(p.x * rect.width, p.y * rect.height));
      ctx.stroke();
    }
    if (phaseAResult === 'success') { ctx.fillStyle = 'rgba(16,185,129,0.15)'; ctx.fillRect(0, 0, rect.width, rect.height); }
    else if (phaseAResult === 'fail') { ctx.fillStyle = 'rgba(239,68,68,0.15)'; ctx.fillRect(0, 0, rect.width, rect.height); }
  }, [phase, dragPath, phaseAResult]);

  const startPhaseB = () => {
    const idx = Math.floor(Math.random() * demoQuestions.length);
    setQuestionIndex(idx);
    setDroppedItems([]);
    setPhase('phaseB');
  };

  useEffect(() => {
    if (phase !== 'phaseB') return;
    const current = demoQuestions[questionIndex];
    const { noiseLevel } = DIFFICULTY_CONFIG[difficulty];
    
    current.icons.forEach((iconType, idx) => {
      const canvas = imageCanvasRefs.current[idx];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const size = 72;
      canvas.width = size; canvas.height = size;
      
      ctx.fillStyle = '#0c0c14';
      ctx.fillRect(0, 0, size, size);
      
      drawIcon(ctx, iconType, size);
      
      if (noiseLevel > 0) {
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i+3] > 0) {
            const n = (Math.random() - 0.5) * noiseLevel * 2;
            data[i] = Math.max(0, Math.min(255, data[i] + n));
            data[i+1] = Math.max(0, Math.min(255, data[i+1] + n));
            data[i+2] = Math.max(0, Math.min(255, data[i+2] + n));
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
    });
  }, [phase, questionIndex, difficulty]);

  const handlePhaseBDragStart = (index, e) => {
    if (droppedItems.includes(index)) return;
    e.preventDefault();
    setDraggedItem(index);
    setDragPosition({ x: e.touches ? e.touches[0].clientX : e.clientX, y: e.touches ? e.touches[0].clientY : e.clientY });
  };

  const handlePhaseBDragMove = (e) => {
    if (draggedItem === null) return;
    e.preventDefault();
    setDragPosition({ x: e.touches ? e.touches[0].clientX : e.clientX, y: e.touches ? e.touches[0].clientY : e.clientY });
  };

  const handlePhaseBDragEnd = (e) => {
    if (draggedItem === null) return;
    const dropZone = document.getElementById('demo-drop-zone');
    if (dropZone) {
      const rect = dropZone.getBoundingClientRect();
      const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        const current = demoQuestions[questionIndex];
        const newDropped = [...droppedItems, draggedItem];
        setDroppedItems(newDropped);
        if (newDropped.length >= current.answers.length) {
          const ok = newDropped.every(i => current.answers.includes(i)) && current.answers.every(i => newDropped.includes(i));
          if (ok) setTimeout(() => setPhase('success'), 500);
          else setTimeout(() => setDroppedItems([]), 1000);
        }
      }
    }
    setDraggedItem(null);
  };

  useEffect(() => {
    const move = (e) => { if (phase === 'phaseA') handlePhaseAMove(e); if (phase === 'phaseB') handlePhaseBDragMove(e); };
    const end = (e) => { if (phase === 'phaseA') handlePhaseAEnd(); if (phase === 'phaseB') handlePhaseBDragEnd(e); };
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', end);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', end); window.removeEventListener('touchmove', move); window.removeEventListener('touchend', end); };
  });

  const current = demoQuestions[questionIndex];
  const diffLabels = { NORMAL: t.captcha.easy, MEDIUM: t.captcha.medium, HIGH: t.captcha.hard };

  return (
    <div className="captcha-overlay" onClick={onClose}>
      <div className="captcha-modal" onClick={e => e.stopPropagation()}>
        <button className="captcha-close" onClick={onClose}>×</button>
        <div className="captcha-header"><div className="captcha-brand"><span>T:</span>CURITY</div></div>
        
        {phase === 'intro' && (
          <div className="captcha-intro">
            <div className="intro-icon">{Icons.shield}</div>
            <h3>{t.captcha.title}</h3>
            <p>{t.captcha.desc}</p>
            <div className="intro-steps">
              <div className="intro-step"><span className="step-n">1</span><span>{t.captcha.drag}</span></div>
              <span className="step-arrow">→</span>
              <div className="intro-step"><span className="step-n">2</span><span>{t.captcha.select}</span></div>
            </div>
            <button className="captcha-btn" onClick={startPhaseA}>{t.captcha.begin}</button>
          </div>
        )}
        
        {phase === 'phaseA' && (
          <div className="captcha-phase-a">
            <div className="phase-head"><span className="phase-tag">Phase A</span><span>{t.captcha.phase1}</span></div>
            <canvas ref={canvasRef} className="phase-a-canvas" onMouseDown={handlePhaseAStart} onTouchStart={handlePhaseAStart} />
            <div className="phase-hint">↓ {t.captcha.hint}</div>
          </div>
        )}
        
        {phase === 'phaseB' && (
          <div className="captcha-phase-b">
            <div className="phase-head"><span className="phase-tag">Phase B</span><span>{t.captcha.questions[questionIndex]}</span></div>
            <div className="diff-bar">
              {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                <button key={key} className={`diff-btn ${difficulty === key ? 'active' : ''}`} style={{ '--c': config.color }} onClick={() => setDifficulty(key)}>{diffLabels[key]}</button>
              ))}
            </div>
            <div className="img-grid">
              {current.icons.map((_, index) => (
                <div key={index} className={`img-cell ${droppedItems.includes(index) ? 'done' : ''} ${draggedItem === index ? 'dragging' : ''}`} onMouseDown={(e) => handlePhaseBDragStart(index, e)} onTouchStart={(e) => handlePhaseBDragStart(index, e)}>
                  <canvas ref={el => imageCanvasRefs.current[index] = el} width="72" height="72" />
                  {droppedItems.includes(index) && <span className="cell-check">✓</span>}
                </div>
              ))}
            </div>
            <div id="demo-drop-zone" className="drop-area">
              {current.answers.map((_, i) => (
                <div key={i} className={`drop-slot ${droppedItems[i] !== undefined ? 'filled' : ''}`}>
                  {droppedItems[i] !== undefined ? (
                    <svg width="36" height="36" viewBox="0 0 36 36">
                      {current.icons[droppedItems[i]] === 'circle' && <circle cx="18" cy="18" r="12" fill="none" stroke="#FFE103" strokeWidth="2"/>}
                      {current.icons[droppedItems[i]] === 'triangle' && <polygon points="18,6 30,28 6,28" fill="none" stroke="#FFE103" strokeWidth="2"/>}
                      {current.icons[droppedItems[i]] === 'square' && <rect x="7" y="7" width="22" height="22" fill="none" stroke="#FFE103" strokeWidth="2"/>}
                      {current.icons[droppedItems[i]] === 'diamond' && <polygon points="18,4 32,18 18,32 4,18" fill="none" stroke="#FFE103" strokeWidth="2"/>}
                    </svg>
                  ) : (
                    <span className="slot-n">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="phase-foot"><span>{droppedItems.length}/{current.answers.length}</span><button className="reset-btn" onClick={() => setDroppedItems([])}>{t.captcha.reset}</button></div>
          </div>
        )}
        
        {phase === 'success' && (
          <div className="captcha-done">
            <div className="done-icon">✓</div>
            <h3>{t.captcha.verified}</h3>
            <code>tc_{Math.random().toString(36).substr(2, 8)}</code>
            <button className="captcha-btn" onClick={() => { onComplete?.(); setTimeout(onClose, 200); }}>{t.captcha.done}</button>
          </div>
        )}
        
        {draggedItem !== null && phase === 'phaseB' && <div className="drag-ghost" style={{ left: dragPosition.x - 24, top: dragPosition.y - 24 }}><canvas ref={el => { if(el) { el.width=48; el.height=48; const ctx=el.getContext('2d'); ctx.strokeStyle='#FFE103'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(24,24,16,0,Math.PI*2); ctx.stroke(); }}} /></div>}
        
        <div className="captcha-dots">
          <span className={phase === 'intro' ? 'active' : phase !== 'intro' ? 'done' : ''} />
          <span className={phase === 'phaseA' ? 'active' : ['phaseB', 'success'].includes(phase) ? 'done' : ''} />
          <span className={phase === 'phaseB' ? 'active' : phase === 'success' ? 'done' : ''} />
          <span className={phase === 'success' ? 'active done' : ''} />
        </div>
      </div>
    </div>
  );
}

function DemoSelector({ onSelectReal, onSelectDemo, onClose, t }) {
  return (
    <div className="captcha-overlay" onClick={onClose}>
      <div className="captcha-modal selector" onClick={e => e.stopPropagation()}>
        <button className="captcha-close" onClick={onClose}>×</button>
        <div className="captcha-header"><div className="captcha-brand"><span>T:</span>CURITY</div></div>
        <h3>{t.selector.title}</h3>
        <div className="selector-btns">
          <button className="sel-btn" onClick={onSelectReal}><span className="sel-icon">{Icons.lock}</span><strong>{t.selector.live}</strong><small>{t.selector.liveDesc}</small></button>
          <button className="sel-btn demo" onClick={onSelectDemo}><span className="sel-icon">{Icons.play}</span><strong>{t.selector.demo}</strong><small>{t.selector.demoDesc}</small></button>
          <a href="/ticket-site-demo/" className="sel-btn ticket"><span className="sel-icon">{Icons.ticket}</span><strong>{t.selector.ticket}</strong><small>{t.selector.ticketDesc}</small></a>
        </div>
      </div>
    </div>
  );
}

function CaptchaResult({ sessionId, error, onClose }) {
  if (!sessionId && !error) return null;
  return (
    <div className="captcha-overlay" onClick={onClose}>
      <div className="captcha-modal" onClick={e => e.stopPropagation()}>
        <button className="captcha-close" onClick={onClose}>×</button>
        {sessionId && <div className="captcha-done"><div className="done-icon">✓</div><h3>Verified</h3><code>{sessionId}</code></div>}
        {error && <div className="captcha-error"><div className="err-icon">✕</div><h3>Failed</h3><p>{error}</p></div>}
      </div>
    </div>
  );
}

// ============================================
// Contact Form Modal
// ============================================
function ContactFormModal({ onClose, selectedPlan, t }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    plan: selectedPlan || 'Starter',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '11807575-8b11-4760-b4f2-e52835dda1ff',
          subject: `[T:CURITY] ${formData.plan} 플랜 문의 - ${formData.company || formData.name}`,
          from_name: formData.name,
          replyto: formData.email,
          '이름': formData.name,
          '회사명': formData.company || '-',
          '이메일': formData.email,
          '관심 플랜': formData.plan,
          '문의 내용': formData.message || '-'
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="captcha-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={e => e.stopPropagation()}>
        <button className="captcha-close" onClick={onClose}>×</button>
        <div className="contact-header">
          <div className="captcha-brand"><span>T:</span>CURITY</div>
          <h3>{t.contactForm.title}</h3>
          <p>{t.contactForm.desc}</p>
        </div>

        {status === 'success' ? (
          <div className="contact-success">
            <div className="success-icon">✓</div>
            <h4>{t.contactForm.success}</h4>
            <p>{t.contactForm.successDesc}</p>
            <button className="contact-btn" onClick={onClose}>{t.contactForm.close}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>{t.contactForm.name} *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t.contactForm.company}</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>{t.contactForm.email} *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t.contactForm.plan}</label>
              <select name="plan" value={formData.plan} onChange={handleChange}>
                {t.contactForm.planOptions.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t.contactForm.message}</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={4} />
            </div>
            {status === 'error' && <p className="form-error">{t.contactForm.error}</p>}
            <button type="submit" className="contact-btn" disabled={status === 'sending'}>
              {status === 'sending' ? t.contactForm.sending : t.contactForm.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

async function runTCurityCaptcha(clientId = "cust_alpha") {
  if (typeof window.TCuritySDK === 'undefined') throw new Error('SDK not loaded');
  return await window.TCuritySDK.captcha(clientId);
}

// ============================================
// Nav
// ============================================
function Nav({ isDark, onThemeToggle, activeTab, setActiveTab, lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn); }, []);

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}><span className="logo-t">T</span><span className="logo-c">:</span><span className="logo-n">CURITY</span></a>
          <div className="nav-links">
            <a href="#" className={activeTab === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>{t.nav.home}</a>
            <a href="#" className={activeTab === 'pricing' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('pricing'); }}>{t.nav.pricing}</a>
            <a href="#" className={activeTab === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>{t.nav.dashboard}</a>
          </div>
          <div className="nav-right">
            <button className="lang-btn" onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}>{lang === 'ko' ? 'EN' : '한국어'}</button>
            <button className="icon-btn" onClick={onThemeToggle}>{isDark ? '☀️' : '🌙'}</button>
            <a href="https://github.com/t-curity" target="_blank" rel="noopener noreferrer" className="icon-btn">{Icons.github}</a>
          </div>
          <button className="nav-toggle" onClick={() => setOpen(!open)}><span className={open ? 'open' : ''} /></button>
        </div>
      </nav>
      <div className={`mobile-nav ${open ? 'open' : ''}`}>
        <a href="#" className={activeTab === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('home'); setOpen(false); }}>{t.nav.home}</a>
        <a href="#" className={activeTab === 'pricing' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('pricing'); setOpen(false); }}>{t.nav.pricing}</a>
        <a href="#" className={activeTab === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); setOpen(false); }}>{t.nav.dashboard}</a>
        <button className="lang-btn mobile" onClick={() => { setLang(lang === 'ko' ? 'en' : 'ko'); setOpen(false); }}>{lang === 'ko' ? 'EN' : '한국어'}</button>
      </div>
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}

// ============================================
// Home Sections
// ============================================
function Hero({ onDemoClick, t }) {
  return (
    <section className="hero">
      <div className="hero-bg"><div className="hero-grad" /><div className="hero-grid" /></div>
      <div className="hero-inner">
        <div className="hero-badge animate-on-scroll"><span className="badge-pulse" />{t.hero.badge}</div>
        <h1 className="animate-on-scroll delay-1">{t.hero.title1}<br/><span>{t.hero.title2}</span></h1>
        <p className="animate-on-scroll delay-2">{t.hero.desc}</p>
        <div className="hero-btns animate-on-scroll delay-3">
          <button className="btn primary" onClick={onDemoClick}>{t.hero.tryDemo} →</button>
          <a href="#install" className="btn ghost">{t.hero.docs}</a>
        </div>
        <div className="hero-stats animate-on-scroll delay-4">
          <div className="stat"><strong>99.7%</strong><span>{t.hero.stat1}</span></div>
          <div className="stat-sep" />
          <div className="stat"><strong>&lt;2s</strong><span>{t.hero.stat2}</span></div>
          <div className="stat-sep" />
          <div className="stat"><strong>2-Phase</strong><span>{t.hero.stat3}</span></div>
        </div>
      </div>
    </section>
  );
}

function Features({ t }) {
  const icons = [Icons.chart, Icons.image, Icons.shield, Icons.zap];
  return (
    <section id="features" className="features">
      <div className="container">
        <div className="sec-head animate-on-scroll"><span className="sec-tag">Features</span><h2>{t.features.title}</h2><p>{t.features.desc}</p></div>
        <div className="feat-grid">
          {t.features.items.map((f, i) => (
            <div key={i} className={`feat-card animate-on-scroll delay-${i + 1}`}>
              <div className="feat-icon">{icons[i]}</div>
              <span className="feat-tag">{f.tag}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection({ t }) {
  return (
    <section id="demo" className="demo-sec">
      <div className="container">
        <div className="demo-wrap">
          <div className="demo-info">
            <span className="sec-tag animate-on-scroll">Live Demo</span>
            <h2 className="animate-on-scroll delay-1">{t.demo.title}</h2>
            <p className="animate-on-scroll delay-2">{t.demo.desc}</p>
            <div className="demo-steps animate-on-scroll delay0-3">
              <div className="d-step"><span className="d-num">01</span><div><strong>Ticket Slice</strong><span>{t.demo.phase1}</span></div></div>
              <div className="d-step"><span className="d-num">02</span><div><strong>Drag & Drop</strong><span>{t.demo.phase2}</span></div></div>
            </div>
            <a href="/ticket-site-demo/" className="btn primary animate-on-scroll delay-4">{t.demo.launch} →</a>
          </div>
          <div className="demo-preview animate-on-scroll slide-left">
            <div className="preview-card">
              <div className="preview-header"><span /><span /><span /></div>
              <div className="preview-body">
                <div className="preview-flow">
                  <div className="pf-item"><span>Ticket Slice</span><div className="pf-line" /></div>
                  <span className="pf-arrow">→</span>
                  <div className="pf-item"><span>Drag & Drop</span><div className="pf-grid"><span>{Icons.dog}</span><span>{Icons.car}</span><span>{Icons.apple}</span></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstallSection({ t }) {
  const [copied, setCopied] = useState(null);
  const copy = (txt, id) => { navigator.clipboard.writeText(txt); setCopied(id); setTimeout(() => setCopied(null), 1500); };
  const codes = {
    script: '<script src="https://tcurity.com/sdk.js"></script>',
    init: 'const sessionId = await TCuritySDK.captcha("client-id");',
    backend: 'response = requests.post(\n  "https://tcurity.com/api/v1/session/verify",\n  headers={"X-Client-Id": "...", "X-Client-Secret-Key": "..."},\n  json={"session_id": session_id}\n)'
  };
  return (
    <section id="install" className="install">
      <div className="container">
        <div className="sec-head animate-on-scroll"><span className="sec-tag">Quick Start</span><h2>{t.install.title}</h2><p>{t.install.desc}</p></div>
        <div className="install-steps">
          <div className="i-step animate-on-scroll delay-1">
            <div className="i-head"><span>1</span>{t.install.step1}</div>
            <div className="code-block"><div className="code-top"><span>HTML</span><button onClick={() => copy(codes.script, 's1')}>{copied === 's1' ? 'Copied!' : 'Copy'}</button></div><pre>{codes.script}</pre></div>
          </div>
          <div className="i-step animate-on-scroll delay-2">
            <div className="i-head"><span>2</span>{t.install.step2}</div>
            <div className="code-block"><div className="code-top"><span>JavaScript</span><button onClick={() => copy(codes.init, 's2')}>{copied === 's2' ? 'Copied!' : 'Copy'}</button></div><pre>{codes.init}</pre></div>
          </div>
          <div className="i-step animate-on-scroll delay-3">
            <div className="i-head"><span>3</span>{t.install.step3}</div>
            <div className="code-block"><div className="code-top"><span>Python</span><button onClick={() => copy(codes.backend, 's3')}>{copied === 's3' ? 'Copied!' : 'Copy'}</button></div><pre>{codes.backend}</pre></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Pricing Section
// ============================================
const planPrices = [
  { monthly: 0, annual: 0 },
  { monthly: 49000, annual: 39000 },
  { monthly: 149000, annual: 119000 },
  { monthly: null, annual: null },
];

function PricingSection({ t, lang, onContactClick }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const formatPrice = (price) => {
    if (price === null) return t.pricing.negotiate;
    if (price === 0) return '₩0';
    return `₩${price.toLocaleString()}`;
  };

  const planNames = ['Starter', 'Growth', 'Business', 'Enterprise'];

  return (
    <section className="pricing-section">
      <div className="container">
        <div className="sec-head animate-on-scroll">
          <span className="sec-tag">Pricing</span>
          <h2>{t.pricing.title}</h2>
          <p>{t.pricing.desc}</p>
        </div>
        
        <div className="billing-toggle animate-on-scroll delay-1">
          <span className={!isAnnual ? 'active' : ''}>{t.pricing.monthly}</span>
          <button className={`toggle-switch ${isAnnual ? 'annual' : ''}`} onClick={() => setIsAnnual(!isAnnual)}><div className="toggle-thumb" /></button>
          <span className={isAnnual ? 'active' : ''}>{t.pricing.annual}<span className="discount-badge">{t.pricing.discount}</span></span>
        </div>
        
        <div className="pricing-cards animate-on-scroll delay-2">
          {t.pricing.plans.map((plan, idx) => (
            <div key={idx} className={`pricing-card ${idx === 2 ? 'popular' : ''}`}>
              {idx === 2 && <div className="popular-badge">{t.pricing.popular}</div>}
              <div className="card-header"><h3>{plan.name}</h3><p>{plan.desc}</p></div>
              <div className="card-price">
                <span className="price">{formatPrice(isAnnual ? planPrices[idx].annual : planPrices[idx].monthly)}</span>
                {planPrices[idx].monthly !== null && <span className="period">{t.pricing.perMonth}</span>}
                {isAnnual && planPrices[idx].monthly > 0 && <span className="original-price">{formatPrice(planPrices[idx].monthly)}{t.pricing.perMonth}</span>}
                <span className="requests">{plan.requests} {t.pricing.requests}{t.pricing.perMonth}</span>
                <span className="concurrent">{t.pricing.concurrent}: {plan.concurrent}</span>
              </div>
              <button className={`card-cta ${idx === 2 ? 'primary' : ''}`} onClick={() => onContactClick(planNames[idx])}>{plan.cta}</button>
              <ul className="card-features">
                {plan.features.map((f, i) => <li key={i} className="feature"><span className="check">✓</span>{f}</li>)}
                {plan.limitations.map((l, i) => <li key={i} className="limitation"><span className="x">✗</span>{l}</li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="competitor-section animate-on-scroll delay-3">
          <h3>{t.pricing.compare}</h3>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead><tr>{t.pricing.competitor.headers.map((h, i) => <th key={i} className={i === 3 ? 'highlight' : ''}>{h}</th>)}</tr></thead>
              <tbody>
                {t.pricing.competitor.rows.map((row, idx) => (
                  <tr key={idx}>{row.map((cell, i) => <td key={i} className={i === 3 ? 'highlight' : ''}>{cell === '✓' ? <span className="check">✓</span> : cell === '—' ? <span className="dash">—</span> : cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="comparison-note">{t.pricing.compareNote}</p>
        </div>
        
        <div className="pricing-cta animate-on-scroll delay-4">
          <h3>{t.pricing.cta}</h3>
          <p>{t.pricing.ctaDesc}</p>
          <div className="cta-buttons">
            <a href="/ticket-site-demo/" className="btn primary">{t.pricing.start}</a>
            <button className="btn ghost" onClick={() => onContactClick('Enterprise')}>{t.pricing.contact}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Dashboard Section
// ============================================
function Sparkline({ data, height = 32 }) {
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ');
  return <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height }}><polyline fill="none" stroke="var(--primary)" strokeWidth="2" points={points} /></svg>;
}

function DashboardSection({ t }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const gen = () => ({
      hours: Array.from({ length: 24 }, () => ({ req: Math.floor(Math.random() * 4000) + 800, block: Math.floor(Math.random() * 400) + 40 })),
      countries: [
        { name: 'South Korea', code: 'KR', req: 45230, block: 2341 },
        { name: 'United States', code: 'US', req: 12450, block: 892 },
        { name: 'China', code: 'CN', req: 8920, block: 4521 },
        { name: 'Japan', code: 'JP', req: 6780, block: 234 },
        { name: 'Vietnam', code: 'VN', req: 3450, block: 1823 },
      ],
      logs: [
        { id: 1, type: 'block', ip: '192.168.1.xxx', msg: 'Bot detected', t: '2m' },
        { id: 2, type: 'pass', ip: '10.0.0.xxx', msg: 'Verified', t: '3m' },
        { id: 3, type: 'block', ip: '172.16.0.xxx', msg: 'Rate exceeded', t: '5m' },
        { id: 4, type: 'pass', ip: '192.168.2.xxx', msg: 'Verified', t: '6m' },
        { id: 5, type: 'block', ip: '10.1.1.xxx', msg: 'Abnormal pattern', t: '8m' },
      ]
    });
    setData(gen());
    const id = setInterval(() => setData(gen()), 5000);
    return () => clearInterval(id);
  }, []);
  
  if (!data) return null;
  const stats = { requests: 78432, blocked: 4521, rate: 94.2, latency: 312 };

  return (
    <section className="dashboard-section">
      <div className="container">
        <div className="sec-head animate-on-scroll">
          <span className="sec-tag">Dashboard</span>
          <h2>{t.dashboard.title}</h2>
          <p>{t.dashboard.desc}</p>
        </div>
        
        <div className="dash-stats animate-on-scroll delay-1">
          <div className="dash-stat">
            <div className="dash-stat-icon">{Icons.activity}</div>
            <div className="dash-stat-info"><span className="dash-stat-value">{stats.requests.toLocaleString()}</span><span className="dash-stat-label">{t.dashboard.requests}</span></div>
            <Sparkline data={data.hours.map(h => h.req)} />
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon">{Icons.shield}</div>
            <div className="dash-stat-info"><span className="dash-stat-value">{stats.blocked.toLocaleString()}</span><span className="dash-stat-label">{t.dashboard.blocked}</span></div>
            <Sparkline data={data.hours.map(h => h.block)} />
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon">{Icons.check}</div>
            <div className="dash-stat-info"><span className="dash-stat-value">{stats.rate}%</span><span className="dash-stat-label">{t.dashboard.rate}</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${stats.rate}%` }} /></div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon">{Icons.zap}</div>
            <div className="dash-stat-info"><span className="dash-stat-value">{stats.latency}ms</span><span className="dash-stat-label">{t.dashboard.latency}</span></div>
            <div className="health-indicator"><span className="health-dot" /> {t.dashboard.healthy}</div>
          </div>
        </div>
        
        <div className="dash-panels animate-on-scroll delay-2">
          <div className="dash-panel">
            <h4><span className="panel-icon">{Icons.globe}</span>{t.dashboard.region}</h4>
            <table className="dash-table">
              <thead><tr><th>{t.dashboard.country}</th><th>{t.dashboard.requests}</th><th>{t.dashboard.blocked}</th></tr></thead>
              <tbody>
                {data.countries.map((c, i) => (
                  <tr key={i}><td><span className="country-code">{c.code}</span>{c.name}</td><td>{c.req.toLocaleString()}</td><td>{c.block.toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="dash-panel">
            <h4><span className="panel-icon">{Icons.activity}</span>{t.dashboard.activity}</h4>
            <div className="dash-logs">
              {data.logs.map(log => (
                <div key={log.id} className={`dash-log ${log.type}`}>
                  <span className="log-icon">{log.type === 'pass' ? '✓' : '✗'}</span>
                  <div className="log-info"><span className="log-ip">{log.ip}</span><span className="log-msg">{log.msg}</span></div>
                  <span className="log-time">{log.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Footer
// ============================================
function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand"><span className="logo-t">T</span><span className="logo-c">:</span><span className="logo-n">CURITY</span></div>
          <a href="mailto:support@tcurity.com" className="footer-email">
            <span className="footer-email-icon">{Icons.mail}</span>
            support@tcurity.com
          </a>
          <div className="footer-copy">{t.footer.copyright}</div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// App
// ============================================
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('ko');
  const [activeTab, setActiveTab] = useState('home');
  const [showSelector, setShowSelector] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [captchaResult, setCaptchaResult] = useState({ sessionId: null, error: null });
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Starter');

  const t = translations[lang];
  useScrollAnimation(activeTab);

  useEffect(() => { document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const handleDemoClick = () => setShowSelector(true);
  const handleSelectReal = async () => {
    setShowSelector(false);
    try { const sessionId = await runTCurityCaptcha(); setCaptchaResult({ sessionId, error: null }); setShowResult(true); }
    catch (err) { setCaptchaResult({ sessionId: null, error: err.message }); setShowResult(true); }
  };
  const handleSelectDemo = () => { setShowSelector(false); setShowDemo(true); };
  const handleContactClick = (plan) => { setSelectedPlan(plan); setShowContactForm(true); };

  return (
    <div className="app">
      <Nav isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} t={t} />
      <main>
        {activeTab === 'home' && (
          <>
            <Hero onDemoClick={handleDemoClick} t={t} />
            <Features t={t} />
            <DemoSection t={t} />
            <InstallSection t={t} />
          </>
        )}
        {activeTab === 'pricing' && <PricingSection t={t} lang={lang} onContactClick={handleContactClick} />}
        {activeTab === 'dashboard' && <DashboardSection t={t} />}
      </main>
      <Footer t={t} />
      {showSelector && <DemoSelector onSelectReal={handleSelectReal} onSelectDemo={handleSelectDemo} onClose={() => setShowSelector(false)} t={t} />}
      {showDemo && <DemoCaptcha onClose={() => setShowDemo(false)} onComplete={() => setShowDemo(false)} t={t} />}
      {showResult && <CaptchaResult sessionId={captchaResult.sessionId} error={captchaResult.error} onClose={() => setShowResult(false)} />}
      {showContactForm && <ContactFormModal onClose={() => setShowContactForm(false)} selectedPlan={selectedPlan} t={t} />}
      <FaqChatbot lang={lang} />
    </div>
  );
}