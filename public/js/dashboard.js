if (!requireAuth()) throw new Error('redirect');

async function loadMyItems() {
  const box = document.getElementById('my-items');
  try {
    const all = await request('/items');
    const me = getUser();
    const mine = all.filter(i => i.reportedBy?._id === me._id);
    if (!mine.length) return box.innerHTML = '<p class="muted">You have not reported any items yet.</p>';
    box.innerHTML = mine.map(item => `
      <div class="item-card">
        <div class="head">
          <h3>${escapeHtml(item.title)}</h3>
          <span class="badge ${item.type}">${item.type.toUpperCase()}</span>
        </div>
        <div class="body">
          <p><strong>Category:</strong> ${item.category}</p>
          <p><strong>Status:</strong> <span class="badge ${item.status}">${item.status}</span></p>
          <div class="row mt">
            <a class="btn small" href="/item.html?id=${item._id}">View</a>
            <button class="btn small danger" onclick="deleteItem('${item._id}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) { box.innerHTML = `<p>${err.message}</p>`; }
}

async function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  try {
    await request(`/items/${id}`, { method: 'DELETE' });
    toast('Deleted');
    loadMyItems();
  } catch (err) { toast(err.message, 'error'); }
}

async function loadMyClaims() {
  const box = document.getElementById('my-claims');
  try {
    const claims = await request('/claims/my');
    if (!claims.length) return box.innerHTML = '<p class="muted">You have not submitted any claims.</p>';
    box.innerHTML = claims.map(c => `
      <div class="card">
        <p><strong>Item:</strong> ${escapeHtml(c.item?.title || 'Deleted item')}</p>
        <p><strong>Message:</strong> ${escapeHtml(c.message)}</p>
        <p><strong>Status:</strong> <span class="badge ${c.status}">${c.status}</span></p>
      </div>
    `).join('');
  } catch (err) { box.innerHTML = `<p>${err.message}</p>`; }
}

loadMyItems();
loadMyClaims();
