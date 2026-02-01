// HWK 4C — Static Candle Structure
registerSketch('sk4', function (p) {

  let maxCandleHeight = 200;
  let candleWidth = 30;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(245);

    let tableY = p.height * 0.75;
    let candleX = p.width / 2;

    // table
    p.stroke(200);
    p.strokeWeight(3);
    p.line(0, tableY, p.width, tableY);

    // candle body (static)
    p.noStroke();
    p.fill(240, 230, 200);
    p.rectMode(p.CENTER);
    p.rect(
      candleX,
      tableY - maxCandleHeight / 2,
      candleWidth,
      maxCandleHeight,
      6
    );
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

});

