// HWK 4C — Candle Burn (Irreversible Time)
registerSketch('sk4', function (p) {

  let startTime;
  let burnDuration = 300; // 5 minutes

  let maxCandleHeight = 200;
  let candleWidth = 30;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    startTime = p.millis();
  };

  p.draw = function () {
    p.background(245);

    let tableY = p.height * 0.75;
    let candleX = p.width / 2;

    // table
    p.stroke(200);
    p.strokeWeight(3);
    p.line(0, tableY, p.width, tableY);

    // time logic
    let elapsed = (p.millis() - startTime) / 1000;
    let progress = p.constrain(elapsed / burnDuration, 0, 1);

    let candleHeight = p.lerp(maxCandleHeight, 0, progress);

    // candle body
    if (candleHeight > 0) {
      p.noStroke();
      p.fill(240, 230, 200);
      p.rectMode(p.CENTER);
      p.rect(
        candleX,
        tableY - candleHeight / 2,
        candleWidth,
        candleHeight,
        6
      );
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

});


