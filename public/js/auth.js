document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      try {
        const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        setAuth(data);
        toast('Login successful');
        setTimeout(() => window.location.href = '/index.html', 500);
      } catch (err) { toast(err.message, 'error'); }
    });
  }
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      if (password.length < 6) return toast('Password must be at least 6 characters', 'error');
      try {
        const data = await request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
        setAuth(data);
        toast('Registration successful');
        setTimeout(() => window.location.href = '/index.html', 500);
      } catch (err) { toast(err.message, 'error'); }
    });
  }
});
