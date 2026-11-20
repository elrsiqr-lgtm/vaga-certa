const $ = (s) => document.querySelector(s);
const MAX_RESUMES = 5, MAX_BYTES = 4 * 1024 * 1024;
let resumes = [];

function renderResumes() {
  const ul = $('#resumes');
  ul.replaceChildren();
  if (!resumes.length) { const li = document.createElement('li'); li.textContent = 'Nenhum currículo cadastrado ainda.'; ul.append(li); }
  resumes.forEach((r, i) => {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.textContent = r.name;
    const size = document.createElement('small'); size.textContent = Math.round(r.size / 1024) + ' KB';
    const del = document.createElement('button'); del.textContent = 'Remover';
    del.onclick = async () => { resumes.splice(i, 1); await chrome.storage.local.set({ resumes }); renderResumes(); };
    if (resumes.length) li.append(name, size, del); else li.append(name);
    ul.append(li);
  });
}
const toBase64 = (buf) => { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(s); };

async function load() {
  const c = await chrome.storage.local.get(['apiKey', 'model', 'resumes', 'salarioAtual', 'salarioDesejado']);
  resumes = c.resumes || [];
  $('#apiKey').value = c.apiKey || '';
  $('#model').value = c.model || 'claude-sonnet-5-5';
  $('#salarioAtual').value = c.salarioAtual || '';
  $('#salarioDesejado').value = c.salarioDesejado || '';
  renderResumes();
}

$('#file').addEventListener('change', async (e) => {
  const msg = $('#fileMsg'); msg.className = 'msg'; msg.textContent = '';
  const errs = [];
  for (const f of e.target.files) {
    if (resumes.length >= MAX_RESUMES) { errs.push(`Limite de ${MAX_RESUMES} currículos.`); break; }
    if (f.type !== 'application/pdf') { errs.push(`${f.name}: só PDF.`); continue; }
    if (f.size > MAX_BYTES) { errs.push(`${f.name}: maior que 4 MB.`); continue; }
    resumes.push({ id: crypto.randomUUID(), name: f.name.replace(/\.pdf$/i, ''), size: f.size, data: toBase64(await f.arrayBuffer()) });
  }
  e.target.value = '';
  await chrome.storage.local.set({ resumes });
  renderResumes();
  if (errs.length) { msg.className = 'msg err'; msg.textContent = errs.join(' '); }
});

$('#save').addEventListener('click', async () => {
  await chrome.storage.local.set({
    apiKey: $('#apiKey').value.trim(),
    model: $('#model').value,
    salarioAtual: Number($('#salarioAtual').value) || 0,
    salarioDesejado: Number($('#salarioDesejado').value) || 0
  });
  $('#saveMsg').textContent = 'Salvo ✓'; setTimeout(() => ($('#saveMsg').textContent = ''), 2000);
});

$('#wipe').addEventListener('click', async () => {
  if (!confirm('Apagar currículos, chave e configurações deste navegador?')) return;
  await chrome.storage.local.clear(); await load();
});

load();
