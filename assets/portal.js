const AIRTABLE_API_KEY = window.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE = 'apphCfpJ4CFtw9l4d';

sessionStorage.removeItem('accessLevel');
sessionStorage.removeItem('userName');
sessionStorage.removeItem('userEmail');
sessionStorage.removeItem('userCompany');
sessionStorage.removeItem('userFacilityType');
sessionStorage.removeItem('selectedFacility');

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
  const navBtn = btn || Array.from(document.querySelectorAll('.nav-item')).find((b) => {
    if (getPageIdFromButton(b) !== pageId) return false;
    return b.offsetParent !== null;
  });
  if (navBtn) navBtn.classList.add('active');
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
    <div style="min-height:100vh;padding:24px;display:flex;align-items:center;justify-content:center;background:#F8FAFB;">
      <div id="nda-card" style="width:100%;max-width:640px;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <div style="font-size:28px;font-weight:900;color:var(--cyan);letter-spacing:-0.02em;margin-bottom:18px;">BLEND+</div>
      <div style="font-size:32px;font-weight:700;color:#111827;margin-bottom:8px;">Before You Continue</div>
      <div style="font-size:14px;color:#6B7280;line-height:1.7;margin-bottom:18px;">What you are about to see represents thousands of hours of engineering, software development, and strategic planning — and a platform already in motion with five founding partners secured. This information is shared selectively. Please read the agreement below before continuing.</div>
      <div id="nda-scroll" style="max-height:280px;overflow-y:auto;border:1px solid #E5E7EB;background:#F9FAFB;padding:16px;border-radius:8px;font-size:12px;color:#111827;line-height:1.7;margin-bottom:18px;white-space:pre-wrap;">NON-DISCLOSURE AGREEMENT — v1.0 — April 2026

By entering your information and clicking 'I Agree & Enter Portal', you agree to the following:

1. Confidentiality. All information in this portal — including business plans, financial projections, product specifications, pricing, and partnership terms — is confidential and proprietary to BLEND+, Inc.

2. Non-Disclosure. You will not disclose, share, reproduce, copy, or distribute any information from this portal to any third party without prior written consent from BLEND+, Inc.

3. Limited Use. You will use this information solely to evaluate a potential business relationship with BLEND+, Inc.

4. No License. Nothing in this portal grants any license, right, or interest in BLEND+, Inc. or its intellectual property.

5. Governing Law. This agreement is governed by the laws of the State of Delaware.

Your name, email, company, timestamp, and access level will be recorded upon submission. This NDA is electronically executed upon clicking 'I Agree & Enter Portal'.</div>
      <form id="nda-form">
        <div class="two-col" style="margin-bottom:12px;">
          <input id="nda-name" type="text" required placeholder="Full Name" style="width:100%;background:#FFFFFF;border:1px solid #D1D5DB;color:var(--text);font-family:var(--font);font-size:14px;padding:12px 16px;border-radius:8px;">
          <input id="nda-email" type="email" required placeholder="Email" style="width:100%;background:#FFFFFF;border:1px solid #D1D5DB;color:var(--text);font-family:var(--font);font-size:14px;padding:12px 16px;border-radius:8px;">
        </div>
        <div class="two-col" style="margin-bottom:12px;">
          <input id="nda-company" type="text" required placeholder="Company or Facility Name" style="width:100%;background:#FFFFFF;border:1px solid #D1D5DB;color:var(--text);font-family:var(--font);font-size:14px;padding:12px 16px;border-radius:8px;">
          <select id="nda-facility-type" required style="width:100%;background:#FFFFFF;border:1px solid #D1D5DB;color:var(--text);font-family:var(--font);font-size:14px;padding:12px 16px;border-radius:8px;">
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
        <label style="display:flex;gap:8px;align-items:flex-start;font-size:12px;color:#374151;margin-bottom:14px;">
          <input id="nda-agree" type="checkbox" style="margin-top:2px;">
          <span>I have read and agree to the Non-Disclosure Agreement above</span>
        </label>
        <button id="nda-submit" type="submit" disabled style="background:#00BFA5;opacity:.55;color:#FFFFFF;font-family:var(--font);font-size:14px;font-weight:600;padding:12px 18px;border:none;border-radius:8px;cursor:pointer;">I Agree & Enter Portal</button>
        <div id="nda-save-error" style="display:none;color:var(--red);font-size:11px;margin-top:8px;">Note: your NDA record could not be saved. Please continue.</div>
      </form>
    </div>
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

  console.log('NDA Airtable request body:', payload);

  try {
    const ndaErrorEl = document.getElementById('nda-save-error');
    if (ndaErrorEl) ndaErrorEl.style.display = 'none';

    const missingKey = !AIRTABLE_API_KEY || AIRTABLE_API_KEY === 'YOUR_AIRTABLE_KEY_HERE';
    if (missingKey) {
      throw new Error('Airtable API key is missing or placeholder value');
    }

    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/tblsSZyuLCq2INg8j`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + AIRTABLE_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('NDA record created successfully');
    } else {
      const errText = await res.text();
      console.error('NDA Airtable POST failed:', {
        status: res.status,
        statusText: res.statusText,
        response: errText,
        payload
      });
      if (ndaErrorEl) ndaErrorEl.style.display = 'block';
    }
  } catch (error) {
    console.error('NDA Airtable POST failed with exception:', {
      error: String(error),
      payload
    });
    const ndaErrorEl = document.getElementById('nda-save-error');
    if (ndaErrorEl) ndaErrorEl.style.display = 'block';
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
    ['🏥', 'Clinical or Wellness Facility', 'Precision nutrition that extends your clinical offering — with a revenue share and full dispense logging built in.'],
    ['🎓', 'College or University', 'Built for high-traffic rec centers — zero staff, maximum member engagement.'],
    ['🏨', 'Hotel or Resort', 'Premium wellness amenity at zero cost — enhancing guest experience and earning monthly revenue.'],
    ['🏢', 'Corporate Campus', 'Employee wellness benefit that pays you — not one that costs you.'],
    ['🎖️', 'Military Base or Facility', 'Built for high-fitness cultures with captive daily populations and built-in nutrition awareness.'],
    ['🏡', 'Senior Living Community', 'Collagen, electrolytes, magnesium — exactly what active senior residents need, delivered autonomously.'],
    ['🔍', 'Something Else', 'Tell us about your facility and we will figure out if BLEND+ is a fit.']
  ];

  root.innerHTML = `
    <div style="min-height:100vh;padding:24px;max-width:1120px;margin:0 auto;">
      <div style="font-size:32px;font-weight:900;color:var(--text);margin-bottom:8px;">What best describes your facility?</div>
      <div style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:18px;">BLEND+ is currently deploying across California and Arizona. Tell us what you operate and we will show you exactly how the model works for your facility type.</div>
      <div class="facility-selector-grid" id="facility-grid"></div>
    </div>
  `;

  const grid = document.getElementById('facility-grid');
  options.forEach(([icon, label, subtext]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'facility-selector-btn';
    btn.innerHTML = `<div class="facility-selector-btn__icon">${icon}</div><div class="facility-selector-btn__title">${label}</div><div class="facility-selector-btn__sub">${subtext}</div>`;
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
  const allowed = new Set(['overview', 'experience', 'why-it-works', 'machine', 'competitive', 'app', 'dashboard', 'ingredients', 'retention', 'the-numbers', 'host-terms', 'host-economics', 'submit-interest', 'faq']);
  document.querySelectorAll('#sidebar .nav-item').forEach((btn) => {
    const id = getPageIdFromButton(btn);
    if (!allowed.has(id)) btn.remove();
  });
  ['raise', 'economics', 'trajectory', 'acquisition', 'roadmap', 'why-now', 'tam', 'projections', 'buyout-calculator', 'engineering', 'bom', 'ops', 'software'].forEach(removeSectionById);
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

function buildSectionCta(cfg, audienceClass) {
  const wrap = document.createElement('div');
  wrap.className = 'section-cta ' + (audienceClass || '');
  const h = document.createElement('h3');
  h.className = 'section-cta__heading';
  h.textContent = cfg.heading;
  const p = document.createElement('p');
  p.className = 'section-cta__sub';
  p.textContent = cfg.sub;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'section-cta__btn';
  btn.textContent = cfg.btn;
  if (cfg.mailto) {
    btn.addEventListener('click', () => {
      window.location.href = 'mailto:' + cfg.mailto;
    });
  } else if (cfg.pageId) {
    btn.addEventListener('click', () => {
      const b = Array.from(document.querySelectorAll('.nav-item')).find((x) => {
        if (getPageIdFromButton(x) !== cfg.pageId) return false;
        return x.offsetParent !== null;
      });
      nav(cfg.pageId, b || null);
    });
  }
  wrap.appendChild(h);
  wrap.appendChild(p);
  wrap.appendChild(btn);
  return wrap;
}

const HOST_CTA_CONFIG = {
  overview: { heading: 'Ready to see if your facility qualifies?', sub: 'It takes 3 minutes. We\'ll follow up within 48 hours.', btn: 'Apply for a Founding Partner Placement', pageId: 'submit-interest' },
  experience: { heading: 'This is what your members are missing.', sub: 'Zero cost to place. Zero risk to host. Revenue from day one.', btn: 'See the Partner Terms', pageId: 'host-terms' },
  machine: { heading: 'This machine is ready for your facility.', sub: '5 founding partner locations are already committed. A few slots remain.', btn: 'Apply for Placement', pageId: 'submit-interest' },
  app: { heading: 'Your members already use apps like this.', sub: 'BLEND+ loyalty mechanics drive repeat visits — to your facility.', btn: 'See Your Revenue Potential', pageId: 'host-economics' },
  dashboard: { heading: 'Full transparency. Real-time.', sub: 'See every transaction as it happens. Your revenue share. Your next payment date.', btn: 'See the Partner Terms', pageId: 'host-terms' },
  'the-numbers': { heading: 'The math works. The question is timing.', sub: '5 founding partner slots remaining in the Southwest region. Early partners lock in 20% permanently.', btn: 'Apply for a Founding Partner Placement', pageId: 'submit-interest' },
  'host-economics': { heading: 'This revenue is available to your facility.', sub: 'Zero capital. Zero staff. Zero risk. Just a machine that earns for you.', btn: 'Apply for a Founding Partner Placement', pageId: 'submit-interest' },
  'host-terms': { heading: 'These are the best terms we will ever offer.', sub: 'Early partner rate closes once founding slots are filled. Standard terms apply after.', btn: 'Submit Your Interest Now', pageId: 'submit-interest' },
  competitive: { heading: 'No one else is offering this in your market.', sub: 'BLEND+ is placing machines in a select group of Southwest locations. This is the window.', btn: 'Apply for a Founding Partner Placement', pageId: 'submit-interest' },
  ingredients: { heading: 'Your members deserve better than the shelf.', sub: 'Organic. Personalized. Under 60 seconds. Zero operational burden on your team.', btn: 'See the Partner Terms', pageId: 'host-terms' },
  retention: { heading: 'Retention mechanics that benefit your facility.', sub: 'Every Blend Buck earned drives a member back to your gym.', btn: 'Apply for a Founding Partner Placement', pageId: 'submit-interest' },
  faq: { heading: 'Still have questions?', sub: 'Reach out directly. We respond within 24 hours.', btn: 'Contact Conner', mailto: 'conner@blendplus.co' },
  'why-it-works': { heading: 'See how the economics back it up.', sub: 'One view with build cost, revenue, payback, and reinvestment — built to be tested.', btn: 'View The Numbers', pageId: 'the-numbers' },
  team: { heading: 'The team services every machine.', sub: 'Founding partners work directly with the people building and deploying BLEND+.', btn: 'Apply for a Founding Partner Placement', pageId: 'submit-interest' },
  'submit-interest': { heading: 'Prefer email first?', sub: 'Tell us about your facility and we will respond within 48 hours.', btn: 'Contact Conner', mailto: 'conner@blendplus.co' }
};

const INVESTOR_CTA_CONFIG = {
  overview: { heading: 'The model is ready to be funded.', sub: '$25,000 builds the machine. The machine funds everything else.', btn: 'See The Raise', pageId: 'raise' },
  experience: { heading: 'This is what 1,000 locations looks like from the ground.', sub: 'The experience scales because the machine scales. People don\'t.', btn: 'See the 5-Year Roadmap', pageId: 'roadmap' },
  'why-now': { heading: 'Nine forces converging. One company positioned to capture them.', sub: 'The window is open. This round funds the first machine that proves it.', btn: 'See The Raise', pageId: 'raise' },
  'the-numbers': { heading: '~5.5-month payback. Self-funding fleet. Gate-triggered capital.', sub: 'The numbers are not complicated. They are just math.', btn: 'See The Raise', pageId: 'raise' },
  economics: { heading: 'Every assumption is falsifiable.', sub: 'Machine 1 confirms or corrects every number before Machine 2 ships.', btn: 'See The Raise', pageId: 'raise' },
  competitive: { heading: 'The category is proven. The model is right. The timing is now.', sub: 'Blendid raised $20M+ across venture capital, strategic investors, and crowdfunding. BLEND+ gets there for $100K.', btn: 'See The Raise', pageId: 'raise' },
  acquisition: { heading: '25 machines. Eight figures. The conversation changes.', sub: 'This round funds the first machine. That machine funds the rest.', btn: 'See The Raise', pageId: 'raise' },
  raise: { heading: 'Ready to participate?', sub: 'One SAFE. Three scenarios. You decide how much conviction you have.', btn: 'Contact Conner', mailto: 'conner@blendplus.co' },
  machine: { heading: 'Hardware built for industrial duty cycles.', sub: 'Gate 3 proves reliability before capital scales.', btn: 'See The Raise', pageId: 'raise' },
  app: { heading: 'Software is the retention layer.', sub: 'The machine sells the first drink. The app sells every drink after.', btn: 'See The Raise', pageId: 'raise' },
  dashboard: { heading: 'Operators see everything in real time.', sub: 'Transparency is part of the host value proposition.', btn: 'See The Raise', pageId: 'raise' },
  ingredients: { heading: 'Formulation meets food-safety discipline.', sub: 'NSF/ANSI 25 pathway aligns product and machine certification.', btn: 'See The Raise', pageId: 'raise' },
  retention: { heading: 'Loyalty compounds with every order.', sub: 'Behavioral data is an acquisition asset — see Exit Thesis.', btn: 'See The Raise', pageId: 'raise' },
  tam: { heading: 'The TAM is not the question.', sub: 'Machine 1 answers whether the model holds.', btn: 'See The Raise', pageId: 'raise' },
  projections: { heading: 'Penetration scenarios are illustrative.', sub: 'Capital follows proof through the tranche structure.', btn: 'See The Raise', pageId: 'raise' },
  trajectory: { heading: 'Manufacturing cadence follows design lock.', sub: 'Water Innovations at cost + 20% through Machine 100.', btn: 'See The Raise', pageId: 'raise' },
  'buyout-calculator': { heading: 'Model the exit from real fleet data.', sub: 'Illustrative multiples — diligence replaces every placeholder.', btn: 'See Exit Thesis', pageId: 'acquisition' },
  team: { heading: 'Questions for the founders?', sub: 'We respond to serious investor inquiries directly.', btn: 'Contact Conner', mailto: 'conner@blendplus.co' },
  faq: { heading: 'Still have questions?', sub: 'Reach out directly. We respond within 24 hours.', btn: 'Contact Conner', mailto: 'conner@blendplus.co' },
  'submit-interest': { heading: 'Interested in hosting or partnering?', sub: 'We route investor and host inquiries through the same team.', btn: 'Contact Conner', mailto: 'conner@blendplus.co' },
  engineering: { heading: 'Machine architecture under NDA.', sub: 'Gate 3 and certification precede scaled deployment.', btn: 'See The Raise', pageId: 'raise' },
  bom: { heading: '109-line BOM. Fourteen subsystems.', sub: 'Cost discipline is engineered in from day one.', btn: 'See The Raise', pageId: 'raise' },
  ops: { heading: 'Uptime and PM protocols.', sub: 'Reliability is the product — see competitive lessons.', btn: 'See The Raise', pageId: 'raise' },
  software: { heading: 'App is in final development — launching alongside Machine 1.', sub: 'PLC middleware completes the stack.', btn: 'See The Raise', pageId: 'raise' }
};

function injectSectionCtas() {
  if (document.body.dataset.ctasInjected === '1') return;
  document.body.dataset.ctasInjected = '1';

  Object.entries(HOST_CTA_CONFIG).forEach(([pageId, cfg]) => {
    const page = document.getElementById('page-' + pageId);
    if (!page || page.querySelector('.section-cta.host-only')) return;
    page.appendChild(buildSectionCta(cfg, 'host-only'));
  });

  Object.entries(INVESTOR_CTA_CONFIG).forEach(([pageId, cfg]) => {
    const page = document.getElementById('page-' + pageId);
    if (!page || page.querySelector('.section-cta.investor-only')) return;
    page.appendChild(buildSectionCta(cfg, 'investor-only'));
  });
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
  if (app) {
    app.style.display = 'flex';
    app.style.flexDirection = 'row';
  }
  configurePortalForAccess();
  injectSectionCtas();
  attachSubmitInterestHandler();
  const overviewBtn = Array.from(document.querySelectorAll('.nav-item')).find((b) => {
    if (getPageIdFromButton(b) !== 'overview') return false;
    return b.offsetParent !== null;
  });
  nav('overview', overviewBtn || null);
}

function bootFlow() {
  renderAccessScreen();
}

window.handleAccessCode = handleAccessCode;
window.submitNDA = submitNDA;

document.addEventListener('DOMContentLoaded', bootFlow);
