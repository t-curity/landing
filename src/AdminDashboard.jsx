import { useState, useEffect } from 'react';

// SVG 아이콘들
const Icons = {
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  key: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  arrowUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  ),
  arrowDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 4v6h-6M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M4.93 4.93l14.14 14.14" />
    </svg>
  ),
  checkSmall: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  ),
  hash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

// Mock 데이터
const generateData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    h: i,
    req: Math.floor(Math.random() * 4000) + 800,
    block: Math.floor(Math.random() * 400) + 40,
  }));

  const countries = [
    { name: 'South Korea', code: 'KR', req: 45230, block: 2341 },
    { name: 'United States', code: 'US', req: 12450, block: 892 },
    { name: 'China', code: 'CN', req: 8920, block: 4521 },
    { name: 'Japan', code: 'JP', req: 6780, block: 234 },
    { name: 'Vietnam', code: 'VN', req: 3450, block: 1823 },
  ];

  const logs = [
    { id: 1, type: 'block', ip: '192.168.1.xxx', msg: 'Abnormal behavior', t: '2m' },
    { id: 2, type: 'pass', ip: '10.0.0.xxx', msg: 'Verified', t: '3m' },
    { id: 3, type: 'block', ip: '172.16.0.xxx', msg: 'Bot detected', t: '5m' },
    { id: 4, type: 'pass', ip: '192.168.2.xxx', msg: 'Verified', t: '6m' },
    { id: 5, type: 'block', ip: '10.1.1.xxx', msg: 'Rate exceeded', t: '8m' },
    { id: 6, type: 'warn', ip: '172.17.0.xxx', msg: 'Suspicious', t: '10m' },
  ];

  return { hours, countries, logs };
};

function Sparkline({ data, height = 32 }) {
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="sparkline" style={{ height }}>
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
    </svg>
  );
}

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('24h');
  const [live, setLive] = useState(true);

  useEffect(() => {
    setData(generateData());
    const id = setInterval(() => live && setData(generateData()), 5000);
    return () => clearInterval(id);
  }, [live]);

  if (!data) return null;

  const stats = { requests: 78432, blocked: 4521, rate: 94.2, latency: 312 };

  return (
    <div className="dash">
      <header className="dash-head">
        <div className="dash-head-l">
          <h1>Overview</h1>
          <span className={`live-tag ${live ? 'on' : ''}`}>
            <i />
            {live ? 'Live' : 'Paused'}
          </span>
        </div>
        <div className="dash-head-r">
          <div className="tabs">
            {['24h', '7d', '30d'].map(p => (
              <button key={p} className={period === p ? 'on' : ''} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <button className="ico-btn" onClick={() => setLive(!live)}>
            {live ? Icons.pause : Icons.play}
          </button>
        </div>
      </header>

      <section className="metrics">
        <div className="metric">
          <div className="metric-top">
            <span className="metric-ico">{Icons.activity}</span>
            <span className="metric-delta up">{Icons.arrowUp}12.3%</span>
          </div>
          <p className="metric-val">{stats.requests.toLocaleString()}</p>
          <p className="metric-lbl">Total Requests</p>
          <Sparkline data={data.hours.map(h => h.req)} />
        </div>
        <div className="metric">
          <div className="metric-top">
            <span className="metric-ico">{Icons.shield}</span>
            <span className="metric-delta down">{Icons.arrowDown}5.2%</span>
          </div>
          <p className="metric-val">{stats.blocked.toLocaleString()}</p>
          <p className="metric-lbl">Blocked</p>
          <Sparkline data={data.hours.map(h => h.block)} />
        </div>
        <div className="metric">
          <div className="metric-top">
            <span className="metric-ico">{Icons.check}</span>
            <span className="metric-delta up">{Icons.arrowUp}0.8%</span>
          </div>
          <p className="metric-val">{stats.rate}%</p>
          <p className="metric-lbl">Success Rate</p>
          <div className="bar"><div className="bar-fill" style={{ width: `${stats.rate}%` }} /></div>
        </div>
        <div className="metric">
          <div className="metric-top">
            <span className="metric-ico">{Icons.zap}</span>
            <span className="metric-delta up">{Icons.arrowUp}15ms</span>
          </div>
          <p className="metric-val">{stats.latency}ms</p>
          <p className="metric-lbl">Latency</p>
          <div className="health"><i className="dot green" />Healthy</div>
        </div>
      </section>

      <div className="panels">
        <section className="panel">
          <div className="panel-head">
            <h2><span className="panel-ico">{Icons.globe}</span>Traffic by Region</h2>
          </div>
          <table>
            <thead>
              <tr><th>Country</th><th>Requests</th><th>Blocked</th><th>Rate</th></tr>
            </thead>
            <tbody>
              {data.countries.map((c, i) => (
                <tr key={i}>
                  <td><span className="cc">{c.code}</span>{c.name}</td>
                  <td className="num">{c.req.toLocaleString()}</td>
                  <td className="num mute">{c.block.toLocaleString()}</td>
                  <td><span className={`pill ${(c.block / c.req) > 0.3 ? 'red' : 'green'}`}>{((c.block / c.req) * 100).toFixed(1)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2><span className="panel-ico">{Icons.activity}</span>Recent Activity</h2>
            <span className="cnt">{data.logs.length}</span>
          </div>
          <div className="logs">
            {data.logs.map(l => (
              <div key={l.id} className="log">
                <span className={`log-ico ${l.type}`}>
                  {l.type === 'block' ? Icons.x : l.type === 'warn' ? Icons.alert : Icons.checkSmall}
                </span>
                <div className="log-body">
                  <div className="log-row"><span className="log-ip">{l.ip}</span><span className="log-t">{l.t}</span></div>
                  <p className="log-msg">{l.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel wide">
        <div className="panel-head">
          <h2><span className="panel-ico">{Icons.key}</span>API Keys</h2>
          <button className="btn-ghost">{Icons.plus}<span>Create</span></button>
        </div>
        <table>
          <thead>
            <tr><th>Name</th><th>Key</th><th>Created</th><th>Usage</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="bold">Production</td>
              <td><code>tc_live_••••7f2a</code></td>
              <td className="mute">Dec 1, 2024</td>
              <td><div className="usage"><div className="usage-bar"><div style={{ width: '90%' }} /></div><span>45.2k/50k</span></div></td>
              <td><span className="status on">Active</span></td>
              <td className="acts"><button className="ico-sm">{Icons.copy}</button><button className="ico-sm">{Icons.refresh}</button></td>
            </tr>
            <tr>
              <td className="bold">Development</td>
              <td><code>tc_test_••••3b1c</code></td>
              <td className="mute">Dec 15, 2024</td>
              <td><div className="usage"><div className="usage-bar"><div style={{ width: '12%' }} /></div><span>1.2k/10k</span></div></td>
              <td><span className="status on">Active</span></td>
              <td className="acts"><button className="ico-sm">{Icons.copy}</button><button className="ico-sm">{Icons.refresh}</button></td>
            </tr>
            <tr>
              <td className="bold">Staging</td>
              <td><code>tc_test_••••9d4e</code></td>
              <td className="mute">Nov 20, 2024</td>
              <td><div className="usage"><div className="usage-bar"><div style={{ width: '0%' }} /></div><span className="mute">0/10k</span></div></td>
              <td><span className="status off">Inactive</span></td>
              <td className="acts"><button className="ico-sm">{Icons.copy}</button><button className="ico-sm">{Icons.refresh}</button></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="panel wide">
        <div className="panel-head">
          <h2><span className="panel-ico">{Icons.bell}</span>Notifications</h2>
        </div>
        <div className="notifs">
          <div className="notif">
            <div className="notif-top"><span className="notif-ico">{Icons.mail}</span><span>Email</span><label className="sw"><input type="checkbox" defaultChecked /><i /></label></div>
            <p>Anomaly alerts</p>
          </div>
          <div className="notif">
            <div className="notif-top"><span className="notif-ico">{Icons.hash}</span><span>Slack</span><label className="sw"><input type="checkbox" defaultChecked /><i /></label></div>
            <p>Real-time to #security</p>
          </div>
          <div className="notif">
            <div className="notif-top"><span className="notif-ico">{Icons.link}</span><span>Webhook</span><label className="sw"><input type="checkbox" /><i /></label></div>
            <p>Custom endpoint</p>
          </div>
          <div className="notif">
            <div className="notif-top"><span className="notif-ico">{Icons.phone}</span><span>SMS</span><label className="sw"><input type="checkbox" /><i /></label></div>
            <p>Critical alerts</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
