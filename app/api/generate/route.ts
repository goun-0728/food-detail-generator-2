// path: app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompt';
import type { GenerateInput, GeneratedCopy } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY가 설정되지 않았습니다.' },
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

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.8,
      response_format: { type: 'json_object' }, // JSON만 강제 출력
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input) },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? '';

    let copy: GeneratedCopy;
    try {
      copy = JSON.parse(raw);
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