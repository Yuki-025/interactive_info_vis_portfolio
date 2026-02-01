// HWK 4B — Base Structure (pole and ground)
registerSketch('sk3', function (p) {

  let poleX, poleY;
  let poleHeight = 160;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    poleX = p.width / 2;
    poleY = p.height * 0.7;
  };

  p.draw = function () {
    p.background(245);

    // ground
    p.stroke(210);
    p.strokeWeight(3);
    p.line(0, poleY, p.width, poleY);

    // pole
    p.stroke(80);
    p.strokeWeight(5);
    p.line(poleX, poleY, poleX, poleY - poleHeight);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    poleX = p.width / 2;
    poleY = p.height * 0.7;
  };

});

