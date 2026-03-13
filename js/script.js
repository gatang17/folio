//===================GOOGLE ANALITICS
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-X2R58E5647');

 //=================HIDE THE SECTIONS IN BROWSER=======
function goToSection(link) {
    // Tomamos el id de destino desde el data-section
    const sectionId = link.dataset.section;
    const section = document.getElementById(sectionId);
  
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      // Animación opcional de cuadritos
      animateSection(section);
    }
  }
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
  let lastScroll = 0;


//----------------------------------menu_top for no index pages
  fetch("./data/header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-container").innerHTML = html;
    initMosaicButtons();
  })
  .catch(err => console.error('Error loading header:', err));
  fetch("./data/h_menu.html")
.then(res => res.text())
.then(html => {
  
  document.getElementById("mobile-menu-btn").innerHTML = html;
  InitMobile();
  }) 
.catch(err => console.error('Error loading menuhamburguer:', err));
//======================ESTE CODIGO HACE Q EL MENU FLOTANDO NO SE VEA EN 0
const mobileBtn = document.getElementById("mobile-menu-btn");
window.addEventListener("scroll", () => {
const current = window.scrollY;
  if (current <= 20) {
  mobileBtn.style.opacity = "0";
} else if (current > lastScroll) {
  mobileBtn.style.opacity = "1"; // bajando
}  
lastScroll = current;
});
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
              <a class="nav-link m_text mosaic_btn" href="javascript:void(0)"data-section="projects" onclick="goToSection(this)">projects</a>      
              <a class="nav-link m_text mosaic_btn" href="javascript:void(0)"data-section="skills" onclick="goToSection(this)">Skills</a>
              <a class="nav-link m_text mosaic_btn" href="resume.html">resume</a>     
              <a class="nav-link m_text mosaic_btn" href="javascript:void(0)"data-section="contact" onclick="goToSection(this)" href="index.html#">contact</a>
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
        <div class="div_img" >
              ${project.images.map(img => `
                <div class="mb-3 gal_wrap">
                  <img src="${img}" class="img-fluid " alt="${project.title}">
                </div>
              `).join('')}
            </div>  `;
        projectContainer.innerHTML = html;
      });
  }
}


//=======================================================about_me----------------------------------------------------------------
fetch('./data/projects.json')
.then(res => res.json())
.then(data => {
    const aboutme = data.about[0];  

    // Nombre
    document.getElementById("name").textContent = aboutme.pageTitle;
    const titlesCol = document.getElementById("titles_col");

        // Contenedor de personal info (p_info)
        const personalDiv = document.getElementById('p_info');
        personalDiv.innerHTML = `
            <h3 style="font-weight:bold; text-transform:uppercase;">${aboutme.personal.name}</h3>
            <p>
                ${aboutme.personal.phone}<br>
                ${aboutme.personal.email}<br>
                <a href="${aboutme.personal.website}" class="nav-link" target="_blank">${aboutme.personal.website.replace(/^https?:\/\//,'')}</a>
            </p>
        `;
    

    const topics = Object.keys(aboutme)
  .filter(key => key !== "pageTitle" && key !== "personal");
    let selectedTopic = topics[0]; // por defecto seleccionamos el primero
    const downloadBtn = document.createElement("div");
    downloadBtn.innerHTML = `
    <a id="download" href="data/Final_Resume_Gretel.pdf" download class="btn m_text mosaic_btn">
    Download PDF
    </a>`;
    
    function renderTitles() {
        titlesCol.innerHTML = '';
        topics.forEach(topic => {
            const div = document.createElement('div');

            div.className = 'title_item' + (topic === selectedTopic ? ' selected' : '');
            div.innerHTML = `<i class="fa-solid fa-circle"></i><h4>${topic}</h4>`;
            div.addEventListener('click', () => {
                selectedTopic = topic;
                renderTitles();
                renderDesc();
            });
            titlesCol.appendChild(div);
            titlesCol.appendChild(downloadBtn);
        });
    }

    function renderDesc() {
      const descContent = document.getElementById('desc_content');
      descContent.innerHTML = '';
  
      const sectionData = aboutme[selectedTopic];
  
      if (!sectionData) {
          console.log("No data for:", selectedTopic);
          return;
      }
  
      // Si es lista simple (skills, abilities, awards, etc.)
      if (Array.isArray(sectionData) && typeof sectionData[0] === "string") {
          const ul = document.createElement('ul');
  
          sectionData.forEach(item => {
              const li = document.createElement('li');
              li.textContent = item;
              ul.appendChild(li);
          });
  
          descContent.appendChild(ul);
          return;
      }
  
      // EDUCATION
      if (selectedTopic === "education") {
          sectionData.forEach(item => {
              const div = document.createElement('div');
              div.innerHTML = `
              <h4>${item.institution}</h4>
              <p>
                  ${item.degree}<br>
                  ${item.graduation}<br><br>
              </p>
          `;
              descContent.appendChild(div);
          });
          return;
      }
  
      // EXPERIENCE
      if (selectedTopic === "experience") {
          sectionData.forEach(job => {
              const div = document.createElement('div');
  
              const ul = document.createElement('ul');
              job.responsibilities.forEach(r => {
                  const li = document.createElement('li');
                  li.textContent = r;
                  ul.appendChild(li);
              });
              const space=  document.createElement('br');
            //  const hr=  document.createElement('hr');
  
              div.innerHTML = `
               <hr>
                  <h4>${job.title}</h4>
                 
                  <p>${job.organization} — ${job.location}</p>
                  <small>${job.period}</small>
              `;
  
              div.appendChild(ul);
              div.appendChild(space);
              descContent.appendChild(div);
          });
      }
  }
    renderTitles();
    renderDesc();
});


//=================================================project en index
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

     /* const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.textContent = truncateText(project.description, 60);*/

      const title = document.createElement("p");
      title.textContent = project.title;

      imageWrapper.appendChild(img);
     /* imageWrapper.appendChild(overlay);*/
      card.appendChild(imageWrapper);
      card.appendChild(title);
      grid.appendChild(card);
    });
  });

  //=================================================SKILLS
function showProject(id) {
  fetch('projects.json')``
    .then(response => response.json())
    .then(data => {
      const project = data.projects.find(p => p.id === id);
      document.getElementById('projectModalLabel').textContent = project.title;

      let imagesHtml = '';
      project.images.forEach(img => {
        imagesHtml += `<div id="img_cont" ><img src="${img}" class="img-fluid mb-2"></div>`;
      });

      document.getElementById('projectModalBody').innerHTML = `
        <p>${project.description}</p>
        ${imagesHtml}
        <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
      `;

      let footerHtml = '';
      if(project.github) footerHtml += `<a href="${project.github}" target="_blank" class="btn btn-secondary mr-2">GitHub</a>`;
      if(project.live) footerHtml += `<a href="${project.live}" target="_blank" class="btn btn-success">Live Site</a>`;

      document.getElementById('projectModalFooter').innerHTML = footerHtml;
    });
}

fetch('data/projects.json')
.then(res => res.json())
.then(data => {
  const skills = document.querySelectorAll('.skill');


  skills.forEach(skillEl => {
    const key = skillEl.dataset.title.toLowerCase();
    const skillData = data.skills.find(s => s.id.toLowerCase() === key);
    if (!skillData) return;

    // contenido interno mínimo
    skillEl.querySelector('.skill-overlay').innerHTML = `<span>${skillData.overlay}</span>`;


    skillEl.querySelector('.skill-inner').innerHTML = `
      <h3>${skillData.title}</h3>
      <ul>${skillData.points.map(p => `<li>${p}</li>`).join('')}</ul>
      <small>${skillData.tools.join(' • ')}</small>
    `;

    // click expand/contraer
    skillEl.addEventListener('click', () => {
      skills.forEach(s => s !== skillEl && s.classList.remove('active'));
      skillEl.classList.toggle('active');
    });
  });
})
.catch(err => console.error('Error loading skills:', err));


  //just tryinnggggg something-PROJECT CAROUSEL================
//   const topTrack = document.getElementById("film-track-top");
// const bottomTrack = document.getElementById("film-track-bottom");

// fetch("./data/projects.json")
//   .then(res => res.json())
//   .then(data => {
//     const projects = data.projects;

//     function createFilmCard(project) {
//       const card = document.createElement("div");
//       card.classList.add("film-card");
//       card.dataset.id = project.id;

//       const img = document.createElement("img");
//       img.src = project.images[0] || "images/placeholder.png";
//       img.alt = project.title;

//       const overlay = document.createElement("div");
//       overlay.classList.add("film-overlay");
//       overlay.textContent = project.title;

//       card.appendChild(img);
//       card.appendChild(overlay);

//       card.addEventListener("click", () => {
//         sessionStorage.setItem("selectedProject", project.id);
//         window.location.href = "p_descript.html";
//       });

//       return card;
//     }
//     function fillInfinite(track, list, reverse = false) {
//       const items = reverse ? list.slice().reverse() : list;
    
//       // mínimo 3 pantallas para que jamás se vea hueco
//       const minWidth = window.innerWidth * 4;
    
//       while (track.scrollWidth < minWidth) {
//         items.forEach(p => track.appendChild(createFilmCard(p)));
//       }
//     }
    
//     fillInfinite(topTrack, projects);
//     fillInfinite(bottomTrack, projects, true);
//   });




//==================END_FETCHES==========================

/* ===============================
   HELPERS
=============================== */

// function normalize(path) {
//   return path.replace(/\/$/, '');
// }
// function fileNameToLabel(path) {
//   let file = path.split('/').pop();

//   if (!file || file === '') {
//     file = 'index.html';
//   }
//   if (file === 'index.html') {
//     return 'Home';
//   } 
//   if (file === 'p_descript.html') {
//     return 'details';
//   }
//   return file
//     .replace('.html', '')
//     .replace(/[-_]/g, ' ')
//     .replace(/([a-z])([A-Z])/g, '$1 $2')
//     .replace(/\b\w/g, c => c);
// }

//=================================================CONTACT
const popup = document.getElementById("pop_up");
const form = document.getElementById("contactForm");

function openPopup(){
  popup.classList.add("active");
}

function closePopup(){
  popup.classList.remove("active");
}

// cerrar si hacen click fuera del cuadro
popup.addEventListener("click", function(e){
  if(e.target === popup){
    closePopup();
  }
});

// cerrar con tecla ESC
document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    closePopup();
  }
});

// enviar formulario sin recargar
form.addEventListener("submit", function(e){

  e.preventDefault();

  fetch(form.action, {
    method: "POST",
    body: new FormData(form)
  })
  .then(() => {
    openPopup();
    form.reset();
  });

});


//==================================== Botón flotante móvil
const mobileBtn = document.querySelector('#mobile-menu-btn a');
const introSection = document.getElementById('intro');
mobileBtn.addEventListener('click', (e) => {
    e.preventDefault(); // es es lo q evita scroll normal
    // Fade in
    fadeOverlay.classList.add('show');
    // Cuando termina el fade
    setTimeout(() => {
        introSection.scrollIntoView({ behavior: 'smooth' }); // salto limpio
    }, 600); // MISMO tiempo que el transition
});

  // -------------------- INIT ANIMATION (loader principal)

document.addEventListener("DOMContentLoaded", () => {


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
const texts = [
  "Let’s connect!",
  "Let’s Build Something Great!"
];

const element = document.getElementById("typewriter");


let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

const speed = 100;
const deleteSpeed = 60;
const pause = 1200;

function typeWriter() {
  const currentText = texts[textIndex];

  if (!isDeleting) {
    // ESCRIBIENDO
    if (charIndex < currentText.length) {
      element.textContent += currentText.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, speed);
    } else {
      setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, pause);
    }
  } else {
    // BORRANDO
    if (charIndex > 0) {
      charIndex--;
      element.textContent = currentText.substring(0, charIndex);
      setTimeout(typeWriter, deleteSpeed);
    } else {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeWriter, 300);
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
