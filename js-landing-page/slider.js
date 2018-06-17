$(function(){
  new Slider({
      images: '.gallery .screensh img',
      btn_prev: '.gallery .prev',
      btn_next: '.gallery .next',
      auto: true
  });
});
function Slider(obj){
  this.images = $(obj.images);
  this.btn_prev = $(obj.btn_prev);
  this.btn_next = $(obj.btn_next);
  this.auto = obj.auto;
  let slider = this;
  let i=0;
  let isRun = false;
  this.prev = function(){
      if (isRun){
          return;
      }
      isRun = true;
      slider.images.eq(i).css({'left': '0', 'width': '100%'}).animate({
          left: '100%'
      }, 3500);
      i--;
      if (i<0){
          i= slider.images.length - 1;
      }
      slider.images.eq(i).css({'left': '-100%', 'width': '100%'}).animate({
          left: 0
      }, 3500, function(){
          isRun = false;
      });
      }
  this.next = function(){
      if (isRun){
          return;
      }
      isRun = true;
      slider.images.eq(i).css({'left': '0', 'width': '100%'}).animate({
          left: '-100%'
      }, 3500);
      i++;
      if (i>=slider.images.length){
          i= 0;
      }
      slider.images.eq(i).css({'left': '100%', 'width': '100%'}).animate({
          left: 0
      }, 3500, function(){
          isRun = false;
      });
  }
  slider.btn_prev.on("click", function(){
      slider.prev();
  })
  slider.btn_next.on("click", function(){
      slider.next();
  })
  if (slider.auto){
      setInterval(slider.next, 3500);
  }
}