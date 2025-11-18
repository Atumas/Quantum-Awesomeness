import { NextResponse } from 'next/server';

/**
 * Returns a minimal self-representation of AppForge code.
 * In a real implementation this would serialize the current repo.
 */
export const runtime = 'edge';

export async function GET() {
  const code = `// AppForge self-deploy stub
// In a full implementation this endpoint would stream the actual project file tree.
export default function App() {
  return <div>AppForge Self Deploy Stub</div>;
}
`;

  return NextResponse.json({ code });
}
