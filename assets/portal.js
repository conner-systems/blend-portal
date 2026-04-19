const AIRTABLE_API_KEY = window.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE = 'apphCfpJ4CFtw9l4d';

const ACCESS_CODES = {
  BLEND2026: 'host',
  INVESTOR24: 'investor',
  FOUNDER: 'investor'
};

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !overlay) return;
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function nav(pageId, btn) {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (window.innerWidth <= 768 && sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  if (btn) btn.classList.add('active');
  const main = document.getElementById('main');
  if (main) main.scrollTop = 0;
}

function setAudience() {
  // Legacy no-op. Access level now controls view.
}

function tryLogin() {
  handleAccessCode();
}

function renderAccessScreen() {
  const root = document.getElementById('gate-root');
  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
      <div class="login-box">
        <div class="logo">BLEND+</div>
        <div class="tagline">Southwest Region · By invitation only · Confidential</div>
        <input type="password" id="access-code-input" placeholder="Enter access code" onkeydown="if(event.key==='Enter')handleAccessCode()"/>
        <button onclick="handleAccessCode()">Enter</button>
        <div class="login-error" id="access-code-error">Incorrect access code.</div>
      </div>
    </div>
  `;
}

function handleAccessCode() {
  const input = document.getElementById('access-code-input');
  const error = document.getElementById('access-code-error');
  const code = (input.value || '').trim();
  if (code === 'FOUNDER') {
    sessionStorage.setItem('accessLevel', 'investor');
    sessionStorage.setItem('userName', 'Conner');
    sessionStorage.setItem('userEmail', 'conner@blendplus.co');
    showPortal();
    return;
  }
  const level = ACCESS_CODES[code];
  if (!level) {
    error.style.display = 'block';
    input.value = '';
    input.focus();
    return;
  }
  sessionStorage.setItem('accessLevel', level);
  renderNDAScreen();
}

function renderNDAScreen() {
  const root = document.getElementById('gate-root');
  root.innerHTML = `
    <div style="min-height:100vh;padding:24px;max-width:920px;margin:0 auto;">
      <div style="font-size:28px;font-weight:900;color:var(--cyan);letter-spacing:-0.02em;margin-bottom:18px;">BLEND+</div>
      <div style="font-size:32px;font-weight:900;color:var(--text);margin-bottom:8px;">Before You Continue</div>
      <div style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:18px;">What you are about to see represents thousands of hours of engineering, software development, and strategic planning — and a platform already in motion with five founding partners secured. This information is shared selectively. Please read the agreement below before continuing.</div>
      <div style="max-height:280px;overflow-y:auto;border:1px solid var(--border);background:var(--surface);padding:16px;border-radius:10px;font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:18px;white-space:pre-wrap;">NON-DISCLOSURE AGREEMENT — v1.0 — April 2026

By entering your information and clicking 'I Agree & Enter Portal', you agree to the following:

1. Confidentiality. All information in this portal — including business plans, financial projections, product specifications, pricing, and partnership terms — is confidential and proprietary to BLEND+, Inc.

2. Non-Disclosure. You will not disclose, share, reproduce, copy, or distribute any information from this portal to any third party without prior written consent from BLEND+, Inc.

3. Limited Use. You will use this information solely to evaluate a potential business relationship with BLEND+, Inc.

4. No License. Nothing in this portal grants any license, right, or interest in BLEND+, Inc. or its intellectual property.

5. Governing Law. This agreement is governed by the laws of the State of Delaware.

Your name, email, company, timestamp, and access level will be recorded upon submission. This NDA is electronically executed upon clicking 'I Agree & Enter Portal'.</div>
      <form id="nda-form">
        <div class="two-col" style="margin-bottom:12px;">
          <input id="nda-name" type="text" required placeholder="Full Name" style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:var(--font);font-size:13px;padding:10px 12px;border-radius:8px;">
          <input id="nda-email" type="email" required placeholder="Email" style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:var(--font);font-size:13px;padding:10px 12px;border-radius:8px;">
        </div>
        <div class="two-col" style="margin-bottom:12px;">
          <input id="nda-company" type="text" required placeholder="Company or Facility Name" style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:var(--font);font-size:13px;padding:10px 12px;border-radius:8px;">
          <select id="nda-facility-type" required style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:var(--font);font-size:13px;padding:10px 12px;border-radius:8px;">
            <option value="">Facility Type</option>
            <option>Gym or Fitness Center</option>
            <option>Hotel or Resort</option>
            <option>Corporate Campus</option>
            <option>College or University</option>
            <option>Clinical or Wellness Facility</option>
            <option>Investor</option>
            <option>Other</option>
          </select>
        </div>
        <label style="display:flex;gap:8px;align-items:flex-start;font-size:12px;color:var(--muted);margin-bottom:14px;">
          <input id="nda-agree" type="checkbox" style="margin-top:2px;">
          <span>I have read and agree to the Non-Disclosure Agreement above</span>
        </label>
        <button id="nda-submit" type="submit" disabled style="background:var(--cyan);opacity:.55;color:#080C10;font-family:var(--font);font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:12px 18px;border:none;border-radius:8px;cursor:pointer;">I Agree & Enter Portal</button>
      </form>
    </div>
  `;

  const agree = document.getElementById('nda-agree');
  const submit = document.getElementById('nda-submit');
  agree.addEventListener('change', () => {
    submit.disabled = !agree.checked;
    submit.style.opacity = agree.checked ? '1' : '.55';
  });
  document.getElementById('nda-form').addEventListener('submit', submitNDA);
}

async function submitNDA(event) {
  event.preventDefault();
  const name = document.getElementById('nda-name').value.trim();
  const email = document.getElementById('nda-email').value.trim();
  const company = document.getElementById('nda-company').value.trim();
  const facilityType = document.getElementById('nda-facility-type').value;
  const accessLevel = sessionStorage.getItem('accessLevel') || 'host';

  const payload = {
    records: [{
      fields: {
        fldx8X1jHjvBkWohh: name,
        fldBBaOqXmJpX9kAH: email,
        fldKFAH3Ms8kb95Lx: company,
        fld5dLM9DMvUyDBzg: facilityType,
        fldfRWPUXU3tA1Pzy: true,
        fld8Fq6fvIw5i97EF: new Date().toISOString(),
        fldeG4iPzffvT9TCq: 'v1.0 — April 2026'
      }
    }]
  };

  try {
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/tblsSZyuLCq2INg8j`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('NDA Airtable POST failed:', error);
  }

  sessionStorage.setItem('userName', name);
  sessionStorage.setItem('userEmail', email);
  sessionStorage.setItem('userCompany', company);
  sessionStorage.setItem('userFacilityType', facilityType);

  if (accessLevel === 'host') renderFacilitySelector();
  else showPortal();
}

function renderFacilitySelector() {
  const root = document.getElementById('gate-root');
  const options = [
    ['🏋️', 'Gym or Fitness Center', 'Post-workout nutrition your members already want — generating passive revenue for you.'],
    ['🏨', 'Hotel or Resort', 'Premium wellness amenity at zero cost — enhancing guest experience and earning monthly revenue.'],
    ['🏢', 'Corporate Campus', 'Employee wellness benefit that pays you — not one that costs you.'],
    ['🎓', 'College or University', 'Built for high-traffic rec centers — zero staff, maximum member engagement.'],
    ['🏥', 'Clinical or Wellness Facility', 'Precision nutrition that extends your clinical offering — with a revenue share built in.'],
    ['🔍', 'I want to explore all options', 'See the full picture and decide what model works for you.']
  ];

  root.innerHTML = `
    <div style="min-height:100vh;padding:24px;max-width:920px;margin:0 auto;">
      <div style="font-size:32px;font-weight:900;color:var(--text);margin-bottom:8px;">What best describes your facility?</div>
      <div style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:18px;">BLEND+ is currently deploying across California and Arizona. Tell us what you operate and we will show you exactly how the model works for your facility type.</div>
      <div class="two-col" id="facility-grid"></div>
    </div>
  `;

  const grid = document.getElementById('facility-grid');
  options.forEach(([icon, label, subtext]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;cursor:pointer;color:var(--text);font-family:var(--font);text-align:left;transition:border-color .2s;';
    btn.innerHTML = `<div style="font-size:28px;margin-bottom:10px;">${icon}</div><div style="font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;">${label}</div><div style="font-size:11px;color:var(--sub);line-height:1.5;">${subtext}</div>`;
    btn.onmouseenter = () => { btn.style.borderColor = 'var(--cyan)'; };
    btn.onmouseleave = () => { btn.style.borderColor = 'var(--border)'; };
    btn.onclick = () => {
      sessionStorage.setItem('selectedFacility', label);
      showPortal();
    };
    grid.appendChild(btn);
  });
}

function getPageIdFromButton(btn) {
  const oc = btn.getAttribute('onclick') || '';
  const m = oc.match(/nav\('([^']+)'/);
  return m ? m[1] : '';
}

function removeSectionById(id) {
  const el = document.getElementById(`page-${id}`);
  if (el) el.remove();
}

function ensureSubmitInterestNav() {
  const navSection = document.querySelector('#sidebar .nav-section');
  if (!navSection) return;
  const existing = Array.from(navSection.querySelectorAll('.nav-item')).find((b) => getPageIdFromButton(b) === 'submit-interest');
  if (existing) return;
  const btn = document.createElement('button');
  btn.className = 'nav-item';
  btn.setAttribute('onclick', "nav('submit-interest',this)");
  btn.innerHTML = '<span class="nav-dot"></span>Submit Interest';
  navSection.appendChild(btn);
}

function configureHostView() {
  document.body.setAttribute('data-audience', 'host');
  const allowed = new Set(['overview', 'team', 'machine', 'app', 'dashboard', 'ingredients', 'retention', 'host-terms', 'host-economics', 'submit-interest']);
  document.querySelectorAll('#sidebar .nav-item').forEach((btn) => {
    const id = getPageIdFromButton(btn);
    if (!allowed.has(id)) btn.remove();
  });
  ['raise', 'economics', 'trajectory', 'acquisition', 'tam', 'projections', 'engineering', 'bom', 'ops', 'software'].forEach(removeSectionById);
  const safeBlock = Array.from(document.querySelectorAll('div')).find((d) => (d.textContent || '').includes('SAFE Agreements · Full Legal Documents'));
  if (safeBlock) safeBlock.remove();
  if (!document.getElementById('host-welcome-banner')) {
    const overview = document.getElementById('page-overview');
    if (overview) {
      const selectedFacility = sessionStorage.getItem('selectedFacility') || sessionStorage.getItem('userFacilityType') || 'facility';
      const name = sessionStorage.getItem('userName') || 'Partner';
      const banner = document.createElement('div');
      banner.id = 'host-welcome-banner';
      banner.className = 'card';
      banner.style.borderColor = 'var(--cyan)';
      banner.style.marginBottom = '16px';
      banner.innerHTML = `<div style="font-size:13px;color:var(--cyan);line-height:1.6;">Welcome, ${name}. You're viewing the ${selectedFacility} partner experience.</div>`;
      overview.insertBefore(banner, overview.firstChild);
    }
  }
}

function configureInvestorView() {
  document.body.setAttribute('data-audience', 'investor');
  const logo = document.querySelector('.sidebar-logo');
  if (logo && !document.getElementById('investor-view-badge')) {
    const badge = document.createElement('span');
    badge.id = 'investor-view-badge';
    badge.textContent = 'INVESTOR VIEW';
    badge.style.cssText = 'display:inline-block;margin-top:8px;padding:2px 6px;border:1px solid var(--cyan);border-radius:4px;color:var(--cyan);font-size:9px;letter-spacing:0.08em;text-transform:uppercase;';
    logo.appendChild(badge);
  }
}

function configurePortalForAccess() {
  ensureSubmitInterestNav();
  const audienceToggle = document.querySelector('.audience-toggle');
  if (audienceToggle) audienceToggle.remove();
  const accessLevel = sessionStorage.getItem('accessLevel') || 'host';
  if (accessLevel === 'host') configureHostView();
  else configureInvestorView();
}

function renderSubmitSuccess(userName) {
  const shell = document.getElementById('submit-interest-shell');
  if (!shell) return;
  shell.innerHTML = `<div style="padding:8px 0;"><div style="font-size:26px;font-weight:900;color:var(--text);margin-bottom:8px;">We've received your submission.</div><div style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:10px;">Thank you, ${userName}. Conner will review your details and follow up within 48 hours.</div><div style="font-size:12px;color:var(--cyan);letter-spacing:0.04em;">Conner Ward · Founder, BLEND+ · conner@blendplus.co</div></div>`;
}

function attachSubmitInterestHandler() {
  const form = document.getElementById('submit-interest-form');
  if (!form || form.dataset.bound === '1') return;
  form.dataset.bound = '1';
  const facilityInput = document.getElementById('si-facility');
  if (facilityInput && !facilityInput.value) facilityInput.value = sessionStorage.getItem('userCompany') || '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const facilityName = document.getElementById('si-facility').value.trim();
    const city = document.getElementById('si-city').value.trim();
    const footTraffic = document.getElementById('si-traffic').value;
    const ownOrLease = document.getElementById('si-own').value;
    const electricalCircuit = document.getElementById('si-electric').value;
    const floorDrain = document.getElementById('si-drain').value;
    const workingModel = document.getElementById('si-model').value;
    const message = document.getElementById('si-message').value.trim();
    const timestamp = new Date().toISOString();
    const userName = sessionStorage.getItem('userName') || '';
    const userEmail = sessionStorage.getItem('userEmail') || '';
    const userFacilityType = sessionStorage.getItem('userFacilityType') || '';

    const payload = {
      records: [{
        fields: {
          fldWF2agkV9BdRu8S: userName,
          fldqMJg08b4QKPdnZ: userEmail,
          fldrCSOhNvdAWLyxC: facilityName,
          fldVmCj6kt26dkQRS: userFacilityType,
          fldLCIbGJ5p5UyJsR: city,
          fldnLaPepjhFmqh1L: footTraffic,
          fldMkUZcOiXbje4uy: ownOrLease,
          fldCh2cdbLLXGDkbi: electricalCircuit,
          fldEYCUBQ8NNNRNQe: floorDrain,
          fldxpP6gWU1zdLcWF: workingModel,
          fldpaURKNu2dv4BzU: message,
          fldJLLPSTuhBvuYxS: 'New',
          fldzzGmJGgYoOFUha: timestamp
        }
      }]
    };

    const subject = `New BLEND+ Interest Submission — ${facilityName}`;
    const body = [
      `Name: ${userName}`,
      `Email: ${userEmail}`,
      `Facility: ${facilityName}`,
      `Facility Type: ${userFacilityType}`,
      `City: ${city}`,
      `Daily Foot Traffic: ${footTraffic}`,
      `Own or Lease: ${ownOrLease}`,
      `Electrical Circuit: ${electricalCircuit}`,
      `Floor Drain: ${floorDrain}`,
      `Working Model: ${workingModel}`,
      `Message: ${message}`,
      `Submitted: ${timestamp}`
    ].join('\n');
    window.open(`mailto:conner@blendplus.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');

    try {
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/tblDVB31XM6YzPv78`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      renderSubmitSuccess(userName);
    } catch (error) {
      console.error('Interest Airtable POST failed:', error);
      renderSubmitSuccess(userName);
    }
  });
}

function showPortal() {
  const loginScreen = document.getElementById('login-screen');
  const app = document.getElementById('app');
  if (loginScreen) loginScreen.style.display = 'none';
  if (app) app.style.display = 'flex';
  configurePortalForAccess();
  attachSubmitInterestHandler();
  const overviewBtn = Array.from(document.querySelectorAll('.nav-item')).find((b) => getPageIdFromButton(b) === 'overview');
  nav('overview', overviewBtn || null);
}

function bootFlow() {
  const level = sessionStorage.getItem('accessLevel');
  if (!level) {
    renderAccessScreen();
    return;
  }
  const hasNdaData = sessionStorage.getItem('userName') && sessionStorage.getItem('userEmail') && sessionStorage.getItem('userCompany');
  if (!hasNdaData) {
    renderNDAScreen();
    return;
  }
  if (level === 'host' && !sessionStorage.getItem('selectedFacility')) {
    renderFacilitySelector();
    return;
  }
  showPortal();
}

window.handleAccessCode = handleAccessCode;
window.submitNDA = submitNDA;

document.addEventListener('DOMContentLoaded', bootFlow);
