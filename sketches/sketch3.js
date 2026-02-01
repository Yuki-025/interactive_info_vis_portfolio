// HWK 4B — Continuous Shadow Clock (final)
registerSketch('sk3', function (p) {

  let poleX, poleY;
  let poleHeight = 320;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    poleX = p.width / 2;
    poleY = p.height * 0.7;
  };

  p.draw = function () {
    p.background(245);

    // continuous time (seconds)
    let totalSeconds =
      p.hour() * 3600 +
      p.minute() * 60 +
      p.second() +
      p.millis() / 1000;

    let fakeHour = p.map(
      totalSeconds,
      0,
      24 * 3600,
      0,
      24
    );

    // shadow angle across the day
    let angle = p.map(
      fakeHour,
      0,
      24,
      -p.PI / 2,
      p.PI / 2
    );

    // shadow length (shortest near noon)
    let shadowLength = p.map(
      Math.abs(fakeHour - 12),
      0,
      12,
      100,
      240
    );

    // ground
    p.stroke(210);
    p.strokeWeight(3);
    p.line(0, poleY, p.width, poleY);

    // pole
    p.stroke(80);
    p.strokeWeight(5);
    p.line(poleX, poleY, poleX, poleY - poleHeight);

    // shadow
    p.stroke(120);
    p.strokeWeight(4);
    let shadowX = poleX + p.cos(angle) * shadowLength;
    p.line(poleX, poleY, shadowX, poleY);

    // time label (reference only)
    p.noStroke();
    p.fill(120);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.text(
      p.nf(p.hour(), 2) + ":" +
      p.nf(p.minute(), 2) + ":" +
      p.nf(p.second(), 2),
      p.width / 2,
      poleY + 40
    );
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    poleX = p.width / 2;
    poleY = p.height * 0.7;
  };

});