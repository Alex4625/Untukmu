import fs from 'fs';
import path from 'path';

async function main() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const env: Record<string, string> = {};
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('=== DISCOVERING SUPABASE DATA ===');
  console.log('Supabase URL:', supabaseUrl);

  const tables = ['memories', 'letters', 'memory_cards', 'quiz_questions', 'plans', 'site_settings'];
  const supabaseData: Record<string, any[]> = {};

  if (supabaseUrl && supabaseKey) {
    for (const table of tables) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        });
        if (res.ok) {
          const rows = await res.json();
          supabaseData[table] = rows;
          console.log(`Table '${table}': ${rows.length} rows found.`);
        } else {
          console.log(`Table '${table}' status:`, res.status, await res.text());
        }
      } catch (err: any) {
        console.error(`Error querying table '${table}':`, err.message);
      }
    }
  } else {
    console.log('No Supabase credentials found.');
  }

  // Save discovered data to json for inspection
  const outPath = path.join(process.cwd(), 'scripts', 'discovered_supabase_data.json');
  fs.writeFileSync(outPath, JSON.stringify(supabaseData, null, 2));
  console.log(`Discovered data saved to ${outPath}`);

  console.log('\n=== DISCOVERING CLOUDINARY MEDIA ===');
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=500`, {
        headers: {
          Authorization: authHeader
        }
      });
      if (res.ok) {
        const json = await res.json();
        console.log(`Found ${json.resources?.length || 0} Cloudinary assets.`);
        if (json.resources?.length) {
          json.resources.forEach((r: any) => {
            console.log(`- ${r.public_id} (${r.format}, ${r.bytes} bytes, ${r.secure_url})`);
          });
        }
        fs.writeFileSync(
          path.join(process.cwd(), 'scripts', 'discovered_cloudinary_media.json'),
          JSON.stringify(json.resources || [], null, 2)
        );
      } else {
        console.log('Cloudinary API status:', res.status, await res.text());
      }
    } catch (err: any) {
      console.error('Error fetching Cloudinary resources:', err.message);
    }
  } else {
    console.log('No Cloudinary credentials found.');
  }
}

main().catch(console.error);
