//==================FETCHES===========================

//----------------------------------menu_top for no index pages
document.addEventListener('DOMContentLoaded', () => {
  fetch("./data/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header-container").innerHTML = html;
    })
    .catch(err => console.error('Error loading header:', err));
});


document.addEventListener('DOMContentLoaded', () => {
  fetch("./data/h_menu.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("h_menu-container").innerHTML = html;
    })
    .catch(err => console.error('Error loading menuhamburguer:', err));
});


//----------------------------------footer-container for all pages
document.addEventListener('DOMContentLoaded', () => {
  fetch("./data/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer-container").innerHTML = html;
    })
    .catch(err => console.error('Error loading footer:', err));
});



//----------------------------------PROJECT
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
          ${project.technologies && project.technologies.length > 0 ? `
            <h5>Technologies:</h5>
            <ul>
              ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
            </ul>
          ` : ''}
          ${project.images && project.images.length > 0 ? `
            <div class="row">
              ${project.images.map(img => `
                <div class="col-6 mb-3">
                  <img src="${img}" class="img-fluid" alt="${project.title}">
                </div>
              `).join('')}
            </div>
          ` : '<p>No images available.</p>'}
          <div class="project-links mt-3">
            ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-primary me-2">GitHub</a>` : ''}
            ${project.live ? `<a href="${project.live}" target="_blank" class="btn btn-success">Live Demo</a>` : ''}
          </div>
        `;

        projectContainer.innerHTML = html;
      });
  }
}

//==================END_FETCHES===========================




//------------------------------------clicl logo on header
document.addEventListener('DOMContentLoaded', () => {
  //this if is in home
  const link = document.getElementById('link_logoV');
  
  if (link) {
    // Cambia el cursor a pointer
    link.style.cursor = 'pointer';

    // Redirige al hacer clic
    link.addEventListener('click', () => {
      window.location.href = 'aboutme.html'; 
    });
  }
});
  //this if is in any other
document.addEventListener('DOMContentLoaded',()=>{
  const link_home = document.getElementById('logoH');
  
  if (link_home) {
    link_home.style.cursor = 'pointer';
    link_home.addEventListener('click',()=>{
      window,location.href = 'index.html';
    });
  }

});

// ------------------- Menu injection on index
document.addEventListener("DOMContentLoaded", () => {
  const div_desk = document.getElementById("menu_dtk");
  if (!div_desk) return; // seguridad

  const mediaQuery = window.matchMedia("(min-width: 851px)");
  const hMenu = document.getElementById("header-container");

  function updateSocialMenu(e) {
    if (e.matches) {
      // inject desktop layout
      div_desk.innerHTML = `
        <div class="row container-fluid"> 
          <div class="col-9 col-md-6 container_logo"> 
            <div class="sec_logo" id="link_logoV"></div>
          </div>
          <div class="col-12 col-md-6 div_menu_home">  
            <section class="sec_menu">
              <a class="nav-link" href="project.html"><p>projects</p></a>
              <a class="nav-link" href="aboutme.html"><p class="p_v">about_me</p></a>
              <a class="nav-link" href="contact.html"><p class="p_v">contact</p></a>
            </section>
            <div class="sec_menu22" id="social_menu"></div>
          </div>
        </div>
      `;
      if (hMenu) hMenu.classList.add("hide-menu");

      const soc_menu = document.getElementById("social_menu");
      if (soc_menu) {
        soc_menu.innerHTML = `
          <a class="nav-link" href="https://www.instagram.com/grey_dpa"><p class="p_v">INSTAGRAM</p></a>
          <a class="nav-link" href="https://github.com/gatang17"><p class="p_v">GITHUB</p></a>
          <a class="nav-link" href="https://www.linkedin.com/in/grete88/" target="_blank" rel="noopener noreferrer"><p class="p_v">LINKEDIN</p></a>
        `;
      }

    } else {
      div_desk.innerHTML = "";
      if (hMenu) hMenu.classList.remove("hide-menu");
    }
  }

  updateSocialMenu(mediaQuery);
  mediaQuery.addEventListener("change", updateSocialMenu);
});







document.addEventListener("DOMContentLoaded", function() {
  // Mostrar el formulario
  document.getElementById("open-form").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que el link recargue la página
    document.getElementById("popup-form").classList.remove("popup-hidden");
  });

  // Cerrar el formulario
  document.getElementById("close-form").addEventListener("click", function() {
    document.getElementById("popup-form").classList.add("popup-hidden");
  });
});



//==============BREADCUMBS============================

document.addEventListener('DOMContentLoaded', () => {

  const bc = document.getElementById('breadcrumb');
  if (!bc) return;

  const url = normalize(window.location.pathname);
  const label = fileNameToLabel(url);

  const HOME = normalize('/index.html');

  let trail = JSON.parse(sessionStorage.getItem('breadcrumbTrail')) || [];

  if (url === HOME) {
    trail = [{ label, url }];
  } else {
    const existingIndex = trail.findIndex(p => p.url === url);

    if (existingIndex !== -1) {
      trail = trail.slice(0, existingIndex + 1);
    } else {
      trail.push({ label, url });
    }
  }

  sessionStorage.setItem('breadcrumbTrail', JSON.stringify(trail));

  bc.innerHTML = trail
    .map((item, i) => {
      if (i === trail.length - 1) {
        return `<span>${item.label}</span>`;
      }
      return `<a href="${item.url}">${item.label}</a>`;
    })
    .join(' <i class="fa-solid fa-angle-right mx-2"></i> ');

});

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










