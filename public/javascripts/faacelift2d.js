Faacelift = {
  init: function(){
    this.canvasEl = document.getElementById('canvas');
    this.ctx = this.canvasEl.getContext('2d');
  },

  drawImage: function(){
    var photoData = this.photos[0],
      img = new Image(),
      tag = photoData.tags[0],
      scale = 0.8,
      faceLeft = tag.center.x - (tag.width / 2),
      faceTop = tag.center.y - (tag.height / 2);
    
    img.onload = $.proxy(function(){
      this.ctx.drawImage(img, faceLeft, faceTop, tag.width, tag.height, this.canvasEl.width * (1 - scale) / 2, this.canvasEl.height * (1 - scale) / 2, this.canvasEl.width * scale, this.canvasEl.height * scale);
    }, this);
    img.src = '/proxy?src=' + photoData.url;
  }
};

$(function(){
  Faacelift.init();
  Faacelift.drawImage();
});