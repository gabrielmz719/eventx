let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

function showSlide(index) {
  // Remove a classe "active" do slide atual
  slides[currentSlide].classList.remove('active');
  // Atualiza o índice do slide atual
  currentSlide = (index + totalSlides) % totalSlides; // Garante que o índice não seja negativo nem ultrapasse o total de slides
  // Adiciona a classe "active" no novo slide
  slides[currentSlide].classList.add('active');
}

nextButton.addEventListener('click', () => {
  showSlide(currentSlide + 1); // Vai para o próximo slide
});

prevButton.addEventListener('click', () => {
  showSlide(currentSlide - 1); // Volta para o slide anterior
});

// Inicia o slider com o primeiro slide
showSlide(currentSlide);
