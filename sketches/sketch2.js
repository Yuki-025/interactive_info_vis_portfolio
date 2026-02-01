// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    p.background(240);

    let min = p.minute();
    let hr = p.hour();

  // Breathing depth varies slowly with minutes
    let amplitude = p.map(min, 0, 59, 40, 120);

  // Meditation breathing: ~6 breaths per minute
    let breathPeriod = 10;
    let flow = (p.millis() / 1000) * (p.TWO_PI / breathPeriod);

    p.noFill();
    p.strokeWeight(2);

  // Color shifts across hours to suggest mood / day cycle
    let r = p.map(hr, 0, 23, 60, 200);
    let b = p.map(hr, 0, 23, 200, 60);
    p.stroke(r, 120, b);

    p.beginShape();
    for (let x = 0; x < p.width; x += 10) {
      let y =
      p.height / 2 +
      p.sin(x * 0.02 + flow) * amplitude;
      p.vertex(x, y);
    }
    p.endShape();
  };


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
