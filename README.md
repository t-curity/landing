# T:CURITY Landing Page

T:CURITY 서비스 소개 및 마케팅을 위한 랜딩 페이지입니다.

## ✨ 주요 기능

- **서비스 소개**: 2-Phase CAPTCHA 기술 및 특징 설명
- **가격 정책**: Starter / Growth / Business / Enterprise 플랜 안내
- **라이브 데모**: SDK 체험 및 예매 데모 사이트 연동
- **대시보드 미리보기**: 실시간 모니터링 UI 시연
- **FAQ 챗봇**: 자주 묻는 질문 자동 응답
- **다국어 지원**: 한국어 / 영어

## 🛠 기술 스택

- **Frontend**: React 18
- **Bundler**: Vite
- **Styling**: Vanilla CSS (CSS Variables)
- **Icons**: Lucide-style SVG

## 🚀 시작하기

### 설치

```bash
npm install
```

### 로컬 개발

```bash
npm run dev
```

http://localhost:5173 에서 확인

### 빌드

```bash
npm run build
```

## 📁 프로젝트 구조

```
landing/
├── src/
│   ├── App.jsx          # 메인 컴포넌트 (Hero, Features, Pricing 등)
│   ├── App.css          # 전체 스타일
│   ├── FaqChatbot.jsx   # FAQ 챗봇 컴포넌트
│   └── FaqChatbot.css   # 챗봇 스타일
├── public/              # 정적 파일 (로고, 파비콘)
├── dist/                # 빌드 결과물
└── Dockerfile           # 컨테이너 빌드 설정
```

## ⚙️ 배포

- `dev` 브랜치 push 시 GitHub Actions 자동 빌드
- Docker 이미지 → GitHub Container Registry
- Main 서버에서 컨테이너로 실행

## 🔗 관련 링크

- **Production**: https://tcurity.com
- **Demo Site**: https://tcurity.com/ticket-demo-site/

## 📄 라이선스

MIT License - Copyright (c) 2025 T:CURITY
