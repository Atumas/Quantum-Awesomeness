import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export interface PerformanceReport {
  bundleHints: string[];
  lighthouseTargets: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  suggestions: string[];
}

/**
 * High-level "one shot" optimization with explicit performance-focused prompt.
 */
export async function optimizeCode(code: string): Promise<string> {
  const optimizationAreas = [
    'Bundle size reduction',
    'Core Web Vitals improvement',
    'Memoization opportunities',
    'Code splitting points',
    'Image optimization',
    'Font loading strategy',
    'CSS optimization',
  ];

  const result = await streamText({
    model: openai('gpt-4.1-mini'),
    messages: [
      {
        role: 'system',
        content:
          'You are a senior web performance engineer. You rewrite React/Next.js code for maximum performance and explain your changes in comments.'
      },
      {
        role: 'user',
        content: `Optimize this code for maximum performance:

${code}

Focus on:
1. Reduce bundle size
2. Improve Core Web Vitals (LCP, FID, CLS)
3. Add memoization where needed
4. Split into lazy-loaded components
5. Optimize images and fonts
6. Apply: ${optimizationAreas.join(', ')}

Return optimized code with comments explaining improvements.`
      },
    ],
    temperature: 0.2,
    maxTokens: 4000,
  });

  let optimized = '';
  for await (const delta of result.fullStream) {
    if (delta.type === 'text-delta') {
      optimized += delta.textDelta;
    }
  }
  return optimized;
}

/**
 * Structured JSON analysis of performance characteristics.
 */
export async function analyzeCodePerformance(code: string): Promise<PerformanceReport> {
  const result = await streamText({
    model: openai('gpt-4.1-mini'),
    messages: [
      {
        role: 'system',
        content:
          'You are a web performance engineer. Analyze the given React/Next.js code for performance issues and suggest concrete improvements. Respond in JSON.'
      },
      {
        role: 'user',
        content: code.slice(0, 12000),
      },
    ],
    temperature: 0.1,
    maxTokens: 1000,
  });

  let response = '';
  for await (const delta of result.fullStream) {
    if (delta.type === 'text-delta') {
      response += delta.textDelta;
    }
  }

  try {
    const parsed = JSON.parse(response);
    return parsed as PerformanceReport;
  } catch {
    return {
      bundleHints: ['Failed to parse performance report; using default hints.'],
      lighthouseTargets: {
        performance: 95,
        accessibility: 95,
        bestPractices: 95,
        seo: 95,
      },
      suggestions: [
        'Enable React lazy loading for heavy components.',
        'Compress and optimize images.',
        'Prefer static generation where possible.',
      ],
    };
  }
}

export async function optimizeCodeForPerformance(code: string): Promise<string> {
  // Use a simpler performance rewrite prompt; kept for backwards compatibility
  const result = await streamText({
    model: openai('gpt-4.1-mini'),
    messages: [
      {
        role: 'system',
        content:
          'You are a senior performance-focused front-end engineer. Rewrite the given code for better performance while preserving behavior.'
      },
      {
        role: 'user',
        content: code.slice(0, 12000),
      },
    ],
    temperature: 0.2,
    maxTokens: 4000,
  });

  let optimized = '';
  for await (const delta of result.fullStream) {
    if (delta.type === 'text-delta') {
      optimized += delta.textDelta;
    }
  }
  return optimized;
}
