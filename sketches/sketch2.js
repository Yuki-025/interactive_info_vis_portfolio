// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    p.background(240);
  // Meditation breathing: ~6 breaths per minute
    let breathPeriod = 10; // seconds per breath
    let flow = (p.millis() / 1000) * (p.TWO_PI / breathPeriod);

    p.noFill();
    p.strokeWeight(2);
    p.stroke(120);

    p.beginShape();
    for (let x = 0; x < p.width; x += 10) {
     let y =
        p.height / 2 +
        p.sin(x * 0.02 + flow) * 80;
        p.vertex(x, y);
    }
    p.endShape();
  };

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
