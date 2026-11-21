document.addEventListener("DOMContentLoaded", () => {

  // IMAGE SLIDER

  const slides = Array.from(document.querySelectorAll(".slide"));
  let currentSlide = 0;
  let sliderTimer;

  function showSlide(index) {
    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide);
    });
  }

  function restartSlider() {
    clearInterval(sliderTimer);

    sliderTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 4500);
  }

  document.querySelector(".prev")?.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    restartSlider();
  });

  document.querySelector(".next")?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    restartSlider();
  });

  showSlide(0);
  restartSlider();

  // CURRENT YEAR

  const year = document.getElementById("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // HN AI CHAT

  const panel = document.getElementById("hnAiPanel");
  const launcher = document.getElementById("hnAiLauncher");
  const closeButton = document.getElementById("hnAiClose");
  const form = document.getElementById("hnAiForm");
  const input = document.getElementById("hnAiInput");
  const messages = document.getElementById("hnAiMessages");

  function toggleChat(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean"
      ? forceOpen
      : !panel.classList.contains("open");

    panel.classList.toggle("open", shouldOpen);
    panel.setAttribute("aria-hidden", String(!shouldOpen));

    if (shouldOpen) input.focus();
  }

  launcher.addEventListener("click", () => toggleChat());
  closeButton.addEventListener("click", () => toggleChat(false));

  function addMessage(text, kind) {
    const bubble = document.createElement("div");

    bubble.className = "chat-bubble " + kind;
    bubble.textContent = text;

    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;

    return bubble;
  }

  async function askHN(message) {

    addMessage(message, "user");

    const pending = addMessage(
      "जवाब तैयार किया जा रहा है…",
      "assistant"
    );

    try {

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message
        })
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (!data || typeof data.reply !== "string") {
        throw new Error("Invalid response");
      }

      pending.textContent = data.reply;

    } catch (error) {

      pending.className = "chat-bubble error";

      pending.textContent =
        "HN AI अभी सेटअप हो रहा है। कृपया बाद में फिर कोशिश करें या कंपनी से फोन पर संपर्क करें: 8294891066 / 7739233551.";

    }

    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const message = input.value.trim();

    if (!message) return;

    input.value = "";

    await askHN(message);
  });

  document.querySelectorAll("[data-question]").forEach(button => {

    button.addEventListener("click", () => {
      askHN(button.dataset.question);
    });

  });

});
