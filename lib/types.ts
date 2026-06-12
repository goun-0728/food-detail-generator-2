// path: lib/types.ts

export type Category = '농산물' | '수산물' | '축산물' | '가공식품' | '건강식품';
export type Theme = '신뢰감형' | '감성형' | '정보형' | '프리미엄형';
export type PriceLevel = '가성비' | '중간가' | '프리미엄';

// === 법적 필수 정보 — AI가 생성하지 않고 판매자 입력값을 그대로 사용 ===
export interface ProductInfo {
  productName: string;     // 제품명
  weight: string;          // 중량/용량
  origin: string;          // 원산지
  manufacturer: string;    // 제조사/판매자
  foodType: string;        // 식품유형
  expiry: string;          // 유통기한/소비기한
  storage: string;         // 보관방법
  allergens: string;       // 알레르기 유발성분
  nutrition: string;       // 영양성분
  certifications: string;  // 인증/수상 이력
  manufactureDate: string; // 제조연월일
}

// === 생성 입력값 ===
export interface GenerateInput {
  productName: string;
  category: Category;
  subCategory?: string;
  target: string;          // 연령대 + 구매 동기
  theme: Theme;
  lifestyle: string;       // 건강 / 선물 / 일상식 / 간편식 등
  priceLevel: PriceLevel;
  mood: string;            // 따뜻한 / 세련된 / 자연친화적 / 고급스러운
  productInfo: ProductInfo;
}

// === AI 생성 결과 (카피 7섹션만) ===
export interface HeroSection      { headline: string; subcopy: string; imageDirection: string; }
export interface IntroSection     { oneLiner: string; story: string; imageDirection: string; }
export interface FeatureItem      { icon: string; title: string; desc: string; }
export interface FeaturesSection  { items: FeatureItem[]; imageDirection: string; }
export interface OriginSection    { headline: string; story: string; imageDirection: string; }
export interface OptionItem       { name: string; desc: string; }
export interface OptionsSection   { items: OptionItem[]; imageDirection: string; }
export interface LifestyleScene   { title: string; copy: string; }
export interface LifestyleSection { scenes: LifestyleScene[]; imageDirection: string; }
export interface ReviewItem       { nickname: string; rating: number; text: string; }
export interface ReviewsSection   { items: ReviewItem[]; imageDirection: string; }

export interface GeneratedCopy {
  hero: HeroSection;
  intro: IntroSection;
  features: FeaturesSection;
  origin: OriginSection;
  options: OptionsSection;
  lifestyle: LifestyleSection;
  reviews: ReviewsSection;
}

// API 응답: AI 카피 + 입력값 그대로의 법적 정보
export interface GenerateResponse {
  copy: GeneratedCopy;
  productInfo: ProductInfo;
}
