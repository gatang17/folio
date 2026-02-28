fetch('projects.json')
  .then(response => response.json())
  .then(data => {
    const projectsList = document.getElementById('projects-list');
    data.projects.forEach(project => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      col.innerHTML = `
        <div class="card">
          ${project.images[0] ? `<img src="${project.images[0]}" class="card-img-top" alt="${project.title}">` : ''}
          <div class="card-body">
            <h5 class="card-title">${project.title}</h5>
            <p class="card-text">${project.description.substring(0, 100)}...</p>
            <button class="btn btn-primary" data-toggle="modal" data-target="#projectModal" onclick="showProject('${project.id}')">View More</button>
          </div>
        </div>
      `;

      projectsList.appendChild(col);
    });
  });

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

//about_me----------------------------------------------------------------
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
                <a href="${aboutme.personal.website}" target="_blank">${aboutme.personal.website.replace(/^https?:\/\//,'')}</a>
            </p>
        `;
    

    const topics = Object.keys(aboutme)
  .filter(key => key !== "pageTitle" && key !== "personal");
    let selectedTopic = topics[0]; // por defecto seleccionamos el primero

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
                  <h4>${job.title}</h4>
                  <hr>
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
