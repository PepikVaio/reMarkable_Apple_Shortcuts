// Kontroluje obrázky a odstraní duplicitní (header)
window.addEventListener("load", () => {

  function normalize(url) {
    // vezme jen základ bez parametrů
    return url.split("?")[0];
  }

  function getImageKey(url) {
    let file = normalize(url).split("/").pop();

    // odstranění přípony
    file = file.replace(/\.[^.]+$/, "");

    // odstranění velikostí typu -820x512 nebo -820x512-c
    file = file.replace(/-\d+x\d+(-[a-z])?$/, "");

    return file;
  }

  const mainImg = document.querySelector("[data-main='1']");
  if (!mainImg) return;

  const mainSrc = normalize(mainImg.getAttribute("src"));
  const mainKey = getImageKey(mainSrc);

  document.querySelectorAll("img").forEach(img => {

    if (img === mainImg) return;

    const imgSrc = normalize(img.getAttribute("src"));
    const imgKey = getImageKey(imgSrc);

    if (
      imgSrc === mainSrc ||   // původní kontrola
      imgKey === mainKey      // nová kontrola podle názvu
    ) {
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

  const GAP = 20;

  function getPerRow(count) {
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    if (count === 4) return 2;
    if (count === 5) return 3;
    if (count === 6) return 3;
    if (count === 7) return 4;
    if (count === 8) return 4;

    for (let p = Math.ceil(Math.sqrt(count)); p <= count; p++) {
      if (count % p !== 1) return p;
    }
    return count;
  }

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
    const perRow = getPerRow(count);

    const container = document.createElement("div");

    container.style.display = "block";
    container.style.width = "100%";
    container.style.textAlign = "center";

    container.style.fontSize = "0";
    container.style.lineHeight = "0";

    parent.parentNode.insertBefore(container, parent);

    const itemWidth = `calc((100% - ${(perRow - 1) * GAP}px) / ${perRow})`;

    imgs.forEach((img, index) => {

      img.style.display = "inline-block";
      img.style.verticalAlign = "top";
      img.style.boxSizing = "border-box";
      img.style.margin = "0";
      img.style.width = count === 1 ? "auto" : itemWidth;
      img.style.maxWidth = count === 1 ? "100%" : "none";

      container.appendChild(img);

      // HORIZONTÁLNÍ mezera
      if ((index + 1) % perRow !== 0) {
        const spacer = document.createElement("span");
        spacer.style.display = "inline-block";
        spacer.style.width = `${GAP}px`;
        container.appendChild(spacer);
      }

      // VERTIKÁLNÍ mezera (nový řádek)
      if ((index + 1) % perRow === 0 && index !== imgs.length - 1) {
        const lineBreak = document.createElement("div");
        lineBreak.style.height = `${GAP}px`;
        container.appendChild(lineBreak);
      }

    });

    if (!parent.querySelector("img")) {
      parent.remove();
    }

  });

});