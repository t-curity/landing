import { useState } from 'react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: '소규모 서비스 & 테스트용',
    monthlyPrice: 0,
    annualPrice: 0,
    requests: '5,000',
    concurrent: '50명',
    features: [
      '월 5,000 요청',
      '동시 접속 50명',
      '기본 봇 탐지 (AI 기반)',
      '기본 대시보드',
      '커뮤니티 지원',
    ],
    limitations: [
      'T:CURITY 워터마크',
      '오토스케일링 미지원',
    ],
    cta: '무료로 시작',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    description: '성장하는 서비스에 적합',
    monthlyPrice: 99000,
    annualPrice: 79000,
    requests: '100,000',
    concurrent: '500명',
    features: [
      '월 100,000 요청',
      '동시 접속 500명',
      '오토스케일링 (최대 1,000명)',
      '평균 응답 1.3초',
      '프리미엄 봇 탐지',
      '고급 대시보드',
      '이메일 지원 (24시간 내)',
      '일간 리포트',
      '워터마크 제거',
    ],
    limitations: [],
    cta: '시작하기',
    popular: false,
  },
  {
    id: 'business',
    name: 'Business',
    description: '티켓/예약 서비스 최적화',
    monthlyPrice: 290000,
    annualPrice: 232000,
    requests: '500,000',
    concurrent: '2,000명',
    features: [
      '월 500,000 요청',
      '동시 접속 2,000명',
      '오토스케일링 (최대 5,000명)',
      '평균 응답 1.5초 이내',
      '프리미엄+ 봇 탐지',
      '실시간 대시보드',
      '실시간 알림 (Slack, 웹훅)',
      '커스텀 브랜딩',
      '우선 지원 (4시간 내)',
      '주간/월간 리포트',
      'SLA 99.5%',
    ],
    limitations: [],
    cta: '가장 인기',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: '대규모 오픈런 완벽 대응',
    monthlyPrice: null,
    annualPrice: null,
    requests: '무제한',
    concurrent: '무제한',
    features: [
      '무제한 요청',
      '무제한 동시 접속',
      '무제한 오토스케일링',
      '평균 응답 1초 이내 보장',
      '전담 기술 매니저',
      '24/7 긴급 지원',
      'SLA 99.9%',
      '오픈런 사전 대응 (인프라 예열)',
      '온프레미스 옵션',
      '맞춤 기능 개발',
      '보안 감사 리포트',
    ],
    limitations: [],
    cta: '문의하기',
    popular: false,
  },
];

const faqs = [
  {
    q: '오토스케일링이 뭔가요?',
    a: '트래픽이 증가하면 자동으로 서버가 늘어나고, 줄어들면 다시 축소됩니다. 오픈런 때만 비용이 늘어나고, 평소엔 기본 비용만 발생합니다.',
  },
  {
    q: '오픈런 때 갑자기 트래픽이 몰려도 괜찮나요?',
    a: 'Business 플랜은 최대 5,000명, Enterprise는 무제한으로 자동 확장됩니다. 부하 테스트 결과 1,000명까지 실패율 0%가 검증되었고, 오토스케일링으로 그 이상도 대응 가능합니다.',
  },
  {
    q: '동시 접속 한도를 초과하면 어떻게 되나요?',
    a: '오토스케일링이 활성화된 플랜은 자동 확장됩니다. Starter 플랜은 대기열이 발생할 수 있습니다.',
  },
  {
    q: '응답 시간 1.3초는 어떤 기준인가요?',
    a: '실제 부하 테스트 결과입니다. 동시 100명 접속 기준 평균 1.3초가 측정되었습니다.',
  },
  {
    q: '요청 한도 초과 시 추가 비용이 있나요?',
    a: '초과분에 대해 1,000 요청당 ₩100이 과금됩니다. Enterprise는 무제한입니다.',
  },
  {
    q: '연간 결제 혜택이 있나요?',
    a: '연간 결제 시 20% 할인되며, 오픈런 대응 컨설팅 1회가 무료 제공됩니다.',
  },
];

const formatPrice = (price) => {
  if (price === null) return '협의';
  if (price === 0) return '무료';
  return `₩${price.toLocaleString()}`;
};

const comparisonData = [
  ['월 요청 수', '5,000', '100,000', '500,000', '무제한'],
  ['기본 동시 접속', '50명', '500명', '2,000명', '무제한'],
  ['오토스케일 최대', '—', '1,000명', '5,000명', '무제한'],
  ['평균 응답 시간', '1.3초', '1.3초', '1.5초 이내', '1초 이내'],
  ['봇 탐지', '기본', '프리미엄', '프리미엄+', '프리미엄+'],
  ['대시보드', '기본', '고급', '실시간', '전용'],
  ['리포트', '—', '일간', '주간/월간', '실시간'],
  ['커스텀 브랜딩', '—', '—', '✓', '✓'],
  ['Slack/웹훅', '—', '—', '✓', '✓'],
  ['전담 지원', '—', '—', '—', '✓'],
  ['SLA', '—', '—', '99.5%', '99.9%'],
  ['오픈런 대응', '—', '—', '자동 확장', '사전 예열'],
];

function PricingPage({ onBack }) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="pricing-page">
      {/* Hero */}
      <section className="pricing-hero">
        <h1>오픈런도 견디는 CAPTCHA</h1>
        <p>오토스케일링으로 트래픽 걱정 없이, 사용한 만큼만 지불하세요</p>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <span className={!isAnnual ? 'active' : ''}>월간 결제</span>
          <button
            className={`toggle-switch ${isAnnual ? 'annual' : ''}`}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div className="toggle-thumb" />
          </button>
          <span className={isAnnual ? 'active' : ''}>
            연간 결제
            <span className="discount-badge">20% 할인</span>
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && <div className="popular-badge">가장 인기</div>}

            <div className="card-header">
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>

            <div className="card-price">
              <span className="price">
                {formatPrice(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
              </span>
              {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && <span className="period">/월</span>}
              {isAnnual && plan.monthlyPrice > 0 && (
                <span className="original-price">{formatPrice(plan.monthlyPrice)}/월</span>
              )}
              <span className="requests">월 {plan.requests} 요청 · 동시 {plan.concurrent}</span>
            </div>

            <button className={`card-cta ${plan.popular ? 'primary' : ''}`}>
              {plan.cta}
            </button>

            <ul className="card-features">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="feature">
                  <span className="check">✓</span>
                  {feature}
                </li>
              ))}
              {plan.limitations.map((limitation, idx) => (
                <li key={idx} className="limitation">
                  <span className="x">✗</span>
                  {limitation}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Feature Comparison */}
      <section className="pricing-comparison">
        <h2>상세 기능 비교</h2>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>기능</th>
                <th>Starter</th>
                <th>Growth</th>
                <th className="highlight">Business</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map(([feature, ...values], idx) => (
                <tr key={idx}>
                  <td>{feature}</td>
                  {values.map((value, i) => (
                    <td key={i} className={i === 2 ? 'highlight' : ''}>
                      {value === '✓' ? (
                        <span className="check">✓</span>
                      ) : value === '—' ? (
                        <span className="dash">—</span>
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="pricing-stats">
        <div className="stat">
          <span className="stat-value">1,000명</span>
          <span className="stat-label">단일 서버 무중단 검증</span>
        </div>
        <div className="stat">
          <span className="stat-value">0%</span>
          <span className="stat-label">실패율</span>
        </div>
        <div className="stat">
          <span className="stat-value">1.3초</span>
          <span className="stat-label">평균 응답 시간</span>
        </div>
        <div className="stat">
          <span className="stat-value">∞</span>
          <span className="stat-label">오토스케일 확장성</span>
        </div>
      </section>

      {/* FAQ */}
      <section className="pricing-faq">
        <h2>자주 묻는 질문</h2>
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <details key={idx} className="faq-item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pricing-cta">
        <h2>지금 바로 시작하세요</h2>
        <p>무료로 테스트하고, 필요할 때 확장하세요</p>
        <div className="cta-buttons">
          <button className="btn btn-primary">무료로 시작하기</button>
          <button className="btn btn-secondary">데모 요청</button>
        </div>
      </section>
    </div>
  );
}

export default PricingPage;
