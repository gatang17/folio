//==================FETCHES===========================

// menu_top for no index pages
document.addEventListener('DOMContentLoaded', () => {
  fetch("./data/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header-container").innerHTML = html;
    })
    .catch(err => console.error('Error loading header:', err));
});


// footer-container for all pages
document.addEventListener('DOMContentLoaded', () => {
  fetch("./data/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer-container").innerHTML = html;
    })
    .catch(err => console.error('Error loading footer:', err));
});

//==================END_FETCHES===========================



document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('.popup-img');
  let currentIndex = 0;

  // Crear el contenedor del popup
  let popup = document.createElement('div');
  popup.id = 'popup-container';
  popup.style.position = 'fixed';
  popup.style.top = 0;
  popup.style.left = 0;
  popup.style.width = '100vw';
  popup.style.height = '100vh';
  popup.style.backgroundColor = 'rgba(0,0,0,0.8)';
  popup.style.display = 'none';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.style.zIndex = 9999;

  const popupImg = document.createElement('img');
  popupImg.style.maxWidth = '90%';
  popupImg.style.maxHeight = '90%';
  popupImg.style.transition = '0.3s ease';
  popup.appendChild(popupImg);

  // Botón anterior
  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '⟵';
  prevBtn.style.position = 'absolute';
  prevBtn.style.left = '20px';
  prevBtn.style.top = '50%';
  prevBtn.style.transform = 'translateY(-50%)';
  prevBtn.style.fontSize = '2rem';
  prevBtn.style.color = 'white';
  prevBtn.style.background = 'none';
  prevBtn.style.border = 'none';
  prevBtn.style.cursor = 'pointer';
  popup.appendChild(prevBtn);

  // Botón siguiente
  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '⟶';
  nextBtn.style.position = 'absolute';
  nextBtn.style.right = '20px';
  nextBtn.style.top = '50%';
  nextBtn.style.transform = 'translateY(-50%)';
  nextBtn.style.fontSize = '2rem';
  nextBtn.style.color = 'white';
  nextBtn.style.background = 'none';
  nextBtn.style.border = 'none';
  nextBtn.style.cursor = 'pointer';
  popup.appendChild(nextBtn);

  document.body.appendChild(popup);

  function showImage(index) {
    if (index >= 0 && index < images.length) {
      popupImg.src = images[index].src;
      currentIndex = index;
    }
  }

  images.forEach((img, index) => {
    img.addEventListener('click', function () {
      showImage(index);
      popup.style.display = 'flex';
    });
  });

  // Cerrar popup al hacer clic fuera de la imagen
  popup.addEventListener('click', function (e) {
    if (e.target === popup || e.target === popupImg) {
      popup.style.display = 'none';
      popupImg.src = '';
    }
  });

  // Navegación
  prevBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    showImage((currentIndex - 1 + images.length) % images.length);
  });

  nextBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    showImage((currentIndex + 1) % images.length);
  });

  // Navegación con teclado
  document.addEventListener('keydown', function (e) {
    if (popup.style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        showImage((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        showImage((currentIndex + 1) % images.length);
      } else if (e.key === 'Escape') {
        popup.style.display = 'none';
        popupImg.src = '';
      }
    }
  });
});





document.addEventListener('DOMContentLoaded', () => {
  const link = document.getElementById('link_logoV');
  
  if (link) {
    // Cambia el cursor a pointer
    link.style.cursor = 'pointer';

    // Redirige al hacer clic
    link.addEventListener('click', () => {
      window.location.href = 'aboutme.html'; // cambia esto por tu página real
    });
  }
});

document.addEventListener('DOMContentLoaded',()=>{
  const link_home = document.getElementById('logoH');
  
  if (link_home) {
    link_home.style.cursor = 'pointer';
    link_home.addEventListener('click',()=>{
      window,location.href = 'index.html';
    });
  }

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

/*PROJECTS*/
document.querySelectorAll('.project-card .project-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); 
    const projectId = e.target.closest('.project-card').dataset.id;
    sessionStorage.setItem('selectedProject', projectId);
    window.location.href = 'p_descript.html';
  });
});

const projectId = sessionStorage.getItem('selectedProject'); // obtener el proyecto
const projectContainer = document.getElementById('projects-list');

if (!projectId) {
  projectContainer.innerHTML = '<p>No se seleccionó ningún proyecto.</p>';
} else {
  
  fetch('js/data/projects.json')
    .then(res => res.json())
    .then(data => {
      const project = data.projects.find(p => p.id === projectId);
      if (!project) {
        projectContainer.innerHTML = '<p>Proyecto no encontrado.</p>';
        return;
      }
      let imagesHtml = '';
project.images.forEach(img => {
  imagesHtml += `
    <div class="col-6 mb-3">
      <img src="${img}" class="img-fluid" alt="${project.title}">
    </div>
  `;
});





    })
  
}

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

  return file
    .replace('.html', '')
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c);
}










