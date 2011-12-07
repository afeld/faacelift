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
      radius = this.canvasEl.width / 2,
      noseOffsetX = radius * Math.sin(tag.yaw * Math.PI / 180), // from center
      faceWidth = this.canvasEl.width * scale,
      faceHeight = this.canvasEl.height * scale,
      noseToFaceLeft = -1 * (tag.nose.x - faceLeft) * (faceWidth / tag.width),
      noseToFaceTop = -1 * (tag.nose.y - faceTop) * (faceHeight / tag.height);
      
    
    img.onload = $.proxy(function(){
      // clear the canvas
      this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      
      this.ctx.save();
      
      this.ctx.translate(this.canvasEl.width / 2, this.canvasEl.height / 2); // center-center
      this.ctx.translate(noseOffsetX, 0); // where nose will be centered
      this.ctx.rotate(-1 * tag.roll * Math.PI / 180); // un-tilt the face
      this.ctx.translate(noseToFaceLeft, noseToFaceTop);
      
      this.ctx.drawImage(img, faceLeft, faceTop, tag.width, tag.height, 0, 0, faceWidth, faceHeight);
      
      this.ctx.restore();
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
