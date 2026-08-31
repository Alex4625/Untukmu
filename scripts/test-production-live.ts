const BASE_URL = process.env.BASE_URL || 'https://untukmu-web.inaa-tino.workers.dev';

async function runProductionTests() {
  console.log(`\n========================================`);
  console.log(`🚀 STARTING COMPREHENSIVE PRODUCTION PROOF`);
  console.log(`Target URL: ${BASE_URL}`);
  console.log(`========================================\n`);

  const results: Record<string, 'PASS' | 'FAIL'> = {};

  // --- 1. SMOKE TEST ALL 11 ROUTES ---
  const routes = [
    '/',
    '/countdown',
    '/hub',
    '/timeline',
    '/gallery',
    '/letters',
    '/memory-box',
    '/quiz',
    '/plans',
    '/final',
    '/admin',
    '/locked'
  ];

  console.log(`[1] Testing Public Route HTTP Statuses...`);
  for (const route of routes) {
    try {
      const res = await fetch(`${BASE_URL}${route}`, { headers: { 'User-Agent': 'ProductionProof/1.0' } });
      const ok = res.status === 200;
      console.log(`  ${ok ? '✓' : '✗'} ${route.padEnd(15)} -> HTTP ${res.status}`);
      results[`Route ${route}`] = ok ? 'PASS' : 'FAIL';
    } catch (e: any) {
      console.log(`  ✗ ${route.padEnd(15)} -> Error: ${e.message}`);
      results[`Route ${route}`] = 'FAIL';
    }
  }

  // --- 2. ADMIN AUTHENTICATION & LOGIN ---
  console.log(`\n[2] Testing Admin Authentication & Session Management...`);
  let adminCookie = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'admin12345' })
    });
    const loginJson = await loginRes.json();
    const rawCookie = loginRes.headers.get('set-cookie');
    adminCookie = rawCookie ? rawCookie.split(';')[0] : '';
    const isLoginOk = loginRes.status === 200 && loginJson.ok === true && !!adminCookie;
    console.log(`  ${isLoginOk ? '✓' : '✗'} Admin Login (POST /api/admin/login) -> HTTP ${loginRes.status}, ok: ${loginJson.ok}`);
    results['Admin Login'] = isLoginOk ? 'PASS' : 'FAIL';

    // Verify session
    const meRes = await fetch(`${BASE_URL}/api/admin/me`, {
      headers: { Cookie: adminCookie }
    });
    const meJson = await meRes.json();
    const isMeOk = meRes.status === 200 && meJson.authenticated === true;
    console.log(`  ${isMeOk ? '✓' : '✗'} Admin Session Check (GET /api/admin/me) -> HTTP ${meRes.status}, Authenticated: ${meJson.authenticated}`);
    results['Admin Session Check'] = isMeOk ? 'PASS' : 'FAIL';

  } catch (e: any) {
    console.log(`  ✗ Admin Login Error: ${e.message}`);
    results['Admin Login'] = 'FAIL';
  }

  // --- 3. UNLOCK LOGIC, PREVIEW MODE & D1 REMOTE READS ---
  console.log(`\n[3] Testing Unlock Logic & Public Content API...`);
  try {
    // 3A. Normal unauthenticated request (must be locked before 10 Dec 2026)
    const lockedRes = await fetch(`${BASE_URL}/api/public/content`);
    const lockedJson = await lockedRes.json();
    const isLockedCorrect = lockedJson.unlocked === false && lockedJson.memories.length === 0;
    console.log(`  ${isLockedCorrect ? '✓' : '✗'} Unauthenticated Request: unlocked=${lockedJson.unlocked}, memories count=${lockedJson.memories.length}`);
    results['Unlock Logic (Locked Pre-Date)'] = isLockedCorrect ? 'PASS' : 'FAIL';

    // 3B. Unauthenticated request with ?preview=unlocked (must be rejected/locked without admin cookie)
    const unauthorizedPreviewRes = await fetch(`${BASE_URL}/api/public/content?preview=unlocked`);
    const unauthorizedPreviewJson = await unauthorizedPreviewRes.json();
    const isUnauthorizedPreviewLocked = unauthorizedPreviewJson.unlocked === false;
    console.log(`  ${isUnauthorizedPreviewLocked ? '✓' : '✗'} Unauthorized ?preview=unlocked without cookie -> locked=${!unauthorizedPreviewJson.unlocked}`);
    results['Preview Mode Security (No Cookie)'] = isUnauthorizedPreviewLocked ? 'PASS' : 'FAIL';

    // 3C. Authenticated preview request with admin cookie
    const authPreviewRes = await fetch(`${BASE_URL}/api/public/content?preview=unlocked`, {
      headers: { Cookie: adminCookie }
    });
    const authPreviewJson = await authPreviewRes.json();
    const isAuthPreviewOk = authPreviewJson.unlocked === true &&
      authPreviewJson.preview === true &&
      authPreviewJson.memories.length === 4 &&
      authPreviewJson.letters.length === 1 &&
      authPreviewJson.memory_cards.length === 2 &&
      authPreviewJson.quiz_questions.length === 1 &&
      authPreviewJson.plans.length === 1 &&
      authPreviewJson.site_settings?.id === 'main';

    console.log(`  ${isAuthPreviewOk ? '✓' : '✗'} Authenticated ?preview=unlocked with Admin Cookie:`);
    console.log(`      - unlocked: ${authPreviewJson.unlocked}`);
    console.log(`      - preview: ${authPreviewJson.preview}`);
    console.log(`      - memories (D1): ${authPreviewJson.memories.length} items`);
    console.log(`      - letters (D1): ${authPreviewJson.letters.length} item`);
    console.log(`      - memory_cards (D1): ${authPreviewJson.memory_cards.length} items`);
    console.log(`      - quiz_questions (D1): ${authPreviewJson.quiz_questions.length} item`);
    console.log(`      - plans (D1): ${authPreviewJson.plans.length} item`);
    console.log(`      - site_settings (D1): id="${authPreviewJson.site_settings?.id}"`);
    results['D1 Remote Reads & Authenticated Preview'] = isAuthPreviewOk ? 'PASS' : 'FAIL';

    // 3D. Image delivery format check (Cloudflare Image Transformations, NOT raw R2/Supabase/Cloudinary)
    const firstMem = authPreviewJson.memories[0];
    const isTransformationUrl = firstMem?.image_url && firstMem.image_url.startsWith('/cdn-cgi/image/');
    console.log(`  ${isTransformationUrl ? '✓' : '✗'} Image Transformation URL: ${firstMem?.image_url}`);
    results['Image Edge Transformation URL'] = isTransformationUrl ? 'PASS' : 'FAIL';

  } catch (e: any) {
    console.log(`  ✗ Unlock/Preview Test Error: ${e.message}`);
    results['D1 Remote Reads & Authenticated Preview'] = 'FAIL';
  }

  // --- 4. R2 LIVE IMAGE UPLOAD VIA ADMIN ---
  console.log(`\n[4] Testing Live Admin R2 Image Upload...`);
  try {
    // Create a 1x1 test PNG buffer
    const testPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const testPngBuffer = Buffer.from(testPngBase64, 'base64');
    const blob = new Blob([testPngBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, 'test-live-upload.png');

    const uploadRes = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      headers: { Cookie: adminCookie },
      body: formData
    });
    const uploadJson = await uploadRes.json();
    const isUploadOk = uploadRes.status === 200 && 
      uploadJson.ok === true && 
      uploadJson.media_key?.startsWith('originals/memories/') &&
      uploadJson.image_url?.startsWith('/cdn-cgi/image/');

    console.log(`  ${isUploadOk ? '✓' : '✗'} POST /api/admin/upload -> HTTP ${uploadRes.status}:`);
    console.log(`      - ok: ${uploadJson.ok}`);
    console.log(`      - media_key: ${uploadJson.media_key}`);
    console.log(`      - image_url: ${uploadJson.image_url}`);
    console.log(`      - mime_type: ${uploadJson.media_mime_type}`);
    results['Admin R2 Live Upload'] = isUploadOk ? 'PASS' : 'FAIL';

  } catch (e: any) {
    console.log(`  ✗ Admin Upload Error: ${e.message}`);
    results['Admin R2 Live Upload'] = 'FAIL';
  }

  // --- 5. ADMIN D1 CRUD WRITES (INSERT, PUT, DELETE) ---
  console.log(`\n[5] Testing Admin D1 Remote CRUD Writes...`);
  try {
    // Create
    const createRes = await fetch(`${BASE_URL}/api/admin/content/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        title: 'Live Plan for Proof',
        note: 'Created during live production verification',
        plan_status: 'ingin_dilakukan',
        status: 'draft',
        sort_order: 10
      })
    });
    const createdItem = await createRes.json();
    const isCreateOk = createRes.status === 200 && !!createdItem.id;
    console.log(`  ${isCreateOk ? '✓' : '✗'} D1 INSERT (POST /api/admin/content/plans) -> HTTP ${createRes.status}, ID: ${createdItem.id}`);

    if (createdItem.id) {
      // Update with PUT
      const updateRes = await fetch(`${BASE_URL}/api/admin/content/plans/${createdItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
        body: JSON.stringify({
          title: 'Live Plan for Proof (Updated Title)',
          plan_status: 'direncanakan',
          status: 'active'
        })
      });
      const updatedItem = await updateRes.json();
      const isUpdateOk = updateRes.status === 200 && updatedItem.title === 'Live Plan for Proof (Updated Title)' && updatedItem.plan_status === 'direncanakan';
      console.log(`  ${isUpdateOk ? '✓' : '✗'} D1 UPDATE (PUT /api/admin/content/plans/${createdItem.id.slice(0,8)}) -> HTTP ${updateRes.status}, Title: "${updatedItem.title}", Plan Status: "${updatedItem.plan_status}"`);

      // Delete
      const deleteRes = await fetch(`${BASE_URL}/api/admin/content/plans/${createdItem.id}`, {
        method: 'DELETE',
        headers: { Cookie: adminCookie }
      });
      const deleteJson = await deleteRes.json();
      const isDeleteOk = deleteRes.status === 200 && deleteJson.ok === true;
      console.log(`  ${isDeleteOk ? '✓' : '✗'} D1 DELETE (DELETE /api/admin/content/plans/${createdItem.id.slice(0,8)}) -> HTTP ${deleteRes.status}, ok: ${deleteJson.ok}`);
      results['Admin D1 Remote CRUD Writes'] = isCreateOk && isUpdateOk && isDeleteOk ? 'PASS' : 'FAIL';
    }

    // Logout
    const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
      method: 'POST',
      headers: { Cookie: adminCookie }
    });
    const isLogoutOk = logoutRes.status === 200;
    console.log(`  ${isLogoutOk ? '✓' : '✗'} Admin Logout (POST /api/admin/logout) -> HTTP ${logoutRes.status}`);
    results['Admin Logout'] = isLogoutOk ? 'PASS' : 'FAIL';

  } catch (e: any) {
    console.log(`  ✗ Admin CRUD Error: ${e.message}`);
    results['Admin D1 Remote CRUD Writes'] = 'FAIL';
  }

  // --- 6. PERSISTENT AUDIO STATIC ASSET ---
  console.log(`\n[6] Testing Persistent Audio Asset...`);
  try {
    const audioRes = await fetch(`${BASE_URL}/audio/about_you.mp3`);
    const isAudioOk = audioRes.status === 200 && Number(audioRes.headers.get('content-length') || 0) > 1000000;
    console.log(`  ${isAudioOk ? '✓' : '✗'} /audio/about_you.mp3 -> HTTP ${audioRes.status}, Size: ${audioRes.headers.get('content-length')} bytes`);
    results['Persistent Audio Asset'] = isAudioOk ? 'PASS' : 'FAIL';
  } catch (e: any) {
    console.log(`  ✗ Audio Error: ${e.message}`);
    results['Persistent Audio Asset'] = 'FAIL';
  }

  // --- 7. PERFORMANCE & LATENCY AUDIT ---
  console.log(`\n[7] Performance & Latency Audit (Edge TTFB)...`);
  try {
    const latencies: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      const res = await fetch(`${BASE_URL}/`);
      await res.text();
      const t1 = performance.now();
      latencies.push(t1 - t0);
    }
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    console.log(`  ✓ 5 Consecutive Requests: Avg: ${avgLatency.toFixed(1)} ms | Min: ${Math.min(...latencies).toFixed(1)} ms | Max: ${Math.max(...latencies).toFixed(1)} ms`);
    results['Performance Edge Latency'] = avgLatency < 500 ? 'PASS' : 'FAIL';
  } catch (e: any) {
    console.log(`  ✗ Performance Error: ${e.message}`);
    results['Performance Edge Latency'] = 'FAIL';
  }

  console.log(`\n========================================`);
  console.log(`📊 LIVE PRODUCTION PROOF RESULTS:`);
  console.log(`========================================`);
  let allPass = true;
  for (const [k, v] of Object.entries(results)) {
    console.log(`  ${k.padEnd(42)} : ${v}`);
    if (v !== 'PASS') allPass = false;
  }

  console.log(`\nOVERALL PRODUCTION STATUS: ${allPass ? '✅ ALL CHECKS PASSED (100%)' : '❌ SOME CHECKS FAILED'}\n`);
}

runProductionTests();
