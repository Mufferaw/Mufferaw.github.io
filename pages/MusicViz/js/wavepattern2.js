function wavepattern2()
{
    this.name = "Wave Pattern WEBGL";
    var pg =  createGraphics(1024, 512,WEBGL);
    var pg2 = createGraphics(1024, 512, WEBGL);
    var colorSpread = 0; //color offset variable
    //Spectrum1_colShader is preloaded in sketch.js
    var wave;
    
    var peakDetect = new p5.PeakDetect();
    
    pg.clear();
    pg2.clear();

    pg2.noStroke();
    pg.smooth();

    this.draw = function()
    {
        //Push and pop around everything in draw so the UI will draw properly
        push();
        translate(width/2, height/2);
        clear();

        //prepare data from FFD object
        fourier.analyze();
        wave = fourier.waveform();
        peakDetect.update(fourier);

        //set shader and send variables to the shader
        pg2.shader(Spectrum1_colShader);
        Spectrum1_colShader.setUniform("Tex", pg);//this is the buffer we have drawn our waveforms onto
        Spectrum1_colShader.setUniform("peak", peakDetect.currentValue);
        Spectrum1_colShader.setUniform("iResolution", [pg.width, pg.height]);
        Spectrum1_colShader.setUniform("iTime", millis() / 600);

        //draw a fullscreen rectangle on the pg2 buffer shaded by our shader (distorted waves)
        pg2.rect(0,0, pg2.width,pg2.height);
        pg.noStroke();
        //...and use that as a texture for a fullscreen rectangle on the pg buffer.
        pg.texture(pg2);
        pg.clear();
        pg.rect(-pg.width/2, -pg.height/2, pg.width, pg.height);


      //on the pg buffer we will draw the current wave pattern
        pg.noStroke();
        pg.colorMode(HSB);
        pg.fill(0,0,0,1);

        colorSpread = (colorSpread+23)%360;
        pg.stroke(colorSpread,(colorSpread+45)%100, 50, 1);

        pg.noFill();
        pg.beginShape();
        pg.push();
        pg.translate(-pg.width/2, -pg.height/2);
        pg.strokeWeight(1);
        for(var i= 0; i< wave.length; i++)
        {
            var x = map(i, 0, wave.length, 0, pg.width);
            var y = map(wave[i], -1, 1, pg.height/4, pg.height-pg.height/4);
            pg.vertex(x, y);
        }
        pg.endShape();
        pg.pop();

        //now draw the pg buffer to the screen
        translate(-width/2, -height/2);
        image(pg,0,0, width, height);
        
        //Push and pop around everything in draw so the UI will draw properly
        pop();
    };
}