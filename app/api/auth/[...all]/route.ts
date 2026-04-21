export async function GET() {
  return Response.json({ error: "Auth is disabled." }, { status: 410 });
}

export async function POST() {
  return Response.json({ error: "Auth is disabled." }, { status: 410 });
}
