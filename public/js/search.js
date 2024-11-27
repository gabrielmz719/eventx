function pesquisar() {
    const searchTerm = document.getElementById('search').value.trim(); // Captura o texto da barra de pesquisa
    
    if (searchTerm.length < 3) { // Verifica se o termo tem pelo menos 3 caracteres
      alert('Digite ao menos 3 caracteres para pesquisar');
      return;
    }
  
    // Envia a requisição para o backend
    fetch(`/search?query=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
        displaySearchResults(data); // Exibe os resultados
      })
      .catch(error => {
        console.error('Erro ao buscar eventos:', error);
      });
  }
  
  function displaySearchResults(events) {
    const resultsContainer = document.getElementById('search-results');
    const eventsContainer = document.getElementById('events-container');
    
    // Limpa os resultados anteriores
    resultsContainer.innerHTML = '';
    
    // Esconde todos os eventos atualmente exibidos
    eventsContainer.style.display = 'none';
  
    if (events.length === 0) {
      resultsContainer.innerHTML = 'Nenhum evento encontrado.';
    } else {
      // Exibe os resultados encontrados na busca
      events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event-item');
        eventElement.innerHTML = `
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="uploads/${event.coverImage}" class="card-img-top" alt="Imagem de Capa do Evento">
              <div class="card-body">
                <h5 class="card-title">${event.title}</h5>
                <p class="card-text"><strong>Tipo:</strong> ${event.type}</p>
                <p class="card-text"><strong>Data:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                <a href="/events/${event._id}" class="btn btn-primary">Detalhes</a>
              </div>
            </div>
          </div>
        `;
        resultsContainer.appendChild(eventElement);
      });
    }
  }
  