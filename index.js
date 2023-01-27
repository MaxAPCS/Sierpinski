let triangles = new Set();
let newtriangles = [];
function setup() {
  createCanvas(1024, 1024);
  colorMode(HSB);
  let height = width*Math.sqrt(3)/2;
  newtriangles.push(new Triangle([0, -height], [width, height], [-width, height], 0));
}

let s = 1;
let h = 0;
function draw() {
  const translation = [(width+mouseX*2)/4, (height+mouseY*2)/4]
  translate(...translation)
  s *= mouseIsPressed ? (mouseButton === LEFT ? 12/11 : 11/12) : 1.001;
  scale(s);
  background(0);
  
  // Cull out-of-bounds triangles
  triangles = new Set([...triangles].filter(t=>!t.outOfBounds(
    [-translation[0]/s, -translation[1]/s, width*2/s, height*2/s]
  )));
  
  // Draw triangles
  triangles.forEach(t=>t.draw());
  newtriangles.forEach(t=>t.draw());
  
  // Generate new triangles
  if (newtriangles[0].length()*s > 100 && triangles.size < 100) {
    triangles = new Set([...triangles, ...newtriangles]);
    h+=25; h%=255;
    newtriangles = newtriangles.filter(t=>!t.outOfBounds(
      [-translation[0]/s, -translation[1]/s, width*2/s, height*2/s]
    )).flatMap(t=>t.nextTriangles(h));
  }
}

class Triangle {
  constructor(a, b, c, col) {
    this.p1 = a;
    this.p2 = b;
    this.p3 = c;
    this.hue = col;
  }
  
  draw() {
    noStroke();
    fill(this.hue, 255, 255);
    triangle(...this.p1, ...this.p2, ...this.p3);
  }
  
  length() {
    return Math.sqrt((this.p1[0]+this.p2[0])**2+(this.p1[1]+this.p2[1])**2);
  }
  
  outOfBounds([x, y, w, h]) {
    return [this.p1, this.p2, this.p3].every(p=>p[0]<x||p[0]>x+h||p[1]<y||p[1]>y+h);
  }
  
  nextTriangles(h) {
    const midpoints = [
      [(this.p1[0]+this.p2[0])/2, (this.p1[1]+this.p2[1])/2],
      [(this.p2[0]+this.p3[0])/2, (this.p2[1]+this.p3[1])/2],
      [(this.p3[0]+this.p1[0])/2, (this.p3[1]+this.p1[1])/2]
    ]
    return [
      new Triangle(this.p1, midpoints[0], midpoints[2], h),
      new Triangle(this.p2, midpoints[0], midpoints[1], h),
      new Triangle(this.p3, midpoints[1], midpoints[2], h)
    ]
  }
}