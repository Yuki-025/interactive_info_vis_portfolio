// Instance-mode sketch for tab 2 — Breathing Wave Clock
registerSketch('sk2', function (p) {

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    p.background(240);

    let min = p.minute();
    let hr = p.hour();

    // Breathing depth varies slowly with minutes
    // Mapping minute() to amplitude to suggest deeper breathing over time
    let amplitude = p.map(min, 0, 59, 40, 120);

    // Meditation breathing rhythm: ~6 deep breaths per minute
    // One full breath cycle ≈ 10 seconds
    let breathPeriod = 10;
    let flow = (p.millis() / 1000) * (p.TWO_PI / breathPeriod);

    p.noFill();
    p.strokeWeight(2);

    // Color shifts across hours to suggest mood / day cycle
    let r = p.map(hr, 0, 23, 60, 200);
    let b = p.map(hr, 0, 23, 200, 60);
    p.stroke(r, 120, b);

    // Wave visualization
    // Positive sine values = exhale (wave rises)
    // Negative sine values = inhale (wave falls)
    p.beginShape();
    for (let x = 0; x < p.width; x += 10) {
      let y =
        p.height / 2 +
        p.sin(x * 0.02 + flow) * amplitude;
      p.vertex(x, y);
    }
    p.endShape();

    // Annotation (bottom-right)
    // Explains how to read the breathing wave
    p.noStroke();
    p.fill(120);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.textSize(20);
    p.text(
      "Top: Exhale\nBottom: Inhale\n~6 deep breaths / minute",
      p.width - 20,
      p.height - 20
    );
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

});

