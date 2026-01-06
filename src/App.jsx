import { useState } from 'react';
import './App.css';

// 실제 SDK 호출 결과를 보여주는 컴포넌트
function CaptchaResult({ sessionId, error, onClose }) {
  if (!sessionId && !error) return null;
  
  return (
    <div className="captcha-overlay" onClick={onClose}>
      <div className="captcha-modal" onClick={e => e.stopPropagation()}>
        <button className="captcha-close" onClick={onClose}>×</button>
        
        {sessionId && (
          <div className="captcha-success">
            <div className="success-icon">✓</div>
            <h3>인증 완료!</h3>
            <p>사람으로 확인되었습니다</p>
            <div className="success-session">
              session_id: <code>{sessionId}</code>
            </div>
          </div>
        )}
        
        {error && (
          <div className="captcha-error">
            <div className="error-icon">✕</div>
            <h3>인증 실패</h3>
            <p>{error}</p>
            <button className="captcha-start-btn" onClick={onClose}>
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 실제 SDK 호출 함수
async function runTCurityCaptcha(clientId = "cust_alpha") {
  // SDK 로드 확인
  if (typeof window.TCuritySDK === 'undefined') {
    throw new Error('T:CURITY SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
  }
  
  // SDK captcha 호출 - SDK가 자동으로 모달 UI를 띄움
  const sessionId = await window.TCuritySDK.captcha(clientId);
  return sessionId;
}

// Animated Background
function AnimatedBackground() {
  return (
    <div className="animated-bg">
      <div className="grid-lines"></div>
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="floating-shapes">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`shape shape-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
}

// Theme Toggle Button
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="테마 변경">
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

// Navigation
function Nav({ isDark, onThemeToggle }) {
  return (
    <nav className="nav">
      <div className="nav-container">
        <a href="#" className="nav-logo">
          <span className="logo-t">T</span>
          <span className="logo-colon">:</span>
          <span className="logo-curity">CURITY</span>
        </a>
        <div className="nav-links">
          <a href="#features">기능</a>
          <a href="#demo">데모</a>
          <a href="#install">설치</a>
          <a href="https://github.com/tcurity" target="_blank" rel="noopener noreferrer">GitHub</a>
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function Hero({ onDemoClick }) {
  return (
    <section className="hero">
      <AnimatedBackground />
      <div className="hero-content">
        <div className="hero-badge">🛡️ Next-Gen CAPTCHA Solution</div>
        <h1 className="hero-title">
          <span className="title-line">봇은 막고,</span>
          <span className="title-line highlight">사람은 통과</span>
        </h1>
        <p className="hero-desc">
          행동 패턴 분석과 이미지 인식을 결합한<br />
          <strong>2-Phase 검증</strong>으로 99.7%의 봇 탐지율
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onDemoClick}>
            <span>지금 체험하기</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <a href="#install" className="btn btn-secondary">
            설치 가이드
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">99.7%</span>
            <span className="stat-label">봇 탐지율</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value">&lt;2s</span>
            <span className="stat-label">평균 인증 시간</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value">2-Phase</span>
            <span className="stat-label">이중 검증</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  const features = [
    {
      icon: '🎯',
      title: 'Phase 1: 행동 분석',
      desc: 'Isolation Forest 알고리즘으로 마우스 궤적, 속도, 압력 등 행동 패턴을 실시간 분석하여 봇을 1차 필터링합니다.',
      badge: 'Isolation Forest'
    },
    {
      icon: '🧠',
      title: 'Phase 2: 이미지 인식',
      desc: 'Random Forest 기반 이미지 분류 문제로 2차 검증을 수행합니다. 봇이 우회하기 어려운 시각적 판단을 요구합니다.',
      badge: 'Random Forest'
    },
    {
      icon: '🔐',
      title: 'S2S 서버 검증',
      desc: '프론트엔드를 신뢰하지 않는 구조. 발급된 session_id는 반드시 서버 간 통신으로 검증되어 우회를 원천 차단합니다.',
      badge: 'Zero Trust'
    },
    {
      icon: '⚡',
      title: 'Rate Limiting',
      desc: 'IP 기반 지능형 요청 제한으로 무차별 대입 공격을 방어하고 서버 자원을 보호합니다.',
      badge: 'DDoS Protection'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="section-container">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2 className="section-title">왜 T:CURITY인가?</h2>
          <p className="section-desc">
            단순한 체크박스가 아닙니다.<br />
            다층 검증으로 진짜 보안을 제공합니다.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <span className="feature-badge">{feature.badge}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Demo Section
function DemoSection({ onDemoClick }) {
  return (
    <section id="demo" className="demo-section">
      <div className="section-container">
        <div className="demo-content">
          <div className="demo-text">
            <span className="section-badge">Live Demo</span>
            <h2 className="section-title">직접 체험해보세요</h2>
            <p className="section-desc">
              2단계 인증이 어떻게 작동하는지<br />
              실제로 경험해볼 수 있습니다.
            </p>
            <div className="demo-steps">
              <div className="demo-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Phase A</strong>
                  <span>가이드라인을 따라 선 긋기</span>
                </div>
              </div>
              <div className="demo-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Phase B</strong>
                  <span>올바른 이미지 선택하기</span>
                </div>
              </div>
              <div className="demo-step">
                <div className="step-number">✓</div>
                <div className="step-content">
                  <strong>검증 완료</strong>
                  <span>session_id 발급</span>
                </div>
              </div>
            </div>
          </div>
          <div className="demo-preview">
            <div className="preview-window">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="preview-url">tcurity.com/demo</span>
              </div>
              <div className="preview-content">
                <div className="preview-captcha">
                  <div className="preview-logo">T:CURITY</div>
                  <div className="preview-phases">
                    <div className="preview-phase active">
                      <div className="phase-icon">✏️</div>
                      <span>Phase 1</span>
                    </div>
                    <div className="preview-arrow">→</div>
                    <div className="preview-phase">
                      <div className="phase-icon">🖼️</div>
                      <span>Phase 2</span>
                    </div>
                    <div className="preview-arrow">→</div>
                    <div className="preview-phase">
                      <div className="phase-icon">✓</div>
                      <span>완료</span>
                    </div>
                  </div>
                  <button className="preview-btn" onClick={onDemoClick}>
                    체험하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Install Section
function InstallSection() {
  const [copied, setCopied] = useState(false);
  
  const scriptCode = `<script src="https://sdk.tcurity.com/sdk.js"></script>`;
  const usageCode = `<script>
  async function verifyCaptcha() {
    try {
      const sessionId = await TCuritySDK.captcha("YOUR_CLIENT_ID");
      
      // 서버로 sessionId 전송하여 S2S 검증
      const response = await fetch('/api/verify', {
        method: 'POST',
        body: JSON.stringify({ sessionId })
      });
      
      if (response.ok) {
        console.log('✓ 인증 성공!');
      }
    } catch (error) {
      console.error('인증 실패:', error);
    }
  }
</script>`;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="install" className="install-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-badge">Installation</span>
          <h2 className="section-title">한 줄로 시작하기</h2>
          <p className="section-desc">
            복잡한 설정 없이 스크립트 한 줄이면 끝
          </p>
        </div>
        
        <div className="install-steps">
          <div className="install-step">
            <div className="install-step-header">
              <span className="install-step-num">1</span>
              <span className="install-step-title">SDK 로드</span>
            </div>
            <div className="code-block">
              <code>{scriptCode}</code>
              <button 
                className="copy-btn"
                onClick={() => handleCopy(scriptCode)}
              >
                {copied ? '✓ 복사됨' : '복사'}
              </button>
            </div>
          </div>
          
          <div className="install-step">
            <div className="install-step-header">
              <span className="install-step-num">2</span>
              <span className="install-step-title">CAPTCHA 실행</span>
            </div>
            <div className="code-block large">
              <pre><code>{usageCode}</code></pre>
              <button 
                className="copy-btn"
                onClick={() => handleCopy(usageCode)}
              >
                {copied ? '✓ 복사됨' : '복사'}
              </button>
            </div>
          </div>
          
          <div className="install-step">
            <div className="install-step-header">
              <span className="install-step-num">3</span>
              <span className="install-step-title">서버에서 S2S 검증</span>
            </div>
            <div className="s2s-flow">
              <div className="flow-item">
                <span className="flow-icon">🌐</span>
                <span>Browser</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <span className="flow-icon">🖥️</span>
                <span>Your Server</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item highlight">
                <span className="flow-icon">🔐</span>
                <span>T:CURITY API</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">T:CURITY</span>
          <p>차세대 CAPTCHA 보안 솔루션</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/tcurity" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="#features">기능</a>
          <a href="#install">설치</a>
        </div>
        <div className="footer-copyright">
          © 2025 T:CURITY Project by T:CURITOR
        </div>
      </div>
    </footer>
  );
}

// Main App
function App() {
  const [captchaResult, setCaptchaResult] = useState({ sessionId: null, error: null });
  const [showResult, setShowResult] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleDemoClick = async () => {
    try {
      // 실제 SDK 호출 - SDK가 자동으로 캡챠 UI 모달을 띄움
      const sessionId = await runTCurityCaptcha("cust_alpha");
      setCaptchaResult({ sessionId, error: null });
      setShowResult(true);
    } catch (err) {
      // 사용자가 취소하거나 에러 발생시
      if (err.message !== 'CAPTCHA_CANCELLED') {
        setCaptchaResult({ sessionId: null, error: err.message });
        setShowResult(true);
      }
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setCaptchaResult({ sessionId: null, error: null });
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`app ${isDarkTheme ? 'theme-dark' : 'theme-light'}`}>
      <Nav isDark={isDarkTheme} onThemeToggle={handleThemeToggle} />
      <Hero onDemoClick={handleDemoClick} />
      <Features />
      <DemoSection onDemoClick={handleDemoClick} />
      <InstallSection />
      <Footer />
      
      {showResult && (
        <CaptchaResult 
          sessionId={captchaResult.sessionId}
          error={captchaResult.error}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
}

export default App;
