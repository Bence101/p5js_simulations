
class ViewTransformer {
  static move(controls, settings) {
    function mousePressed(e) {
      if (!isLooping()) {return}
      if (mouseButton != CENTER) {return}
    if (!Utils.vectorOnCanvas(createVector(mouseX, mouseY))) {return}

      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }
    function mouseDragged(e) {
      if (!isLooping()) {return}
      if (mouseButton != CENTER) {return}
      if (!Utils.vectorOnCanvas(createVector(mouseX, mouseY))) {return}
      const { prevX, prevY, isDragging } = controls.viewPos;
      if (!isDragging) return;
      const minPanPadding = settings.viewTransformer.minPanPadding
      const pos = { x: e.clientX, y: e.clientY };
      const dx = pos.x - prevX;
      const dy = pos.y - prevY;
      if (prevX || prevY) {
        controls.view.x += dx*settings.viewTransformer.panSpeed;
        controls.view.y += dy*settings.viewTransformer.panSpeed;
        
        // applying min padding
        controls.view.x = min((settings.general.canvasWidth-minPanPadding)/controls.view.zoom, 
                              max(-settings.board.boardWidth+minPanPadding/controls.view.zoom, 
                              controls.view.x));
        controls.view.y = min((settings.general.canvasHeight-minPanPadding)/controls.view.zoom, 
                              max(-settings.board.boardHeight+minPanPadding/controls.view.zoom, 
                              controls.view.y));
        
        controls.viewPos.prevX = pos.x;
        controls.viewPos.prevY = pos.y;
      }
    }
    function mouseReleased(e) {
      if (!isLooping()) {return}
      if (mouseButton != CENTER) {return}
      if (!Utils.vectorOnCanvas(createVector(mouseX, mouseY))) {return}
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }
    return {
      mousePressed,
      mouseDragged,
      mouseReleased,
    };
  }

  static zoom(controls, settings) {
    function worldZoom(e) {
      if (!isLooping()) {return}
      if (!Utils.vectorOnCanvas(createVector(mouseX, mouseY))) {return}
      const { x, y, deltaY } = e;
      if ((controls.view.zoom<=settings.viewTransformer.minZoom) 
          & (deltaY>0)) {return}
      if ((controls.view.zoom>=settings.viewTransformer.maxZoom) 
          & (deltaY<0)) {return}

      const direction = deltaY > 0 ? -1 : 1;
      const factor = settings.viewTransformer.zoomSpeed;
      const minPanPadding = settings.viewTransformer.minPanPadding
      const zoom = 1 * direction * factor;
      const wx = (x - controls.view.x) / (width * controls.view.zoom);
      const wy = (y - controls.view.y) / (height * controls.view.zoom);
      controls.view.x -= wx * width * zoom;
      controls.view.y -= wy * height * zoom;
      controls.view.zoom += zoom;
                         
                         
      // applying min padding
      controls.view.x = min((settings.general.canvasWidth-minPanPadding)/controls.view.zoom, 
                            max(-settings.board.boardWidth+minPanPadding/controls.view.zoom, 
                            controls.view.x));
      controls.view.y = min((settings.general.canvasHeight-minPanPadding)/controls.view.zoom, 
                            max(-settings.board.boardHeight+minPanPadding/controls.view.zoom, 
                            controls.view.y));
      // zoom restraining
      controls.view.zoom = min(settings.viewTransformer.maxZoom,
                               max(settings.viewTransformer.minZoom, 
                               controls.view.zoom));
    }
    return { worldZoom };
  }
  static restore(controls, settings, directMode = false) {
    if (!isLooping()) {return}
    if ((key != settings.keyLayout.restoreViewTransformer) && (!directMode)) {return}
    controls.view.x = 0;
    controls.view.y = 0;
    controls.view.zoom = 1;
    controls.viewPos.prevX = null;
    controls.viewPos.prevY = null;
    controls.viewPos.isDragging = null;
  }
  static fullScreen(controls, settings, directMode = false) {
    if (!isLooping()) {return}
    if ((key != settings.keyLayout.fullScreenViewTransformer) && (!directMode)) {return}

    let widthZoomRate  = settings.general.canvasWidth/settings.board.boardWidth;              
    let heightZoomRate  = settings.general.canvasHeight/settings.board.boardHeight;
                                                                                 
    controls.view.x = 0;
    controls.view.y = 0;
    controls.view.zoom = min(widthZoomRate, heightZoomRate);
    controls.viewPos.prevX = null;
    controls.viewPos.prevY = null;
    controls.viewPos.isDragging = null;
  }
}
