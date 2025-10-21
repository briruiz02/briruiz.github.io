let plants = [
  { name: "Roses",
   favoriteArtist: "Frederic Chopin",
   musicGenre: "Romantic classical" 
  },
  { 
    name: "Mexican Honeysuckle",
    favoriteArtist: "The Beatles",
    musicGenre: "Psychedelic rock" 
  },
  { 
    name: "Oak Tree",
    favoriteArtist: "Miles Davis",
    musicGenre: "Modal jazz" 
  },
  { 
    name: "Ballmoss",
    favoriteArtist: "Black Sabbath",
    musicGenre: "Sludge/stoner metal" 
  },
  { 
    name: "Prickly Pears", 
    favoriteArtist: "Sonido Duenez",
    musicGenre: "Desert cumbia" 
  },
  { 
    name: "Baldcypress",
    favoriteArtist: "Robert Johnson",
    musicGenre: "Delta blues" 
  },
  { 
    name: "Coleus", 
    favoriteArtist: "D'Angelo",
    musicGenre: "Neo-Soul/R&B" 
  },
  { 
    name: "Chinese Wisteria",
    favoriteArtist: "Grimes",
    musicGenre: "Villain pop" 
  },
  { 
    name: "Flamingo Feather Flower",
    favoriteArtist: "Ricky Martin",
    musicGenre: "Latin pop" 
  },
  { 
    name: "Purple Heart", 
    favoriteArtist: "Nirvana",
    musicGenre: "Alt rock/grunge" 
  }
];

let c = 125;
let goldenAngle = 137.5;
let points = [];

function setup() {
  var canvas = createCanvas(850, 850);
  canvas.parent("sketch-holder");
  angleMode(DEGREES);
  textFont("monospace");

  // store positions of each dot
  for (let i = 0; i < plants.length; i++) {
    let a = i * goldenAngle;
    let r = c * sqrt(i);
    let x = width / 2 + r * cos(a);
    let y = height / 2 + r * sin(a);
    points.push(createVector(x, y));
  }
}

function draw() {
  background(255);

  // overlay text
  noStroke();
  fill(70, 70, 60);
  textFont('monospace');
  textSize(14);
  textAlign(LEFT, TOP);
  text('A symbiotic phyllotactic grid of plant life on campus', width * 0.05, height * 0.05);

  // tagline text
  textSize(12);
  fill(100, 100, 90, 200);
  text('Inspired by natural growth patterns, hover to discover.', width * 0.05, height * 0.05 + 22);


  // connecting lines 
  stroke(100, 120, 90, 60); 
  strokeWeight(0.5);
  noFill();

  for (let i = 0; i < points.length - 1; i++) {
    line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  }

  // connect back to center 
  for (let i = 0; i < points.length; i++) {
    line(width / 2, height / 2, points[i].x, points[i].y);
  }

  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);

  for (let i = 0; i < points.length; i++) {
    let d = dist(mouseX, mouseY, points[i].x, points[i].y);

    if (d < 15) {
      // hovered: darker color
      fill("#8E996F");
      ellipse(points[i].x, points[i].y, 15, 15);

      // genre info beside mouse
      fill(0);
      textSize(12);
      textAlign(RIGHT, CENTER);
      text(
        "\n" + plants[i].musicGenre,
        mouseX + 10,
        mouseY + 10
      );
    } else {
      // normal state
      fill("#AEB794");
      ellipse(points[i].x, points[i].y, 10, 10);
    }

    // label under circles
    fill(0);
    textSize(12);
    textAlign(CENTER, TOP);
    text(plants[i].name, points[i].x, points[i].y + 25);
  }
}
