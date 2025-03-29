const container = document.querySelector(".carousel-container");
const slides = document.querySelectorAll(".slide");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let index = 0;
const totalSlides = slides.length;

// Function to update the slide position
function updateSlide() {
    container.style.transform = `translateX(${-index * 100}%)`;
}

// Go to next slide
function nextSlide() {
    index = (index + 1) % totalSlides;
    updateSlide();
}

// Go to previous slide
function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    updateSlide();
}

// Auto-slide every 3 seconds
let autoSlide = setInterval(nextSlide, 3000);

// Reset interval on button click
function resetInterval() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 3000);
}

// Event listeners
nextButton.addEventListener("click", () => {
    nextSlide();
    resetInterval();
});

prevButton.addEventListener("click", () => {
    prevSlide();
    resetInterval();
});
container.addEventListener('mouseover', () => {
    clearInterval(autoSlide);
});
container.addEventListener('mouseout', () => {
    autoSlide = setInterval(nextSlide, 3000);
});
