//===================GOOGLE ANALITICS
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-X2R58E5647');
//---------------------------scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      
      const offset = 160; // 10rem ≈ 160px
      const topPos = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      
      window.scrollTo({
        top: topPos,
        behavior: 'smooth' // 
      });
    });
  });
  
//==================FETCHES===========================

function InitMobile() {
  const btn = document.getElementById("btn_menu");
  const menu = document.getElementById("navMenu");
  if (!btn || !menu) return;

  // Evita agregar listeners múltiples
  if (btn.dataset.init === "true") return;
  btn.dataset.init = "true";

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
    }
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}




// ------------------- Menu injection on index
document.addEventListener("DOMContentLoaded", () => {

//----------------------------------menu_top for no index pages
  fetch("./data/header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-container").innerHTML = html;
    initMosaicButtons();
  })
  .catch(err => console.error('Error loading header:', err));
  //----------------------------------footer-container for all pages
  fetch("./data/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer-container").innerHTML = html;
  })  .catch(err => console.error('Error loading footer:', err));
   //----------------------------------hamburguer-mobil
  fetch("./data/h_menu.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("h_menu-container").innerHTML = html;
    
   
    // AQUI el menú ya existe
 
    InitMobile();
  })
  .catch(err => console.error('Error loading menuhamburguer:', err));

  const div_desk = document.getElementById("menu_dtk");
  if (!div_desk) return; // seguridad

  const mediaQuery = window.matchMedia("(min-width: 875px)");
  const hMenu = document.getElementById("header-container");
 
  function updateSocialMenu(e) {
    if (e.matches) {
      // inject desktop layout
      div_desk.innerHTML = `
        <div class="container-fluid"> 
             
          <div class="div_menu_home">
          <div id="logo_container"><img id="img_logoV" src="images/logo.png" ></div>  
        
            <section class="sec_menu">             
              <a class="nav-link m_text mosaic_btn" href="#projects">projects</a>
              <a class="nav-link m_text mosaic_btn" href="#skills">Skills</a>
              <a class="nav-link m_text mosaic_btn" href="resume.html">resume</a>     
              <a class="nav-link m_text mosaic_btn" href="#contact">contact</a>
            </section>
            <div class="sec_menu22" id="">
      <a class="nav-link m_text" href="https://figma.com/@gatang17"  target="_blank" ><i class="fa-brands fa-figma"></i></a>
      <a class="nav-link m_text " href="https://github.com/gatang17"  target="_blank" ><i class="fa-brands fa-github-alt"></i></a>
      <a class="nav-link m_text" href="https://www.linkedin.com/in/grete88/" target="_blank" ><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
          </div>
          </div>
          </div>    `;
      if (hMenu) hMenu.classList.add("hide-menu");   
    } else {
      div_desk.innerHTML = "";
        if (hMenu) hMenu.classList.remove("hide-menu");
       }
  }

  updateSocialMenu(mediaQuery);
  mediaQuery.addEventListener("change", updateSocialMenu);
});

//=====================================================DNOTES
fetch('data/projects.json')
  .then(res => res.json())
  .then(data => {
    const t_dnote = document.getElementById('t_dnote');
    const dnoDescrip = document.getElementById('dno_descrip');
    const pdnLink = document.getElementById('pdn_link');
    const pdiag = document.getElementById('pdiag');
    const t_pdiag = document.getElementById('t_pdiag');
    const sec_diag = document.getElementById('sec_diag');

    const project = data.d_notes[0]; // solo el primer proyecto

    // título y descripción
    t_dnote.textContent = project.title;
    dnoDescrip.textContent = project.description;

    // botones GitHub / Live
    pdnLink.innerHTML = `
    <div class="project-links mt-0 mb-5 mt-5 text-end " style=" border-top:solid;">
      ${project.github ? `<a href="${project.github}" target="_blank" class="btn me-2" style="font-size:0.75rem;">GitHub</a>` : ''}
      ${project.live ? `<a href="${project.live}" target="_blank" class="btn" style="font-size:0.75rem;">Live Demo</a>` : ''}
    </div>`;

    // diagram description

    pdiag.textContent = `${project.diag_descrip}`;
    t_pdiag.textContent=`${project.title2}`;

    // imagen
    if (project.images && project.images.length > 0) {
      sec_diag.src = project.images[0];      
    }
  })
  .catch(err => console.error('Error cargando JSON:', err));


//=====================================================PROJECT
document.querySelectorAll('.project-card .project-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); 
    const projectId = e.target.closest('.project-card').dataset.id;
    sessionStorage.setItem('selectedProject', projectId);
    window.location.href = 'p_descript.html';
  });
});

const projectContainer = document.getElementById('projects-list');

if (projectContainer) {  // <- chequeo agregado
  const projectId = sessionStorage.getItem('selectedProject'); // obtener el proyecto

  if (!projectId) {
    projectContainer.innerHTML = '<p>No se seleccionó ningún proyecto.</p>';
  } else {
 //-------------------------------fetch the selected project
    fetch('./data/projects.json')
      .then(res => res.json())
      .then(data => {
        const project = data.projects.find(p => p.id.toString() === projectId);
        if (!project) {
          projectContainer.innerHTML = '<p>Proyecto no encontrado.</p>';
          return;
        }
        //-------------------built the data
        let html = `
        <h2>${project.title}</h2>
       
          ${project.subtitle ? `<h4>${project.subtitle}</h4>` : ''}
          <p>${project.description}</p>
          <div class="row "> 
  <div class="col-6 mb-3 ">
    ${project.technologies && project.technologies.length > 0 ? `
      <h5>Technologies:</h5>
      <ul class="list-unstyled">
        ${project.technologies.map(tech => `<li><i class="fa-solid fa-check me-2"></i></i>${tech}</li>`).join('')}
      </ul>
    ` : ''}
  </div>

  <div class="col-6 mb-3">
    ${project.captions && project.captions.length > 0 ? `
      <h5>Captions:</h5>
      <ul class="list-unstyled">
        ${project.captions.map(caption => `<li><i class="fa-solid fa-check me-2"></i></i>${caption}</li>`).join('')}
      </ul>  ` : ''}
  </div>
</div>
<div class="project-links mt-0 mb-5 text-end " style=" border-top:solid;">
            ${project.github ? `<a href="${project.github}" target="_blank" class="btn  me-2" style="font-size:0.75rem;">GitHub</a>` : ''}
            ${project.live ? `<a href="${project.live}" target="_blank" class="btn" style="font-size:0.75rem;">Live Demo</a>` : ''}
          </div>
          ${project.images && project.images.length > 0 ? ` ` : '<p>No images available.</p>'}
        <div class="row " >
              ${project.images.map(img => `
                <div class="col-6 mb-3 ">
                  <img src="${img}" class="img-fluid " alt="${project.title}">
                </div>
              `).join('')}
            </div>  `;
        projectContainer.innerHTML = html;
      });
  }
}



//==================project en index
const grid = document.getElementById("projects-grid");
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".project-card");
  if (!card) return;

  const projectId = card.dataset.id;
  sessionStorage.setItem("selectedProject", projectId);
  window.location.href = "p_descript.html";
});

function truncateText(text, limit = 60) {
  return text.length > limit
    ? text.slice(0, limit).trim() + "…"
    : text;
}
fetch("./data/projects.json")
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById("projects-grid");

    data.projects.forEach(project => {
      const card = document.createElement("div");
      card.classList.add("project-card");
      card.dataset.id = project.id; // <<< Esto es lo que faltaba

      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("image-wrapper");

      const img = document.createElement("img");
      img.src = project.images[0] || "images/placeholder.png";
      img.alt = project.title;

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.textContent = truncateText(project.description, 60);

      const title = document.createElement("p");
      title.textContent = project.title;

      imageWrapper.appendChild(img);
      imageWrapper.appendChild(overlay);
      card.appendChild(imageWrapper);
      card.appendChild(title);
      grid.appendChild(card);
    });
  });




//==================END_FETCHES==========================

/* ===============================
   HELPERS
=============================== */

function normalize(path) {
  return path.replace(/\/$/, '');
}
function fileNameToLabel(path) {
  let file = path.split('/').pop();

  if (!file || file === '') {
    file = 'index.html';
  }
  if (file === 'index.html') {
    return 'Home';
  } 
  if (file === 'p_descript.html') {
    return 'details';
  }
  return file
    .replace('.html', '')
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c);
}

document.addEventListener("DOMContentLoaded", () => {

  // -------------------- INIT ANIMATION (loader principal)
  const loader = document.getElementById("mosaic-loader");
  if (loader) {
    const blocks = 24;
    for (let i = 0; i < blocks; i++) {
      const tile = document.createElement("div");
      tile.style.animationDelay = `${Math.random() * 0.4}s`;
      loader.appendChild(tile);
    }    setTimeout(() => {      loader.remove();    }, 900); // duración total < 1s
  }});
//========================typewriter effect
const text2 = "Let’s connect!";
const h32 = document.getElementById("typewriter2");

let index = 0;
let isDeleting = false;

const speed = 120;
const deleteSpeed = 120;
const pause = 1000;

// cursor
const cursor = document.createElement("span");
cursor.classList.add("cursor");
h32.parentElement.appendChild(cursor);

function typeWriter() {

  if (!isDeleting) {
    // ESCRIBIENDO
    if (index < text2.length) {
      h32.textContent += text2.charAt(index);
      index++;
      setTimeout(typeWriter, speed);
    } else {
      setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, pause);
    }
  } else {
    // BORRANDO AL REVÉS
    if (index > 0) {
      index--;
      h32.textContent = text2.substring(0, index);
      setTimeout(typeWriter, deleteSpeed);
    } else {
      isDeleting = false;
      setTimeout(typeWriter, 500);
    }
  }
}

typeWriter();
//==============================boton


function getLineColorFromBackground(btn) {
  let el = btn.parentElement;
  while (el) {
    const bg = window.getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      // convertir a formato hex para comparar
      const rgb = bg.match(/\d+/g); // ["0","0","0"] por ejemplo
      if (rgb) {
        const r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2]);
        const brightness = (r*299 + g*587 + b*114)/1000;
        return brightness < 128 ? '#000000' : '#ffffff';
      }
    }
    el = el.parentElement;
  }
  return '#bb9f30'; // default
}

function initMosaicButtons(scope = document) {
  // selecciona todos los botones/links
  const buttons = scope.querySelectorAll('.mosaic_btn');
  const lineCount = 50;

  buttons.forEach(btn => {
    // guarda el color REAL del link al cargar
    const originalColor = getComputedStyle(btn).color;

    // hover
    btn.addEventListener('mouseenter', () => {
      btn.style.letterSpacing = '0.05em';

      for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('span');
        line.classList.add('line');
        line.style.background = getLineColorFromBackground(btn);

        const isTop = Math.random() > 0.5;
        line.classList.add(isTop ? 'top' : 'bottom');
        line.style.left = Math.random() * 100 + '%';

        btn.appendChild(line);

        setTimeout(() => {
          if (isTop) line.style.top = '-100%';
          else line.style.bottom = '-100%';
        }, Math.random() * 200);

        setTimeout(() => line.remove(), 100);
      }
    });

    // mouse leave
    btn.addEventListener('mouseleave', () => {
      // restaura el color original
      btn.style.color = originalColor;
      btn.style.letterSpacing = '0.05em';

      for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('span');
        line.classList.add('line');
        line.style.background = getLineColorFromBackground(btn);

        const isTop = Math.random() > 0.5;
        line.classList.add(isTop ? 'top' : 'bottom');
        line.style.left = Math.random() * 100 + '%';

        btn.appendChild(line);

        setTimeout(() => {
          if (isTop) line.style.top = '-100%';
          else line.style.bottom = '-100%';
        }, Math.random() * 200);

        setTimeout(() => line.remove(), 100);
      }
    });
  });
}
