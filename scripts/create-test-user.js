#!/usr/bin/env node
/*
Creates a test user in Supabase using the service role key.

Usage (example):
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \ 
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \ 
  node scripts/create-test-user.js --email test@local.dev --password Pa55word!

This script does NOT print secrets. It requires `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` to be set.
*/

const argv = (() => {
  const out = {};
  const parts = process.argv.slice(2);
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.startsWith('--')) {
      const key = p.slice(2);
      const next = parts[i + 1];
      if (next && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    } else if (p.startsWith('-')) {
      const key = p.slice(1);
      const next = parts[i + 1];
      if (next && !next.startsWith('-')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
})();

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in environment');
    process.exit(1);
  }
  if (!serviceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY in environment');
    process.exit(1);
  }

  const email = String(argv.email || argv.e || 'test@local.dev');
  const password = String(argv.password || argv.p || 'Test1234!');
  const userMeta = { full_name: 'Test User', role: 'admin' };

  console.log(`Creating Supabase user: ${email}`);

  const resp = await fetch(`${url.replace(/\/$/, '')}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      email,
      password,
      user_metadata: userMeta,
      email_confirm: true,
    }),
  });

  const payload = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    console.error('Failed to create user:', payload);
    process.exit(2);
  }

  console.log('User created. id:', payload.id || '(no id returned)');
  console.log('You can now login via the app with the provided credentials.');
}

main().catch((err) => {
  console.error('Unexpected error:', err && err.message ? err.message : err);
  process.exit(99);
});
