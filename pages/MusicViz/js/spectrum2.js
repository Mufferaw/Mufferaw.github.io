function spectrum2()
{
    this.name = "Spectrogram";
    var surface2= createGraphics(1024,1024); //fixed size otherwise things don't work when resizing this window.
    surface2.noStroke();
    surface2.colorMode(HSB);

    var peakDetect = new p5.PeakDetect();

    //Need to use an object so there is a reference for the gui, primatives (such as numbers) cannot be passsed by reference (as I understand). this.gui will be added to the GUI object in sketch.js.
    var color_shift = {val: 0}; 
    this.gui = [];
    this.gui.push(function() {
        gui.slider(91001, gui.x + gui.w + 5, gui.y + 100, 360, color_shift, '    Color Shift') ;
      });
 
    this.draw = function()
    {
       push();
        var spectrum = fourier.analyze();
        peakDetect.update(fourier);
    
        //Draw the previously collected bands, shifted 1 pixel to the left.
        surface2.image(surface2,-1,0, surface2.width, surface2.height);
       
        var b = peakDetect.energy;

        //draw the new band into the offscreen buffer
        surface2.colorMode(HSB);
        for (let i = 0; i < 1024; i++) 
        {
            var stretch = map(i, 0, 1024, 0, surface2.height);

            surface2.fill((spectrum[stretch]+ color_shift.val)%360, 
                        spectrum[stretch],
                        spectrum[stretch]-(50*b)/((i/surface2.height)*3), 
                        1);
            surface2.ellipse(surface2.width-1, surface2.height - stretch, 1, 1);
        }
        //draw buffer onto the screen
        //OCD: height + 1 because of a one pixel white line along the bottom while idle, I assume it's caused when surface2 is stretched?
        image(surface2, 0, 0, width, height+1);
     pop();
    };
}