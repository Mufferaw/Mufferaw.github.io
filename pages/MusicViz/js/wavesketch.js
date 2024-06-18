function wavesketch()
{
  this.name = "Wave Pattern Extension";
  var pg = createGraphics(windowWidth, windowHeight);
  var peakDetect = new p5.PeakDetect();
  var colorSpread= random(0, 360);
  var history = [];


this.draw = function() 
{
  push();
  let spectrum = fourier.analyze();
  //fourier.smooth();

  let wave = fourier.waveform();
  peakDetect.update(fourier);

  //draw a semi-transparent full screen rectangle to fade the offscreen buffer without clearing it completely.
  pg.colorMode(RGB);
  pg.fill(220, 100);
  pg.noStroke();
  pg.rect(0, 0, width, height);
 
  //Draw the previous waveforms
  RenderPreviousWaves();
 
  //Set colors and strokeweight for foreground waveform
  pg.colorMode(HSB);
  pg.stroke(random(colorSpread, colorSpread + 45) % 360, 100, 100, 10 * peakDetect.currentValue);
  pg.strokeWeight(15 * peakDetect.currentValue);
  pg.noFill();

  //Draw the foreground waveform and possibly add it to the array of prevoius waveforms
  pg.beginShape();
  var h = [];  //array for current waveform
 
  for (var i = 0; i < wave.length; i++)
  {
    //for each element of the waveform map it to screen 
    //coordinates and make a new vertex at the point.
    var x = map(i, 0, wave.length, 0, width);
    var y = map(wave[i], -1, 1, height/4, height - (height/4));

    pg.vertex(x, y);

    h.push(createVector(x, y));//add vertex positions for this wave
  }

  //only add the waveform to history if it has lots of detail
  if(peakDetect.currentValue > 0.2)
  {
    history.push(h);
  }

  //Limit the length of previous waveforms array  
  if(history.length > 5)
  {
    history.splice(0, 1);
  }

  //End of foreground wave drawing
  pg.endShape();


  //Shift color for next draw
  if(peakDetect.currentValue > 0.2)
  {
   colorSpread += 45;
   colorSpread = colorSpread % 360;
  }

  //Draw the offscreen buffer to the screen with image()
  image(pg, 0, 0, width, height);
  pop();
}

RenderPreviousWaves = function()
{
  pg.push();
  pg.noFill();
  pg.colorMode(HSB);
  pg.stroke(colorSpread % 360, 100, 50);
  
  for(var i = 0; i < history.length; i++)
  {
    pg.strokeWeight(0.25 * i);
    pg.beginShape();
   
    for (let j = 0; j < 1024; j++) 
    {
      //draw the previous waveform verticies but distort them to make them look interesting
      pg.vertex(history[i][j].x,(25 * i * peakDetect.currentValue) + history[i][j].y - i * (sin(i * j)));
    }
    pg.endShape();
  }
  pg.pop();

};

this.onResize = function() 
{
     var newPG = createGraphics(windowWidth, windowHeight);
     newPG.image(pg, 0, 0, newPG.width, newPG.height);
     pg = newPG;
     newPG.remove();
};
}
