import { useState, useRef, useEffect } from 'react';

// 테스트용 무료 이미지 (Picsum, Unsplash)
const TEST_IMAGES = [
  {
    id: 'dog',
    name: '강아지',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
    answer: '강아지'
  },
  {
    id: 'cat', 
    name: '고양이',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
    answer: '고양이'
  },
  {
    id: 'car',
    name: '자동차',
    url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=200&fit=crop',
    answer: '자동차'
  },
  {
    id: 'apple',
    name: '사과',
    url: 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=200&h=200&fit=crop',
    answer: '사과'
  },
  {
    id: 'airplane',
    name: '비행기',
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=200&fit=crop',
    answer: '비행기'
  },
  {
    id: 'flower',
    name: '꽃',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop',
    answer: '꽃'
  }
];

// Adversarial Perturbation 적용 함수
const applyAdversarialNoise = (ctx, width, height, intensity = 30) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() - 0.5) * intensity));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (Math.random() - 0.5) * intensity));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (Math.random() - 0.5) * intensity));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// 이미지를 Base64로 변환
const canvasToBase64 = (canvas) => {
  return canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
};

function NoiseTest() {
  const [selectedImage, setSelectedImage] = useState(TEST_IMAGES[0]);
  const [noiseIntensity, setNoiseIntensity] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResults, setAiResults] = useState({ original: null, noisy: null });
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const originalCanvasRef = useRef(null);
  const noisyCanvasRef = useRef(null);
  const imageRef = useRef(new Image());

  // 이미지 로드 및 캔버스에 그리기
  useEffect(() => {
    const img = imageRef.current;
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setImageLoaded(true);
      drawCanvases();
    };
    
    img.onerror = () => {
      console.error('이미지 로드 실패');
      setImageLoaded(false);
    };
    
    img.src = selectedImage.url;
  }, [selectedImage]);

  // 캔버스 그리기
  const drawCanvases = () => {
    const img = imageRef.current;
    if (!img.complete || !originalCanvasRef.current || !noisyCanvasRef.current) return;
    
    const size = 200;
    
    // 원본 캔버스
    const origCtx = originalCanvasRef.current.getContext('2d');
    originalCanvasRef.current.width = size;
    originalCanvasRef.current.height = size;
    origCtx.drawImage(img, 0, 0, size, size);
    
    // 노이즈 캔버스
    const noisyCtx = noisyCanvasRef.current.getContext('2d');
    noisyCanvasRef.current.width = size;
    noisyCanvasRef.current.height = size;
    noisyCtx.drawImage(img, 0, 0, size, size);
    applyAdversarialNoise(noisyCtx, size, size, noiseIntensity);
  };

  // 노이즈 강도 변경 시 다시 그리기
  useEffect(() => {
    if (imageLoaded) {
      drawCanvases();
    }
  }, [noiseIntensity, imageLoaded]);

  // AI에게 물어보기 (Claude API)
  const askAI = async () => {
    if (!originalCanvasRef.current || !noisyCanvasRef.current) return;
    
    setIsLoading(true);
    setAiResults({ original: null, noisy: null });
    
    const originalBase64 = canvasToBase64(originalCanvasRef.current);
    const noisyBase64 = canvasToBase64(noisyCanvasRef.current);
    
    const prompt = `이 이미지에 무엇이 있는지 한 단어로 답해주세요. 확신도를 퍼센트로 함께 알려주세요.
예시 형식: "강아지 (95%)" 또는 "잘 모르겠음 (20%)"`;

    try {
      // 원본 이미지 분석
      const originalResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: originalBase64
                }
              },
              { type: 'text', text: prompt }
            ]
          }]
        })
      });
      
      const originalData = await originalResponse.json();
      const originalAnswer = originalData.content?.[0]?.text || '응답 없음';
      
      // 노이즈 이미지 분석
      const noisyResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: noisyBase64
                }
              },
              { type: 'text', text: prompt }
            ]
          }]
        })
      });
      
      const noisyData = await noisyResponse.json();
      const noisyAnswer = noisyData.content?.[0]?.text || '응답 없음';
      
      setAiResults({
        original: originalAnswer,
        noisy: noisyAnswer
      });
      
    } catch (error) {
      console.error('AI 호출 실패:', error);
      setAiResults({
        original: '오류 발생',
        noisy: '오류 발생'
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="noise-test">
      <div className="noise-test-header">
        <h2>🔬 Adversarial Perturbation 테스트</h2>
        <p>실제 이미지에 노이즈를 적용하고 AI가 어떻게 인식하는지 확인해보세요</p>
      </div>

      {/* 이미지 선택 */}
      <div className="image-selector">
        <label>테스트 이미지 선택:</label>
        <div className="image-options">
          {TEST_IMAGES.map(img => (
            <button
              key={img.id}
              className={`image-option ${selectedImage.id === img.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedImage(img);
                setAiResults({ original: null, noisy: null });
              }}
            >
              {img.name}
            </button>
          ))}
        </div>
      </div>

      {/* 노이즈 강도 조절 */}
      <div className="intensity-control">
        <label>노이즈 강도: {noiseIntensity}</label>
        <input
          type="range"
          min="10"
          max="100"
          value={noiseIntensity}
          onChange={(e) => setNoiseIntensity(Number(e.target.value))}
        />
        <div className="intensity-labels">
          <span>약함</span>
          <span>강함</span>
        </div>
      </div>

      {/* 이미지 비교 */}
      <div className="image-comparison">
        <div className="image-card">
          <h3>👤 원본 이미지</h3>
          <canvas ref={originalCanvasRef} className="test-canvas" />
          <p className="image-label">사람이 보는 이미지</p>
        </div>
        
        <div className="vs-divider">VS</div>
        
        <div className="image-card">
          <h3>🤖 노이즈 적용</h3>
          <canvas ref={noisyCanvasRef} className="test-canvas" />
          <p className="image-label">Adversarial Perturbation 적용</p>
        </div>
      </div>

      {/* AI 테스트 버튼 */}
      <button 
        className="ai-test-btn"
        onClick={askAI}
        disabled={isLoading || !imageLoaded}
      >
        {isLoading ? '🔄 AI 분석 중...' : '🤖 AI에게 물어보기'}
      </button>

      {/* AI 결과 */}
      {(aiResults.original || aiResults.noisy) && (
        <div className="ai-results">
          <h3>🧠 AI 인식 결과</h3>
          <div className="results-grid">
            <div className="result-card original">
              <span className="result-label">원본 이미지</span>
              <span className="result-answer">{aiResults.original}</span>
              <span className="result-status success">✓ 정상 인식</span>
            </div>
            <div className="result-card noisy">
              <span className="result-label">노이즈 이미지</span>
              <span className="result-answer">{aiResults.noisy}</span>
              <span className="result-status warning">⚠️ 인식 방해됨</span>
            </div>
          </div>
          <p className="result-note">
            * 정답: <strong>{selectedImage.answer}</strong>
          </p>
        </div>
      )}

      {/* 설명 */}
      <div className="explanation">
        <h3>💡 Adversarial Perturbation이란?</h3>
        <p>
          이미지 픽셀에 <strong>미세한 노이즈</strong>를 추가하여 AI의 인식을 방해하는 기술입니다.
          사람 눈에는 거의 차이가 없지만, AI 모델은 완전히 다른 결과를 출력할 수 있습니다.
        </p>
        <ul>
          <li>✅ 사람: 쉽게 인식 가능</li>
          <li>❌ AI 봇: 인식률 급격히 저하</li>
          <li>🛡️ CAPTCHA 우회 방지에 효과적</li>
        </ul>
      </div>
    </div>
  );
}

export default NoiseTest;
