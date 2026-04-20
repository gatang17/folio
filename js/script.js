// =============================
// GOOGLE ANALYTICS
// =============================
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-X2R58E5647');

// =============================
// GLOBAL HELPERS
// =============================
const isIndexPage = () => {
  const path = window.location.pathname;
  return path === '/' || path.endsWith('/index.html') || path.endsWith('index.html');
};

const getProjectUrl = (projectId) => `p_descript.html?id=${encodeURIComponent(projectId)}`;

function handleSectionRedirect() {
  if (!isIndexPage()) return;

  const params = new URLSearchParams(window.location.search);
  const sectionId = params.get('section');
  if (!sectionId) return;

  const section = document.getElementById(sectionId);
  if (!section) return;

  setTimeout(() => {
    section.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', 'index.html');
  }, 300);
}

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

function truncateText(text = '', limit = 110) {
  return text.length > limit ? `${text.slice(0, limit).trim()}…` : text;
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =============================
// TYPEWRITER
// =============================
function createTypeWriter(elementId, texts) {
  const element = document.getElementById(elementId);
  if (!element || !Array.isArray(texts) || texts.length === 0) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const speed = 100;
  const deleteSpeed = 60;
  const pause = 1200;

  function typeWriter() {
    const currentText = texts[textIndex];

    if (!isDeleting) {
      if (charIndex < currentText.length) {
        element.textContent += currentText.charAt(charIndex);
        charIndex += 1;
        setTimeout(typeWriter, speed);
      } else {
        setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, pause);
      }
    } else if (charIndex > 0) {
      charIndex -= 1;
      element.textContent = currentText.substring(0, charIndex);
      setTimeout(typeWriter, deleteSpeed);
    } else {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeWriter, 300);
    }
  }

  typeWriter();
}

// =============================
// MOSAIC BUTTONS
// =============================
function getLineColorFromBackground(btn) {
  let el = btn.parentElement;

  while (el) {
    const bg = window.getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return 'var(--background-color)';
    }
    el = el.parentElement;
  }

  return 'var(--background-color)';
}

function initMosaicButtons(scope = document) {
  const buttons = scope.querySelectorAll('.mosaic_btn');
  const lineCount = 50;

  buttons.forEach((btn) => {
    if (btn.dataset.mosaicInit === 'true') return;
    btn.dataset.mosaicInit = 'true';

    const originalColor = getComputedStyle(btn).color;

    const burstLines = () => {
      for (let i = 0; i < lineCount; i += 1) {
        const line = document.createElement('span');
        line.classList.add('line');
        line.style.background = getLineColorFromBackground(btn);

        const isTop = Math.random() > 0.5;
        line.classList.add(isTop ? 'top' : 'bottom');
        line.style.left = `${Math.random() * 100}%`;

        btn.appendChild(line);

        setTimeout(() => {
          if (isTop) line.style.top = '-100%';
          else line.style.bottom = '-100%';
        }, Math.random() * 200);

        setTimeout(() => line.remove(), 120);
      }
    };

    btn.addEventListener('mouseenter', () => {
      btn.style.letterSpacing = '0.05em';
      burstLines();
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.color = originalColor;
      btn.style.letterSpacing = '0.05em';
      burstLines();
    });
  });
}

// =============================
// MENU INJECTION
// =============================
function initMobileMenu() {
  const btn = document.getElementById('btn_menu');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  if (btn.dataset.init === 'true') return;
  btn.dataset.init = 'true';

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

async function injectSharedLayout() {
  try {
    const [headerHtml, footerHtml, mobileMenuHtml] = await Promise.all([
      fetch('./data/header.html').then((res) => res.text()),
      fetch('./data/footer.html').then((res) => res.text()),
      fetch('./data/h_menu.html').then((res) => res.text())
    ]);

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      headerContainer.innerHTML = headerHtml;
    }

    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = footerHtml;
      initMosaicButtons(footerContainer);
    }

    const hMenuContainer = document.getElementById('h_menu-container');
    if (hMenuContainer) {
      hMenuContainer.innerHTML = mobileMenuHtml;
      initMobileMenu();
    }
  } catch (error) {
    console.error('Shared layout injection error:', error);
  }
}

// =============================
// PROJECT RENDERING
// =============================
function createFeaturedProjectCard(project, isMobile) {
  const imageSrc = getResponsiveImage(project.images);

  return `
    <article class="project-card" data-id="${escapeHtml(project.id)}">
      <a class="project-thumb" href="${getProjectUrl(project.id)}" aria-label="View ${escapeHtml(project.title)} project details">
        <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(project.title)} preview image">
        <div class="project-overlay"><span>View Project</span></div>
      </a>

      <div class="project-meta">
        <span class="project-kicker">${escapeHtml(project.category || '')}</span>
        <h4 class="project-title">${escapeHtml(project.title)}</h4>
        <p class="project-stack">${escapeHtml(project.cardStack || project.subtitle || '')}</p>
      </div>
    </article>`;
}

function renderFeaturedProjects(data) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const featuredProjects = data.projects.filter((project) => project.featured !== false).slice(0, 4);
  const isMobile = window.matchMedia('(max-width: 863px)').matches;

  grid.innerHTML = featuredProjects
    .map((project) => createFeaturedProjectCard(project, isMobile))
    .join('');
}

function createArchiveProjectCard(project) {
  return `
    <article class="archive-card" data-id="${escapeHtml(project.id)}">
      <div class="archive-thumb">
        <img src="${getResponsiveImage(project.images)}" alt="${escapeHtml(project.title)} project image">
      </div>

      <div class="archive-copy">
        <span class="archive-subtitle">${escapeHtml(project.subtitle || project.category || '')}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary || project.description || '')}</p>

        <div class="archive-links">
          <a href="${getProjectUrl(project.id)}">Case Study</a>
          ${project.live ? `<a href="${escapeHtml(project.live)}" target="_blank" rel="noreferrer">Live</a>` : ''}
          ${project.github ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer">GitHub</a>` : ''}
        </div>
      </div>
    </article>`;
}

function initArchiveCardClicks() {
  const cards = document.querySelectorAll('.archive-card');

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.archive-links a')) return;

      const projectId = card.dataset.id;
      if (!projectId) return;

      window.location.href = getProjectUrl(projectId);
    });
  });
}

function renderProjectsArchive(data) {
  const listing = document.getElementById('projects-listing');
  const heroContainer = document.querySelector('.projects-hero');
  if (!listing) return;

  const orderedProjects = [
    ...data.projects.filter(p => p.featured === true),
    ...data.projects.filter(p => p.featured === false)
  ];

  const hero = orderedProjects[0];

  if (heroContainer && hero) {
    heroContainer.innerHTML = `
      <div class="project-hero-card">
        <img src="${getResponsiveImage(hero.images)}" alt="${hero.title}">
        <div class="project-hero-content">
          <span>${hero.category}</span>
          <h2>${hero.title}</h2>
          <p>${hero.summary || ''}</p>
          <a href="${getProjectUrl(hero.id)}" class="btn mosaic_btn">View Case Study</a>
        </div>
      </div>
    `;
  }

  const rest = orderedProjects.slice(1);

  listing.innerHTML = rest
    .map(createArchiveProjectCard)
    .join('');

  initArchiveCardClicks();
}

function createMetaBlock(title, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) return '';

  const content = Array.isArray(value)
    ? value.map((item) => `<p>${escapeHtml(item)}</p>`).join('')
    : `<p>${escapeHtml(value)}</p>`;

  return `
    <div class="meta-block">
      <h5>${escapeHtml(title)}</h5>
      ${content}
    </div>`;
}

function renderProjectDetail(project) {
  const projectContainer = document.getElementById('projects-list');
  if (!projectContainer) return;

  const images = Array.isArray(project.images) ? project.images : [];
  const firstImage = images[0] || '';

  projectContainer.innerHTML = `
    <section class="project-detail-shell">
      <header class="project-detail-head" data-aos="fade-up">
        <div class="project-head-copy">
          <span class="project-eyebrow">${escapeHtml(project.category || project.subtitle || 'Project')}</span>
          <h1>${escapeHtml(project.title)}</h1>
          ${project.subtitle ? `<h4>${escapeHtml(project.subtitle)}</h4>` : ''}
          <p class="project-summary">${escapeHtml(project.summary || project.description || '')}</p>
        </div>

        <div class="project-head-meta">
          ${createMetaBlock('Year', project.year)}
          ${createMetaBlock('Role', project.roles)}
          ${createMetaBlock('Key Features', project.features)}
        </div>
      </header>

      <section class="project-layout" data-aos="fade-up">
        <div class="project-info-card project-info">
          <div class="meta-block">
            <h5>Overview</h5>
            <p>${escapeHtml(project.description || '')}</p>
          </div>

          ${project.challenge ? createMetaBlock('Challenge', project.challenge) : ''}
          ${project.solution ? createMetaBlock('Solution', project.solution) : ''}
          ${project.impact ? createMetaBlock('Impact', project.impact) : ''}

          ${project.technologies?.length ? `
            <div class="meta-block">
              <h5>Technologies</h5>
              <p class="tech-inline">${project.technologies.map(escapeHtml).join(' • ')}</p>
            </div>` : ''}

          <div class="project-links">
            ${project.live ? `<a href="${escapeHtml(project.live)}" target="_blank" rel="noreferrer" class="btn m_text mosaic_btn">Live Site</a>` : ''}
            ${project.github ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer" class="btn m_text mosaic_btn">GitHub</a>` : ''}
          </div>
        </div>

        <div class="project-gallery">
          <div class="main-image">
            <a href="${escapeHtml(firstImage)}" data-fancybox="gallery" id="mainFancyboxLink">
              <img src="${escapeHtml(firstImage)}" id="activeImage" alt="${escapeHtml(project.title)} main project image">
            </a>
          </div>

          <div class="thumbs">
            ${images.map((img, index) => `
              <img
                src="${escapeHtml(img)}"
                class="thumb ${index === 0 ? 'active' : ''}"
                data-full="${escapeHtml(img)}"
                alt="${escapeHtml(project.title)} thumbnail ${index + 1}">
            `).join('')}
          </div>

          <div class="d-none">
            ${images.map((img) => `<a href="${escapeHtml(img)}" data-fancybox="gallery"></a>`).join('')}
          </div>
        </div>
      </section>
    </section>`;

  initMosaicButtons(projectContainer);

  if (window.Fancybox) {
    Fancybox.bind("[data-fancybox='gallery']", {
      infinite: false,
      Toolbar: true,
      closeButton: 'top'
    });
  }

  const thumbs = projectContainer.querySelectorAll('.thumb');
  const mainImg = document.getElementById('activeImage');
  const mainLink = document.getElementById('mainFancyboxLink');

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const newSrc = thumb.dataset.full;
      if (!mainImg || !mainLink || !newSrc) return;

      mainImg.src = newSrc;
      mainLink.href = newSrc;

      thumbs.forEach((item) => item.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

function getResponsiveImage(images) {
  if (!Array.isArray(images)) return 'images/placeholder.png';

  const isMobile = window.matchMedia('(max-width: 863px)').matches;

  const desktopImg = images.find(img => img.includes('_0d'));
  const mobileImg = images.find(img => img.includes('_0m'));

  if (isMobile) {
    return mobileImg || desktopImg || images[0];
  } else {
    return desktopImg || images[0];
  }
}

async function initProjects(data) {
  renderFeaturedProjects(data);
  renderProjectsArchive(data);

  const featuredGrid = document.getElementById('projects-grid');
  if (featuredGrid) {
    window.addEventListener('resize', () => {
      renderFeaturedProjects(data);
      renderProjectsArchive(data);
    });
  }

  const detailContainer = document.getElementById('projects-list');
  if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
      detailContainer.innerHTML = '<p>No project was selected.</p>';
      return;
    }

    const project = data.projects.find((item) => item.id === projectId);
    if (!project) {
      detailContainer.innerHTML = '<p>Project not found.</p>';
      return;
    }

    renderProjectDetail(project);
  }
}

// =============================
// DESIGNER NOTES
// =============================
function initDesignerNotes(data) {
  const tDnote = document.getElementById('t_dnote');
  const dnoDescrip = document.getElementById('dno_descrip');
  const pdnLink = document.getElementById('pdn_link');
  const secDiag = document.getElementById('sec_diag');

  if (!tDnote || !dnoDescrip || !pdnLink || !secDiag) return;

  const project = data.d_notes?.[0];
  if (!project) return;

  tDnote.textContent = project.title;
  dnoDescrip.textContent = project.description;

  pdnLink.innerHTML = `
    <div class="project-links mt-0 mb-5 mt-5 text-start">
      ${project.github ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer" class="btn m_text mosaic_btn">GitHub</a>` : ''}
      ${project.live ? `<a href="${escapeHtml(project.live)}" target="_blank" rel="noreferrer" class="btn m_text mosaic_btn">Live Demo</a>` : ''}
    </div>`;

  secDiag.innerHTML = project.gallery.map((item) => `
    <div class="diag-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="diag-img">
    </div>`).join('');

  initMosaicButtons(pdnLink);
}

/* =============================
   RESUME
============================= */
function initResume(data) {
  const aboutme = data.about?.[0];
  const titlesCol = document.getElementById('titles_col');
  const personalDiv = document.getElementById('p_info');
  const descContent = document.getElementById('desc_content');

  if (!aboutme || !titlesCol || !personalDiv || !descContent) return;

  personalDiv.innerHTML = `
    <div class="resume-contact-inner">
      <h2 class="resume-name">${escapeHtml(aboutme.personal.name)}</h2>
      <div class="resume-contact-lines">
        <p>${escapeHtml(aboutme.personal.phone)}</p>
        <p>${escapeHtml(aboutme.personal.email)}</p>
        <a href="${escapeHtml(aboutme.personal.website)}" class="resume-website" target="_blank" rel="noreferrer">
          ${escapeHtml(aboutme.personal.website.replace(/^https?:\/\//, ''))}
        </a>
      </div>
    </div>
  `;

  const topics = Object.keys(aboutme).filter(
    (key) => key !== 'pageTitle' && key !== 'personal'
  );

  let selectedTopic = topics[0];

  function formatTopicLabel(topic) {
    return topic
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function renderTitles() {
    titlesCol.innerHTML = '';

    topics.forEach((topic) => {
      const div = document.createElement('button');
      div.type = 'button';
      div.className = `title_item${topic === selectedTopic ? ' selected' : ''}`;
      div.innerHTML = `
        <span class="title_dot"></span>
        <span class="title_label">${escapeHtml(formatTopicLabel(topic))}</span>
      `;

      div.addEventListener('click', () => {
        selectedTopic = topic;
        renderTitles();
        renderDesc();
      });

      titlesCol.appendChild(div);
    });
  }

  function renderDesc() {
    descContent.innerHTML = '';
    const sectionData = aboutme[selectedTopic];
    if (!sectionData) return;

    if (Array.isArray(sectionData) && typeof sectionData[0] === 'string') {
      const block = document.createElement('div');
      block.className = 'resume-block';

      const ul = document.createElement('ul');
      ul.className = 'resume-list';

      sectionData.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });

      block.appendChild(ul);
      descContent.appendChild(block);
      return;
    }

    if (selectedTopic === 'education') {
      sectionData.forEach((item) => {
        const div = document.createElement('article');
        div.className = 'resume-entry';

        div.innerHTML = `
          <h3>${escapeHtml(item.institution)}</h3>
          <p class="resume-subtitle">${escapeHtml(item.degree).replace(/\n/g, '<br>')}</p>
          <p class="resume-date">${escapeHtml(item.graduation)}</p>
        `;

        descContent.appendChild(div);
      });
      return;
    }

    if (selectedTopic === 'experience') {
      sectionData.forEach((job) => {
        const article = document.createElement('article');
        article.className = 'resume-entry';

        const ul = document.createElement('ul');
        ul.className = 'resume-list';

        job.responsibilities.forEach((responsibility) => {
          const li = document.createElement('li');
          li.textContent = responsibility;
          ul.appendChild(li);
        });

        article.innerHTML = `
          <h3>${escapeHtml(job.title)}</h3>
          <p class="resume-subtitle">${escapeHtml(job.organization)} — ${escapeHtml(job.location)}</p>
          <p class="resume-date">${escapeHtml(job.period)}</p>
        `;

        article.appendChild(ul);
        descContent.appendChild(article);
      });
      return;
    }

    if (Array.isArray(sectionData)) {
      sectionData.forEach((item) => {
        const article = document.createElement('article');
        article.className = 'resume-entry';
        article.innerHTML = `<p>${escapeHtml(String(item))}</p>`;
        descContent.appendChild(article);
      });
    }
  }

  renderTitles();
  renderDesc();
}

// =============================
// ABOUT ME SIDEBAR
// =============================
function initAboutMe(data) {
  const aboutData = data.about_me?.[0];
  const sidebar = document.getElementById('sidebar');
  const displayBox = document.getElementById('display-box');

  if (!aboutData || !sidebar || !displayBox) return;

  let firstLoaded = false;

  const showProject = (item, itemDiv) => {
    const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;

    displayBox.innerHTML = `
      <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(item.title)}">
      <div class="description">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>`;

    document.querySelectorAll('.item').forEach((el) => el.classList.remove('active'));
    if (itemDiv) itemDiv.classList.add('active');
  };

  Object.keys(aboutData).forEach((category) => {
    const catDiv = document.createElement('div');
    catDiv.classList.add('category');

    const header = document.createElement('div');
    header.classList.add('cat-header');
    header.innerHTML = `
      <span>${escapeHtml(category)}</span>
      <span class="plus">+</span>`;

    const itemsDiv = document.createElement('div');
    itemsDiv.classList.add('items');

    aboutData[category].forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      itemDiv.textContent = item.title;

      itemDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        showProject(item, itemDiv);
      });

      if (!firstLoaded && index === 0) {
        showProject(item, itemDiv);
        catDiv.classList.add('open');
        firstLoaded = true;
      }

      itemsDiv.appendChild(itemDiv);
    });

    header.addEventListener('click', () => {
      document.querySelectorAll('.category').forEach((cat) => {
        if (cat !== catDiv) cat.classList.remove('open');
      });
      catDiv.classList.toggle('open');
    });

    catDiv.appendChild(header);
    catDiv.appendChild(itemsDiv);
    sidebar.appendChild(catDiv);
  });
}

// =============================
// SKILLS
// =============================
function initSkills(data) {
  const skills = document.querySelectorAll('.skill');
  if (!skills.length) return;

  skills.forEach((skillEl) => {
    const key = skillEl.dataset.title?.toLowerCase();
    const skillData = data.skills.find((item) => item.id.toLowerCase() === key);
    if (!skillData) return;

    const overlay = skillEl.querySelector('.skill-overlay');
    const inner = skillEl.querySelector('.skill-inner');
    if (!overlay || !inner) return;

    overlay.innerHTML = `<span>${escapeHtml(skillData.overlay)}</span>`;
    inner.innerHTML = `
      <h3>${escapeHtml(skillData.title)}</h3>
      <ul>${skillData.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>
      <small>${skillData.tools.map(escapeHtml).join(' • ')}</small>`;

    skillEl.addEventListener('click', () => {
      skills.forEach((skill) => {
        if (skill !== skillEl) skill.classList.remove('active');
      });
      skillEl.classList.toggle('active');
    });
  });
}

// =============================
// CONTACT POPUP
// =============================
function initContactForm() {
  const popup = document.getElementById('pop_up');
  const form = document.getElementById('contactForm');
  if (!popup || !form) return;

  function openPopup() {
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
  }

  function closePopup() {
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
  }

  window.closePopup = closePopup;

  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      await fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      });

      openPopup();
      form.reset();
    } catch (error) {
      console.error('Contact form error:', error);
    }
  });
}

// =============================
// MOBILE FLOAT BUTTON
// =============================
function initMobileScrollButton() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileBtnLink = document.querySelector('#mobile-menu-btn a');
  const introSection = document.getElementById('intro');
  const fadeOverlay = document.getElementById('fade-overlay');

  if (mobileMenuBtn) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current <= 20) {
        mobileMenuBtn.style.opacity = '0';
      } else if (current > lastScroll) {
        mobileMenuBtn.style.opacity = '1';
      }
      lastScroll = current;
    });
  }

  if (!mobileBtnLink || !introSection) return;

  mobileBtnLink.addEventListener('click', (e) => {
    e.preventDefault();

    if (fadeOverlay) {
      fadeOverlay.classList.add('show');
    }

    setTimeout(() => {
      introSection.scrollIntoView({ behavior: 'smooth' });
      if (fadeOverlay) fadeOverlay.classList.remove('show');
    }, 350);
  });
}

// =============================
// APP INIT
// =============================
async function initApp() {
  await injectSharedLayout();
  handleSectionRedirect();
  initMosaicButtons();
  initContactForm();
  initMobileScrollButton();

  createTypeWriter('typewriter', [
    'Let’s connect!',
    'Let’s Build Something Great!'
  ]);

  createTypeWriter('typewriter_hero', [
    'I design with intention',
    'Not just pretty. Functional.',
    'Experiences that actually work'
  ]);

  try {
    const data = await fetchJSON('./data/projects.json');
    await initProjects(data);
    initDesignerNotes(data);
    initResume(data);
    initAboutMe(data);
    initSkills(data);
  } catch (error) {
    console.error('App initialization data error:', error);
  }
}

document.addEventListener('DOMContentLoaded', initApp);