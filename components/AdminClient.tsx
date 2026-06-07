'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Letter, Memory, MemoryCard, Plan, PublicContent, QuizQuestion, SiteSettings } from '@/lib/types';
import { ImagePlus, Lock, LogOut, Plus, RefreshCw, Trash2 } from 'lucide-react';

type AdminData = Omit<PublicContent, 'unlocked' | 'unlockIso'>;
type Tab = 'memories' | 'letters' | 'memory_cards' | 'quiz_questions' | 'plans' | 'site_settings';

const tabs: { key: Tab; label: string }[] = [
  { key: 'memories', label: 'Kenangan/Galeri' },
  { key: 'letters', label: 'Surat' },
  { key: 'memory_cards', label: 'Kotak Kenangan' },
  { key: 'quiz_questions', label: 'Quiz' },
  { key: 'plans', label: 'Rencana Kita' },
  { key: 'site_settings', label: 'Settings' }
];

const emptyData: AdminData = { memories: [], letters: [], memory_cards: [], quiz_questions: [], plans: [], site_settings: null };

export default function AdminClient({ authenticated: initialAuth }: { authenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuth);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('memories');
  const [data, setData] = useState<AdminData>(emptyData);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error || 'Login gagal.');
    setAuthenticated(true);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
  }

  async function load() {
    if (!authenticated) return;
    const res = await fetch('/api/admin/content', { cache: 'no-store' });
    const json = await res.json();
    if (res.ok) setData(json);
    else setError(json.error || 'Gagal memuat data.');
  }

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (!authenticated) {
    return (
      <main className="container-page flex min-h-screen items-center justify-center py-16">
        <form onSubmit={login} className="card w-full max-w-md p-8 sm:p-10">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream text-maroon"><Lock size={28} /></div>
          <h1 className="font-display text-4xl font-bold text-cocoa">Admin Untuk Nona</h1>
          <p className="mt-3 leading-7 text-cocoa/65">Masukkan password admin untuk menambah kenangan, surat, foto, quiz, dan rencana.</p>
          <label className="label mt-6">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password admin" />
          {error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary mt-6 w-full">{loading ? 'Memeriksa...' : 'Masuk'}</button>
        </form>
      </main>
    );
  }

  return (
    <main className="container-page py-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-rosegold">Admin</p>
          <h1 className="font-display text-4xl font-bold text-cocoa">Dashboard Untuk Nona</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/?preview=unlocked" target="_blank" className="btn-secondary">Preview Unlocked</a>
          <button onClick={load} className="btn-secondary gap-2"><RefreshCw size={16} /> Refresh</button>
          <button onClick={logout} className="btn-primary gap-2"><LogOut size={16} /> Logout</button>
        </div>
      </div>

      <div className="grid admin-grid gap-6">
        <aside className="card h-fit p-3 lg:sticky lg:top-6">
          {tabs.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} className={`mb-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${tab === item.key ? 'bg-maroon text-white' : 'text-cocoa/70 hover:bg-cream'}`}>
              {item.label}
            </button>
          ))}
        </aside>
        <section className="space-y-6">
          <Stats data={data} />
          {tab === 'memories' && <MemoryAdmin items={data.memories} reload={load} />}
          {tab === 'letters' && <LetterAdmin items={data.letters} reload={load} />}
          {tab === 'memory_cards' && <CardAdmin items={data.memory_cards} reload={load} />}
          {tab === 'quiz_questions' && <QuizAdmin items={data.quiz_questions} reload={load} />}
          {tab === 'plans' && <PlanAdmin items={data.plans} reload={load} />}
          {tab === 'site_settings' && <SettingsAdmin item={data.site_settings} reload={load} />}
        </section>
      </div>
    </main>
  );
}

function Stats({ data }: { data: AdminData }) {
  const cards = [
    ['Kenangan', data.memories.length],
    ['Surat', data.letters.length],
    ['Kartu', data.memory_cards.length],
    ['Quiz', data.quiz_questions.length],
    ['Rencana', data.plans.length]
  ];
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{cards.map(([label, value]) => <div key={label} className="rounded-3xl border border-white/70 bg-white/70 p-4 text-center"><p className="font-display text-3xl font-bold text-maroon">{value}</p><p className="text-xs font-bold uppercase tracking-[0.2em] text-rosegold">{label}</p></div>)}</div>;
}

async function createItem(resource: Tab, body: any) {
  const res = await fetch(`/api/admin/content/${resource}`, { method: 'POST', body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal menyimpan.');
}
async function updateItem(resource: Tab, id: string, body: any) {
  const res = await fetch(`/api/admin/content/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal update.');
}
async function deleteItem(resource: Tab, id: string) {
  if (!confirm('Yakin ingin menghapus data ini?')) return;
  const res = await fetch(`/api/admin/content/${resource}/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal hapus.');
}

function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <select className="input" value={value} onChange={(e) => onChange(e.target.value)}><option value="draft">Draft</option><option value="active">Aktif setelah 10 Desember</option><option value="hidden">Sembunyikan</option></select>;
}

function MemoryAdmin({ items, reload }: { items: Memory[]; reload: () => void }) {
  const [form, setForm] = useState({ title: '', story: '', memory_date: '', category: 'Momen Kecil', image_url: '', cloudinary_public_id: '', status: 'active', is_favorite: false });
  const [editing, setEditing] = useState<Memory | null>(null);
  const [uploading, setUploading] = useState(false);
  const edit = editing || null;

  function fill(item: Memory) {
    setEditing(item);
    setForm({ title: item.title, story: item.story || '', memory_date: item.memory_date || '', category: item.category || '', image_url: item.image_url || '', cloudinary_public_id: item.cloudinary_public_id || '', status: item.status, is_favorite: item.is_favorite });
  }
  function reset() { setEditing(null); setForm({ title: '', story: '', memory_date: '', category: 'Momen Kecil', image_url: '', cloudinary_public_id: '', status: 'active', is_favorite: false }); }
  async function upload(file: File) {
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const json = await res.json(); setUploading(false);
    if (!res.ok) return alert(json.error || 'Upload gagal.');
    setForm((f) => ({ ...f, image_url: json.secure_url, cloudinary_public_id: json.public_id }));
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return alert('Judul wajib diisi.');
    edit ? await updateItem('memories', edit.id, form) : await createItem('memories', form);
    reset(); reload();
  }
  return <AdminPanel title="Kelola Kenangan & Galeri" button="Simpan Kenangan" onSubmit={submit}>
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Judul" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
      <Field label="Tanggal" type="date" value={form.memory_date} onChange={(v) => setForm({ ...form, memory_date: v })} />
      <Field label="Kategori" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
      <div><label className="label">Status</label><StatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div>
      <div className="md:col-span-2"><label className="label">Cerita</label><textarea className="input min-h-28" value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} /></div>
      <div className="md:col-span-2"><label className="label">Upload Foto Cloudinary</label><input className="input" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} /><p className="mt-2 text-sm text-cocoa/60">{uploading ? 'Mengupload...' : form.image_url ? 'Foto sudah terupload.' : 'Maksimal 5 MB.'}</p></div>
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.is_favorite} onChange={(e) => setForm({ ...form, is_favorite: e.target.checked })} /> Jadikan favorit</label>
    </div>
    <ItemList items={items} title={(i) => i.title} subtitle={(i) => i.status} onEdit={fill} onDelete={async (i) => { await deleteItem('memories', i.id); reload(); }} />
  </AdminPanel>;
}

function LetterAdmin({ items, reload }: { items: Letter[]; reload: () => void }) {
  const [form, setForm] = useState({ title: '', body: '', unlock_label: 'Surat kecil', status: 'active' });
  const [editing, setEditing] = useState<Letter | null>(null);
  function fill(item: Letter) { setEditing(item); setForm({ title: item.title, body: item.body, unlock_label: item.unlock_label || '', status: item.status }); }
  function reset() { setEditing(null); setForm({ title: '', body: '', unlock_label: 'Surat kecil', status: 'active' }); }
  async function submit(e: React.FormEvent) { e.preventDefault(); editing ? await updateItem('letters', editing.id, form) : await createItem('letters', form); reset(); reload(); }
  return <AdminPanel title="Kelola Surat" button="Simpan Surat" onSubmit={submit}>
    <Field label="Judul Surat" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
    <Field label="Label" value={form.unlock_label} onChange={(v) => setForm({ ...form, unlock_label: v })} />
    <div><label className="label">Status</label><StatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div>
    <div><label className="label">Isi Surat</label><textarea className="input min-h-44" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
    <ItemList items={items} title={(i) => i.title} subtitle={(i) => i.status} onEdit={fill} onDelete={async (i) => { await deleteItem('letters', i.id); reload(); }} />
  </AdminPanel>;
}

function CardAdmin({ items, reload }: { items: MemoryCard[]; reload: () => void }) {
  const [form, setForm] = useState({ title: '', body: '', card_type: 'Alasan', status: 'active', sort_order: 0 });
  const [editing, setEditing] = useState<MemoryCard | null>(null);
  function fill(i: MemoryCard) { setEditing(i); setForm({ title: i.title, body: i.body, card_type: i.card_type || '', status: i.status, sort_order: i.sort_order }); }
  function reset() { setEditing(null); setForm({ title: '', body: '', card_type: 'Alasan', status: 'active', sort_order: 0 }); }
  async function submit(e: React.FormEvent) { e.preventDefault(); editing ? await updateItem('memory_cards', editing.id, form) : await createItem('memory_cards', form); reset(); reload(); }
  return <AdminPanel title="Kelola Kotak Kenangan" button="Simpan Kartu" onSubmit={submit}>
    <Field label="Judul Kartu" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
    <Field label="Tipe" value={form.card_type} onChange={(v) => setForm({ ...form, card_type: v })} />
    <Field label="Urutan" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
    <div><label className="label">Status</label><StatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div>
    <div><label className="label">Isi Kartu</label><textarea className="input min-h-32" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
    <ItemList items={items} title={(i) => i.title} subtitle={(i) => i.status} onEdit={fill} onDelete={async (i) => { await deleteItem('memory_cards', i.id); reload(); }} />
  </AdminPanel>;
}

function QuizAdmin({ items, reload }: { items: QuizQuestion[]; reload: () => void }) {
  const [form, setForm] = useState({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', feedback: '', status: 'active', sort_order: 0 });
  const [editing, setEditing] = useState<QuizQuestion | null>(null);
  function fill(i: QuizQuestion) { setEditing(i); setForm({ question: i.question, option_a: i.option_a, option_b: i.option_b, option_c: i.option_c, option_d: i.option_d, correct_option: i.correct_option, feedback: i.feedback || '', status: i.status, sort_order: i.sort_order }); }
  function reset() { setEditing(null); setForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', feedback: '', status: 'active', sort_order: 0 }); }
  async function submit(e: React.FormEvent) { e.preventDefault(); editing ? await updateItem('quiz_questions', editing.id, form) : await createItem('quiz_questions', form); reset(); reload(); }
  return <AdminPanel title="Kelola Quiz" button="Simpan Quiz" onSubmit={submit}>
    <Field label="Pertanyaan" value={form.question} onChange={(v) => setForm({ ...form, question: v })} />
    <div className="grid gap-3 md:grid-cols-2"><Field label="Opsi A" value={form.option_a} onChange={(v) => setForm({ ...form, option_a: v })} /><Field label="Opsi B" value={form.option_b} onChange={(v) => setForm({ ...form, option_b: v })} /><Field label="Opsi C" value={form.option_c} onChange={(v) => setForm({ ...form, option_c: v })} /><Field label="Opsi D" value={form.option_d} onChange={(v) => setForm({ ...form, option_d: v })} /></div>
    <div className="grid gap-3 md:grid-cols-3"><div><label className="label">Jawaban Benar</label><select className="input" value={form.correct_option} onChange={(e) => setForm({ ...form, correct_option: e.target.value })}><option>A</option><option>B</option><option>C</option><option>D</option></select></div><Field label="Urutan" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} /><div><label className="label">Status</label><StatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></div>
    <Field label="Feedback" value={form.feedback} onChange={(v) => setForm({ ...form, feedback: v })} />
    <ItemList items={items} title={(i) => i.question} subtitle={(i) => i.status} onEdit={fill} onDelete={async (i) => { await deleteItem('quiz_questions', i.id); reload(); }} />
  </AdminPanel>;
}

function PlanAdmin({ items, reload }: { items: Plan[]; reload: () => void }) {
  const [form, setForm] = useState({ title: '', note: '', plan_status: 'ingin_dilakukan', status: 'active', sort_order: 0 });
  const [editing, setEditing] = useState<Plan | null>(null);
  function fill(i: Plan) { setEditing(i); setForm({ title: i.title, note: i.note || '', plan_status: i.plan_status, status: i.status, sort_order: i.sort_order }); }
  function reset() { setEditing(null); setForm({ title: '', note: '', plan_status: 'ingin_dilakukan', status: 'active', sort_order: 0 }); }
  async function submit(e: React.FormEvent) { e.preventDefault(); editing ? await updateItem('plans', editing.id, form) : await createItem('plans', form); reset(); reload(); }
  return <AdminPanel title="Kelola Rencana Kita" button="Simpan Rencana" onSubmit={submit}>
    <Field label="Rencana" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
    <Field label="Catatan" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
    <div className="grid gap-3 md:grid-cols-3"><div><label className="label">Status Rencana</label><select className="input" value={form.plan_status} onChange={(e) => setForm({ ...form, plan_status: e.target.value })}><option value="ingin_dilakukan">Ingin dilakukan</option><option value="direncanakan">Sedang direncanakan</option><option value="tercapai">Sudah tercapai</option></select></div><Field label="Urutan" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} /><div><label className="label">Status Tampil</label><StatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></div>
    <ItemList items={items} title={(i) => i.title} subtitle={(i) => i.status} onEdit={fill} onDelete={async (i) => { await deleteItem('plans', i.id); reload(); }} />
  </AdminPanel>;
}

function SettingsAdmin({ item, reload }: { item: SiteSettings | null; reload: () => void }) {
  const [form, setForm] = useState({ birthday_message: item?.birthday_message || '', final_message: item?.final_message || '', music_url: item?.music_url || '' });
  useEffect(() => setForm({ birthday_message: item?.birthday_message || '', final_message: item?.final_message || '', music_url: item?.music_url || '' }), [item]);
  async function submit(e: React.FormEvent) { e.preventDefault(); await updateItem('site_settings', 'main', form); reload(); }
  return <AdminPanel title="Site Settings" button="Simpan Settings" onSubmit={submit}>
    <Field label="URL Musik" value={form.music_url} onChange={(v) => setForm({ ...form, music_url: v })} />
    <div><label className="label">Birthday Message</label><textarea className="input min-h-28" value={form.birthday_message} onChange={(e) => setForm({ ...form, birthday_message: e.target.value })} /></div>
    <div><label className="label">Final Message</label><textarea className="input min-h-40" value={form.final_message} onChange={(e) => setForm({ ...form, final_message: e.target.value })} /></div>
  </AdminPanel>;
}

function AdminPanel({ title, button, onSubmit, children }: { title: string; button: string; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode }) {
  return <form onSubmit={onSubmit} className="card p-5 sm:p-8"><h2 className="font-display text-3xl font-bold text-cocoa">{title}</h2><div className="mt-6 space-y-4">{children}</div><button className="btn-primary mt-6 gap-2"><Plus size={16} />{button}</button></form>;
}
function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <div><label className="label">{label}</label><input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} /></div>;
}
function ItemList<T>({ items, title, subtitle, onEdit, onDelete }: { items: T[]; title: (i: T) => string; subtitle: (i: T) => string; onEdit: (i: T) => void; onDelete: (i: T) => void }) {
  return <div className="mt-8 space-y-3"><h3 className="font-bold text-cocoa">Daftar Konten</h3>{items.map((item: any) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-rose/10 bg-white/70 p-4"><div><p className="font-bold text-cocoa">{title(item)}</p><p className="text-sm text-cocoa/55">{subtitle(item)}</p></div><div className="flex gap-2"><button type="button" onClick={() => onEdit(item)} className="btn-secondary !py-2">Edit</button><button type="button" onClick={() => onDelete(item)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600"><Trash2 size={15} /></button></div></div>)}</div>;
}
