fetch('projects.json')
  .then(response => response.json())
  .then(data => {
    const projectsList = document.getElementById('projects-list');
    data.projects.forEach(project => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      col.innerHTML = `
        <div class="card h-100">
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
  fetch('projects.json')
    .then(response => response.json())
    .then(data => {
      const project = data.projects.find(p => p.id === id);
      document.getElementById('projectModalLabel').textContent = project.title;

      let imagesHtml = '';
      project.images.forEach(img => {
        imagesHtml += `<img src="${img}" class="img-fluid mb-2">`;
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


