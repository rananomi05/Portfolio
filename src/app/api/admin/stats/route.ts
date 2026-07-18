import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [total, pending, resolved, recent] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { status: "PENDING" } }),
    prisma.contact.count({ where: { status: { in: ["DONE", "RESOLVED"] } } }),
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, subject: true, status: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({ total, pending, resolved, recent });
}
