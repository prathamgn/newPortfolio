(function initTheme(){
  const stored = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', stored || 'dark');
})();

fetch('data/profile.json')
  .then(res => res.json())
  .then(renderResume)
  .catch(err => {
    console.error('Failed to load profile data:', err);
    document.getElementById('resumeSheet').innerHTML = '<p class="muted">Could not load profile.json</p>';
  });

function renderResume(data){
  const { meta, about, experience = [], skills, education = [] } = data;
  document.title = `${meta.name} — Résumé`;

  const contactBits = [meta.email, meta.phone, meta.location].filter(Boolean).join(' · ');

  const expHtml = experience.map(job => `
    <div class="r-job">
      <div class="r-job-head">
        <b>${job.title} — ${job.company}</b>
        <span>${job.start} – ${job.end}</span>
      </div>
      <div class="r-job-sub">${[job.location, job.summary].filter(Boolean).join(' · ')}</div>
      ${job.highlights?.length ? `<ul>${job.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  const skillsHtml = (skills?.groups || []).map(g =>
    `<p class="r-tags"><b>${g.category}:</b> ${g.items.join(', ')}</p>`
  ).join('');

  const eduHtml = education.map(ed => {
    const dates = [ed.start, ed.end].filter(Boolean).join(' – ');
    return `
    <div class="r-job">
      <div class="r-job-head">
        <b>${ed.degree}</b>
        ${dates ? `<span>${dates}</span>` : ''}
      </div>
      <div class="r-job-sub">${[ed.school, ed.detail].filter(Boolean).join(' · ')}</div>
    </div>`;
  }).join('');

  document.getElementById('resumeSheet').innerHTML = `
    <h1>${meta.name}</h1>
    <p class="r-role">${meta.role}</p>
    <p class="r-contact">${contactBits}</p>

    <div class="r-section">
      <h2>Summary</h2>
      ${(about?.paragraphs || []).map(p => `<p>${p}</p>`).join('')}
    </div>

    <div class="r-section">
      <h2>Experience</h2>
      ${expHtml}
    </div>

    <div class="r-section">
      <h2>Skills</h2>
      ${skillsHtml}
    </div>

    <div class="r-section">
      <h2>Education</h2>
      ${eduHtml}
    </div>
  `;
}
