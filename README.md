# 식품 상세페이지 생성기 (Fable 5)

네이버 스마트스토어 식품 카테고리용 상세페이지 카피 생성기.
입력값 → Claude Fable 5 → 카피 7섹션(JSON). 법적 필수정보(상품상세정보 표)는 AI가 생성하지 않고 판매자 입력값을 그대로 사용.

## 로컬 실행
```bash
npm install
cp .env.example .env.local   # .env.local 에 본인 ANTHROPIC_API_KEY 입력
npm run dev                  # http://localhost:3000
```

## Vercel 배포
1. 이 레포를 Vercel에서 Import
2. Settings → Environment Variables 에 `ANTHROPIC_API_KEY` 추가
3. Deploy

## 구조
- `lib/types.ts` — 입력/출력 타입, 법적 필수정보 스키마
- `lib/prompt.ts` — 시스템 프롬프트 + 유저 프롬프트 빌더
- `app/api/generate/route.ts` — Fable 5 호출 (카피만 생성, 법적정보 패스스루)
- `app/page.tsx` — 엔진 테스트 하니스 (2단계에서 실제 UI로 교체)
