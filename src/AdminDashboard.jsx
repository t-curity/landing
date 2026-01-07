import { useState, useEffect } from 'react';

// 샘플 데이터 생성
const generateMockData = () => {
  const now = new Date();
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    requests: Math.floor(Math.random() * 5000) + 1000,
    blocked: Math.floor(Math.random() * 500) + 50,
  }));

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      requests: Math.floor(Math.random() * 50000) + 20000,
      blocked: Math.floor(Math.random() * 5000) + 1000,
    };
  });

  const countryData = [
    { country: '대한민국', code: 'KR', requests: 45230, blocked: 2341, flag: '🇰🇷' },
    { country: '미국', code: 'US', requests: 12450, blocked: 892, flag: '🇺🇸' },
    { country: '중국', code: 'CN', requests: 8920, blocked: 4521, flag: '🇨🇳' },
    { country: '일본', code: 'JP', requests: 6780, blocked: 234, flag: '🇯🇵' },
    { country: '베트남', code: 'VN', requests: 3450, blocked: 1823, flag: '🇻🇳' },
  ];

  const recentActivity = [
    { id: 1, type: 'blocked', ip: '192.168.1.xxx', reason: '비정상 행동 패턴', time: '2분 전', country: '🇨🇳' },
    { id: 2, type: 'success', ip: '10.0.0.xxx', reason: '정상 인증', time: '3분 전', country: '🇰🇷' },
    { id: 3, type: 'blocked', ip: '172.16.0.xxx', reason: 'AI 봇 탐지', time: '5분 전', country: '🇻🇳' },
    { id: 4, type: 'success', ip: '192.168.2.xxx', reason: '정상 인증', time: '6분 전', country: '🇰🇷' },
    { id: 5, type: 'blocked', ip: '10.1.1.xxx', reason: '반복 요청 초과', time: '8분 전', country: '🇺🇸' },
    { id: 6, type: 'warning', ip: '172.17.0.xxx', reason: '의심스러운 패턴', time: '10분 전', country: '🇷🇺' },
    { id: 7, type: 'success', ip: '192.168.3.xxx', reason: '정상 인증', time: '12분 전', country: '🇯🇵' },
    { id: 8, type: 'blocked', ip: '10.2.2.xxx', reason: 'User-Agent 위조', time: '15분 전', country: '🇨🇳' },
  ];

  return { hourlyData, dailyData, countryData, recentActivity };
};

// 간단한 막대 차트 컴포넌트
function BarChart({ data, dataKey, color = '#FFE103', height = 150 }) {
  const maxValue = Math.max(...data.map(d => d[dataKey]));
  
  return (
    <div className="bar-chart" style={{ height }}>
      <div className="bar-chart-bars">
        {data.map((item, idx) => (
          <div key={idx} className="bar-container">
            <div 
              className="bar" 
              style={{ 
                height: `${(item[dataKey] / maxValue) * 100}%`,
                backgroundColor: color 
              }}
              title={`${item[dataKey].toLocaleString()}`}
            />
            <span className="bar-label">{item.hour || item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 도넛 차트 컴포넌트
function DonutChart({ value, total, color = '#FFE103', size = 120 }) {
  const percentage = (value / total) * 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="donut-chart" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="donut-value">{percentage.toFixed(1)}%</div>
    </div>
  );
}

function AdminDashboard({ onBack }) {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('today');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    setData(generateMockData());
    
    // 실시간 업데이트 시뮬레이션
    const interval = setInterval(() => {
      if (isLive) {
        setData(generateMockData());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  if (!data) return <div className="dashboard-loading">로딩 중...</div>;

  const todayStats = {
    totalRequests: 78432,
    blockedRequests: 4521,
    successRate: 94.2,
    avgResponseTime: 0.31,
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📊 관리자 대시보드</h1>
          <span className={`live-indicator ${isLive ? 'active' : ''}`}>
            <span className="live-dot"></span>
            {isLive ? 'LIVE' : 'PAUSED'}
          </span>
        </div>
        <div className="header-right">
          <div className="time-range-selector">
            {['today', 'week', 'month'].map(range => (
              <button
                key={range}
                className={timeRange === range ? 'active' : ''}
                onClick={() => setTimeRange(range)}
              >
                {range === 'today' ? '오늘' : range === 'week' ? '이번 주' : '이번 달'}
              </button>
            ))}
          </div>
          <button 
            className={`live-toggle ${isLive ? 'active' : ''}`}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? '⏸ 일시정지' : '▶ 재개'}
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-info">
            <span className="stat-value">{todayStats.totalRequests.toLocaleString()}</span>
            <span className="stat-label">총 요청</span>
          </div>
          <div className="stat-trend up">+12.3%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛡️</div>
          <div className="stat-info">
            <span className="stat-value">{todayStats.blockedRequests.toLocaleString()}</span>
            <span className="stat-label">차단된 요청</span>
          </div>
          <div className="stat-trend down">-5.2%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{todayStats.successRate}%</span>
            <span className="stat-label">성공률</span>
          </div>
          <div className="stat-trend up">+0.8%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-value">{todayStats.avgResponseTime}초</span>
            <span className="stat-label">평균 응답시간</span>
          </div>
          <div className="stat-trend up">-0.05초</div>
        </div>
      </section>

      {/* Charts Row */}
      <section className="charts-row">
        <div className="chart-card wide">
          <div className="chart-header">
            <h3>시간대별 요청량</h3>
            <div className="chart-legend">
              <span><i style={{background: '#FFE103'}}></i> 전체 요청</span>
              <span><i style={{background: '#FF6B6B'}}></i> 차단</span>
            </div>
          </div>
          <BarChart data={data.hourlyData} dataKey="requests" height={180} />
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>봇 차단율</h3>
          </div>
          <div className="donut-container">
            <DonutChart 
              value={todayStats.blockedRequests} 
              total={todayStats.totalRequests} 
              color="#22c55e"
              size={140}
            />
            <div className="donut-stats">
              <div className="donut-stat">
                <span className="value">{todayStats.blockedRequests.toLocaleString()}</span>
                <span className="label">차단</span>
              </div>
              <div className="donut-stat">
                <span className="value">{(todayStats.totalRequests - todayStats.blockedRequests).toLocaleString()}</span>
                <span className="label">통과</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row */}
      <section className="bottom-row">
        {/* Country Stats */}
        <div className="table-card">
          <div className="card-header">
            <h3>🌍 국가별 현황</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>국가</th>
                <th>요청</th>
                <th>차단</th>
                <th>차단율</th>
              </tr>
            </thead>
            <tbody>
              {data.countryData.map((country, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="country-cell">
                      {country.flag} {country.country}
                    </span>
                  </td>
                  <td>{country.requests.toLocaleString()}</td>
                  <td className="blocked-cell">{country.blocked.toLocaleString()}</td>
                  <td>
                    <span className={`rate-badge ${(country.blocked / country.requests) > 0.3 ? 'high' : 'low'}`}>
                      {((country.blocked / country.requests) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="table-card">
          <div className="card-header">
            <h3>⚡ 실시간 활동</h3>
            <span className="activity-count">{data.recentActivity.length}건</span>
          </div>
          <div className="activity-list">
            {data.recentActivity.map(activity => (
              <div key={activity.id} className={`activity-item ${activity.type}`}>
                <div className="activity-icon">
                  {activity.type === 'blocked' ? '🚫' : activity.type === 'warning' ? '⚠️' : '✅'}
                </div>
                <div className="activity-info">
                  <div className="activity-main">
                    <span className="activity-ip">{activity.country} {activity.ip}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-reason">{activity.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Keys Section */}
      <section className="api-section">
        <div className="card-header">
          <h3>🔑 API 키 관리</h3>
          <button className="btn-small">+ 새 키 생성</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>API 키</th>
              <th>생성일</th>
              <th>사용량</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Production</td>
              <td><code>tc_live_****...7f2a</code></td>
              <td>2024-12-01</td>
              <td>45,230 / 50,000</td>
              <td><span className="status-badge active">활성</span></td>
              <td>
                <button className="btn-icon" title="복사">📋</button>
                <button className="btn-icon" title="재생성">🔄</button>
              </td>
            </tr>
            <tr>
              <td>Development</td>
              <td><code>tc_test_****...3b1c</code></td>
              <td>2024-12-15</td>
              <td>1,250 / 10,000</td>
              <td><span className="status-badge active">활성</span></td>
              <td>
                <button className="btn-icon" title="복사">📋</button>
                <button className="btn-icon" title="재생성">🔄</button>
              </td>
            </tr>
            <tr>
              <td>Staging</td>
              <td><code>tc_test_****...9d4e</code></td>
              <td>2024-11-20</td>
              <td>0 / 10,000</td>
              <td><span className="status-badge inactive">비활성</span></td>
              <td>
                <button className="btn-icon" title="복사">📋</button>
                <button className="btn-icon" title="재생성">🔄</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Alerts Section */}
      <section className="alerts-section">
        <div className="card-header">
          <h3>🔔 알림 설정</h3>
        </div>
        <div className="alerts-grid">
          <div className="alert-card">
            <div className="alert-header">
              <span>📧 이메일 알림</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            <p>비정상 트래픽 감지 시 이메일로 알림</p>
          </div>
          <div className="alert-card">
            <div className="alert-header">
              <span>💬 Slack 알림</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            <p>#security 채널로 실시간 알림</p>
          </div>
          <div className="alert-card">
            <div className="alert-header">
              <span>🔗 Webhook</span>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            <p>커스텀 엔드포인트로 이벤트 전송</p>
          </div>
          <div className="alert-card">
            <div className="alert-header">
              <span>📱 SMS 알림</span>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            <p>긴급 상황 시 SMS 발송</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
