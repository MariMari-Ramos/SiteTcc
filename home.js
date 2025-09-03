let index=1;
function moveSlide(step){
    const slides= document.querySelector(".slides");
    const totalSlides = slides.children.length;
    index =(index+ step+totalSlides)% totalSlides;
    slides.sytle.transform= `translateX(${-index * 300}px)`;
}
setInterval(() => {
    moveSlide(1);
  }, 4000);