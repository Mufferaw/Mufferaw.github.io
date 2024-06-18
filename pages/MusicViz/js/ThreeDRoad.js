function ThreeDRoad()
{
  this.name = '3D Road';
  var pg = createGraphics(windowWidth, windowHeight, WEBGL);

  //define and load texture maps, async loading. The images can be async loaded here but the models could not (problem with WEBGL contexts) and had to be loaded in the sketch.js preload function. 
  var block_tex;
  loadImage('assets/blueblock.png', img => {
    block_tex = img;
  });

  var floor_tex;
  loadImage('assets/floor.png', img => {
    floor_tex = img;
  });

  var road_tex;
  loadImage('assets/road.png', img => {
    road_tex = img;
  });

  var city_BG;
  loadImage('assets/city_BG.png', img => {
    city_BG = img;
  });

  var city_BG_clouds;
  loadImage('assets/city_bg_cloud.png', img => {
    city_BG_clouds = img;
  });

  var cam = pg.createCamera();

  //scroll offset, used to scroll UVs on the 'road' object
  var scroller = 0;
  
  //arrays for model positions
  var floor_light_pos = [];
  var lamp_pos = [];

  var Amp = new p5.Amplitude();
  Amp.toggleNormalize(true);

  //populate model position arrays
  for (var i = 0; i < 10; i++) 
  {
    var p = createVector(0, 0, i * 100);
    floor_light_pos.push(p);
  }

  for (var i = 0; i < 16; i++) 
  {
    var p = createVector(0, 0, i * 200);
    lamp_pos.push(p);
  }

this.draw = function() 
{
  pg.reset();
  pg.angleMode(DEGREES);
  angleMode(DEGREES);

  //these had to be preloaded in sketch.js
  var lamp = d_lamp;
  var lamp_light = d_lamp_light;

  //Camera
  cam.lookAt(0, 0, 1);
  cam.setPosition(0, 10, 455);
  //change camera perspective and make the near clip plane 1 so it doesnt clip the road, far clip plane to 3000 so the 'city' is visible.
  pg.perspective(60, width/height, 1, 3000);

  fourier.analyze();
  var amp = Amp.getLevel();
  var energy = fourier.getEnergy("treble");

  pg.clear();
  pg.noStroke();

  //move everything relative to the camera to create a 'wobble' effect
  pg.translate(sin(frameCount) * 20, cos(frameCount) * 3.5, 0);

  /* Why haven't I separated these different drawing sections into functions? They are only called once and I think adding comments to the beginning of each section is easier to reason about than something like:
  drawBG();
  drawLamps();
  drawWhatever();
  ...
  which would make following the program flow more difficult. I use VS Code (on vertically mounted screen) to edit these files and using the mini-map and the 'code folding' feature make it very pleasant to navigate.
  */

  //draw city background layers
  pg.push();
  pg.scale(6, 6, 1);
  pg.translate(500, 250, -2000);
  pg.image(city_BG, -city_BG.width, -city_BG.height,city_BG.width, city_BG.height);
  pg.translate(0, 0, 1);
  pg.tint(255, energy);
  pg.image(city_BG_clouds, -city_BG.width, -city_BG.height,city_BG.width, city_BG.height);
  pg.pop();

  //add some noisy offset relative to the camera to make the road 'shake'
  noiseDetail(2, 0.2);
  pg.translate(0, noise(frameCount) * 0.8, 0);

  //lighting
  pg.ambientLight(2);
  pg.lightFalloff(0.9 / energy, 0.015, 0);
  pg.pointLight(0, 255, 255, 0, 0, 350);

  //Have textures map to UV in 0-1 range and repeat in U and V
  pg.angleMode(DEGREES);
  pg.textureMode(NORMAL);
  pg.textureWrap(REPEAT, REPEAT);
  pg.texture(block_tex);

  //draw street lamp models
  for (v in lamp_pos) 
  {
    pg.push();
      pg.fill(108, 108, 108);
      pg.translate(100, 40, -1600);
      pg.translate(lamp_pos[v]);
      pg.model(lamp);
      pg.push();
        pg.emissiveMaterial(255 * energy, 187 * energy, energy);
        pg.model(lamp_light);
      pg.pop();
      pg.scale(-1, 1, 1);
      pg.translate(200, 0, 0);
      pg.model(lamp);
      pg.push();
        pg.emissiveMaterial(255 * energy, 187 * energy, energy);
        pg.model(lamp_light);
      pg.pop();
    pg.pop();

    //if the lamps get too close to the camera send them to the back
    lamp_pos[v].z += 8.5 * amp * 5;
    if (lamp_pos[v].z > 2000) 
    {
      lamp_pos[v].z -= 2000;
    }
  }

  //draw decorations along the 'sidewalk'
  pg.push();
  for (v in floor_light_pos) 
  {
    pg.push();
      pg.translate(floor_light_pos[v]);
      pg.push();
        pg.translate(-60, 44, -362.50);
        pg.rotateX(90);
        pg.rectMode(CENTER);
        pg.emissiveMaterial(15 + amp * 255, 00, 100 + amp * 255);
        pg.rect(0, 0, 20, 8, 20);
        pg.rect(120, 0, 20, 8, 20);
      pg.pop();
    pg.pop();

    //if the decorations get too close to the camera send them to the back
    floor_light_pos[v].z += 8.5 * amp * 10;
    if (floor_light_pos[v].z >= 750) 
    {
      floor_light_pos[v].z -= 900;
    }
  }
 pg.pop();

  //draw road
  pg.translate(-50, 50, -1600);
  pg.texture(road_tex);
  
  //middle section of road
  pg.beginShape();
    pg.vertex(0, 0, 0, 0, scroller);
    pg.vertex(100, 0, 0, 1, scroller);
    pg.vertex(100, 0, 2000, 1, scroller + 75);
    pg.vertex(0, 0, 2000, 0, scroller + 75);
  pg.endShape(CLOSE);
  
  //curb, sidewalk and barrier
  //draw one side, mirror/flip and draw again to create both sides
  pg.push()
  for (i = 0; i < 2; i++) 
  {  
    //curb
    pg.texture(floor_tex);
    pg.beginShape();
      pg.vertex(0, 0, 0, 0, scroller);
      pg.vertex(0, -5, 0, 1, scroller);
      pg.vertex(0, -5, 2000, 1, scroller + 75);
      pg.vertex(0, 0, 2000, 0, scroller + 75);
    pg.endShape(CLOSE);
    //sidewalk
    pg.push();
    pg.texture(floor_tex);
    pg.beginShape();
      pg.vertex(0, -5, 0, 0, scroller);
      pg.vertex(-25, -5, 0, 1, scroller);
      pg.vertex(-25, -5, 2000, 1, scroller + 75);
      pg.vertex(0, -5, 2000, 0, scroller + 75);
    pg.endShape(CLOSE);
    pg.pop();
    //barrier
    pg.texture(floor_tex);
    pg.beginShape();
      pg.vertex(-25, -5, 0, 0, scroller);
      pg.vertex(-25, -20, 0, 1, scroller);
      pg.vertex(-25, -20, 2000, 1, scroller + 75);
      pg.vertex(-25, -5, 2000, 0, scroller + 75);
    pg.endShape(CLOSE);
    //barrier ledge
    pg.beginShape();
      pg.vertex(-25, -20, 0, 0, scroller);
      pg.vertex(-30, -20, 0, 1, scroller);
      pg.vertex(-30, -20, 2000, 1, scroller + 75);
      pg.vertex(-25, -20, 2000, 0, scroller + 75);
    pg.endShape(CLOSE);
    //move to the other side, flip and draw again
    pg.translate(100, 0, 0);
    pg.scale(-1, 1, 1);
  }
  pg.pop();

  //increment scroll offset
  scroller -= energy * 0.005;
  //draw offsecreen buffer to canvas
  image(pg, 0,0, width, height);
  }
}