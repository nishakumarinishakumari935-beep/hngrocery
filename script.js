// IMAGE SLIDER

document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(".slide");
    const next = document.querySelector(".slider-control.next");
    const prev = document.querySelector(".slider-control.prev");

    let currentSlide = 0;
    let sliderTimer;

    function showSlide(index) {

        if (slides.length === 0) return;

        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add("active");
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
    }

    if (next) {
        next.addEventListener("click", function () {
            nextSlide();
            restartSlider();
        });
    }

    if (prev) {
        prev.addEventListener("click", function () {
            previousSlide();
            restartSlider();
        });
    }

    function startSlider() {
        if (slides.length > 1) {
            sliderTimer = setInterval(nextSlide, 4000);
        }
    }

    function restartSlider() {
        clearInterval(sliderTimer);
        startSlider();
    }

    if (slides.length > 0) {
        showSlide(0);
        startSlider();
    }

    // CURRENT YEAR

    const year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

});
