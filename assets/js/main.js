/* ===================== Theme ===================== */
(function initTheme(){
  const stored = localStorage.getItem('theme');
  const theme = stored || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

document.getElementById('themeToggle').addEventListener('click', () => {
  const root = document.documentElement;
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ===================== Mobile nav ===================== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

/* ===================== Helpers ===================== */
function el(tag, className, html){
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function tagRow(items = []){
  const wrap = el('div', 'tag-row');
  items.forEach(t => wrap.appendChild(el('span', 'tag', t)));
  return wrap;
}

/* ===================== Load profile.json ===================== */
fetch('data/profile.json')
  .then(res => res.json())
  .then(renderAll)
  .catch(err => {
    console.error('Failed to load profile data:', err);
    document.getElementById('heroName').textContent = 'Could not load profile.json';
  });

function renderAll(data){
  renderHero(data);
  renderAbout(data.about);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderSkills(data.skills);
  renderEducation(data.education);
  renderContact(data.meta, data.contact);
  initScrollReveal();
}

/* ---------- Hero ---------- */
function renderHero(data){
  const { meta } = data;
  document.title = `${meta.name} — ${meta.role}`;
  document.getElementById('heroRole').textContent = `${meta.role} · ${meta.location}`;
  document.getElementById('heroName').textContent = meta.name;
  document.getElementById('heroTagline').textContent = meta.tagline;
  document.getElementById('footerName').textContent = meta.name;

  const resumeBtn = document.getElementById('resumeBtn');
  if (meta.resumeFile) resumeBtn.setAttribute('href', meta.resumeFile);

  const statsWrap = document.getElementById('heroStats');
  (data.about?.highlights || []).slice(0, 3).forEach(h => {
    const stat = el('div', 'stat', `<b>${h.value}</b><span>${h.label}</span>`);
    statsWrap.appendChild(stat);
  });

  const years = meta.yearsExperience || '';
  document.getElementById('heroPanelCode').textContent =
    `<${years}yrs>\n  .fullstack()\n  .ship(${(meta.location || '').split(',')[0].toLowerCase()})\n</${years}yrs>`;
}

/* ---------- About ---------- */
function renderAbout(about){
  if (!about) return;
  const textWrap = document.getElementById('aboutText');
  about.paragraphs.forEach(p => textWrap.appendChild(el('p', '', p)));

  const hlWrap = document.getElementById('aboutHighlights');
  about.highlights.forEach(h => {
    hlWrap.appendChild(el('div', 'highlight-item', `<span>${h.label}</span><b>${h.value}</b>`));
  });
}

/* ---------- Experience ---------- */
function renderExperience(list = []){
  const wrap = document.getElementById('experienceList');
  list.forEach(job => {
    const item = el('article', 'timeline-item');
    item.innerHTML = `
      <div class="timeline-head">
        <h3>${job.title} · ${job.company}</h3>
        <span class="timeline-dates">${job.start} — ${job.end}</span>
      </div>
      <div class="timeline-company">${[job.location, job.summary].filter(Boolean).join(' · ')}</div>
      ${job.highlights?.length ? `<ul>${job.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
    `;
    if (job.stack?.length) item.appendChild(tagRow(job.stack));
    wrap.appendChild(item);
  });
}

/* ---------- Projects ---------- */
function renderProjects(list = []){
  const wrap = document.getElementById('projectsList');
  list.forEach(p => {
    const card = el('article', 'card');
    card.innerHTML = `<h3>${p.name}</h3><p>${p.description}</p>`;
    if (p.tags?.length) card.appendChild(tagRow(p.tags));
    if (p.link || p.repo){
      const links = el('div', 'card-links');
      if (p.link){
        const a = document.createElement('a');
        a.href = p.link; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Live';
        links.appendChild(a);
      }
      if (p.repo){
        const a = document.createElement('a');
        a.href = p.repo; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Code';
        links.appendChild(a);
      }
      card.appendChild(links);
    }
    wrap.appendChild(card);
  });
}

/* ---------- Skills ---------- */
function renderSkills(skills){
  if (!skills) return;
  const wrap = document.getElementById('skillsList');
  skills.groups.forEach(g => {
    const group = el('div', 'skill-group', `<h3>${g.category}</h3>`);
    group.appendChild(tagRow(g.items));
    wrap.appendChild(group);
  });
}

/* ---------- Education ---------- */
function renderEducation(list = []){
  const wrap = document.getElementById('educationList');
  list.forEach(ed => {
    const item = el('article', 'timeline-item');
    const dates = [ed.start, ed.end].filter(Boolean).join(' — ');
    item.innerHTML = `
      <div class="timeline-head">
        <h3>${ed.degree}</h3>
        ${dates ? `<span class="timeline-dates">${dates}</span>` : ''}
      </div>
      <div class="timeline-company">${[ed.school, ed.detail].filter(Boolean).join(' · ')}</div>
    `;
    wrap.appendChild(item);
  });
}

/* ---------- Contact ---------- */
function renderContact(meta, contact){
  if (contact?.heading) document.getElementById('contactHeading').textContent = contact.heading;
  if (contact?.message) document.getElementById('contactMessage').textContent = contact.message;

  const linksWrap = document.getElementById('contactLinks');
  const links = [];
  if (meta.email) links.push({ label: 'Email', href: `mailto:${meta.email}` });
  if (meta.phone) links.push({ label: 'Phone', href: `tel:${meta.phone}` });
  if (meta.socials?.github && !meta.socials.github.includes('<<FILL')) links.push({ label: 'GitHub', href: meta.socials.github });
  if (meta.socials?.linkedin && !meta.socials.linkedin.includes('<<FILL')) links.push({ label: 'LinkedIn', href: meta.socials.linkedin });
  if (meta.socials?.twitter) links.push({ label: 'Twitter', href: meta.socials.twitter });

  links.forEach(l => {
    const a = document.createElement('a');
    a.href = l.href;
    a.textContent = l.label;
    if (l.href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; }
    linksWrap.appendChild(a);
  });
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal(){
  const items = document.querySelectorAll('.timeline-item, .card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  items.forEach(i => obs.observe(i));
}
