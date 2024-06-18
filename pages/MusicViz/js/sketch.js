//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;
//gui, replaces 'controlsandInput'
var gui;

//WEBGL shaders must be preloaded or there will be trouble with WEBGL contexts.
var Spectrum1_colShader;

//Same goes for .obj models
var d_lamp;
var d_lamp_light;

function preload() 
{
	sound = loadSound('assets/wick.m4a'); 
	// Music used: 
	//'Think' by 'Kaleida' from the album 'Think'
	//'LED Spirals (Extended Version)' by 'Le Castle Vania'
	//'Shots Fired' by 'Le Castle Vania'

	//Shaders and .objs must be preloaded here or there will be trouble with WEBGL contexts.
	Spectrum1_colShader = loadShader('assets/shaders/render.vert', 'assets/shaders/colors.frag');

	d_lamp = loadModel('assets/lamp.obj');
	d_lamp_light = loadModel('assets/light.obj');
}

function setup() 
{
	createCanvas(windowWidth, windowHeight);
	background(0);

	//instantiate the fft object
	fourier = new p5.FFT();

	//create a new visualisation container and add visualisations
	vis = new Visualisations();
	vis.add(new spectrum2());
	vis.add(new capsules());
	vis.add(new wavepattern2());
	vis.add(new RTT());
	vis.add(new ThreeDRoad());
	vis.add(new wave3d());
	vis.add(new wavesketch());
	vis.add(new Spectrum());
	vis.add(new WavePattern());
	vis.add(new Needles());

	//create gui object
	gui = new GUI(100, 100, 300, 490);

	//WARNING: use 'let i' in this loop, see https://stackoverflow.com/questions/46027262/functions-declared-within-loops-referencing-an-outer-scoped-variable-may-lead-to
	//Add GUI buttons for the different visuals
	for(let i = 0; i <  vis.visuals.length; i++)
	{
		gui.widgets.push(function() {
			
			if(gui.button(102+i, gui.x+24, 40+gui.y+(i*40),250, 30, vis.visuals[i].name))
			  {
				vis.selectVisual(vis.visuals[i].name)  
			  }
			
		  });

		  //add visualization specific widgets
		  if(vis.visuals[i].hasOwnProperty('gui')) 
		  {
			gui.viswidgets.push(vis.visuals[i].gui);
		  }
		  else
		  {
			gui.viswidgets.push(null)
		  }
	}
	//Add play/pause button
	gui.widgets.push(function() {

		if(gui.playpauseButton(301, gui.x + gui.w/2 - 10, gui.y + gui.h - 45 , 20, 30, sound.isPlaying())) 
		{
			if(sound.isPlaying())
			{
				sound.pause();
			}
			else
			sound.play();
		}
	});
}

function draw() 
{
	background(0);
	//draw the selected visualisation
	vis.selectedVisual.draw();

	//Draw GUI
	gui.selectedVisual = vis.selectedArrayLocation;
	if(gui.isVisible)
	{
		push();
		gui.draw(mouseX, mouseY);
		pop();
	}
}

function mouseClicked() 
{
}

function mousePressed() 
{
	gui.pressed(mouseX, mouseY);
}
  
function mouseReleased() 
{
	gui.notPressed();
}

function doubleClicked()
{
	//don't register the fullscreen double-click if we are over a widget
	if(gui.uistate.hotitem==0) 
	{
		//double-click to toggle fullscreen instead of single-click
		let fs = fullscreen();
		fullscreen(!fs);
	}
}

function keyPressed() 
{
	//toggle GUI visibility, 'm' or 'space'
	if(keyCode === 77 || keyCode === 32)
	{
		var toggle = gui.isVisible;
		gui.isVisible= !toggle;
	}
	//number keys select visuals too
	if(keyCode > 48 && keyCode < 58)
	{
		var visNumber = keyCode - 49;
		vis.selectVisual(vis.visuals[visNumber].name); 
	}

	if(keyCode === 48)
	vis.selectVisual(vis.visuals[9].name); 

}

//when the window has been resized. Resize canvas to fit 
//if the visualisation needs to be resized call its onResize method
function windowResized() 
{
	resizeCanvas(windowWidth, windowHeight);
	//Let's go ahead and resize all the visualizations.
	for(var i = 0; i < vis.visuals.length; i++)
	{
		if (vis.visuals[i].hasOwnProperty('onResize')) 
		{
			vis.visuals[i].onResize();
		}
	}
}
