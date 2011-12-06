Faacelift = {
  init: function(){
    this.canvasEl = document.getElementById('canvas');
    this.ctx = this.canvasEl.getContext('2d')
    this.updateCanvasSize();
  },

  updateCanvasSize: function(){
    this.canvasEl.width = $(window).width();
    this.canvasEl.height = $(window).height();
  },

  drawImage: function(){
    var photoData = this.photos[1],
      img = new Image(),
      photoScale = this.canvasEl.height / photoData.height;
    
    img.onload = $.proxy(function(){
      this.ctx.drawImage(img, 0, 0, photoData.width * photoScale, this.canvasEl.height);
    }, this);
    img.src = '/proxy?src=' + photoData.url;
  }
};

$(function(){
  Faacelift.init();
  Faacelift.drawImage();
});
