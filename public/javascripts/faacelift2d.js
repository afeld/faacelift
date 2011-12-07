Faacelift = {
  init: function(){
    this.$window = $(window);
    this.canvasEl = document.getElementById('canvas');
    this.ctx = this.canvasEl.getContext('2d');
    
    this.photos.sort(function(a, b){
      return a.tags[0].yaw - b.tags[0].yaw;
    });
    
    this.$window.mousemove($.proxy(this.onMouseMove, this));
  },

  drawImage: function(photoData){
    var img = new Image(),
      tag = photoData.tags[0],
      scale = 0.7,
      faceLeft = tag.center.x - (tag.width / 2),
      faceTop = tag.center.y - (tag.height / 2),
      destX = (this.canvasEl.width * (1 - scale) / 2) + (tag.yaw * 1.5),
      destY = this.canvasEl.height * (1 - scale) / 2;
    
    img.onload = $.proxy(function(){
      // clear the canvas
      this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      
      this.ctx.drawImage(img, faceLeft, faceTop, tag.width, tag.height, destX, destY, this.canvasEl.width * scale, this.canvasEl.height * scale);
    }, this);
    img.src = '/proxy?src=' + photoData.url;
  },
  
  onMouseMove: function(e){
    var numPhotos = this.photos.length,
      photoIndex = Math.floor(e.pageX / (this.$window.width() / numPhotos));
    
    if (this.currentPhotoIndex !== photoIndex){
      this.currentPhotoIndex = photoIndex;
      var photoData = this.photos[photoIndex];
      this.drawImage(photoData);
    }
  }
};

$(function(){
  Faacelift.init();
});
