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

  const allImgs = Array.from(document.querySelectorAll("div.article img"));
  
  const groups = new Map();
  
  allImgs.forEach(img => {
    const parent = img.closest("p, div, figure") || img.parentElement;
    if (!groups.has(parent)) {
      groups.set(parent, []);
    }
    groups.get(parent).push(img);
  });

  groups.forEach((imgs, parent) => {
    const count = imgs.length;
    
    // Vypočti optimální počet na řádek
    let perRow;
    if (count === 1) perRow = 1;
    else if (count === 2) perRow = 2;
    else if (count === 3) perRow = 3;
    else if (count === 4) perRow = 2; // 2+2
    else if (count === 5) perRow = 3; // 3+2
    else if (count === 6) perRow = 3; // 3+3
    else perRow = Math.ceil(Math.sqrt(count));

    const container = document.createElement("div");
    container.classList.add("image-container");
    container.style.textAlign = "center";
    parent.parentNode.insertBefore(container, parent);
    
    imgs.forEach(img => {
      img.style.maxWidth = `calc(${100 / perRow}% - ${perRow * 2}px)`;
      img.style.display = "inline-block";
      img.style.verticalAlign = "top";
      container.appendChild(img);
    });

    if (parent.innerHTML.trim() === "") {
      parent.remove();
    }
  });

});
