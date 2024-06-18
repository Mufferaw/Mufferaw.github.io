function Spectrum()
{
	this.name = "Spectrum - Original";

	this.draw = function()
	{
		push();
		var spectrum = fourier.analyze();
		noStroke();
		
		fill(0,255,0)
		for (var i = 0; i< spectrum.length; i++)
		{
			var x = map(i, 0, spectrum.length, 0, width);
		    //var h = -height + map(spectrum[i], 0, 255, height, 0);
		    var h = -width + map(spectrum[i], 0, 255, width, 0);

			var a = map(spectrum[i], 0, 255, 0, width);
			var g = map(spectrum[i], 0, 255, 255, 0);			

			fill(spectrum[i], 255-spectrum[i], 0);
		    //rect(0, (height/spectrum.length) + i,a,height/spectrum.length );
		    rect(0, (height/spectrum.length) * i,a,height/spectrum.length );


  		}
	
		pop();
	};
}
