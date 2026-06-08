'use client';

import { useEffect, useId, useState } from 'react';
import type { ContentStatus, Letter, Memory, MemoryCard, Plan, PublicContent, QuizQuestion, SiteSettings } from '@/lib/types';
import { AlertTriangle, CheckCircle2, Eye, EyeOff, FilePenLine, Lock, LogOut, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';

type AdminData = Omit<PublicContent, 'unlocked' | 'unlockIso' | 'preview'>;
type Tab = 'memories' | 'letters' | 'memory_cards' | 'quiz_questions' | 'plans' | 'site_settings';
type MutationBody = Record<string, unknown>;
type HealthCheck = {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
};

const tabs: { key: Tab; label: string }[] = [
  { key: 'memories', label: 'Kenangan/Galeri' },
  { key: 'letters', label: 'Surat' },
  { key: 'memory_cards', label: 'Kotak Kenangan' },
  { key: 'quiz_questions', label: 'Quiz' },
  { key: 'plans', label: 'Rencana Kita' },
  { key: 'site_settings', label: 'Settings' }
];

const emptyData: AdminData = { memories: [], letters: [], memory_cards: [], quiz_questions: [], plans: [], site_settings: null };
const contentStatuses: ContentStatus[] = ['draft', 'active', 'hidden'];
const statusLabels: Record<ContentStatus, string> = {
  draft: 'Draft',
  active: 'Published',
  hidden: 'Hidden'
};

export default function AdminClient({ authenticated: initialAuth }: { authenticated: boolean }) {
  const passwordId = useId();
  const [authenticated, setAuthenticated] = useState(initialAuth);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('memories');
  const [data, setData] = useState<AdminData>(emptyData);
  const [health, setHealth] = useState<HealthCheck[] | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error || 'Login gagal.');
    setPassword('');
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

  async function loadHealth() {
    if (!authenticated) return;
    const res = await fetch('/api/admin/health', { cache: 'no-store' });
    const json = await res.json();
    if (res.ok) setHealth(json.checks || []);
  }

  async function refreshAll() {
    await Promise.all([load(), loadHealth()]);
  }

  useEffect(() => {
    if (!authenticated) return;

    let cancelled = false;
    async function loadInitialData() {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      const json = await res.json();
      if (cancelled) return;
      if (res.ok) setData(json);
      else setError(json.error || 'Gagal memuat data.');
    }
    async function loadInitialHealth() {
      const res = await fetch('/api/admin/health', { cache: 'no-store' });
      const json = await res.json();
      if (cancelled) return;
      if (res.ok) setHealth(json.checks || []);
    }

    void loadInitialData();
    void loadInitialHealth();
    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  if (!authenticated) {
    return (
      <main className="container-page flex min-h-screen items-center justify-center py-16">
        <form onSubmit={login} className="card w-full max-w-md p-8 sm:p-10">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream text-rose"><Lock size={28} /></div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-display text-4xl font-normal text-maroon">Untuk Nona</h1>
          <p className="mt-3 leading-7 text-muted">Masukkan password admin untuk menambah kenangan, surat, foto, quiz, dan rencana.</p>
          <label className="label mt-6" htmlFor={passwordId}>Password</label>
          <input id={passwordId} className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password admin" autoComplete="current-password" />
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
          <p className="eyebrow">Untuk Nona Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-cocoa">Selamat datang, Alex</h1>
          <p className="mt-1 text-sm text-muted">Ringkasan konten yang sudah kamu tambahkan.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/hub?preview=unlocked" target="_blank" rel="noreferrer" className="btn-secondary">Preview Public</a>
          <button onClick={() => void refreshAll()} className="btn-secondary gap-2"><RefreshCw size={16} /> Refresh</button>
          <button onClick={logout} className="btn-primary gap-2"><LogOut size={16} /> Logout</button>
        </div>
      </div>
      {error && <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}

      <div className="grid admin-grid gap-6">
        <aside className="h-fit rounded-2xl bg-maroon p-3 text-cream shadow-soft lg:sticky lg:top-6">
          <div className="px-4 py-4">
            <p className="font-display text-2xl font-normal leading-none">Untuk Nona</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-cream/60">admin panel</p>
          </div>
          {tabs.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} className={`mb-1 w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${tab === item.key ? 'bg-white/15 text-white' : 'text-cream/70 hover:bg-white/10 hover:text-white'}`}>
              {item.label}
            </button>
          ))}
        </aside>
        <section className="space-y-6">
          <HealthStrip checks={health} />
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

function HealthStrip({ checks }: { checks: HealthCheck[] | null }) {
  if (!checks) {
    return (
      <div className="rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white p-5 text-sm text-muted shadow-xs">
        Memeriksa konfigurasi deploy...
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {checks.map((check) => (
        <div key={check.key} className="rounded-xl border border-[rgba(196,138,106,0.22)] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2">
            {check.ok ? <CheckCircle2 size={17} className="text-sage" /> : <AlertTriangle size={17} className="text-error" />}
            <p className="text-sm font-semibold text-cocoa">{check.label}</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">{check.detail}</p>
        </div>
      ))}
    </div>
  );
}

function Stats({ data }: { data: AdminData }) {
  const items = [...data.memories, ...data.letters, ...data.memory_cards, ...data.quiz_questions, ...data.plans];
  const sectionsReady = [
    data.memories.some((item) => item.status === 'active'),
    data.letters.some((item) => item.status === 'active'),
    data.memory_cards.some((item) => item.status === 'active'),
    data.quiz_questions.some((item) => item.status === 'active'),
    data.plans.some((item) => item.status === 'active'),
    Boolean(data.site_settings?.final_message)
  ].filter(Boolean).length;
  const cards: Array<[string, number, string, string]> = [
    ['Semua Konten', items.length, 'border-rosegold', 'Total item di admin'],
    ['Published', countByStatus(items, 'active'), 'border-sage', 'Akan tampil setelah unlock'],
    ['Draft', countByStatus(items, 'draft'), 'border-softpink', 'Masih aman disiapkan'],
    ['Hidden', countByStatus(items, 'hidden'), 'border-muted', 'Disimpan tapi tidak tampil'],
    ['Bagian Siap', sectionsReady, 'border-rose', 'Dari 6 bagian utama']
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {cards.map(([label, value, border, detail]) => (
        <div key={label} className={`rounded-xl border border-[rgba(196,138,106,0.22)] border-t-4 ${border} bg-white p-4 text-center shadow-xs`}>
          <p className="text-3xl font-semibold text-maroon">{value}</p>
          <p className="mt-1 text-xs font-semibold text-cocoa">{label}</p>
          <p className="mt-1 text-[11px] leading-4 text-muted">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function countByStatus(items: { status: ContentStatus }[], status: ContentStatus) {
  return items.filter((item) => item.status === status).length;
}

async function createItem(resource: Tab, body: MutationBody) {
  const res = await fetch(`/api/admin/content/${resource}`, { method: 'POST', body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal menyimpan.');
}
async function updateItem(resource: Tab, id: string, body: MutationBody) {
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

function StatusSelect({ label = 'Status', value, onChange }: { label?: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="draft">Draft</option>
        <option value="active">Published setelah unlock</option>
        <option value="hidden">Hidden</option>
      </select>
    </div>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const className =
    status === 'active'
      ? 'bg-sage/15 text-sage'
      : status === 'hidden'
        ? 'bg-muted/10 text-muted'
        : 'bg-softpink/20 text-maroon';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${className}`}>
      {status === 'active' && <ShieldCheck size={13} />}
      {status === 'draft' && <FilePenLine size={13} />}
      {status === 'hidden' && <EyeOff size={13} />}
      {statusLabels[status]}
    </span>
  );
}

function statusAction(status: ContentStatus) {
  if (status === 'active') return { label: 'Publish', Icon: Eye };
  if (status === 'hidden') return { label: 'Hide', Icon: EyeOff };
  return { label: 'Draft', Icon: FilePenLine };
}

function MemoryAdmin({ items, reload }: { items: Memory[]; reload: () => void }) {
  const [form, setForm] = useState({ title: '', story: '', memory_date: '', category: 'Momen Kecil', image_url: '', cloudinary_public_id: '', status: 'draft', is_favorite: false });
  const [editing, setEditing] = useState<Memory | null>(null);
  const [uploading, setUploading] = useState(false);
  const edit = editing || null;

  function fill(item: Memory) {
    setEditing(item);
    setForm({ title: item.title, story: item.story || '', memory_date: item.memory_date || '', category: item.category || '', image_url: item.image_url || '', cloudinary_public_id: item.cloudinary_public_id || '', status: item.status, is_favorite: item.is_favorite });
  }
  function reset() { setEditing(null); setForm({ title: '', story: '', memory_date: '', category: 'Momen Kecil', image_url: '', cloudinary_public_id: '', status: 'draft', is_favorite: false }); }
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
    if (edit) await updateItem('memories', edit.id, form);
    else await createItem('memories', form);
    reset(); reload();
  }
  return <AdminPanel title="Kelola Kenangan & Galeri" button="Simpan Kenangan" onSubmit={submit}>
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Judul" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
      <Field label="Tanggal" type="date" value={form.memory_date} onChange={(v) => setForm({ ...form, memory_date: v })} />
      <Field label="Kategori" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
      <StatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
      <TextareaField className="md:col-span-2" label="Cerita" value={form.story} onChange={(v) => setForm({ ...form, story: v })} />
      <FileField className="md:col-span-2" label="Upload Foto Cloudinary" uploading={uploading} hasFile={Boolean(form.image_url)} onChange={upload} />
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.is_favorite} onChange={(e) => setForm({ ...form, is_favorite: e.target.checked })} /> Jadikan favorit</label>
    </div>
    <ItemList
      items={items}
      title={(i) => i.title}
      subtitle={(i) => [i.category, i.memory_date].filter(Boolean).join(' - ') || 'Belum ada detail'}
      onEdit={fill}
      onStatusChange={async (i, status) => { await updateItem('memories', i.id, { status }); reload(); }}
      onDelete={async (i) => { await deleteItem('memories', i.id); reload(); }}
    />
  </AdminPanel>;
}

function LetterAdmin({ items, reload }: { items: Letter[]; reload: () => void }) {
  const [form, setForm] = useState({ title: '', body: '', unlock_label: 'Surat kecil', status: 'draft' });
  const [editing, setEditing] = useState<Letter | null>(null);
  function fill(item: Letter) { setEditing(item); setForm({ title: item.title, body: item.body, unlock_label: item.unlock_label || '', status: item.status }); }
  function reset() { setEditing(null); setForm({ title: '', body: '', unlock_label: 'Surat kecil', status: 'draft' }); }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) await updateItem('letters', editing.id, form);
    else await createItem('letters', form);
    reset(); reload();
  }
  return <AdminPanel title="Kelola Surat" button="Simpan Surat" onSubmit={submit}>
    <Field label="Judul Surat" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
    <Field label="Label" value={form.unlock_label} onChange={(v) => setForm({ ...form, unlock_label: v })} />
    <StatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
    <TextareaField label="Isi Surat" value={form.body} onChange={(v) => setForm({ ...form, body: v })} minHeight="min-h-44" />
    <ItemList
      items={items}
      title={(i) => i.title}
      subtitle={(i) => i.unlock_label || 'Surat kecil'}
      onEdit={fill}
      onStatusChange={async (i, status) => { await updateItem('letters', i.id, { status }); reload(); }}
      onDelete={async (i) => { await deleteItem('letters', i.id); reload(); }}
    />
  </AdminPanel>;
}

function CardAdmin({ items, reload }: { items: MemoryCard[]; reload: () => void }) {
  const [form, setForm] = useState({ title: '', body: '', card_type: 'Alasan', status: 'draft', sort_order: 0 });
  const [editing, setEditing] = useState<MemoryCard | null>(null);
  function fill(i: MemoryCard) { setEditing(i); setForm({ title: i.title, body: i.body, card_type: i.card_type || '', status: i.status, sort_order: i.sort_order }); }
  function reset() { setEditing(null); setForm({ title: '', body: '', card_type: 'Alasan', status: 'draft', sort_order: 0 }); }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) await updateItem('memory_cards', editing.id, form);
    else await createItem('memory_cards', form);
    reset(); reload();
  }
  return <AdminPanel title="Kelola Kotak Kenangan" button="Simpan Kartu" onSubmit={submit}>
    <Field label="Judul Kartu" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
    <Field label="Tipe" value={form.card_type} onChange={(v) => setForm({ ...form, card_type: v })} />
    <Field label="Urutan" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
    <StatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
    <TextareaField label="Isi Kartu" value={form.body} onChange={(v) => setForm({ ...form, body: v })} minHeight="min-h-32" />
    <ItemList
      items={items}
      title={(i) => i.title}
      subtitle={(i) => `${i.card_type || 'Kartu'} - urutan ${i.sort_order}`}
      onEdit={fill}
      onStatusChange={async (i, status) => { await updateItem('memory_cards', i.id, { status }); reload(); }}
      onDelete={async (i) => { await deleteItem('memory_cards', i.id); reload(); }}
    />
  </AdminPanel>;
}

function QuizAdmin({ items, reload }: { items: QuizQuestion[]; reload: () => void }) {
  const [form, setForm] = useState({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', feedback: '', status: 'draft', sort_order: 0 });
  const [editing, setEditing] = useState<QuizQuestion | null>(null);
  function fill(i: QuizQuestion) { setEditing(i); setForm({ question: i.question, option_a: i.option_a, option_b: i.option_b, option_c: i.option_c, option_d: i.option_d, correct_option: i.correct_option, feedback: i.feedback || '', status: i.status, sort_order: i.sort_order }); }
  function reset() { setEditing(null); setForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', feedback: '', status: 'draft', sort_order: 0 }); }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) await updateItem('quiz_questions', editing.id, form);
    else await createItem('quiz_questions', form);
    reset(); reload();
  }
  return <AdminPanel title="Kelola Quiz" button="Simpan Quiz" onSubmit={submit}>
    <Field label="Pertanyaan" value={form.question} onChange={(v) => setForm({ ...form, question: v })} />
    <div className="grid gap-3 md:grid-cols-2"><Field label="Opsi A" value={form.option_a} onChange={(v) => setForm({ ...form, option_a: v })} /><Field label="Opsi B" value={form.option_b} onChange={(v) => setForm({ ...form, option_b: v })} /><Field label="Opsi C" value={form.option_c} onChange={(v) => setForm({ ...form, option_c: v })} /><Field label="Opsi D" value={form.option_d} onChange={(v) => setForm({ ...form, option_d: v })} /></div>
    <div className="grid gap-3 md:grid-cols-3"><ChoiceSelect value={form.correct_option} onChange={(v) => setForm({ ...form, correct_option: v })} /><Field label="Urutan" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} /><StatusSelect value={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div>
    <Field label="Feedback" value={form.feedback} onChange={(v) => setForm({ ...form, feedback: v })} />
    <ItemList
      items={items}
      title={(i) => i.question}
      subtitle={(i) => `Jawaban ${i.correct_option} - urutan ${i.sort_order}`}
      onEdit={fill}
      onStatusChange={async (i, status) => { await updateItem('quiz_questions', i.id, { status }); reload(); }}
      onDelete={async (i) => { await deleteItem('quiz_questions', i.id); reload(); }}
    />
  </AdminPanel>;
}

function PlanAdmin({ items, reload }: { items: Plan[]; reload: () => void }) {
  const [form, setForm] = useState({ title: '', note: '', plan_status: 'ingin_dilakukan', status: 'draft', sort_order: 0 });
  const [editing, setEditing] = useState<Plan | null>(null);
  function fill(i: Plan) { setEditing(i); setForm({ title: i.title, note: i.note || '', plan_status: i.plan_status, status: i.status, sort_order: i.sort_order }); }
  function reset() { setEditing(null); setForm({ title: '', note: '', plan_status: 'ingin_dilakukan', status: 'draft', sort_order: 0 }); }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) await updateItem('plans', editing.id, form);
    else await createItem('plans', form);
    reset(); reload();
  }
  return <AdminPanel title="Kelola Rencana Kita" button="Simpan Rencana" onSubmit={submit}>
    <Field label="Rencana" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
    <Field label="Catatan" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
    <div className="grid gap-3 md:grid-cols-3"><PlanStatusSelect value={form.plan_status} onChange={(v) => setForm({ ...form, plan_status: v })} /><Field label="Urutan" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} /><StatusSelect label="Status Tampil" value={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div>
    <ItemList
      items={items}
      title={(i) => i.title}
      subtitle={(i) => `${i.plan_status.replace(/_/g, ' ')} - urutan ${i.sort_order}`}
      onEdit={fill}
      onStatusChange={async (i, status) => { await updateItem('plans', i.id, { status }); reload(); }}
      onDelete={async (i) => { await deleteItem('plans', i.id); reload(); }}
    />
  </AdminPanel>;
}

function SettingsAdmin({ item, reload }: { item: SiteSettings | null; reload: () => void }) {
  const settingsKey = JSON.stringify([item?.birthday_message, item?.final_message, item?.music_url]);
  return <SettingsForm key={settingsKey} item={item} reload={reload} />;
}

function SettingsForm({ item, reload }: { item: SiteSettings | null; reload: () => void }) {
  const [form, setForm] = useState({ birthday_message: item?.birthday_message || '', final_message: item?.final_message || '', music_url: item?.music_url || '' });
  async function submit(e: React.FormEvent) { e.preventDefault(); await updateItem('site_settings', 'main', form); reload(); }
  return <AdminPanel title="Site Settings" button="Simpan Settings" onSubmit={submit}>
    <Field label="URL Musik" value={form.music_url} onChange={(v) => setForm({ ...form, music_url: v })} />
    <TextareaField label="Birthday Message" value={form.birthday_message} onChange={(v) => setForm({ ...form, birthday_message: v })} />
    <TextareaField label="Final Message" value={form.final_message} onChange={(v) => setForm({ ...form, final_message: v })} minHeight="min-h-40" />
  </AdminPanel>;
}

function AdminPanel({ title, button, onSubmit, children }: { title: string; button: string; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode }) {
  return <form onSubmit={onSubmit} className="rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white p-5 shadow-romantic sm:p-6"><h2 className="text-xl font-semibold text-cocoa">{title}</h2><div className="mt-6 space-y-4">{children}</div><button className="btn-primary mt-6 gap-2"><Plus size={16} />{button}</button></form>;
}
function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  const id = useId();
  return <div><label className="label" htmlFor={id}>{label}</label><input id={id} className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} /></div>;
}
function TextareaField({
  label,
  value,
  onChange,
  className = '',
  minHeight = 'min-h-28'
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  minHeight?: string;
}) {
  const id = useId();
  return <div className={className}><label className="label" htmlFor={id}>{label}</label><textarea id={id} className={`input ${minHeight}`} value={value} onChange={(e) => onChange(e.target.value)} /></div>;
}
function FileField({
  label,
  uploading,
  hasFile,
  onChange,
  className = ''
}: {
  label: string;
  uploading: boolean;
  hasFile: boolean;
  onChange: (file: File) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} className="input" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])} />
      <p className="mt-2 text-sm text-muted">{uploading ? 'Mengupload...' : hasFile ? 'Foto sudah terupload.' : 'Maksimal 5 MB.'}</p>
    </div>
  );
}
function ChoiceSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <label className="label" htmlFor={id}>Jawaban Benar</label>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>
    </div>
  );
}
function PlanStatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <label className="label" htmlFor={id}>Status Rencana</label>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="ingin_dilakukan">Ingin dilakukan</option>
        <option value="direncanakan">Sedang direncanakan</option>
        <option value="tercapai">Sudah tercapai</option>
      </select>
    </div>
  );
}
function ItemList<T extends { id: string; status?: ContentStatus }>({
  items,
  title,
  subtitle,
  onEdit,
  onStatusChange,
  onDelete
}: {
  items: T[];
  title: (i: T) => string;
  subtitle: (i: T) => string;
  onEdit: (i: T) => void;
  onStatusChange?: (i: T, status: ContentStatus) => Promise<void>;
  onDelete: (i: T) => void;
}) {
  const [pending, setPending] = useState('');

  async function changeStatus(item: T, status: ContentStatus) {
    if (!onStatusChange) return;
    const key = `${item.id}:${status}`;
    setPending(key);
    try {
      await onStatusChange(item, status);
    } finally {
      setPending('');
    }
  }

  return (
    <div className="mt-8 space-y-3">
      <h3 className="font-semibold text-cocoa">Daftar Konten</h3>
      {!items.length && <div className="rounded-xl border border-dashed border-[rgba(196,138,106,0.35)] bg-white/70 p-5 text-sm text-muted">Belum ada item di bagian ini.</div>}
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-[rgba(196,138,106,0.22)] bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-cocoa">{title(item)}</p>
                {item.status && <StatusBadge status={item.status} />}
              </div>
              <p className="mt-1 text-sm text-muted">{subtitle(item)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => onEdit(item)} className="btn-secondary !min-h-10 !py-2">Edit</button>
              <button type="button" aria-label="Hapus" onClick={() => onDelete(item)} className="inline-flex min-h-10 items-center justify-center rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          {item.status && onStatusChange && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[rgba(196,138,106,0.16)] pt-4">
              {contentStatuses
                .filter((status) => status !== item.status)
                .map((status) => {
                  const action = statusAction(status);
                  const Icon = action.Icon;
                  const disabled = pending === `${item.id}:${status}`;
                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={disabled}
                      onClick={() => void changeStatus(item, status)}
                      className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[rgba(196,138,106,0.22)] px-3 py-2 text-xs font-semibold text-cocoa transition hover:border-rose hover:text-rose disabled:opacity-50"
                    >
                      <Icon size={14} />
                      {disabled ? 'Menyimpan...' : action.label}
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
