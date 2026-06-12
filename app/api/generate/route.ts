// path: app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompt';
import type { GenerateInput, GeneratedCopy } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY가 설정되지 않았습니다.' },
        { status: 500 },
      );
    }

    const input = (await req.json()) as GenerateInput;
    if (!input.productName || !input.category) {
      return NextResponse.json(
        { error: '상품명과 카테고리는 필수입니다.' },
        { status: 400 },
      );
    }

    const anthropic = new Anthropic({ apiKey });
    const msg = await anthropic.messages.create({
      model: 'claude-fable-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(input) }],
    });

    const block = msg.content.find((b) => b.type === 'text');
    const raw = block && 'text' in block ? block.text : '';
    const cleaned = raw.replace(/```json|```/g, '').trim();

    let copy: GeneratedCopy;
    try {
      copy = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'AI 응답 파싱 실패', raw }, { status: 502 });
    }

    // 법적 필수정보(상품상세정보)는 AI가 만들지 않고 입력값 그대로 통과
    return NextResponse.json({
      copy,
      productInfo: input.productInfo,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: '생성 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
