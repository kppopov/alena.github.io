/* Renders content from /content/*.json (and amex.md) into the pages.
 * Pure client-side — no build step required.
 */

const SOCIAL_ICONS = {
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.78A8.16 8.16 0 0 0 22 10.8V7.35a4.85 4.85 0 0 1-2.41-.66z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    dm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
};

const ARROW_SVG = `<svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

async function loadJson(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
}

async function loadText(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.text();
}

/* ---------- Home page ---------- */
async function renderHome() {
    const [profile, linksData] = await Promise.all([
        loadJson('content/profile.json'),
        loadJson('content/links.json')
    ]);

    // Profile
    const nameEl = document.querySelector('[data-field="profile.name"]');
    const bioEl = document.querySelector('[data-field="profile.bio"]');
    const avatarEl = document.querySelector('[data-field="profile.avatar"]');
    if (nameEl) nameEl.textContent = profile.name || '';
    if (bioEl) bioEl.textContent = profile.bio || '';
    if (avatarEl && profile.avatar) avatarEl.setAttribute('src', profile.avatar);

    // Socials
    const socialsEl = document.querySelector('[data-field="profile.socials"]');
    if (socialsEl && Array.isArray(profile.socials)) {
        socialsEl.innerHTML = profile.socials.map(s => {
            const icon = SOCIAL_ICONS[s.type] || '';
            const isMail = s.url.startsWith('mailto:');
            const target = isMail ? '' : ' target="_blank" rel="noopener"';
            return `<a href="${escapeHtml(s.url)}"${target} aria-label="${escapeHtml(s.type)}">${icon}</a>`;
        }).join('');
    }

    // Link cards
    const linksEl = document.querySelector('[data-field="links"]');
    if (linksEl && Array.isArray(linksData.links)) {
        linksEl.innerHTML = linksData.links.map(l => {
            const cls = 'link-card' + (l.featured ? ' featured' : '');
            const target = l.external ? ' target="_blank" rel="noopener"' : '';
            return `<a class="${cls}" href="${escapeHtml(l.url)}"${target}>
                <span class="icon" aria-hidden="true">${escapeHtml(l.icon || '')}</span>
                <span class="label">${escapeHtml(l.label || '')}</span>
                ${ARROW_SVG}
            </a>`;
        }).join('');
    }
}

/* ---------- Legal page ---------- */
async function renderLegal() {
    const legal = await loadJson('content/legal.json');
    const map = {
        'legal.name': legal.name,
        'legal.street': legal.street,
        'legal.city': legal.city,
        'legal.country': legal.country,
        'legal.email': legal.email,
        'legal.phone': legal.phone,
        'legal.stand': legal.stand
    };
    for (const [key, value] of Object.entries(map)) {
        document.querySelectorAll(`[data-field="${key}"]`).forEach(el => {
            if (el.tagName === 'A' && key === 'legal.email') {
                el.href = 'mailto:' + (value || '');
                el.textContent = value || '';
            } else {
                el.textContent = value || '';
            }
        });
    }
}

/* ---------- AMEX page ---------- */
async function renderAmex() {
    const raw = await loadText('content/amex.md');
    const { data, body } = parseFrontmatter(raw);

    const titleEl = document.querySelector('[data-field="amex.title"]');
    const emojiEl = document.querySelector('[data-field="amex.emoji"]');
    const ledeEl = document.querySelector('[data-field="amex.lede"]');
    const bodyEl = document.querySelector('[data-field="amex.body"]');
    const goldEl = document.querySelector('[data-field="amex.gold_url"]');
    const platEl = document.querySelector('[data-field="amex.platinum_url"]');
    const disclEl = document.querySelector('[data-field="amex.disclaimer"]');

    if (titleEl) titleEl.textContent = data.title || '';
    if (emojiEl) emojiEl.textContent = data.emoji || '';
    if (ledeEl) ledeEl.textContent = data.lede || '';
    if (bodyEl && window.marked) bodyEl.innerHTML = window.marked.parse(body);
    if (goldEl) goldEl.href = data.gold_url || '#';
    if (platEl) platEl.href = data.platinum_url || '#';
    if (disclEl) disclEl.textContent = data.disclaimer || '';
}

/* Minimal YAML frontmatter parser (key: "value" or key: value, one per line). */
function parseFrontmatter(text) {
    const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) return { data: {}, body: text };
    const data = {};
    for (const line of match[1].split('\n')) {
        const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
        if (!m) continue;
        let v = m[2].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
        }
        data[m[1]] = v;
    }
    return { data, body: match[2] };
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'home')  renderHome().catch(console.error);
    if (page === 'legal') renderLegal().catch(console.error);
    if (page === 'amex')  renderAmex().catch(console.error);
});
