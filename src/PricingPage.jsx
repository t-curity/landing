import { useState } from 'react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: '소규모 프로젝트 & 테스트용',
    monthlyPrice: 0,
    annualPrice: 0,
    requests: '1,000',
    features: [
      '월 1,000 요청',
      '기본 봇 탐지',
      '커뮤니티 지원',
      'T:CURITY 워터마크',
    ],
    limitations: [
      '대시보드 제한',
      '분석 리포트 없음',
    ],
    cta: '무료로 시작',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    description: '성장하는 스타트업에 적합',
    monthlyPrice: 49000,
    annualPrice: 39000,
    requests: '50,000',
    features: [
      '월 50,000 요청',
      '고급 봇 탐지 (AI 기반)',
      '이메일 지원',
      '기본 대시보드',
      '일간 리포트',
      '워터마크 제거',
    ],
    limitations: [],
    cta: '시작하기',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: '대부분의 비즈니스에 추천',
    monthlyPrice: 199000,
    annualPrice: 159000,
    requests: '500,000',
    features: [
      '월 500,000 요청',
      '프리미엄 봇 탐지',
      '우선 지원 (24시간 내 응답)',
      '고급 대시보드 & 분석',
      '실시간 알림 (Slack, 웹훅)',
      '커스텀 브랜딩',
      'API 우선순위 처리',
      '주간/월간 리포트',
    ],
    limitations: [],
    cta: '가장 인기',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: '대규모 서비스 & 맞춤 솔루션',
    monthlyPrice: null,
    annualPrice: null,
    requests: '무제한',
    features: [
      '무제한 요청',
      '전담 매니저',
      '24/7 긴급 지원',
      'SLA 99.9% 보장',
      '온프레미스 배포 옵션',
      '맞춤 기능 개발',
      '보안 감사 리포트',
      '전용 인프라',
    ],
    limitations: [],
    cta: '문의하기',
    popular: false,
  },
];

const faqs = [
  {
    q: '요청 수는 어떻게 계산되나요?',
    a: 'CAPTCHA 위젯이 로드될 때마다 1회 요청으로 계산됩니다. 사용자가 인증을 완료하지 않아도 요청으로 카운트됩니다.',
  },
  {
    q: '플랜을 중간에 변경할 수 있나요?',
    a: '네, 언제든지 업그레이드 가능합니다. 다운그레이드는 다음 결제 주기부터 적용됩니다.',
  },
  {
    q: '요청 한도를 초과하면 어떻게 되나요?',
    a: '서비스가 중단되지 않습니다. 초과분에 대해 요청당 ₩0.5가 추가 과금됩니다.',
  },
  {
    q: '환불 정책은 어떻게 되나요?',
    a: '결제 후 14일 이내 전액 환불 가능합니다. 단, 사용량이 플랜의 10%를 초과한 경우 제외됩니다.',
  },
  {
    q: '연간 결제 시 혜택이 있나요?',
    a: '연간 결제 시 월 대비 20% 할인됩니다. 또한 2개월 무료 사용 혜택이 포함됩니다.',
  },
];

const formatPrice = (price) => {
  if (price === null) return '협의';
  if (price === 0) return '₩0';
  return `₩${price.toLocaleString()}`;
};

const comparisonData = [
  ['월 요청 수', '1,000', '50,000', '500,000', '무제한'],
  ['봇 탐지', '기본', 'AI 기반', '프리미엄', '프리미엄+'],
  ['대시보드', '제한적', '기본', '고급', '전용'],
  ['분석 리포트', '✗', '일간', '실시간', '실시간+'],
  ['API 응답 시간', '표준', '표준', '우선', '최우선'],
  ['커스텀 브랜딩', '✗', '✗', '✓', '✓'],
  ['Slack/웹훅 알림', '✗', '✗', '✓', '✓'],
  ['전담 지원', '✗', '✗', '✗', '✓'],
  ['SLA 보장', '✗', '99%', '99.5%', '99.9%'],
  ['온프레미스', '✗', '✗', '✗', '✓'],
];

function PricingPage({ onBack }) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="pricing-page">
      {/* Hero */}
      <section className="pricing-hero">
        <h1>심플하고 투명한 가격 정책</h1>
        <p>숨겨진 비용 없이, 사용한 만큼만 지불하세요</p>

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
              {plan.monthlyPrice !== null && <span className="period">/월</span>}
              {isAnnual && plan.monthlyPrice > 0 && (
                <span className="original-price">{formatPrice(plan.monthlyPrice)}/월</span>
              )}
              <span className="requests">월 {plan.requests} 요청</span>
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
                <th>Free</th>
                <th>Starter</th>
                <th className="highlight">Pro</th>
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
                      ) : value === '✗' ? (
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
          <span className="stat-value">99.9%</span>
          <span className="stat-label">업타임 보장</span>
        </div>
        <div className="stat">
          <span className="stat-value">50M+</span>
          <span className="stat-label">월간 인증 처리</span>
        </div>
        <div className="stat">
          <span className="stat-value">94%</span>
          <span className="stat-label">봇 차단율</span>
        </div>
        <div className="stat">
          <span className="stat-value">0.3초</span>
          <span className="stat-label">평균 응답 시간</span>
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
        <p>5분 안에 연동 완료. 신용카드 없이 무료로 시작할 수 있습니다.</p>
        <div className="cta-buttons">
          <button className="btn btn-primary">무료로 시작하기</button>
          <button className="btn btn-secondary">영업팀 문의</button>
        </div>
      </section>
    </div>
  );
}

export default PricingPage;
