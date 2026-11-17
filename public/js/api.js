const API_BASE = '/api';

function getToken() { return localStorage.getItem('token'); }
function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}
function setAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role }));
}
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

function toast(message, type = 'success') {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = `toast ${type} show`;
  setTimeout(() => el.classList.remove('show'), 3000);
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

function renderNav() {
  const user = getUser();
  const el = document.getElementById('nav-links');
  if (!el) return;
  const links = [`<li><a href="/index.html">Home</a></li>`];
  if (user) {
    links.push(`<li><a href="/report.html">Report</a></li>`);
    links.push(`<li><a href="/dashboard.html">Dashboard</a></li>`);
    if (user.role === 'admin') links.push(`<li><a href="/admin.html">Admin</a></li>`);
    links.push(`<li><span class="user-badge">${user.name}</span></li>`);
    links.push(`<li><a href="#" id="logout-btn">Logout</a></li>`);
  } else {
    links.push(`<li><a href="/login.html">Login</a></li>`);
    links.push(`<li><a href="/register.html">Register</a></li>`);
  }
  el.innerHTML = links.join('');
  const lo = document.getElementById('logout-btn');
  if (lo) lo.addEventListener('click', (e) => { e.preventDefault(); logout(); });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', renderNav);
