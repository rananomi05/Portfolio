/**
 * scripts/seed-admin.ts
 *
 * Seeds the ONE Admin user for this project:
 *  1. Creates the user in Supabase Authentication (service role key required).
 *  2. Creates the matching row in the `profiles` table via Prisma, linked by auth_user_id.
 *
 * Run locally with:
 *   npm run seed:admin
 *
 * Required env vars (see .env.example):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (server-only, never expose to the client)
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 *   ADMIN_NAME
 *
 * Optional:
 *   ADMIN_REQUIRE_EMAIL_VERIFICATION=true
 *     If true, the Admin account is created UNCONFIRMED and Supabase sends a
 *     real confirmation email - the Admin must click that link before they
 *     can log in (login will return "email not confirmed" until then).
 *     If false/unset (default), the account is auto-confirmed so you can log
 *     in immediately - fine for local testing, since only one trusted Admin
 *     is ever seeded this way.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!url || !serviceKey || !email || !password) {
    throw new Error(
      "Missing one of NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD in .env"
    );
  }

  const supabaseAdmin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const requireEmailVerification = process.env.ADMIN_REQUIRE_EMAIL_VERIFICATION === "true";

  console.log(`Creating Supabase Auth user for ${email} ...`);
  if (requireEmailVerification) {
    console.log("ADMIN_REQUIRE_EMAIL_VERIFICATION=true - a confirmation email will be sent.");
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: !requireEmailVerification,
  });

  let authUserId: string;

  if (createError) {
    // If the user already exists, look it up instead of failing the whole script.
    if (createError.message.toLowerCase().includes("already registered")) {
      console.log("User already exists in Supabase Auth - looking it up ...");
      const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      const existing = list.users.find((u) => u.email === email);
      if (!existing) throw new Error("Could not find the existing user by email.");
      authUserId = existing.id;
    } else {
      throw createError;
    }
  } else {
    authUserId = created.user.id;
  }

  console.log(`Auth user ready: ${authUserId}`);

  const profile = await prisma.profile.upsert({
    where: { authUserId },
    create: { authUserId, name, email, role: "admin" },
    update: { name, email, role: "admin" },
  });

  console.log("Profile row ready:", profile);

  if (requireEmailVerification) {
    console.log("\nAdmin created - check the inbox for a confirmation email before logging in.");
  } else {
    console.log("\nAdmin seeded successfully. Log in with:");
  }
  console.log(`  email:    ${email}`);
  console.log(`  password: (the one set in ADMIN_PASSWORD)`);
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
