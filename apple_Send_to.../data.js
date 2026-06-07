window.addEventListener("load", () => {

  function normalize(url) {
    return url.split("?")[0]; // vezme jen základ bez parametrů
  }

  const mainImg = document.querySelector("[data-main='1']");
  if (!mainImg) return;

  const mainSrc = normalize(mainImg.getAttribute("src"));

  document.querySelectorAll("img").forEach(img => {

    if (img === mainImg) return;

    const imgSrc = normalize(img.getAttribute("src"));

    if (imgSrc === mainSrc) {
      img.remove();
    }

  });

});


// Experimental
 window.addEventListener("load", () => {

  const root = getComputedStyle(document.documentElement);
  const bg = root.getPropertyValue("--background").trim();

  const white = root.getPropertyValue("--set_White").trim();

  if (bg !== white) {
    // document.body.style.padding = "50px";
  }

});




/* Experimental */
window.addEventListener("load", () => {

  // Najdi všechny obrázky v article
  const allImgs = Array.from(document.querySelectorAll("div.article img"));
  
  // Seskup obrázky které jsou ve stejném rodičovském elementu
  const groups = new Map();
  
  allImgs.forEach(img => {
    const parent = img.closest("p, div, figure") || img.parentElement;
    if (!groups.has(parent)) {
      groups.set(parent, []);
    }
    groups.get(parent).push(img);
  });

  // Zpracuj každou skupinu
  groups.forEach((imgs, parent) => {
    const container = document.createElement("div");
    container.classList.add("image-container");
    parent.parentNode.insertBefore(container, parent);
    
    imgs.forEach(img => {
      container.appendChild(img);
    });

    // Odstraň prázdný parent pokud v něm nic nezbylo
    if (parent.innerHTML.trim() === "") {
      parent.remove();
    }
  });

});
