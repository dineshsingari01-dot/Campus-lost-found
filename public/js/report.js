if (!requireAuth()) throw new Error('redirect');

const form = document.getElementById('report-form');
const titleInput = document.getElementById('title');
const categoryInput = document.getElementById('category');
const dupWarning = document.getElementById('dup-warning');

let dupTimer;
titleInput.addEventListener('input', () => {
  clearTimeout(dupTimer);
  dupTimer = setTimeout(async () => {
    const title = titleInput.value.trim();
    const category = categoryInput.value;
    if (!title || !category) return dupWarning.classList.add('hidden');
    try {
      const res = await request(`/items/check/duplicate?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`);
      if (res.duplicate) {
        dupWarning.textContent = `Warning: ${res.count} similar item(s) already reported.`;
        dupWarning.classList.remove('hidden');
      } else {
        dupWarning.classList.add('hidden');
      }
    } catch {}
  }, 400);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    title: titleInput.value.trim(),
    category: categoryInput.value,
    description: document.getElementById('description').value.trim(),
    location: document.getElementById('location').value.trim(),
    date: document.getElementById('date').value,
    type: document.getElementById('type').value,
    imageUrl: document.getElementById('imageUrl').value.trim()
  };
  try {
    await request('/items', { method: 'POST', body: JSON.stringify(body) });
    toast('Report submitted!');
    setTimeout(() => window.location.href = '/dashboard.html', 600);
  } catch (err) { toast(err.message, 'error'); }
});
