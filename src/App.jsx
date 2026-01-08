import { useState, useRef, useEffect } from 'react';
import './App.css';
import NoiseTest from './NoiseTest';
import PricingPage from './PricingPage';
import AdminDashboard from './AdminDashboard';

// ============================================
// 데모용 CAPTCHA 컴포넌트 (Mock)
// ============================================

// 샘플 이미지 데이터
const DEMO_QUESTIONS = [
  {
    question: '🐕 강아지를 모두 찾아 드래그하세요',
    images: ['🐕', '🚗', '🍕', '🎸', '🐕', '🏠', '⚽', '🎨', '🐕'],
    answers: [0, 4, 8],
    answerCount: 3,
  },
  {
    question: '🍎 과일을 모두 찾아 드래그하세요',
    images: ['🍎', '🚀', '🍊', '💎', '🍇', '🔥', '⭐', '🍌', '🌙'],
    answers: [0, 2, 4, 7],
    answerCount: 4,
  },
  {
    question: '🚗 탈것을 모두 찾아 드래그하세요',
    images: ['🚗', '🌸', '✈️', '🎵', '🚢', '🍰', '🚲', '📱', '🎭'],
    answers: [0, 2, 4, 6],
    answerCount: 4,
  },
];

// 노이즈 효과 함수들
const noiseEffects = {
  adversarial: (ctx, width, height, intensity = 25) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() - 0.5) * intensity));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (Math.random() - 0.5) * intensity));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (Math.random() - 0.5) * intensity));
      }
    }
    ctx.putImageData(imageData, 0, 0);
  },
  stripes: (ctx, width, height, opacity = 0.2) => {
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.lineWidth = 1.5;
    for (let i = -height; i < width + height; i += 5) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }
  },
  occlusion: (ctx, width, height, coverage = 0.15) => {
    const blockSize = 10;
    const blocks = Math.floor((width * height * coverage) / (blockSize * blockSize));
    for (let i = 0; i < blocks; i++) {
      ctx.fillStyle = ['#000', '#333', '#222'][Math.floor(Math.random() * 3)];
      ctx.fillRect(
        Math.random() * (width - blockSize),
        Math.random() * (height - blockSize),
        blockSize, blockSize
      );
    }
  },
};

// 동적 노이즈 생성 함수 (사용 안 함)
const generateDynamicNoise = (ctx, width, height, seed = 0) => {
  return ctx.createImageData(width, height);
};

// Adversarial Perturbation만 적용하는 함수
const compositeImageWithNoise = (ctx, emoji, width, height, noiseOpacity = 0.7, seed = 0) => {
  // 이미지 그리기
  ctx.fillStyle = '#1a1a3e';
  ctx.fillRect(0, 0, width, height);
  ctx.font = `${width * 0.5}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, width / 2, height / 2);
  
  // Adversarial Perturbation 적용
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const intensity = 25; // 노이즈 강도
  
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() - 0.5) * intensity));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (Math.random() - 0.5) * intensity));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (Math.random() - 0.5) * intensity));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// AI가 "잘못 인식"하는 라벨들
const AI_WRONG_LABELS = {
  '🐕': ['고양이?', '늑대?', '여우?', '곰?', '???'],
  '🚗': ['트럭?', '버스?', '물체?', '???'],
  '🍕': ['파이?', '원형?', '???'],
  '🎸': ['바이올린?', '물체?', '???'],
  '🏠': ['건물?', '상자?', '???'],
  '⚽': ['원?', '공?', '???'],
  '🎨': ['물체?', '???'],
  '🍎': ['공?', '토마토?', '체리?', '???'],
  '🚀': ['비행기?', '미사일?', '???'],
  '🍊': ['공?', '레몬?', '???'],
  '💎': ['삼각형?', '물체?', '???'],
  '🍇': ['물체?', '???'],
  '🔥': ['꽃?', '물체?', '???'],
  '⭐': ['물체?', '???'],
  '🍌': ['물체?', '???'],
  '🌙': ['원?', 'C자?', '???'],
  '🌸': ['물체?', '분홍?', '???'],
  '✈️': ['새?', '로켓?', '???'],
  '🎵': ['물체?', '???'],
  '🚢': ['건물?', '상자?', '???'],
  '🍰': ['상자?', '삼각형?', '???'],
  '🚲': ['물체?', '???'],
  '📱': ['상자?', '직사각형?', '???'],
  '🎭': ['얼굴?', '물체?', '???'],
};

// AI 시점용 극단적 노이즈
const applyAIViewNoise = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // 극심한 픽셀 노이즈
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() - 0.5) * 100));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (Math.random() - 0.5) * 100));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (Math.random() - 0.5) * 100));
  }
  ctx.putImageData(imageData, 0, 0);
  
  // 심한 블록 가림
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = `rgba(${Math.random()*100}, ${Math.random()*100}, ${Math.random()*100}, 0.7)`;
    ctx.fillRect(
      Math.random() * width * 0.7,
      Math.random() * height * 0.7,
      15 + Math.random() * 15,
      15 + Math.random() * 15
    );
  }
  
  // 글리치 라인
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(255, 0, ${Math.random()*255}, 0.5)`;
    ctx.lineWidth = 2 + Math.random() * 3;
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * height);
    ctx.lineTo(width, Math.random() * height);
    ctx.stroke();
  }
};

// 데모 CAPTCHA 컴포넌트
function DemoCaptcha({ onClose, onComplete }) {
  const [phase, setPhase] = useState('intro');
  const [isDragging, setIsDragging] = useState(false);
  const [dragPath, setDragPath] = useState([]);
  const [phaseAResult, setPhaseAResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [droppedItems, setDroppedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [noiseEnabled, setNoiseEnabled] = useState(true);
  const [aiViewMode, setAiViewMode] = useState(false);
  const [aiLabels, setAiLabels] = useState([]);
  const [dynamicNoiseEnabled, setDynamicNoiseEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef(null);
  const frameCountRef = useRef(0);
  
  const canvasRef = useRef(null);
  const imageCanvasRefs = useRef([]);

  // Phase A 시작
  const startPhaseA = () => {
    setPhase('phaseA');
    setDragPath([]);
    setPhaseAResult(null);
  };

  // Phase A 드래그 핸들러
  const handlePhaseAStart = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    
    if (y < 0.25) {
      setIsDragging(true);
      setDragPath([{ x, y, t: Date.now() }]);
    }
  };

  const handlePhaseAMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    setDragPath(prev => [...prev, { x, y, t: Date.now() }]);
  };

  const handlePhaseAEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (dragPath.length > 10) {
      const startY = dragPath[0].y;
      const endY = dragPath[dragPath.length - 1].y;
      
      if (endY - startY > 0.5) {
        setPhaseAResult('success');
        setTimeout(() => startPhaseB(), 800);
      } else {
        setPhaseAResult('retry');
        setTimeout(() => {
          setDragPath([]);
          setPhaseAResult(null);
        }, 1500);
      }
    }
  };

  // Phase A 캔버스 그리기
  useEffect(() => {
    if (phase !== 'phaseA' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#011142';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // 절취선
    ctx.strokeStyle = 'rgba(255, 225, 3, 0.4)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(rect.width / 2, 30);
    ctx.lineTo(rect.width / 2, rect.height - 30);
    ctx.stroke();
    
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✂️', rect.width / 2, 25);
    
    ctx.setLineDash([]);
    ctx.fillStyle = '#FFE103';
    ctx.beginPath();
    ctx.arc(rect.width / 2, 50, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 225, 3, 0.3)';
    ctx.beginPath();
    ctx.arc(rect.width / 2, rect.height - 50, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFE103';
    ctx.beginPath();
    ctx.arc(rect.width / 2, rect.height - 50, 6, 0, Math.PI * 2);
    ctx.fill();
    
    if (dragPath.length > 1) {
      ctx.strokeStyle = '#FFE103';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(dragPath[0].x * rect.width, dragPath[0].y * rect.height);
      dragPath.forEach(point => {
        ctx.lineTo(point.x * rect.width, point.y * rect.height);
      });
      ctx.stroke();
      
      const lastPoint = dragPath[dragPath.length - 1];
      ctx.fillStyle = '#FFE103';
      ctx.shadowColor = '#FFE103';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(lastPoint.x * rect.width, lastPoint.y * rect.height, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    if (phaseAResult === 'success') {
      ctx.fillStyle = 'rgba(255, 225, 3, 0.2)';
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = '#FFE103';
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓', rect.width / 2, rect.height / 2 + 15);
    } else if (phaseAResult === 'retry') {
      ctx.fillStyle = 'rgba(255, 100, 100, 0.2)';
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = '#FF6464';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('다시 시도해주세요', rect.width / 2, rect.height / 2);
    }
  }, [phase, dragPath, phaseAResult]);

  // Phase B 시작
  const startPhaseB = () => {
    const randomQ = DEMO_QUESTIONS[Math.floor(Math.random() * DEMO_QUESTIONS.length)];
    setCurrentQuestion(randomQ);
    setDroppedItems([]);
    setPhase('phaseB');
  };

  // Phase B 이미지에 Adversarial Perturbation 적용
  useEffect(() => {
    if (phase !== 'phaseB' || !currentQuestion) return;
    
    // AI 라벨 생성
    if (aiViewMode && noiseEnabled) {
      const labels = currentQuestion.images.map(emoji => {
        const wrongLabels = AI_WRONG_LABELS[emoji] || ['???'];
        return wrongLabels[Math.floor(Math.random() * wrongLabels.length)];
      });
      setAiLabels(labels);
    } else {
      setAiLabels([]);
    }
    
    currentQuestion.images.forEach((emoji, idx) => {
      const canvas = imageCanvasRefs.current[idx];
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const size = 80;
      canvas.width = size;
      canvas.height = size;
      
      // 배경
      ctx.fillStyle = '#1a1a3e';
      ctx.fillRect(0, 0, size, size);
      
      // 이모지
      ctx.font = '40px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, size / 2, size / 2);
      
      // Adversarial Perturbation 적용
      if (noiseEnabled) {
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        const intensity = aiViewMode ? 80 : 25; // AI 시점은 더 강하게
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() - 0.5) * intensity));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (Math.random() - 0.5) * intensity));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (Math.random() - 0.5) * intensity));
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
    });
  }, [phase, currentQuestion, noiseEnabled, aiViewMode]);

  // Phase B 드래그 핸들러
  const handlePhaseBDragStart = (index, e) => {
    if (droppedItems.includes(index)) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDraggedItem(index);
    setDragPosition({ x: clientX, y: clientY });
  };

  const handlePhaseBDragMove = (e) => {
    if (draggedItem === null) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragPosition({ x: clientX, y: clientY });
  };

  const handlePhaseBDragEnd = (e) => {
    if (draggedItem === null) return;
    
    const dropZone = document.getElementById('demo-drop-zone');
    if (dropZone) {
      const rect = dropZone.getBoundingClientRect();
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        const newDropped = [...droppedItems, draggedItem];
        setDroppedItems(newDropped);
        
        if (newDropped.length >= currentQuestion.answerCount) {
          const allCorrect = newDropped.every(idx => currentQuestion.answers.includes(idx));
          const hasAllAnswers = currentQuestion.answers.every(idx => newDropped.includes(idx));
          
          if (allCorrect && hasAllAnswers) {
            setTimeout(() => setPhase('success'), 500);
          } else {
            setTimeout(() => setDroppedItems([]), 1000);
          }
        }
      }
    }
    
    setDraggedItem(null);
  };

  // 글로벌 이벤트
  useEffect(() => {
    const handleMove = (e) => {
      if (phase === 'phaseA') handlePhaseAMove(e);
      if (phase === 'phaseB') handlePhaseBDragMove(e);
    };
    
    const handleEnd = (e) => {
      if (phase === 'phaseA') handlePhaseAEnd();
      if (phase === 'phaseB') handlePhaseBDragEnd(e);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [phase, isDragging, draggedItem, dragPath, droppedItems]);

  return (
    <div className="captcha-overlay" onClick={onClose}>
      <div className="captcha-modal demo-modal" onClick={e => e.stopPropagation()}>
        <button className="captcha-close" onClick={onClose}>×</button>
        
        <div className="captcha-logo">T:CURITY</div>
        <div className="demo-badge">데모 모드</div>

        {/* Intro */}
        {phase === 'intro' && (
          <div className="captcha-intro">
            <div className="demo-intro-icon">🛡️</div>
            <h3>2-Phase 인증 체험</h3>
            <p>봇과 사람을 구분하는<br />차세대 CAPTCHA를 경험해보세요</p>
            
            <div className="demo-flow-preview">
              <div className="flow-step">
                <span>✂️</span>
                <small>절취선 드래그</small>
              </div>
              <span className="flow-arrow">→</span>
              <div className="flow-step">
                <span>🖼️</span>
                <small>이미지 분류</small>
              </div>
            </div>
            
            <button className="captcha-start-btn" onClick={startPhaseA}>
              시작하기
            </button>
          </div>
        )}

        {/* Phase A */}
        {phase === 'phaseA' && (
          <div className="captcha-phase">
            <div className="phase-header">
              <span className="phase-badge">Phase 1</span>
              <span className="phase-title">절취선을 따라 드래그하세요</span>
            </div>
            <canvas
              ref={canvasRef}
              className="captcha-canvas demo-canvas"
              onMouseDown={handlePhaseAStart}
              onTouchStart={handlePhaseAStart}
            />
            <p className="phase-hint">⬆️ 위에서 아래로 점선을 따라 드래그 ⬇️</p>
          </div>
        )}

        {/* Phase B */}
        {phase === 'phaseB' && currentQuestion && (
          <div className="captcha-phase">
            <div className="phase-header">
              <span className="phase-badge">Phase 2</span>
              <span className="phase-title">{currentQuestion.question}</span>
            </div>
            
            {/* 뷰 모드 토글 */}
            <div className="view-mode-toggle">
              <button 
                className={`view-btn ${!aiViewMode ? 'active' : ''}`}
                onClick={() => setAiViewMode(false)}
              >
                👤 사람 시점
              </button>
              <button 
                className={`view-btn ai ${aiViewMode ? 'active' : ''}`}
                onClick={() => setAiViewMode(true)}
                disabled={!noiseEnabled}
              >
                🤖 AI 시점
              </button>
            </div>
            
            {/* AI 시점 설명 */}
            {aiViewMode && noiseEnabled && (
              <div className="ai-view-notice">
                <span>⚠️ AI는 Adversarial Perturbation으로 인해 정확히 인식하지 못합니다</span>
              </div>
            )}
            
            {/* 노이즈 토글 */}
            <div className="noise-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={noiseEnabled} 
                  onChange={(e) => {
                    setNoiseEnabled(e.target.checked);
                    if (!e.target.checked) setAiViewMode(false);
                  }} 
                />
                <span>Adversarial Perturbation</span>
              </label>
            </div>
            
            {/* 3x3 이미지 그리드 */}
            <div className={`captcha-grid demo-grid ${aiViewMode ? 'ai-view' : ''}`}>
              {currentQuestion.images.map((emoji, index) => (
                <div
                  key={index}
                  className={`grid-cell ${droppedItems.includes(index) ? 'selected' : ''} ${draggedItem === index ? 'dragging' : ''}`}
                  onMouseDown={(e) => handlePhaseBDragStart(index, e)}
                  onTouchStart={(e) => handlePhaseBDragStart(index, e)}
                >
                  <canvas
                    ref={el => imageCanvasRefs.current[index] = el}
                    className="grid-canvas"
                  />
                  {droppedItems.includes(index) && <div className="cell-check">✓</div>}
                  {/* AI 시점일 때 잘못된 라벨 표시 */}
                  {aiViewMode && noiseEnabled && aiLabels[index] && (
                    <div className="ai-label">{aiLabels[index]}</div>
                  )}
                </div>
              ))}
            </div>
            
            {/* 드롭 영역 */}
            <div id="demo-drop-zone" className="drop-zone">
              {droppedItems.length === 0 ? (
                <span className="drop-hint">여기에 드래그하세요</span>
              ) : (
                droppedItems.map((idx, i) => (
                  <div key={i} className="dropped-item">
                    {currentQuestion.images[idx]}
                  </div>
                ))
              )}
            </div>
            
            <div className="phase-controls">
              <span className="selection-count">선택: {droppedItems.length} / {currentQuestion.answerCount}</span>
              <button className="reset-btn" onClick={() => setDroppedItems([])}>초기화</button>
            </div>
          </div>
        )}

        {/* Success */}
        {phase === 'success' && (
          <div className="captcha-success">
            <div className="success-icon">✓</div>
            <h3>인증 완료!</h3>
            <p>사람으로 확인되었습니다</p>
            <div className="success-session">
              session_id: <code>tc_demo_{Math.random().toString(36).substr(2, 8)}</code>
            </div>
            <button className="captcha-start-btn" style={{ marginTop: '1rem' }} onClick={() => {
              onComplete?.();
              setTimeout(onClose, 300);
            }}>
              완료
            </button>
          </div>
        )}

        {/* 드래그 중인 아이템 */}
        {draggedItem !== null && phase === 'phaseB' && (
          <div
            className="dragged-item"
            style={{
              left: dragPosition.x - 30,
              top: dragPosition.y - 30,
            }}
          >
            {currentQuestion.images[draggedItem]}
          </div>
        )}

        {/* Progress */}
        <div className="demo-progress">
          <div className={`progress-dot ${phase === 'intro' ? 'active' : ''}`} />
          <div className={`progress-dot ${phase === 'phaseA' ? 'active' : ''}`} />
          <div className={`progress-dot ${phase === 'phaseB' ? 'active' : ''}`} />
          <div className={`progress-dot ${phase === 'success' ? 'active' : ''}`} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// 실제 SDK 결과 표시 컴포넌트
// ============================================
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

// ============================================
// 데모 선택 모달
// ============================================
function DemoSelector({ onSelectReal, onSelectDemo, onClose }) {
  return (
    <div className="captcha-overlay" onClick={onClose}>
      <div className="captcha-modal selector-modal" onClick={e => e.stopPropagation()}>
        <button className="captcha-close" onClick={onClose}>×</button>
        
        <div className="captcha-logo">T:CURITY</div>
        <h3 style={{ marginBottom: '0.5rem' }}>체험 모드 선택</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          원하는 체험 방식을 선택하세요
        </p>
        
        <div className="selector-options">
          <button className="selector-option" onClick={onSelectReal}>
            <div className="option-icon">🔐</div>
            <div className="option-content">
              <strong>실제 인증</strong>
              <span>실제 T:CURITY SDK로 인증</span>
            </div>
          </button>
          
          <button className="selector-option demo-option" onClick={onSelectDemo}>
            <div className="option-icon">🎮</div>
            <div className="option-content">
              <strong>데모 체험</strong>
              <span>노이즈 효과 테스트 포함</span>
            </div>
            <div className="option-badge">NEW</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 실제 SDK 호출 함수
// ============================================
async function runTCurityCaptcha(clientId = "cust_alpha") {
  if (typeof window.TCuritySDK === 'undefined') {
    throw new Error('T:CURITY SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
  }
  const sessionId = await window.TCuritySDK.captcha(clientId);
  return sessionId;
}

// ============================================
// 기존 컴포넌트들
// ============================================

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

function Nav({ isDark, onThemeToggle, onPricingClick, onDashboardClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = (callback) => {
    setIsOpen(false);
    if (callback) callback();
  };

  const menuStyle = {
    position: 'fixed',
    top: 0,
    right: isOpen ? 0 : '-100%',
    width: '280px',
    height: '100vh',
    background: 'var(--color-bg)',
    borderLeft: '1px solid var(--color-border)',
    padding: '5rem 2rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    transition: 'right 0.3s ease',
    zIndex: 200,
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 150,
    display: isOpen ? 'block' : 'none',
  };

  const linkStyle = {
    padding: '1rem 0',
    borderBottom: '1px solid var(--color-border)',
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
    fontSize: '1rem',
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-container">
          <a href="#" className="nav-logo">
            <span className="logo-t">T</span>
            <span className="logo-colon">:</span>
            <span className="logo-curity">CURITY</span>
          </a>
          
          {/* 데스크톱 메뉴 */}
          <div className="nav-links nav-desktop">
            <a href="#features">기능</a>
            <a href="#demo">데모</a>
            <a href="#install">설치</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onPricingClick(); }}>가격</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onDashboardClick(); }}>대시보드</a>
            <a href="https://github.com/tcurity" target="_blank" rel="noopener noreferrer">GitHub</a>
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
          </div>

          {/* 햄버거 버튼 */}
          <button 
            className="nav-hamburger"
            onClick={() => setIsOpen(!isOpen)}
            style={{ display: 'none' }}
          >
            <span style={{ 
              display: 'block', 
              width: '24px', 
              height: '2px', 
              background: 'var(--color-text)',
              transition: 'all 0.3s',
              transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }}></span>
            <span style={{ 
              display: 'block', 
              width: '24px', 
              height: '2px', 
              background: 'var(--color-text)',
              margin: '5px 0',
              opacity: isOpen ? 0 : 1,
              transition: 'all 0.3s'
            }}></span>
            <span style={{ 
              display: 'block', 
              width: '24px', 
              height: '2px', 
              background: 'var(--color-text)',
              transition: 'all 0.3s',
              transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
            }}></span>
          </button>
        </div>
      </nav>

      {/* 오버레이 */}
      <div style={overlayStyle} onClick={() => setIsOpen(false)} />
      
      {/* 모바일 메뉴 */}
      <div className="nav-mobile-menu" style={menuStyle}>
        <a href="#features" style={linkStyle} onClick={() => closeMenu()}>기능</a>
        <a href="#demo" style={linkStyle} onClick={() => closeMenu()}>데모</a>
        <a href="#install" style={linkStyle} onClick={() => closeMenu()}>설치</a>
        <a href="#" style={linkStyle} onClick={(e) => { e.preventDefault(); closeMenu(onPricingClick); }}>가격</a>
        <a href="#" style={linkStyle} onClick={(e) => { e.preventDefault(); closeMenu(onDashboardClick); }}>대시보드</a>
        <a href="https://github.com/tcurity" target="_blank" rel="noopener noreferrer" style={linkStyle} onClick={() => closeMenu()}>GitHub</a>
        <div style={{ marginTop: '1rem' }}>
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
      </div>
    </>
  );
}

function Hero({ onDemoClick }) {
  return (
    <section className="hero">
      <AnimatedBackground />
      <div className="hero-content">
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

function Footer({ onPricingClick, onDashboardClick }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">
              <span style={{color: 'var(--color-primary)'}}>T</span>
              <span style={{color: 'var(--color-primary)'}}>:</span>
              CURITY
            </span>
            <p>AI 시대의 차세대 CAPTCHA 보안 솔루션</p>
          </div>
          
          <div className="footer-nav">
            <div className="footer-col">
              <h4>제품</h4>
              <a href="#features">기능</a>
              <a href="#demo">데모</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onPricingClick?.(); }}>가격</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onDashboardClick?.(); }}>대시보드</a>
            </div>
            <div className="footer-col">
              <h4>개발자</h4>
              <a href="#install">설치 가이드</a>
              <a href="https://github.com/tcurity" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://github.com/tcurity/docs" target="_blank" rel="noopener noreferrer">API 문서</a>
            </div>
            <div className="footer-col">
              <h4>팀</h4>
              <a href="#">T:CURITOR 소개</a>
              <a href="mailto:contact@tcurity.com">문의하기</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2025 T:CURITY. Built by T:CURITOR Team.
          </div>
          <div className="footer-legal">
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Main App
// ============================================
function App() {
  const [showSelector, setShowSelector] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showNoiseTest, setShowNoiseTest] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [captchaResult, setCaptchaResult] = useState({ sessionId: null, error: null });
  const [showResult, setShowResult] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleDemoClick = () => {
    setShowSelector(true);
  };

  const handleSelectReal = async () => {
    setShowSelector(false);
    try {
      const sessionId = await runTCurityCaptcha("cust_alpha");
      setCaptchaResult({ sessionId, error: null });
      setShowResult(true);
    } catch (err) {
      if (err.message !== 'CAPTCHA_CANCELLED') {
        setCaptchaResult({ sessionId: null, error: err.message });
        setShowResult(true);
      }
    }
  };

  const handleSelectDemo = () => {
    setShowSelector(false);
    setShowDemo(true);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setCaptchaResult({ sessionId: null, error: null });
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Admin Dashboard 표시
  if (showDashboard) {
    return (
      <div className={`app ${isDarkTheme ? 'theme-dark' : 'theme-light'}`}>
        <nav className="nav">
          <div className="nav-container">
            <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); setShowDashboard(false); }}>
              <span className="logo-t">T</span>
              <span className="logo-colon">:</span>
              <span className="logo-curity">CURITY</span>
            </a>
            <div className="nav-links">
              <a href="#" onClick={(e) => { e.preventDefault(); setShowDashboard(false); }}>← 홈으로</a>
              <ThemeToggle isDark={isDarkTheme} onToggle={handleThemeToggle} />
            </div>
          </div>
        </nav>
        <AdminDashboard onBack={() => setShowDashboard(false)} />
      </div>
    );
  }

  // Pricing 페이지 표시
  if (showPricing) {
    return (
      <div className={`app ${isDarkTheme ? 'theme-dark' : 'theme-light'}`}>
        <nav className="nav">
          <div className="nav-container">
            <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); setShowPricing(false); }}>
              <span className="logo-t">T</span>
              <span className="logo-colon">:</span>
              <span className="logo-curity">CURITY</span>
            </a>
            <div className="nav-links">
              <a href="#" onClick={(e) => { e.preventDefault(); setShowPricing(false); }}>← 홈으로</a>
              <ThemeToggle isDark={isDarkTheme} onToggle={handleThemeToggle} />
            </div>
          </div>
        </nav>
        <PricingPage onBack={() => setShowPricing(false)} />
      </div>
    );
  }

  // NoiseTest 페이지 표시
  if (showNoiseTest) {
    return (
      <div className={`app ${isDarkTheme ? 'theme-dark' : 'theme-light'}`}>
        <nav className="nav">
          <div className="nav-container">
            <button 
              className="back-btn"
              onClick={() => setShowNoiseTest(false)}
            >
              ← 돌아가기
            </button>
            <ThemeToggle isDark={isDarkTheme} onToggle={handleThemeToggle} />
          </div>
        </nav>
        <NoiseTest />
      </div>
    );
  }

  return (
    <div className={`app ${isDarkTheme ? 'theme-dark' : 'theme-light'}`}>
      <Nav 
        isDark={isDarkTheme} 
        onThemeToggle={handleThemeToggle} 
        onPricingClick={() => setShowPricing(true)} 
        onDashboardClick={() => setShowDashboard(true)}
      />
      <Hero onDemoClick={handleDemoClick} />
      <Features />
      <DemoSection onDemoClick={handleDemoClick} />
      <InstallSection />
      <Footer onPricingClick={() => setShowPricing(true)} onDashboardClick={() => setShowDashboard(true)} />
      
      {/* 노이즈 테스트 플로팅 버튼 */}
      <button 
        className="noise-test-fab"
        onClick={() => setShowNoiseTest(true)}
        title="AI 노이즈 테스트"
      >
        🔬
      </button>
      
      {showSelector && (
        <DemoSelector 
          onSelectReal={handleSelectReal}
          onSelectDemo={handleSelectDemo}
          onClose={() => setShowSelector(false)}
        />
      )}
      
      {showDemo && (
        <DemoCaptcha 
          onClose={() => setShowDemo(false)}
          onComplete={() => setShowDemo(false)}
        />
      )}
      
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
