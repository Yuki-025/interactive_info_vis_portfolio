// HWK 4B — Continuous Shadow Clock (12-hour circular motion)
registerSketch('sk3', function (p) {

  let poleX, poleY;
  let poleHeight = 280;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    poleX = p.width / 2;
    poleY = p.height * 0.7;
  };

  p.draw = function () {
    p.background(245);

    // continuous time in seconds
    let totalSeconds =
      p.hour() * 3600 +
      p.minute() * 60 +
      p.second() +
      p.millis() / 1000;

    // continuous hour value
    let fakeHour = totalSeconds / 3600;

    // 12-hour circular rotation (360° per 12 hours)
    let angle =
      p.TWO_PI * (fakeHour % 12) / 12
      - p.HALF_PI; // align "12 o'clock" to vertical

    // shadow length (shortest near noon)
    let shadowLength = p.map(
      Math.abs((fakeHour % 12) - 6),
      0,
      6,
      160,
      260
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
    let shadowY = poleY + p.sin(angle) * shadowLength;
    p.line(poleX, poleY, shadowX, shadowY);

    // time label (reference only)
    p.noStroke();
    p.fill(120);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.text(
      p.nf(p.hour(), 2) + ":" +
      p.nf(p.minute(), 2) + ":" +
      p.nf(p.second(), 2),
      poleX,
      poleY - poleHeight - 40
    );
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    poleX = p.width / 2;
    poleY = p.height * 0.7;
  };

});
