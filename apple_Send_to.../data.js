window.addEventListener("load", () => {

  function normalize(url) {
    return url.split("?")[0];
  }

  const mainImg = document.querySelector("[data-main='1']");
  if (!mainImg) {
    alert("mainImg nenalezen");
    return;
  }

  const mainSrc = normalize(mainImg.getAttribute("src"));
  alert("mainSrc: " + mainSrc);

  document.querySelectorAll("img").forEach(img => {
    if (img === mainImg) return;
    const imgSrc = normalize(img.getAttribute("src"));
    alert("imgSrc: " + imgSrc + " | shoda: " + (imgSrc === mainSrc));
    if (imgSrc === mainSrc) {
      img.remove();
    }
  });

});