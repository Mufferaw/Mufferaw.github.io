function capsules()
{
    this.name = "Spectrum Extension";
    //base height of capsules
    var y = 700; 

    //thickness of the capsules, 8, 16, 32, 64, 128, 256 also look right, we will control this with the GUI
    var radius = 128; 

    //draw onto this surface and then mirror it vertically and horizontally to make the final image.
    var surface = createGraphics(2048,1024);
    surface.background(80);

    //much of the spectrum array is blank, lets just ignore that part, we will control this with GUI slider
    var spectrum_selection = {val: 68}; 

    //Make adjustable settings for this visualization available to the GUI in sketch.js
    this.gui = [];
    this.gui.push(function() {
      if(gui.button(1000, gui.x +gui.w+35, gui.y+ 125, 150, 30, 'Change Capsule Size') )
      {
        radius = radius * 2;
        if(radius > 512)
        radius = 16;
      }
    });

    this.gui.push(function() {
      gui.slider(1001, gui.x +gui.w+5, gui.y+ 200, 80, spectrum_selection, 'Spectrum Cutoff') ;
    });

    function draw_capsule(input, offset)
    {
      var pos = input;
      var off = offset*-2.5;  //this adjusts the capsules vertically
      surface.noStroke();
      surface.colorMode(HSB);
      surface.push();

      //The saturation of the colors will be based on the spectrum value (offset) 
      var ramp = map(offset, 0, 255, 0, 100);

      for(var i =0; i< radius; i=i +4)
        {     
          //Colored capsule
          surface.fill( ((360)/(surface.width/pos)),ramp,100/(radius/i),0.1);
          surface.rect(pos -(i/2), -1, pos +(i/2), y+off); 
          surface.arc(pos, y+off, i, i, TWO_PI, PI, OPEN);    
          
          // Draw gray rectangle 
          surface.fill(220,40,100-90/(radius/i),0.1);
          surface.rect(pos -(i/2),surface.height +1, pos +(i/2), y+radius+off); 
          surface.arc(pos, y+radius+off, i, i, PI, TWO_PI, OPEN);
        }
        surface.pop();
    };


    this.draw = function()
    {
      push(); //Wrap the draw function in push-pop to avoid trouble
      fourier.smooth(0.85);
      var spectrum = fourier.analyze();
      surface.background(0,0,0,0.1);
      surface.rectMode(CORNERS);
      surface.fill(0,255,0,10);

      //Map the spectrum values to the capsules and draw them
      for(var i = radius/2; i< surface.width; i=i+radius)
      {
        var ii = floor(map(i, radius/2, surface.width-radius, 0, spectrum.length * (spectrum_selection.val * 0.01) ));
        draw_capsule(i, spectrum[ii]);
      }
      
      //Draw four copies of the offscreen buffer, one in each quadrant of the screen
      image(surface,0,height/2,width/2,height/2);
      push();
      scale(1.0,-1.0);
      image(surface,0,0,width/2,-height/2);
      scale(-1.0,1);
      image(surface,-width/2,-height/2,-width/2,height/2)
      pop();
      scale(-1.0,1);
      image(surface,-width/2,height/2,-width/2,height/2);

      pop();  //Wrap the draw function in push pop to avoid trouble
    }
}