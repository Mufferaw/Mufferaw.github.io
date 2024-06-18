var analyzer;

var rms;
var zcr;
var energy;
var loudness;
var perceptualSharpness;
var spectralKurtosis;//An indicator to how pointy the spectrum is. Can be viewed as the opposite of Spectral Flatness.
var spectralFlux; //Doesnt work
var spectralCrest;
var spectralCentroid;
var chroma;
var spectralSpread;
var perceptualSpread;
var mfcc; 
var complexSpectrum;
var amplitudeSpectrum;
var powerSpectrum;
var spectralSlope;

var backgroundColors = [
  "black", 
  "white", 
  "red", 
  "blue", 
  "green",
  "gray"
];

var currentbackgroundColor;
var shapefillColor;

var shapes = [
  "square", 
  "triangle", 
  "circle", 
  "pentagon"
];

var currentShape = "square";

function preload() 
{
  soundFormats('wav', 'mp3');
  // mySound = loadSound('/sounds/233709__x86cam__130bpm-32-beat-loop_v2');
//  mySound = loadSound('/sounds/Ex2_sound1.wav'); // loudness, perceptuial sharpness, kurtosis, spectral centroid
//  mySound = loadSound('/sounds/Ex2_sound2.wav'); //loudness, energy, kertosis
  // mySound = loadSound('/sounds/Ex2_sound3.wav'); // kertosis, crest, centroid
  mySound = loadSound('./sounds/Kalte_Ohren_(_Remix_).mp3');

  analyzer = Meyda.createMeydaAnalyzer({
    "audioContext": getAudioContext(),
    "source":  mySound,
    "bufferSize": 512,
    "featureExtractors": ["rms", 
                          "zcr", 
                          "energy", 
                          "loudness", 
                          "perceptualSharpness", 
                          "spectralKurtosis",
                          "spectralFlatness",
                          "spectralCrest",
                          "spectralCentroid",
                          "chroma",
                          "spectralSpread",
                          "perceptualSpread",
                          "mfcc", //dont use 1st?
                          "complexSpectrum",
                          "amplitudeSpectrum",
                          "powerSpectrum",
                          "spectralSlope"
                        ],
    "callback": features => {
      rms = features.rms;
      zcr = features.zcr;
      energy = features.energy;
      loudness = features.loudness;
      perceptualSharpness = features.perceptualSharpness;
      spectralKurtosis = features.spectralKurtosis;
      spectralFlatness = features.spectralFlatness;
      spectralCrest = features.spectralCrest;
      spectralCentroid = features.spectralCentroid;
      spectralSpread = features.spectralSpread;
      perceptualSpread = features.perceptualSpread;
      mfcc = features.mfcc;
      complexSpectrum = features.complexSpectrum;
      amplitudeSpectrum = features.amplitudeSpectrum;
      powerSpectrum = features.powerSpectrum;
      chroma = features.chroma;
      spectralSlope = features.spectralSlope;
    }
  });
  Meyda.windowing(analyzer, "sine");
}

function setup() 
{
 

  var speechRecognizer = new p5.SpeechRec('en-US', parseResult);
  speechRecognizer.continuous = false;
  speechRecognizer.interimResults = true;
  speechRecognizer.start();
  speechRecognizer.onEnd = restartSpeech;

  function parseResult()
  {
    var latestWord = speechRecognizer.resultString.split(' ') .pop().toLowerCase();
    if(backgroundColors.includes(latestWord))
    {
      currentbackgroundColor = latestWord;
      return;
    }

    if(shapes.includes(latestWord))
    {
      currentShape = latestWord;
    }
    console.log(latestWord);
  }

  function restartSpeech()
  {
    speechRecognizer.start();
  }


  createCanvas(1920, 1080);
  background(180);
  currentbackgroundColor = color('grey');
  shapefillColor = color('black');

  mySound.loop();
  analyzer.start();
}



function draw() 
{
  colorMode(RGB);
  background(currentbackgroundColor);
  noStroke();
  textAlign(CENTER);
  textSize(20);

  
  var drawInfo = false;
if(drawInfo)
{

  fill(255, 0, 0);
  circle(50, 1080 - 25- rms* 1000, 50);
  fill('black');
  text(rms.toFixed(2), 50, 1080 - 25- rms* 1000);
  text("rms", 50, 1080 - 25 - 255);
  
  
  
  fill('orange');
  circle(150, 1080 - 25- zcr, 50);
  fill('black');
  text(zcr.toFixed(2), 150, 1080 - 25- zcr);
  text("zcr", 150, 1080 - 25 - 255);
  
  
  fill('green');
  circle(250, 1080 - 25- energy*10, 50);
  fill('black');
  text(energy.toFixed(2), 250, 1080 - 25- energy*10);
  text("energy", 250, 1080 - 25 - 255);
  
  
  fill('orange');
  circle(350, 1080 - 25- loudness.total*10, 50);
  fill('black');
  text(loudness.total.toFixed(2), 350, 1080 - 25- loudness.total*10);
  text("loudness", 350, 1080 - 125 - 255);
  
  fill('orange');
  circle(450, 1080 - 25- perceptualSharpness*1000, 50);
  fill('black');
  text(perceptualSharpness.toFixed(2), 450, 1080 - 25- perceptualSharpness*1000);
  text("perceptualSharpness", 450, 1080 - 25 - 255);
  
  fill('orange');
  circle(550, 1080/2- spectralKurtosis, 50);
  fill('black');
  text(spectralKurtosis.toFixed(2), 550, 1080/2 - spectralKurtosis);
  text("spectralKurtosis", 550, 1080 - 125 - 255);
  
  fill('orange');
  circle(650, 1080/2 - spectralFlatness*1000, 50);
  fill('black');
  text(spectralFlatness.toFixed(2), 650, 1080/2 - spectralFlatness*1000);
  text("spectralFlatness", 650, 1080 - 25 - 255);
  
  fill('orange');
  circle(750, 1080/2 - spectralCrest*20, 50);
  fill('black');
  text(spectralCrest.toFixed(2), 750, 1080/2 - spectralCrest*20);
  text("spectralCrest", 750, 1080 - 125 - 255);
  
  fill('orange');
  circle(850, 1080/2 - spectralCentroid*5, 50);
  fill('black');
  text(spectralCentroid.toFixed(2),850, 1080/2 - spectralCentroid*5)
  text("spectralCentroid", 850, 1080 - 50 - 255);
  
  fill('orange');
  circle(950, 1080/2 - spectralSpread, 50);
  fill('black');
  text(spectralSpread.toFixed(2), 950, 1080/2 - spectralSpread);
  text("spectralSpread", 950, 1080 - 25 - 255);
  
  fill('orange');
  circle(1050, 1080/2 - perceptualSpread*200, 50);
  fill('black');
  text(perceptualSpread.toFixed(2),1050, 1080/2 - perceptualSpread*200);
  text("perceptualSpread", 1050, 1080 - 50 - 255);

  fill('orange');
  circle(1350, 1080/2 - spectralSlope*1000000000, 50);
  fill('black');
  text((spectralSlope*1000000000).toFixed(2),1350, 1080 - 255);
  text("spectralSlope", 1350, 1080 - 50 - 255);
  
  //chroma
  push();
  rectMode(CENTER);
  text("Chroma",1200, 80);
  // textAlign(LEFT, TOP);
  for (let i = 0; i < chroma.length; i++) 
  {
    // const element = array[i];  
    fill('orange');
    rect(1150, 100 + i*20, chroma[i]*100, 20);
    fill('black');
    text(chroma[i].toFixed(2),1150, 100 + i*20 );
  }
  pop();
  
  //MFCC
  push();
  rectMode(CENTER);
  
  text("MFCC", 1200, 480);
  // textAlign(LEFT, TOP);
  for (let i = 1; i < mfcc.length; i++) 
  {
    // const element = array[i];  
    fill('orange');
    rect(1150, 500 + i*20, mfcc[i]*2, 20);
    fill('black');
    text(mfcc[i].toFixed(2),1150, 500 + i*20 );
  }
  pop();
  
  //Complex Spectrum
  push();
  rectMode(CENTER);
  
  text("Complex Spectrum", 1500, 80);
  // textAlign(LEFT, TOP);
  // for (let i = 0; i < complexSpectrum.real.length; i++) 
  for (let i = 0; i < 100; i++) 
  {
    // const element = array[i];  
    fill('orange');
    rect(1500, 100 + i*10, complexSpectrum.real[i]*2, 10);
    rect(1700, 100 + i*10, complexSpectrum.imag[i]*2, 10);
    fill('black');
    //text(mfcc[i].toFixed(2),1150, 500 + i*20 );
  }
  pop();
  
  //amplitudeSpectrum
  push();
  rectMode(CENTER);
  
    text("amplitudeSpectrum", 100, 80);
    // textAlign(LEFT, TOP);
    for (let i = 0; i < amplitudeSpectrum.length; i++) 
    // for (let i = 0; i < 100; i++) 
    {
      // const element = array[i];  
      fill('orange');
      rect(100, 100 + i*4, amplitudeSpectrum[i]*2, 4);
      // rect(1700, 100 + i*10, complexSpectrum.imag[i]*2, 10);
      fill('black');
      //text(mfcc[i].toFixed(2),1150, 500 + i*20 );
    }
  pop(); 

    //powerSpectrum
    push();
    rectMode(CENTER);
    
      text("powerSpectrum", 300, 80);
      // textAlign(LEFT, TOP);
      for (let i = 0; i < powerSpectrum.length; i++) 
      // for (let i = 0; i < 100; i++) 
      {
        // const element = array[i];  
        if(i >8  && i <=106)
        {
          fill('red')
        }
        else
          fill('orange');
        rect(300, 100 + i*4, powerSpectrum[i]*2, 4);
        // rect(1700, 100 + i*10, complexSpectrum.imag[i]*2, 10);
        fill('black');
        //text(mfcc[i].toFixed(2),1150, 500 + i*20 );
      }
    pop(); 

  let sum = 0;
  let thres = 15;
  // console.log(powerSpectrum.length)
  // console.log(map(700, 0, 24000, 0, 255));
  // console.log(map(10000, 0, 24000, 0, 255));
    for (let i = 8; i <= 106; i++) 
    {
      sum += powerSpectrum[i];
    }
    let av = (sum/98);
    text((av.toFixed(2)), 300, 50);
    // if(av > thres)
    if(mfcc[2] <5 && av > thres && mfcc[5] > thres/3 )
    {
      circle(width/2, height/2, av*10);
    }

     return;
  }

  
  // switch the color based on background color
  switch (currentbackgroundColor) 
  {
    case "red":
      currentbackgroundColor = 'maroon';
      // shapefillColor = color('gold');
      shapefillColor = color('pink');
      break;
  
    case "blue":
      currentbackgroundColor = 'orange';
      shapefillColor = color('darkblue');
      break;
    
    case "black":
      currentbackgroundColor = 'black';
      shapefillColor = color('floralwhite');
      break;
    
    case "white":
      currentbackgroundColor = 'floralwhite';
      shapefillColor = color('black');
      break;
    
    case "green":
      currentbackgroundColor = 'lime';
      shapefillColor = color('sienna');
      break;
    
    case "gray":
      currentbackgroundColor = color('grey');
      shapefillColor = color('black');

    default:
      break;
  }

  switch(currentShape) 
  {
    case "square":
      // Background pattern;
      for(var i = 0; i < chroma.length; i++)
      {
        for(var j = 0; j < chroma.length; j++)
        {
         
          DrawSquare((width/chroma.length) * i + width/(chroma.length*2) , height/chroma.length *j + height/(chroma.length*2), loudness.total - (loudness.specific[i+j] / mfcc[i])  );
         
         if((i * (chroma.length-1) +j)% 2 == 0)
          {
            fill(200/chroma[i]);

          }
        else
          {
            fill(255,255,255,0);
          }

        blendMode(MULTIPLY);
        rect(width/chroma.length *i +width/chroma.length/2, height/chroma.length*j + height/chroma.length/2 , (width/chroma.length)-loudness.total - (loudness.specific[i+j] / mfcc[i]), (height/chroma.length)-loudness.total - (loudness.specific[i+j] / mfcc[i]), 5);
        blendMode(BLEND);
        }

      }

      // Foreground Squares
      colorMode(HSB);
      push();
        rectMode(CENTER);
        
        var chroma_len = chroma.length; // workaround for weird browser behavior
        for (let i = 0; i < chroma.length; i++) 
        {
            y_rand = map(chroma[i], 0, 1.0, -100, height/1.8-200);
            y_range = map(y_rand, 200, height/1.8 - 200, 50, -50);

            fill((map(chroma[i], 0, 1, 0, 360)+(sin(mySound.currentTime())*360))%360, 100, map(abs(chroma[i]), 0, 1, 80, 100), chroma[i]);

            stroke((map(chroma[chroma_len-1 -i], 0, 1, 0, 360)+(sin(mySound.currentTime())*360))%360, 100, map(abs(chroma[chroma_len-1 -i]), 0, 1, 80, 100),     chroma[chroma_len-1-i]);

            // Vertical Lines
            strokeWeight(abs(mfcc[i+1]) );            
            blendMode(DODGE);
            line((width/chroma_len)*i+80, 0, (width/chroma_len)*(i)+80, height);
            
            // Squares
            blendMode(OVERLAY);
            strokeWeight(chroma[i] * 40);
            stroke(0,0,0,1 - chroma[i]);
            
            square(width/chroma_len*i+ 80,
                    y_rand,
                    200 - y_range,
                    chroma[i]*chroma[i]);

            square(width/chroma_len*i+ 80, 
                    height - y_rand,
                    200-y_range,
                    chroma[i]*chroma[i]);
        }
      pop();
      break;

    case "triangle":
      // Background Triangles
      for(var i = 0; i<chroma.length; i++)
      {
        for(var j = 0; j<chroma.length; j++)
        {
         // DrawTriangle((width/chroma.length) * i + width/(chroma.length*2) , height/chroma.length *j + height/(chroma.length*2), loudness.specific[i*2]*24);
          DrawTriangle((width/chroma.length) * i + width/(chroma.length*2) , height/chroma.length *j + height/(chroma.length*2), loudness.total - (loudness.specific[i+j] / mfcc[i]));
        }
      }

      // Foreground Triangles
      push();
        colorMode(HSB);

        for (let i = 0; i < chroma.length; i++) 
        {
            y_rand = map(chroma[i], 0, 1.0, 0, height/1.8-200);
            y_range = map(y_rand, 200, height/1.8 - 200, 50, -50);

            fill((map(chroma[i], 0, 1, 0, 360)+(sin(mySound.currentTime())*360))%360,
                  100,
                  map(abs(chroma[i]), 0, 1, 80, 100),
                  chroma[i]);

            stroke((map(chroma[i], 0, 1, 0, 360)+(cos(mySound.currentTime())*360))%360,
                  100,
                  100,
                  1 - chroma[i]);


            blendMode(OVERLAY);            
            triangle(width/chroma.length*i+ 80, height/2 - y_rand*chroma[i], 
                      width/chroma.length*i+ 80 - y_range*2, height ,
                      width/chroma.length*i+ 80 + y_range*2, height);
            
            blendMode(SOFT_LIGHT);            
            triangle(width/chroma.length*i+ 80,  height/2 + y_rand*chroma[i], 
                      width/chroma.length*i+ 80 - y_range*2, 0,
                      width/chroma.length*i+ 80 + y_range*2, 0);

            // Extra lines for visual effect
            blendMode(EXCLUSION);
            strokeWeight(chroma[chroma.length - 1]*10);
            line(0, height/12*i - height/24, width, height/12*i- height/24);
            blendMode(BURN);
            strokeWeight(chroma[i] * 50);
            line(width/chroma.length*i+ 80, height, width/chroma.length*(i)+ 80, 0);
          }
      pop();
      break;

    case "circle": 
      // Background Circles
      for(var i = 0; i<chroma.length; i++)
      {
        for(var j = 0; j<chroma.length; j++)
        {
          DrawCircle((width/chroma.length) * i + width/(chroma.length*2) , height/chroma.length *j + height/(chroma.length*2), loudness.total - (loudness.specific[i+j] / mfcc[i]));
        }
      }

      // Foreground Circle
      push();
      colorMode(HSB);

      for (let i = 0; i < chroma.length; i++) 
      {
          y_rand = map(chroma[i], 0, 1.0, 0, height/1.8-200);
          y_range = map(y_rand, 200, height/1.8 - 200, 50, -50);

          fill((map(chroma[i], 0, 1, 0, 360)+(sin(mySound.currentTime())*360))%360,
                100,
                map(abs(chroma[i]), 0, 1, 80, 100),
                chroma[i]);
          stroke((map(chroma[i], 0, 1, 0, 360)+(cos(mySound.currentTime())*360))%360,
                100,
                100,
                1 - chroma[i]);

          strokeWeight(chroma[i] * 40);
          blendMode(DIFFERENCE);
          line(width/chroma.length*i+ 80, height, width/chroma.length*(i)+ 80, 0);

          
          blendMode(OVERLAY);
          circle(width/chroma.length*i+ 80, y_rand,          200 - y_range, chroma[i]*5);
          circle(width/chroma.length*i+ 80, height - y_rand, 200 - y_range, chroma[i]*5);
      }
      pop();
      break;

    case "pentagon":
      //Background Pentagon
      for(var i = 0; i<chroma.length; i++)
      {
        for(var j = 0; j<chroma.length; j++)
        {
          DrawPentagon((width/chroma.length) * i + width/(chroma.length*2) , height/chroma.length *j + height/(chroma.length*2), loudness.total - (loudness.specific[i+j] / mfcc[i]));
        }
      }

      // Foreground Pentagon
      push();
      colorMode(HSB);

      for (let i = 0; i < chroma.length; i++) 
      {
          y_rand = map(chroma[i], 0, 1.0, 0, height/1.8-200);
          y_range = map(y_rand, 200, height/1.8 - 200, 50, -50);

          fill((map(chroma[i], 0, 1, 0, 360)+(sin(mySound.currentTime())*360))%360,
                    100,
                    map(abs(chroma[i]), 0, 1, 80, 100),
                    chroma[i]);
          stroke((map(chroma[i], 0, 1, 0, 360)+(cos(mySound.currentTime())*360))%360,
                    100,
                    100,
                    1 - chroma[i]);

          strokeWeight(chroma[i] * 80);
          blendMode(DIFFERENCE);
          line(width/chroma.length*i+ 80, height, width/chroma.length*(i)+ 80, 0);

          
          blendMode(OVERLAY);
          beginShape();
          for (let j = 0; j < 5; j++) 
          {
            vertex(width/chroma.length*i+ 80 + cos(TWO_PI * j / 5 -1.57) * chroma[i]*160 , y_rand + sin(TWO_PI * j / 5- 1.57) * chroma[i]*160 );
          }
          endShape(CLOSE);

          beginShape();
          for (let j = 0; j < 5; j++) 
          {
            vertex(width/chroma.length*i+ 80 + cos(TWO_PI * j / 5 +1.57) * chroma[i]*160 ,  height - y_rand + sin(TWO_PI * j / 5 + 1.57) * chroma[i]*160 );
          }
          endShape(CLOSE);
      }
      pop();
      break;

    default:
      break;
  }
}

function DrawSquare(x_pos, y_pos, size)
{
  var radius = size*7;

  rectMode(CENTER);
  colorMode(RGB);
  var col = shapefillColor;

  for(var i = abs(spectralKurtosis); i < radius; i=i +radius*perceptualSpread*0.09)
  {     
    col.setAlpha(10/(i/radius));
    fill(col);
    square(x_pos, y_pos, i,5);
  }

}

function DrawTriangle(x_pos, y_pos, size)
{
  var radius = size*7;
  colorMode(RGB);
  var col = shapefillColor;
  
  for(var i = abs(spectralKurtosis); i< radius; i=i +radius*perceptualSpread*0.1)
  {     
    col.setAlpha(10/(i/radius));
    fill(col);
    triangle(x_pos, y_pos-i/2, x_pos-i/2, y_pos+i/2, x_pos+i/2, y_pos+i/2);
  }
}

function DrawCircle(x_pos, y_pos, size)
{
  var radius = size*7;
  colorMode(RGB);
  var col = shapefillColor;

  for(var i = abs(spectralKurtosis); i< radius; i=i +radius*perceptualSpread*0.08)
  {     
    col.setAlpha(10/(i/radius));
    fill(col);
    circle(x_pos, y_pos, i);
  }
}

function DrawPentagon(x_pos, y_pos, size)
{
  var radius = size*4;
  var col = shapefillColor;
  colorMode(RGB);
  
  for(var i = abs(spectralKurtosis); i< radius;i= i +radius*perceptualSpread*0.1)
  {     
    col.setAlpha(10/(i/radius));
    fill(col);
    beginShape();

    for (var j = 0; j < 5; j++) 
    {
      vertex(x_pos + cos(TWO_PI * j / 5 -1.57) * i , y_pos + sin(TWO_PI * j / 5- 1.57) * i );
    }
    endShape(CLOSE);
  }
}


