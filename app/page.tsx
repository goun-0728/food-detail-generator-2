// path: app/page.tsx
'use client';
import { useState } from 'react';
import type { GenerateInput, GeneratedCopy, ProductInfo } from '@/lib/types';

const emptyInfo: ProductInfo = {
  productName: '', weight: '', origin: '', manufacturer: '', foodType: '',
  expiry: '', storage: '', allergens: '', nutrition: '', certifications: '', manufactureDate: '',
};

// 임시 테스트 하니스 — JSON 출력 확인용. 2단계에서 실제 UI로 교체 예정.
export default function Home() {
  const [input, setInput] = useState<GenerateInput>({
    productName: '제주 노지 감귤 5kg',
    category: '농산물',
    target: '30~40대 주부 / 아이 간식·홈카페용',
    theme: '감성형',
    lifestyle: '건강·간식',
    priceLevel: '중간가',
    mood: '따뜻한',
    productInfo: { ...emptyInfo, productName: '제주 노지 감귤', origin: '제주', weight: '5kg' },
  });
  const [result, setResult] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof GenerateInput, v: string) =>
    setInput((s) => ({ ...s, [k]: v }));

  const generate = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '생성 실패');
      setResult(data.copy);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, k: keyof GenerateInput) => (
    <label style={{ display: 'block', marginBottom: 8 }}>
      <span style={{ display: 'inline-block', width: 110, fontSize: 13 }}>{label}</span>
      <input
        value={String(input[k] ?? '')}
        onChange={(e) => set(k, e.target.value)}
        style={{ width: 320, padding: 6, border: '1px solid #ccc', borderRadius: 4 }}
      />
    </label>
  );

  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: 20, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>식품 상세페이지 생성기 — 엔진 테스트</h1>
      {field('상품명', 'productName')}
      {field('카테고리', 'category')}
      {field('타겟', 'target')}
      {field('테마', 'theme')}
      {field('라이프스타일', 'lifestyle')}
      {field('가격대', 'priceLevel')}
      {field('분위기', 'mood')}
      <button
        onClick={generate}
        disabled={loading}
        style={{ marginTop: 12, padding: '10px 20px', borderRadius: 6, border: 'none',
                 background: '#111', color: '#fff', cursor: 'pointer' }}
      >
        {loading ? '생성 중…' : 'Fable 5로 생성'}
      </button>

      {error && <p style={{ color: 'crimson', marginTop: 12 }}>⚠ {error}</p>}

      {result && (
        <pre style={{ marginTop: 20, padding: 16, background: '#f6f6f6', borderRadius: 8,
                      whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
