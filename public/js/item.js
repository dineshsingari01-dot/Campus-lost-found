const params = new URLSearchParams(window.location.search);
const itemId = params.get('id');
if (!itemId) window.location.href = '/index.html';
const user = getUser();

async function loadItem() {
  try {
    const item = await request(`/items/${itemId}`);
    const detail = document.getElementById('item-detail');
    detail.innerHTML = `
      <h1>${escapeHtml(item.title)} <span class="badge ${item.type}">${item.type.toUpperCase()}</span></h1>
      ${item.imageUrl ? `<img src="${item.imageUrl}" style="max-width:100%;border-radius:8px;margin:10px 0;" />` : ''}
      <p><strong>Category:</strong> ${escapeHtml(item.category)}</p>
      <p><strong>Description:</strong> ${escapeHtml(item.description)}</p>
      <p><strong>Location:</strong> ${escapeHtml(item.location)}</p>
      <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> <span class="badge ${item.status}">${item.status}</span></p>
      <p><strong>Reported by:</strong> ${item.reportedBy?.name || 'Unknown'}</p>
    `;
    if (user && user._id !== item.reportedBy?._id && item.status === 'open') {
      document.getElementById('claim-section').classList.remove('hidden');
    }
    if (user && (user._id === item.reportedBy?._id || user.role === 'admin')) {
      loadClaims();
    }
  } catch (err) {
    document.getElementById('item-detail').innerHTML = `<p>${err.message}</p>`;
  }
}

async function loadClaims() {
  try {
    const claims = await request(`/claims/item/${itemId}`);
    const box = document.getElementById('claims-list');
    const container = document.getElementById('claims-container');
    if (!claims.length) { container.innerHTML = '<p class="muted">No claims yet.</p>'; }
    else {
      container.innerHTML = claims.map(c => `
        <div class="card">
          <p><strong>${escapeHtml(c.claimant.name)}</strong> (${escapeHtml(c.claimant.email)})</p>
          <p>${escapeHtml(c.message)}</p>
          <p>Status: <span class="badge ${c.status}">${c.status}</span></p>
          ${c.status === 'pending' ? `
            <div class="row mt">
              <button class="btn small success" onclick="updateClaim('${c._id}','approved')">Approve</button>
              <button class="btn small danger" onclick="updateClaim('${c._id}','rejected')">Reject</button>
            </div>` : ''}
        </div>
      `).join('');
    }
    box.classList.remove('hidden');
  } catch {}
}

async function updateClaim(id, status) {
  try {
    await request(`/claims/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    toast(`Claim ${status}`);
    loadClaims();
    loadItem();
  } catch (err) { toast(err.message, 'error'); }
}

const claimForm = document.getElementById('claim-form');
if (claimForm) {
  claimForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = document.getElementById('claim-message').value.trim();
    try {
      await request('/claims', { method: 'POST', body: JSON.stringify({ item: itemId, message }) });
      toast('Claim submitted');
      claimForm.reset();
      document.getElementById('claim-section').classList.add('hidden');
    } catch (err) { toast(err.message, 'error'); }
  });
}

loadItem();
