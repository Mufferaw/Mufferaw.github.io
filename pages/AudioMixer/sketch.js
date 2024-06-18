var player;
var lowPass;
var waveShaper;
var dynamicCompressor;
var reverb;
var masterVolume;
var mic;

var fftIN;
var fftOUT;

var chain = [];

var lowPassGui;
var delayGui;
var dynamicCompressorGui;
var waveShaperGui;
var reverbGui;
var masterVolumeGui;
var playbackGui;
var spectrumInGui;
var spectrumOutGui;
var inputGui;
var soundRecorder;
var soundFile;


var img;

var lowPassFreq_val = {val:0};
var lowPassRes_val = {val:0};
var lowPassGain_val = {val:100};
var lowPassWet_val = {val:100};
var lowPassType_val = {val:0};

var waveShaperDistortion_val = {val:0};
var waveShaperOversample_val = {val:0};
var waveShaperGain_val = {val:100};
var waveShaperWet_val = {val:100};

var dynamicCompressorAttack_val = {val:0};
var dynamicCompressorKnee_val = {val:0};
var dynamicCompressorRelease_val = {val:0};
var dynamicCompressorRatio_val = {val:1};
var dynamicCompressorThreshold_val = {val:0};
var dynamicCompressorWet_val = {val:100};
var dynamicCompressorGain_val = {val:100};

var reverbSeconds_val = {val:0};
var reverbDecay_val = {val:0};
var reverbReverse_val = {val: false};
var reverbWet_val = {val:100};
var reverbGain_val = {val:100};

var delayTime_val = {val:0};
var delayFeedback_val = {val:0};
var delayType_val = {val: false};
var delayWet_val = {val:100};
var delayGain_val = {val:100};

var masterVolumeGain_val = {val:100};
var soundRecorderRecording_val = {val:false};

var micSelected = false;



function preload() 
{
  img = loadImage('assets/metalbackground1.png');
  // player = loadSound('assets/audio/ATaleofTwoCities.mp3');
  // player = loadSound('assets/audio/noise.mp3');
  // player = loadSound('assets/audio/sine220.mp3');
  player = loadSound('assets/Audio/kipling.wav');
}


function setup() 
{
  // put setup code here
	createCanvas(1920, 1080);
  background(255);

  // Get the file input element from the html page
  const fileInput = select('#INPUT').elt;

  // Callback after we choose a new file from the file open dialogue
  fileInput.addEventListener("change", (event) => 
  {
    const selectedFile = event.target.files[0];
    console.log("Selected file:", 'assets/Audio/' + selectedFile.name);
    player.stop();
    player.disconnect();
    player = loadSound('assets/Audio/' + selectedFile.name);
    player.disconnect();
    player.connect(p5.soundOut);
    chain[0] = {id: 'player', effect: player, enabled: true, next: 'lowPass'},
    // player.play();
    fftIN.setInput(player);
    updateChain();
  });
  
  lowPass = new p5.LowPass();
  waveShaper = new p5.Distortion();
  reverb = new p5.Reverb();
  dynamicCompressor = new p5.Compressor();
  delay = new p5.Delay();
  fftIN = new p5.FFT();
  fftOUT = new p5.FFT();
  masterVolume = new p5.Gain();
  soundRecorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();
  mic = new p5.AudioIn();
  mic.start();

  player.disconnect();
  lowPass.disconnect();
  waveShaper.disconnect();
  reverb.disconnect();
  delay.disconnect();
  dynamicCompressor.disconnect();

  player.connect(p5.soundOut);
  player.loop();

  lowPassGui =            new GUI( 20,  75, 330, 540, 'Low-Pass Filter');
  delayGui =              new GUI(775, 50, 330, 520, 'Delay');
  dynamicCompressorGui =  new GUI(1170,  45, 330, 640, 'Dynamic Compressor');
  waveShaperGui =         new GUI( 385, 40, 330, 500, 'WaveShaper');
  reverbGui =             new GUI(1555,  45, 330, 520, 'Reverb');
  masterVolumeGui =       new GUI(1655,  690, 190, 265, 'Master Volume');
  playbackGui =           new GUI( 1370, 910, 260, 120, 'Playback Controls');
  spectrumInGui =         new GUI(570, 595, 450, 200, 'Spectrum IN');
  spectrumOutGui =        new GUI(570, 805, 450, 200, 'Spectrum OUT');
  inputGui =              new GUI(1100, 805, 200, 200, 'Input');

  chain = [
    {id: 'player',            effect: player,             enabled: true,    next: 'lowPass'},
    {id: 'lowPass',           effect: lowPass,            enabled: false,   next: 'waveShaper'},
    {id: 'waveShaper',        effect: waveShaper,         enabled: false,   next: 'delay'},
    {id: 'delay',             effect: delay,              enabled: false,   next: 'dynamicCompressor'},
    {id: 'dynamicCompressor', effect: dynamicCompressor,  enabled: false,   next: 'reverb'},
    {id: 'reverb',            effect: reverb,             enabled: false,   next: 'masterVolume'},
    {id: 'masterVolume',      effect: masterVolume,       enabled: true,    next: null},
  ];


  fftIN.setInput(player);
  fftOUT.setInput(lowPass);
  updateChain();

  lowPassGui.widgets.push(
    function() {
      if(lowPassGui.powerButton(15, lowPassGui.x+14, 40+lowPassGui.y, 85, 30))
      {
        if(lowPassGui.isPowerOn == true)
        {
          // Disabled
          lowPassGui.isPowerOn  = false;
          setChainNode('lowPass', false);
        }
        else
        {
          // Enabled
          lowPassGui.isPowerOn  = true;
          setChainNode('lowPass', true);
        }
        
      }
    },
    function() 
    {
      if(lowPassGui.knob(19, lowPassGui.x+40, 180+lowPassGui.y, 100, lowPassRes_val, "Resonance",0.001 * Math.pow(10, lowPassRes_val.val * Math.log10(1000000) / 100)))
        {
         lowPass.res(0.001 * Math.pow(10, lowPassRes_val.val * Math.log10(1000000) / 100));
        }
    },
    function() 
    {
      if(lowPassGui.knob(11, lowPassGui.x+200, 180+lowPassGui.y, 100, lowPassFreq_val, "Cut-off\n Frequency", 10 * Math.pow(10, lowPassFreq_val.val * Math.log10(2205) / 100)))
        {
          lowPass.freq(10 * Math.pow(10, lowPassFreq_val.val * Math.log10(2205) / 100));
        }
    },
    function() 
    {
      if(lowPassGui.slider(25, lowPassGui.x + 72, 325+lowPassGui.y, 100, lowPassWet_val, "Dry/Wet"))
      {
        lowPass.drywet(lowPassWet_val.val*0.01);
      }
    },
    function() 
    {
      if(lowPassGui.slider(35, lowPassGui.x+230, 325+lowPassGui.y, 100, lowPassGain_val, "Output\nLevel"))
      {
        lowPass.amp(lowPassGain_val.val *0.01);
      }
    },
    function() 
    {
      if(lowPassGui.knob(111, lowPassGui.x+200, 35+lowPassGui.y, 100, lowPassType_val, "Type"))
        {
          if(lowPassType_val.val <= 33.3)
          {
            lowPassType_val.val = 0;
            lowPass.setType('lowpass');
          }
          else if (lowPassType_val.val > 33.3 && lowPassType_val.val <= 66.6)
          {
            lowPassType_val.val = 43;
            lowPass.setType('highpass');
          }
          else
          {
            lowPassType_val.val = 100;
            lowPass.setType('bandpass');
          }
        }

        lowPassGui.label(45, lowPassGui.x + 200, lowPassGui.y + 130, 12, 'LowPass');
        lowPassGui.label(46, lowPassGui.x + 290, lowPassGui.y + 130, 12, 'BandPass');
        lowPassGui.label(46, lowPassGui.x + 290, lowPassGui.y + 40, 12, 'HighPass');
        lowPassGui.label(45, lowPassGui.x + 85, lowPassGui.y + 60, 14, 'On/Off');

    }

    );

  //// Wave Shaper ////
  waveShaperGui.widgets.push(
    function() {
      if(waveShaperGui.powerButton(15, waveShaperGui.x+14, 40+waveShaperGui.y, 85, 30))
      {
        if(waveShaperGui.isPowerOn == true)
        {
          // Disabled
          waveShaperGui.isPowerOn  = false;
          setChainNode('waveShaper', false);
        }
        else
        {
          // Enabled
          waveShaperGui.isPowerOn  = true;
          setChainNode('waveShaper', true);
        }
      }
    },
    function() 
    {
      if(waveShaperGui.knob(19, waveShaperGui.x+40, 140+waveShaperGui.y, 100, waveShaperDistortion_val, "Distortion\nAmount"))
        {
          if(waveShaperOversample_val.val <= 33.3)
          {
            waveShaper.set(waveShaperDistortion_val.val*0.01, 'none' );
          }
          else if (waveShaperOversample_val.val > 33.3 && waveShaperOversample_val.val <= 66.6)
          {
            waveShaper.set(waveShaperDistortion_val.val*0.01, '2x' );
          }
          else
          {
            waveShaper.set(waveShaperDistortion_val.val*0.01, '4x' );
          }
        }
    },
    function() 
    {
      if(waveShaperGui.knob(11, waveShaperGui.x+200, 140+waveShaperGui.y, 100, waveShaperOversample_val, "Oversample"))
        {
          if(waveShaperOversample_val.val <= 33.3)
          {
            waveShaperOversample_val.val = 0;
            waveShaper.set(waveShaperDistortion_val.val*0.01, 'none' );
          }
          else if (waveShaperOversample_val.val > 33.3 && waveShaperOversample_val.val <= 66.6)
          {
            waveShaperOversample_val.val = 43;
            waveShaper.set(waveShaperDistortion_val.val*0.01, '2x' );
          }
          else
          {
            waveShaperOversample_val.val = 100;
            waveShaper.set(waveShaperDistortion_val.val*0.01, '4x' );
          }
        }

        waveShaperGui.label(45, waveShaperGui.x + 200, waveShaperGui.y + 230, 12, 'NONE');
        waveShaperGui.label(46, waveShaperGui.x + 275, waveShaperGui.y + 230, 12, '4X');
        waveShaperGui.label(46, waveShaperGui.x + 210, waveShaperGui.y + 150, 12, '2X');
        waveShaperGui.label(45, waveShaperGui.x + 85, waveShaperGui.y + 60, 14, 'On/Off');

    },
    function() 
    {
      if(waveShaperGui.slider(25, waveShaperGui.x + 72, 275+waveShaperGui.y, 100, waveShaperWet_val, "Dry/Wet"))
      {
        waveShaper.drywet(waveShaperWet_val.val*0.01);
      }
    },
    function() 
    {
      if(waveShaperGui.slider(35, waveShaperGui.x+230, 275+waveShaperGui.y, 100, waveShaperGain_val, "Output\nLevel"))
      {
        waveShaper.amp(waveShaperGain_val.val *0.01);
      }
    }
  );

  
  //// Dynamic Compressor ////
  dynamicCompressorGui.widgets.push(function() {
    if(dynamicCompressorGui.powerButton(10, dynamicCompressorGui.x+14, 40+dynamicCompressorGui.y, 85, 30))
    {
      if(dynamicCompressorGui.isPowerOn == true)
      {
        dynamicCompressorGui.isPowerOn = false;
        setChainNode('dynamicCompressor', false);
      }
      else
      {
        dynamicCompressorGui.isPowerOn = true;
        setChainNode('dynamicCompressor', true);
      }

    }
  });

  dynamicCompressorGui.widgets.push(
    function() 
    {
      if(dynamicCompressorGui.slider(25, dynamicCompressorGui.x+100, 425+dynamicCompressorGui.y, 100, dynamicCompressorWet_val, "Dry/Wet"))
      {
        dynamicCompressor.drywet(dynamicCompressorWet_val.val*0.01);
      }
    },
    function() 
    {
      if(dynamicCompressorGui.slider(35, dynamicCompressorGui.x+200, 425+dynamicCompressorGui.y, 100, dynamicCompressorGain_val, "Output\nLevel"))
      {
        dynamicCompressor.amp(dynamicCompressorGain_val.val*0.01);
      }
    },
    function() 
    {
      if(dynamicCompressorGui.knob(11, dynamicCompressorGui.x+20, 140+dynamicCompressorGui.y, 100, dynamicCompressorAttack_val, "Attack"))
      {
        dynamicCompressor.attack(dynamicCompressorAttack_val.val *0.01);
      }
    },
    function() 
    {
      if(dynamicCompressorGui.knob(12, dynamicCompressorGui.x+120, 140+dynamicCompressorGui.y, 40, dynamicCompressorKnee_val, "Knee"))
      {
        dynamicCompressor.knee(dynamicCompressorKnee_val.val)
      }
    },
    function() 
    {
      if(dynamicCompressorGui.knob(13, dynamicCompressorGui.x+220, 140+dynamicCompressorGui.y, 100, dynamicCompressorRelease_val, "Release"))
      {
        dynamicCompressor.release(dynamicCompressorRelease_val.val *0.01);
      }
    },
    function() 
    {
      if(dynamicCompressorGui.knob(14, dynamicCompressorGui.x+70, 275+dynamicCompressorGui.y, 20, dynamicCompressorRatio_val, "Ratio"))
      {
        dynamicCompressor.ratio(max(1, dynamicCompressorRatio_val.val));
      }
    },
    function() 
    {
      if(dynamicCompressorGui.knob(15, dynamicCompressorGui.x+170, 275+dynamicCompressorGui.y, 100, dynamicCompressorThreshold_val, "Threshold"))
      {
        dynamicCompressor.threshold(-dynamicCompressorThreshold_val.val);
      }
    },
    function()
    {
      dynamicCompressorGui.label(45, dynamicCompressorGui.x + 85, dynamicCompressorGui.y + 60, 14, 'On/Off');
    }

  );

  //// Reverb ////
  reverbGui.widgets.push(
    function() {
      if(reverbGui.powerButton(15, reverbGui.x+14, 40+reverbGui.y, 85, 30))
      {
        if(reverbGui.isPowerOn == true)
        {
          // Disabled
          reverbGui.isPowerOn  = false;
          setChainNode('reverb', false);
        }
        else
        {
          // Enabled
          reverbGui.isPowerOn  = true;
          setChainNode('reverb', true);
        }
      }
    },
    function() 
    {
      if(reverbGui.knob(19, reverbGui.x+40, 170+reverbGui.y, 100, reverbSeconds_val, "Seconds"))
        {
          reverb.set(reverbSeconds_val.val*0.1, reverbDecay_val.val, reverbReverse_val.val);
        }
    },
    function() 
    {
      if(reverbGui.knob(11, reverbGui.x+200, 170+reverbGui.y, 100, reverbDecay_val, "Decay Rate"))
        {
          reverb.set(reverbSeconds_val.val*0.1, reverbDecay_val.val, reverbReverse_val.val);
        }
    },
    function() 
    {
      if(reverbGui.slider(25, reverbGui.x + 72, 315+reverbGui.y, 100, reverbWet_val, "Dry/Wet"))
      {
        reverb.drywet(reverbWet_val.val*0.01);
      }
    },
    function() 
    {
      if(reverbGui.slider(35, reverbGui.x+230, 315+reverbGui.y, 100, reverbGain_val, "Output\nLevel"))
      {
        reverb.amp(reverbGain_val.val *0.01);
      }
    },
    function()
    {
      if(reverbGui.sizeableButton(765, reverbGui.x+110, reverbGui.y + 90, 100, 30, reverbReverse_val.val, 14, 'Reverse'))
      {

        if(reverbReverse_val.val == true)
        {
          // reveb.set doesnt seem to actually change the revese value, we can DIY
          reverbReverse_val.val = false;
          reverb.set(reverbSeconds_val.val*0.1, reverbDecay_val.val, false);
          reverb._reverse = false;
          reverb._buildImpulse();

        }
        else
        {
          reverbReverse_val.val = true;
          reverb.set(reverbSeconds_val.val*0.1, reverbDecay_val.val, true);
          reverb._reverse = true;
          reverb._buildImpulse();
        }
      }
    },
    function()
    {
      reverbGui.label(45, reverbGui.x + 85, reverbGui.y + 60, 14, 'On/Off');
    }

    );

    //// Delay ////
    delayGui.widgets.push(
      function() {
        if(delayGui.powerButton(15, delayGui.x+14, 40+delayGui.y, 85, 30))
        {
          if(delayGui.isPowerOn == true)
          {
            // Disabled
            delayGui.isPowerOn  = false;
            setChainNode('delay', false);
          }
          else
          {
            // Enabled
            delayGui.isPowerOn  = true;
            setChainNode('delay', true);
          }
        }
      },
      function() 
      {
        if(delayGui.knob(19, delayGui.x+40, 170+delayGui.y, 100, delayTime_val, "Time"))
          {
            delay.delayTime(delayTime_val.val * 0.01);
          }
      },
      function() 
      {
        if(delayGui.knob(11, delayGui.x+200, 170+delayGui.y, 100, delayFeedback_val, "Feedback"))
          {
            delay.feedback(min(delayFeedback_val.val *0.01, 0.999));
          }
      },
      function() 
      {
        if(delayGui.slider(25, delayGui.x + 72, 315+delayGui.y, 100, delayWet_val, "Dry/Wet"))
        {
          delay.drywet(delayWet_val.val*0.01);
        }
      },
      function() 
      {
        if(delayGui.slider(35, delayGui.x+230, 315+delayGui.y, 100, delayGain_val, "Output\nLevel"))
        {
          delay.amp(delayGain_val.val *0.01);
        }
      },
      function()
      {
        if(delayGui.sizeableButton(765, delayGui.x+110, delayGui.y + 90, 100, 30, delayType_val.val, 14, 'PingPong'))
        {
  
          if(delayType_val.val == true)
          {
            delayType_val.val = false;
            delay.setType('default');
          }
          else
          {
            delayType_val.val = true;
            delay.setType('pingPong');
          }
        }
      },
      function()
      {
        delayGui.label(45, delayGui.x + 85, delayGui.y + 60, 14, 'On/Off');
      }
    );

    //// Master Volume ////
    masterVolumeGui.widgets.push(
      function()
      {
        masterVolumeGui.isPowerOn = true;
        if(masterVolumeGui.slider(693, masterVolumeGui.x+82, masterVolumeGui.y + 60, 100, masterVolumeGain_val))
        {
          masterVolume.amp(masterVolumeGain_val.val*0.01);
        }
      }
    );

  //// Playback Controls ////
  playbackGui.widgets.push(
    function()
    {
     // if(micSelected == false)
     playbackGui.isPowerOn = true;
        playbackGui.timer(910, playbackGui.x + 30, playbackGui.y +40, player.currentTime(), player.duration(), micSelected, soundRecorderRecording_val.val );
    },
    function() 
    {
      if(playbackGui.button(901, playbackGui.x+10, 90+playbackGui.y, 'pause'))
      {
        player.pause();
      }
    },
    function() 
    {
      if(playbackGui.button(902, playbackGui.x+45, 90+playbackGui.y, 'play'))
      {
        if(player.isPlaying() == false)
        {
          player.play();
        }
      }
    },
    function() 
    {
      if(playbackGui.button(903, playbackGui.x+80, 90+playbackGui.y, 'stop'))
      {
        player.stop();
      }
    },
    function() 
    {
      if(playbackGui.button(904, playbackGui.x+115, 90+playbackGui.y, 'skipstart'))
      {
        player.jump(0);
      }
    },
    function() 
    {
      if(playbackGui.button(905, playbackGui.x+150, 90+playbackGui.y, 'skipend'))
      {
        player.jump(player.duration()-1);
      }
    },
    function() 
    {
      if(playbackGui.button(906, playbackGui.x+185, 90+playbackGui.y, 'loop', player.isLooping()))
      {
        if(player.isLooping() == true)
          player.setLoop(false)
        else
          player.setLoop(true);
      }
    },
    function() 
    {
      if(playbackGui.button(907, playbackGui.x+220, 90+playbackGui.y, 'record'))
      {
        if(soundRecorderRecording_val.val == false)
        {
          // start recording
          soundRecorderRecording_val.val = true;
          soundRecorder.record(soundFile);
        }
        else
        {
          //stop recording and save
          soundRecorderRecording_val.val = false;
          soundRecorder.stop();

          // Use a short timeout or else the buffer is not filled
          setTimeout(()=>save(soundFile, 'Output.wav'), 300 );
        }
      }
    }
  );

  spectrumInGui.widgets.push(
    function()
    {
      spectrumInGui.isPowerOn = true;
      spectrumInGui.spectrum(801, spectrumInGui.x+10, spectrumInGui.y + 15, 400, 140, fftIN.analyze() );
    }
  );

  spectrumOutGui.widgets.push(
    function()
    {
      spectrumOutGui.isPowerOn = true;
      spectrumOutGui.spectrum(881, spectrumOutGui.x+10, spectrumOutGui.y + 15, 400, 140, fftOUT.analyze() );
    }
  );

  inputGui.widgets.push(
    function()
    {
      inputGui.isPowerOn = true;
      textAlign(CENTER, BOTTOM);
      if(inputGui.sizeableButton(765, inputGui.x+10, inputGui.y + 90, 100, 30, false, 16, 'OpenFile'))
      {
        fileInput.click();
        chain[0] = {id: 'player', effect: player, enabled: true, next: 'lowPass'};
        mic.stop();
        mic.disconnect();
        updateChain();
        micSelected = false;
      }
    },
    function()
    {
      textAlign(CENTER, BOTTOM);
      if(inputGui.sizeableButton(775, inputGui.x+10, inputGui.y + 140, 100, 30, false, 16, 'Microphone'))
      {
        chain[0] = {id: 'mic', effect: mic, enabled: true, next: 'lowPass'};
        player.stop();
        player.disconnect();
        mic.start();
        fftIN.setInput(mic);
        updateChain();
        micSelected = true;
      }
    },

  );
}

function mousePressed() 
{
	lowPassGui.pressed(mouseX, mouseY);
	waveShaperGui.pressed(mouseX, mouseY);
	dynamicCompressorGui.pressed(mouseX, mouseY);
	delayGui.pressed(mouseX, mouseY);
	reverbGui.pressed(mouseX, mouseY);
	masterVolumeGui.pressed(mouseX, mouseY);
	playbackGui.pressed(mouseX, mouseY);
	spectrumInGui.pressed(mouseX, mouseY);
	spectrumOutGui.pressed(mouseX, mouseY);
	inputGui.pressed(mouseX, mouseY);
}
  
function mouseReleased() 
{
	lowPassGui.notPressed();
	waveShaperGui.notPressed();
	dynamicCompressorGui.notPressed();
	delayGui.notPressed();
	reverbGui.notPressed();
	masterVolumeGui.notPressed();
  playbackGui.notPressed();
  spectrumInGui.notPressed();
  spectrumOutGui.notPressed();
  inputGui.notPressed();
}

function draw() 
{
  // put drawing code here
  background(40);
  cursor(ARROW);


  lowPassGui.draw(mouseX, mouseY);
	waveShaperGui.draw(mouseX, mouseY);
  dynamicCompressorGui.draw(mouseX, mouseY);
  delayGui.draw(mouseX, mouseY);
	reverbGui.draw(mouseX, mouseY);
  masterVolumeGui.draw(mouseX, mouseY);
  playbackGui.draw(mouseX, mouseY);
  spectrumInGui.draw(mouseX, mouseY);
  spectrumOutGui.draw(mouseX, mouseY);
  inputGui.draw(mouseX, mouseY);
}

function setChainNode(targetNodeId, isEnabled)
{
  for (let i = 0; i < chain.length; i++) 
  {
    if (chain[i].id === targetNodeId) 
    {
      chain[i].enabled = isEnabled;
      updateChain();
      return;
    }
  }
}

function updateChain()
{
  player.disconnect();
  lowPass.disconnect();
  reverb.disconnect();
  dynamicCompressor.disconnect();
  delay.disconnect();
   // Connect enabled nodes
  let connectedNodes = chain.filter(node => node.enabled);

  for (let i = 0; i < connectedNodes.length - 1; i++) 
  {
    connectedNodes[i].next = connectedNodes[i+1].id;
  }

  for (let i = 0; i < connectedNodes.length-1 ; i++) 
  {

    if(connectedNodes[i].next != null )
    {
      connectedNodes[i].effect.connect(connectedNodes[i+1].effect);
    }

  }

  connectedNodes[connectedNodes.length-1].effect.connect(p5.soundOut);
  fftOUT.setInput(p5.soundOut);
  soundRecorder.setInput(connectedNodes[connectedNodes.length-1].effect);

}
