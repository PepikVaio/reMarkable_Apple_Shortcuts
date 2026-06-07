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


window.addEventListener("load", () => {

  // Najdi skupiny obrázků za sebou
  const allImgs = document.querySelectorAll("div.article img");
  
  allImgs.forEach(img => {
    // Pokud obrázek ještě není v kontejneru
    if (img.parentElement.classList.contains("image-container")) return;

    // Sbírej obrázky za sebou
    const group = [img];
    let next = img.nextElementSibling;
    while (next && next.tagName === "IMG") {
      group.push(next);
      next = next.nextElementSibling;
    }

    // Obal skupinu do kontejneru
    const container = document.createElement("div");
    container.classList.add("image-container");
    img.parentNode.insertBefore(container, img);
    group.forEach(i => container.appendChild(i));
  });

});
