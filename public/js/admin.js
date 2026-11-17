if (!requireAuth()) throw new Error('redirect');
const me = getUser();
if (me.role !== 'admin') { alert('Admin access only'); window.location.href = '/index.html'; }

async function loadStats() {
  try {
    const s = await request('/admin/stats');
    document.getElementById('stats').innerHTML = `
      <div class="stat"><h3>${s.totalUsers}</h3><p>Users</p></div>
      <div class="stat"><h3>${s.totalItems}</h3><p>Total Items</p></div>
      <div class="stat"><h3>${s.lost}</h3><p>Lost</p></div>
      <div class="stat"><h3>${s.found}</h3><p>Found</p></div>
      <div class="stat"><h3>${s.pendingClaims}</h3><p>Pending Claims</p></div>
      <div class="stat"><h3>${s.resolved}</h3><p>Resolved</p></div>
    `;
  } catch (err) { console.error(err); }
}

async function loadItems() {
  try {
    const items = await request('/items');
    const box = document.getElementById('admin-items');
    if (!items.length) return box.innerHTML = '<p class="muted">No items.</p>';
    box.innerHTML = items.map(item => `
      <div class="item-card">
        <div class="head">
          <h3>${escapeHtml(item.title)}</h3>
          <span class="badge ${item.type}">${item.type.toUpperCase()}</span>
        </div>
        <div class="body">
          <p><strong>Status:</strong> <span class="badge ${item.status}">${item.status}</span></p>
          <p><strong>Location:</strong> ${item.location}</p>
          <select onchange="changeStatus('${item._id}', this.value)">
            <option value="open" ${item.status==='open'?'selected':''}>open</option>
            <option value="claimed" ${item.status==='claimed'?'selected':''}>claimed</option>
            <option value="resolved" ${item.status==='resolved'?'selected':''}>resolved</option>
          </select>
          <button class="btn small danger mt" onclick="deleteItem('${item._id}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (err) { console.error(err); }
}

async function changeStatus(id, status) {
  try {
    await request(`/items/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    toast('Status updated');
    loadStats(); loadItems();
  } catch (err) { toast(err.message, 'error'); }
}

async function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  try {
    await request(`/items/${id}`, { method: 'DELETE' });
    toast('Deleted');
    loadStats(); loadItems();
  } catch (err) { toast(err.message, 'error'); }
}

async function loadClaims() {
  try {
    const claims = await request('/claims');
    const box = document.getElementById('admin-claims');
    if (!claims.length) return box.innerHTML = '<p class="muted">No claims.</p>';
    box.innerHTML = claims.map(c => `
      <div class="card">
        <p><strong>Item:</strong> ${escapeHtml(c.item?.title || 'N/A')}</p>
        <p><strong>By:</strong> ${escapeHtml(c.claimant.name)} (${escapeHtml(c.claimant.email)})</p>
        <p><strong>Message:</strong> ${escapeHtml(c.message)}</p>
        <p><strong>Status:</strong> <span class="badge ${c.status}">${c.status}</span></p>
        ${c.status === 'pending' ? `
          <div class="row mt">
            <button class="btn small success" onclick="updateClaim('${c._id}','approved')">Approve</button>
            <button class="btn small danger" onclick="updateClaim('${c._id}','rejected')">Reject</button>
          </div>` : ''}
      </div>
    `).join('');
  } catch (err) { console.error(err); }
}

async function updateClaim(id, status) {
  try {
    await request(`/claims/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    toast(`Claim ${status}`);
    loadStats(); loadClaims(); loadItems();
  } catch (err) { toast(err.message, 'error'); }
}

loadStats(); loadItems(); loadClaims();
