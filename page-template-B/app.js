const darkmodeBtn = document.querySelector("#darkmode-toggle");
const rootElement = document.querySelector("html");

darkmodeBtn.addEventListener("click", () => {
    darkmodeBtn.classList.toggle("active");
    rootElement.classList.toggle("dark");
})