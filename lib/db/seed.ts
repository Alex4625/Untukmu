import { eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export async function seedInitialData(db: BetterSQLite3Database<typeof schema>) {
  const now = new Date().toISOString();

  // 1. Site Settings
  const existingSettings = await db
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.id, 'main'))
    .limit(1);

  if (existingSettings.length === 0) {
    await db.insert(schema.siteSettings).values({
      id: 'main',
      birthday_message: 'Selamat ulang tahun, sayang. Sekarang semua bagian yang aku siapin sudah bisa dibuka.',
      final_message:
        'Selamat ulang tahun, sayang. Aku tidak tahu semua hal yang akan terjadi sampai hari ini, tapi aku tahu satu hal: aku bersyukur karena kamu ada di hidupku.\n\nDari Alex.',
      music_url: null,
      updated_at: now
    });
  }

  // 2. Letters
  const existingLetters = await db
    .select()
    .from(schema.letters)
    .where(eq(schema.letters.title, 'Surat Ulang Tahun'))
    .limit(1);

  if (existingLetters.length === 0) {
    await db.insert(schema.letters).values({
      id: crypto.randomUUID(),
      title: 'Surat Ulang Tahun',
      body: 'Untuk kamu,\n\nSelamat ulang tahun. Aku mungkin tidak selalu pandai menyusun kata, tapi aku ingin kamu tahu bahwa kamu sangat berarti. Website kecil ini aku siapin pelan-pelan, dengan hati.\n\nDari Alex.',
      unlock_label: 'Surat utama',
      status: 'active',
      created_at: now
    });
  }

  // 3. Memory Cards
  const existingCards = await db.select().from(schema.memoryCards).limit(1);
  if (existingCards.length === 0) {
    await db.insert(schema.memoryCards).values([
      {
        id: crypto.randomUUID(),
        title: 'Alasan kecil',
        body: 'Aku suka caramu tetap berusaha kuat, bahkan saat kamu sedang capek.',
        card_type: 'Alasan',
        status: 'active',
        sort_order: 1,
        created_at: now
      },
      {
        id: crypto.randomUUID(),
        title: 'Doa kecil',
        body: 'Semoga di umur yang baru, kamu makin kuat, makin bahagia, dan selalu dikelilingi hal-hal baik.',
        card_type: 'Doa',
        status: 'active',
        sort_order: 2,
        created_at: now
      }
    ]);
  }

  // 4. Quiz Questions
  const existingQuiz = await db.select().from(schema.quizQuestions).limit(1);
  if (existingQuiz.length === 0) {
    await db.insert(schema.quizQuestions).values({
      id: crypto.randomUUID(),
      question: 'Siapa pemeran utama di website ini?',
      option_a: 'Aku',
      option_b: 'Kamu',
      option_c: 'Kita',
      option_d: 'Semuanya benar',
      correct_option: 'D',
      feedback: 'Tentu saja semuanya benar.',
      status: 'active',
      sort_order: 1,
      created_at: now
    });
  }

  // 5. Plans
  const existingPlans = await db.select().from(schema.plans).limit(1);
  if (existingPlans.length === 0) {
    await db.insert(schema.plans).values({
      id: crypto.randomUUID(),
      title: 'Foto bareng lebih banyak',
      note: 'Bukan karena harus sempurna, tapi supaya ada lebih banyak cerita yang bisa kita ingat.',
      plan_status: 'ingin_dilakukan',
      status: 'active',
      sort_order: 1,
      created_at: now
    });
  }
}
