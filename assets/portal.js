// ── PASSWORDS ──
const PASSWORDS = {"investor123": true, "host456": true, "insider789": true, "founder2026": true};

function tryLogin() {
  const pw = document.getElementById('pw-input').value.trim();
  if (PASSWORDS[pw]) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
  } else {
    document.getElementById('pw-error').style.display = 'block';
    document.getElementById('pw-input').value = '';
    document.getElementById('pw-input').focus();
  }
}

// ── AUDIENCE ──
function setAudience(aud, btn) {
  document.body.setAttribute('data-audience', aud);
  document.querySelectorAll('.aud-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Navigate to overview when switching audience
  nav('overview', document.querySelector('.nav-item'));
}

// ── NAVIGATION ──
function nav(pageId, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  if (btn) btn.classList.add('active');
  document.getElementById('main').scrollTop = 0;
}
