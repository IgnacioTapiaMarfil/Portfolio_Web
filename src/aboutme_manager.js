

function showTab(index) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach((tab, i) => {
        tab.style.display = (i === index) ? 'flex' : 'none'; // Cambia 'block' a 'flex'
    });
  }


  let currentSlide = 0;

function changeSlide(direction) {
  const images = document.querySelectorAll('#tab1 .carousel-image');
  images[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + direction + images.length) % images.length;
  images[currentSlide].classList.add('active');
}