// sketches/sketch5.js  (INSTANCE MODE)
// Requires your HW4 loader: registerSketch("sk5", ...)
// Data file expected at: ./colleges.csv  (repo root)
// If you put it in /data/colleges.csv, change the path in p.preload accordingly.

registerSketch("sk5", function (p) {
  // ----- State -----
  let table;
  let allPoints = [];
  let bandPoints = [];

  const W = 900;
  const H = 900;
  const margin = { top: 200, right: 70, bottom: 120, left: 120 };

  const refAdmit = 30.41; // Oberlin College admission rate (%)
  const band = 2;

  let lowSchool = null;
  let highSchool = null;

  // ----- Lifecycle -----
  p.preload = function () {
    
    table = p.loadTable("./colleges.csv", "csv", "header");

    // If you put it in /data/colleges.csv instead, use:
    //table = p.loadTable("./data/colleges.csv", "csv", "header");
  };

  p.setup = function () {
    p.createCanvas(W, H);
    p.textFont("Arial");

    allPoints = [];
    bandPoints = [];

    for (let r = 0; r < table.getRowCount(); r++) {
      const name = table.getString(r, "Name");
      const admitRaw = table.getNum(r, "Admission Rate");
      const cost = table.getNum(r, "Average Cost");
      if (!isFinite(admitRaw) || !isFinite(cost)) continue;

      const admitPct = admitRaw > 1.5 ? admitRaw : admitRaw * 100;
      allPoints.push({ name, admitPct, cost });
    }

    bandPoints = allPoints.filter((pt) => Math.abs(pt.admitPct - refAdmit) <= band);
    chooseHighlightsCloseToRef();

    p.noLoop();
  };

  p.draw = function () {
    p.background(255);

    const plotX0 = margin.left;
    const plotY0 = margin.top;
    const plotW = W - margin.left - margin.right;
    const plotH = H - margin.top - margin.bottom;

    // Typography
    const subtitleSize = 30;
    const axisLabelSize = 20;
    const refLabelSize = 18;
    const footerSize = 18;

    // ---- Title block ----
    const titleText = "Same Odds. Very Different Price.";

    p.noStroke();
    p.fill(0);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.BASELINE);

    // Auto-shrink title so it never goes out of frame
    let titleSize = 64;
    p.textSize(titleSize);
    const maxTitleWidth = W - margin.left - margin.right;
    while (p.textWidth(titleText) > maxTitleWidth && titleSize > 40) {
      titleSize -= 2;
      p.textSize(titleSize);
    }
    p.text(titleText, margin.left, 90);

    // Subtitle
    p.textStyle(p.NORMAL);
    p.textSize(subtitleSize);

    let subtitle = "";
    if (lowSchool && highSchool) {
      const gap = Math.round(highSchool.cost - lowSchool.cost);
      subtitle =
        `Colleges with admission rates closest to ${formatAdmit(refAdmit)} can differ by ` +
        `about $${formatNumber(gap)} in cost.`;
    } else {
      subtitle = `Colleges with admission rates near ${formatAdmit(refAdmit)} can differ dramatically in cost.`;
    }
    p.text(subtitle, margin.left, 120, W - margin.left - margin.right, 120);

    if (bandPoints.length < 3 || !lowSchool || !highSchool) {
      p.fill(0);
      p.textSize(26);
      p.text(
        "Not enough colleges found near this admission rate.\nTry widening the band (e.g., ±3 or ±4).",
        margin.left,
        240
      );
      return;
    }

    // ---- Scales (x=admission, y=cost) ----
    const admitMin = Math.min(...bandPoints.map((pt) => pt.admitPct));
    const admitMax = Math.max(...bandPoints.map((pt) => pt.admitPct));
    const costMin = Math.min(...bandPoints.map((pt) => pt.cost));
    const costMax = Math.max(...bandPoints.map((pt) => pt.cost));

    const admitPad = 0.3;
    const costPad = (costMax - costMin) * 0.06;

    const xScale = (admitPct) =>
      p.map(admitPct, admitMin - admitPad, admitMax + admitPad, plotX0, plotX0 + plotW);

    const yScale = (cost) =>
      p.map(cost, costMin - costPad, costMax + costPad, plotY0 + plotH, plotY0);

    // ---- Axes ----
    p.stroke(0);
    p.strokeWeight(2);
    p.line(plotX0, plotY0, plotX0, plotY0 + plotH);
    p.line(plotX0, plotY0 + plotH, plotX0 + plotW, plotY0 + plotH);

    // Y-axis label
    p.noStroke();
    p.fill(0);
    p.textSize(axisLabelSize);
    p.textStyle(p.NORMAL);
    p.push();
    p.translate(60, plotY0 + plotH / 2);
    p.rotate(-p.HALF_PI);
    p.textAlign(p.CENTER, p.BASELINE);
    p.text("Average cost ($)", 0, 0);
    p.pop();

    // X-axis label (bottom-right)
    p.noStroke();
    p.fill(0);
    p.textSize(axisLabelSize);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text("Admission rate (%)", plotX0 + plotW, plotY0 + plotH + 65);

    // ---- Reference line at x = refAdmit (vertical dashed) ----
    const xRef = xScale(refAdmit);

    p.stroke(0);
    p.strokeWeight(3);
    p.drawingContext.setLineDash([18, 14]);
    p.line(xRef, plotY0, xRef, plotY0 + plotH);
    p.drawingContext.setLineDash([]);

    // Ref label near x-axis area
    p.noStroke();
    p.fill(0);
    p.textSize(refLabelSize);
    p.textAlign(p.LEFT, p.BASELINE);

    const refLabelX = Math.min(xRef + 12, plotX0 + plotW - 260);
    const refLabelY = plotY0 + plotH + 32;
    p.text(`Same admission rate (~${formatAdmit(refAdmit)})`, refLabelX, refLabelY);

    // ---- Points (band only) ----
    for (const pt of bandPoints) {
      if (isHighlight(pt)) continue;
      const x = xScale(pt.admitPct);
      const y = yScale(pt.cost);

      p.stroke(0);
      p.strokeWeight(1);
      p.fill(255);
      p.ellipse(x, y, 10, 10);
    }

    // ---- Highlights ----
    drawHighlight(lowSchool, xScale, yScale, plotX0, plotY0, plotW, plotH, -1);
    drawHighlight(highSchool, xScale, yScale, plotX0, plotY0, plotW, plotH, +1);

    // Footer
    p.noStroke();
    p.fill(0);
    p.textStyle(p.NORMAL);
    p.textSize(footerSize);
    p.textAlign(p.LEFT, p.BASELINE);
    p.text("Source: colleges.csv", plotX0, H - 30);
  };

  // ----- Helpers -----
  function chooseHighlightsCloseToRef() {
    const sorted = [...bandPoints].sort(
      (a, b) => Math.abs(a.admitPct - refAdmit) - Math.abs(b.admitPct - refAdmit)
    );

    let eps = 0.2;
    const needN = 6;
    let candidates = [];

    while (eps <= band) {
      candidates = sorted.filter((pt) => Math.abs(pt.admitPct - refAdmit) <= eps);
      if (candidates.length >= needN) break;
      eps += 0.2;
    }

    if (candidates.length < 2) {
      candidates = sorted.slice(0, Math.min(10, sorted.length));
    }

    lowSchool = candidates.reduce((a, b) => (b.cost < a.cost ? b : a), candidates[0]);
    highSchool = candidates.reduce((a, b) => (b.cost > a.cost ? b : a), candidates[0]);
  }

  function isHighlight(pt) {
    return (
      (lowSchool && pt.name === lowSchool.name) ||
      (highSchool && pt.name === highSchool.name)
    );
  }

  function drawHighlight(pt, xScale, yScale, plotX0, plotY0, plotW, plotH, side) {
    if (!pt) return;

    const x = xScale(pt.admitPct);
    const y = yScale(pt.cost);

    p.noStroke();
    p.fill(0);
    p.ellipse(x, y, 16, 16);

    p.stroke(0);
    p.strokeWeight(4);
    p.noFill();
    p.ellipse(x, y, 36, 36);

    const label = `$${Math.round(pt.cost / 1000)}k`;
    const nameShort = truncate(pt.name, 28);

    let dx = side > 0 ? 40 : -40;
    let dy = -18;

    if (y > plotY0 + plotH - 60) dy = -40;
    if (x + dx < plotX0 + 10) dx = 18;
    if (x + dx > plotX0 + plotW - 10) dx = -18;

    p.noStroke();
    p.fill(0);

    p.textAlign(dx > 0 ? p.LEFT : p.RIGHT, p.BOTTOM);
    p.textStyle(p.BOLD);
    p.textSize(22);
    p.text(label, x + dx, y + dy);

    p.textAlign(dx > 0 ? p.LEFT : p.RIGHT, p.TOP);
    p.textStyle(p.NORMAL);
    p.textSize(16);
    p.text(nameShort, x + dx, y + dy + 4);

    p.textAlign(p.LEFT, p.BASELINE);
  }

  function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatAdmit(v) {
    return `${v.toFixed(1)}%`;
  }

  function truncate(s, maxLen) {
    if (!s) return "";
    if (s.length <= maxLen) return s;
    return s.slice(0, maxLen - 1) + "…";
  }
});
