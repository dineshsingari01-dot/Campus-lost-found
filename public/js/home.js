async function loadItems() {
  const grid = document.getElementById('items-grid');
  grid.innerHTML = '<p class="muted">Loading...</p>';
  const params = new URLSearchParams();
  const keyword = document.getElementById('keyword').value;
  const category = document.getElementById('category').value;
  const location = document.getElementById('location').value;
  const type = document.getElementById('type').value;
  const sort = document.getElementById('sort').value;
  if (keyword) params.append('keyword', keyword);
  if (category) params.append('category', category);
  if (location) params.append('location', location);
  if (type) params.append('type', type);
  if (sort) params.append('sort', sort);
  try {
    const items = await request(`/items?${params.toString()}`);
    if (!items.length) { grid.innerHTML = '<p class="muted">No items found.</p>'; return; }
    grid.innerHTML = items.map(renderItemCard).join('');
  } catch (err) {
    grid.innerHTML = `<p class="muted">Error: ${err.message}</p>`;
  }
}

function renderItemCard(item) {
  const img = item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" />` : '';
  return `
    <div class="item-card">
      ${img}
      <div class="head">
        <h3>${escapeHtml(item.title)}</h3>
        <span class="badge ${item.type}">${item.type.toUpperCase()}</span>
      </div>
      <div class="body">
        <p><strong>Category:</strong> ${escapeHtml(item.category)}</p>
        <p><strong>Location:</strong> ${escapeHtml(item.location)}</p>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span class="badge ${item.status}">${item.status}</span></p>
        <p>${escapeHtml(item.description).slice(0, 80)}...</p>
        <a class="btn small mt" href="/item.html?id=${item._id}">View / Claim</a>
      </div>
    </div>`;
}

document.getElementById('search-form').addEventListener('submit', (e) => { e.preventDefault(); loadItems(); });
loadItems();
