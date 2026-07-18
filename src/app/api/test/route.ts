// src/app/api/test/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL ? "FOUND" : "NOT FOUND",
  });
}