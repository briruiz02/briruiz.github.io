// new p5 (p) allows for two p5 sketches to run on one webpage simultaneously

new p5((p) => {
  let margin = 80;
  const bottomMargin = 120;

  let chartData = [];
  let barPositions = [];

  let xScale, yScaleSize, yScaleCoord;
  let dataLoaded = false;
  let canvas;

  // format millions

  function formatMillions(num) {
    if (num >= 1_000_000) {
      return p.nf(num / 1_000_000, 0, 1) + "M";
    }
    return p.nf(num, 0, 0);
  }

  p.setup = function() {
    canvas = p.createCanvas(900, 700);
    canvas.parent("data-viz");
    p.textFont("Courier New, monospace");
    p.background(255);
    loadData();
  };

  // async load data and categorize by listeners greatest to smallest

  async function loadData() {
    try {
      let rawData = await d3.csv("plantData.csv", d => {
        d.listeners = +d.listeners;
        return d;
      });

      chartData = d3.sort(rawData, (a, b) =>
        d3.descending(a.listeners, b.listeners)
      );

      setupScales();
      dataLoaded = true;
    } catch (error) {
      console.error("Error loading CSV:", error);
    }
  }

  // set up scales that we can use p5 to draw visuals from this dataset

  function setupScales() {
    let maxListeners = d3.max(chartData, d => d.listeners);

    xScale = d3.scaleBand(
      chartData.map(d => d.artist),
      [margin, p.width - margin]
    ).padding(0.2);

    yScaleSize = d3.scaleLinear(
      [0, maxListeners],
      [0, p.height - margin - bottomMargin]
    );

    yScaleCoord = d3.scaleLinear(
      [0, maxListeners],
      [p.height - bottomMargin, margin]
    );
  }

  // if csv data is loaded then draw the chart

  p.draw = function() {
    p.background(255);
    if (!dataLoaded) return;

    drawChart();
    drawHover();
  };

  // draw chart and find avg monthly listeners
  // add in colors of sage green that we will then assign to the bar chart across artists

  function drawChart() {
    barPositions = [];
    let avg = d3.mean(chartData, d => d.listeners);
    const sageGreens = ["#f1f5f2","#dfe8e2","#c9d7cd","#b4c8b9","#9db8a5","#89a992","#749c7f","#628c6d","#537b5c"];
    let colors = d3.scaleOrdinal(chartData.map(d => d.artist), sageGreens);

    // draws the chart based on established variables

    chartData.forEach(d => {
      let x = xScale(d.artist);
      let y = yScaleCoord(d.listeners);
      let w = xScale.bandwidth();
      let h = yScaleSize(d.listeners);

      //save position of bars for hover interaction

      barPositions.push({ x, y, w, h, plant: d.name });

      // draw vertical bar and assign it a sage green color

      p.stroke(0);
      p.fill(colors(d.artist));
      p.rect(x, y, w, h);

      // monthly listeners top label

      p.noStroke();
      p.fill(0);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(formatMillions(d.listeners), x + w / 2, y - 3);

      // artists labels

      p.push();
      p.translate(x + w / 2, p.height - 65);
      p.rotate(-p.PI / 3);
      p.textSize(12);
      p.text(d.artist, 0, 0);
      p.pop();
    });

    // plant's top artists text

    p.noStroke();
    p.fill(0);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text("Plant's Top Artists", p.width / 2, p.height - 15);

    //avg line

    p.stroke(255, 0, 0);
    let avgY = yScaleCoord(avg);
    p.line(margin, avgY, p.width - margin, avgY);

    // avg text

    p.noStroke();
    p.fill(255, 0, 0);
    p.textAlign(p.RIGHT);
    p.text("average", p.width - margin, avgY - 14);

    // monthly listeners text

    p.push();
    p.translate(35, p.height / 2);
    p.rotate(-p.PI / 2);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(0);
    p.textSize(12);
    p.text("Monthly Listeners (M)", 0, 0);
    p.pop();
  }

  // hover interaction

  function drawHover() {
    for (let b of barPositions) {
      if (
        p.mouseX > b.x &&
        p.mouseX < b.x + b.w &&
        p.mouseY > b.y &&
        p.mouseY < b.y + b.h
      ) {
        let textStr = "Plant: " + b.plant;
        p.textSize(12);
        let boxW = p.textWidth(textStr) + 14;
        let boxH = 22;
        let x = p.mouseX + 10;
        let y = p.mouseY - 10;

        p.fill(255);
        p.stroke(0);
        p.rect(x, y - boxH, boxW, boxH, 4);

        p.noStroke();
        p.fill(0);
        p.textAlign(p.LEFT, p.CENTER);
        p.text(textStr, x + 7, y - boxH / 2);

        break;
      }
    }
  }

});
