class GUI 
{
    constructor(x, y, w, h, title) 
    {
        this.isVisible = true;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.title = title;
        //variables to handle dragging the window
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragging = false;
        //widgets
        this.widgets = [];
        this.selectedVisual;
        this.viswidgets = [];
        //for tracking the state of the UI, whats hot(mouseover), active(being interacted with)
        this.uistate = {
            mousex: 0,
            mousey: 0,
            mousedown: 0,
            hotitem: 0,
            activeitem: 0
        };

        this.isPowerOn = false;
        this.font_Trebuchet = loadFont('assets/TREBUCBD.ttf');
        this.font_Franklin = loadFont('assets/FranklinGothicMedium.ttf');
        this.font_Digital = loadFont('assets/LCDMU.TTF');

        this.img = loadImage('assets/metalbackground1.png');
        this.screwImg = loadImage('assets/screw_head.png');
        this.powerOnImg = loadImage('assets/power_on.png');
        this.powerOffImg = loadImage('assets/power_off.png');
        this.powerSwitchOnImg = loadImage('assets/power_switch_on.png');
        this.powerSwitchOffImg = loadImage('assets/power_switch_off.png');
        this.sliderBG = loadImage('assets/slider_bg.png');
        this.sliderKnob = loadImage('assets/slider_knob.png');
        this.knobBG = loadImage('assets/knob_BG.png')
        this.knobLevel = loadImage('assets/knob_levels.png')
        this.knobCenter = loadImage('assets/knob_center.png');
        this.playback_play = loadImage('assets/playback_play.png');
        this.playback_pause = loadImage('assets/playback_pause.png');
        this.playback_stop = loadImage('assets/playback_stop.png');
        this.playback_skipstart = loadImage('assets/playback_skipstart.png');
        this.playback_skipend = loadImage('assets/playback_skipend.png');
        this.playback_loop = loadImage('assets/playback_loop.png');
        this.playback_record = loadImage('assets/playback_record.png');
        this.sizableButtonSide = loadImage('assets/sizeable_button_side.png');
        this.sizableButtonMiddle = loadImage('assets/sizeable_button_middle.png');
    }

    draw(px, py) 
    {
        //set the uistate
        this.uistate.hotitem = 0;
        this.uistate.mousex = mouseX;
        this.uistate.mousey = mouseY;
        this.uistate.mousedown = mouseIsPressed;

        if (this.dragging) 
        {
            this.x = px + this.offsetX;
            this.y = py + this.offsetY;
        }

        //Draw the floating window
        stroke(255);
        noFill();

        noStroke();
        stroke(120);
        fill(150);
        rect(this.x + 1, this.y + 1, this.w, this.h, 5);
        fill(180);
        rect(this.x, this.y, this.w, this.h, 5);
        image(img,this.x+5, this.y+5, this.w-5, this.h-5, 0, 0, this.w, this.h);
        image(this.screwImg, this.x, this.y);
        image(this.screwImg, this.x +this.w-this.screwImg.width, this.y);
        image(this.screwImg, this.x, this.y +this.h-this.screwImg.height);
        image(this.screwImg, this.x +this.w-this.screwImg.width , this.y +this.h-this.screwImg.height);

        
        textFont(this.font_Trebuchet);
        textSize(20);
        textStyle(BOLD);
        fill(10,180,255, 20);

        let titleWidth = textWidth(this.title) +35;
        rect(this.x + 10, this.y + 5, titleWidth, 25, 18);
        noFill();
        stroke(0, 0, 0, 50);
        strokeWeight(2);
        rect(this.x + 10, this.y + 5, titleWidth, 25, 18);

        strokeWeight(1);
        stroke(255, 255, 255, 100);
        rect(this.x + 9, this.y + 4, titleWidth+1, 26, 18);
        noStroke();
        blendMode(BLEND);


        fill(255,255,255,100);
        textAlign(LEFT, TOP);
        text(this.title, this.x + 36, this.y + 7);
        fill(40);
        text(this.title, this.x + 35, this.y + 6);

        if(this.isPowerOn)
        {
            image(this.powerOnImg, this.x + 12, this.y+8);
            fill(0,255,0,90);
            blendMode(SCREEN );
            ellipse(this.x+12 +this.powerOnImg.width/2, this.y + 8 + this.powerOnImg.height/2, 30, 30)
            blendMode(BLEND);

        }
        else
            image(this.powerOffImg, this.x + 12, this.y+8);
        fill(0);
        push();

        //draw GUI widgets
        for (var i = 0; i < this.widgets.length ; i++) 
        {
            this.widgets[i]();
        }
        pop();

        //Draw visulaization specific widgets
        // if(this.viswidgets[this.selectedVisual] != null)
        // {
        //     //Draw a 'sub-window' for the vusualization widgets
        //     fill(150);
        //     rect(this.x + this.w+1,40+ this.y + 1+ this.selectedVisual*40,
        //         this.w*0.75, 50 +this.viswidgets[this.selectedVisual].length *50, 5);
        //     fill(180);
        //     rect(this.x + this.w,40+ this.y + this.selectedVisual*40, 
        //         this.w*0.75, 50 +  this.viswidgets[this.selectedVisual].length *50, 5);
        //     fill(210);
        //     rect(this.x + this.w + 2, 40+ this.y + 2 + this.selectedVisual*40, 
        //         this.w *0.75 - 4, 20, 4, 4, 2, 2);
        //     fill(0);
        //     textAlign(LEFT, TOP);
        //     textStyle(NORMAL);
        //     text('Visualizer Settings', this.x + this.w + 15, 44 + this.y + 2 + this.selectedVisual*40);

        //     for (var i = 0; i < this.viswidgets[this.selectedVisual].length ; i++) 
        //     {
        //         this.viswidgets[this.selectedVisual][i]();
        //     }
        // }

        //set the uistate
        if (!this.uistate.mousedown) 
        {
            this.uistate.activeitem = 0;
        }
        else 
        {
            if (this.uistate.activeitem == 0)
                this.uistate.activeitem = -1;
        }

    }

    pressed(px, py) 
    {
        //If we are over the GUI window and not over a widget then we are draggging
        if (px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h && this.uistate.hotitem == 0) 
        {
            this.dragging = true;
            this.offsetX = this.x - px;
            this.offsetY = this.y - py;
        }
    }

    notPressed(px, py) 
    {
        this.dragging = false;
    }

    regionhit(x, y, w, h) 
    {
        if (mouseX < x || mouseY < y || mouseX >= (x + w) || mouseY >= (y + h)) 
        {
            return false;
        }
        return true;
    }

    ////////////////Widgets////////////////////
    
    button(id, x, y, type, isEnabled) 
    {
        var button_image;
        
        switch (type) {
            case 'play':
                button_image = this.playback_play;
                break;
            case 'pause':
                button_image = this.playback_pause;
                break;
            case 'stop':
                button_image = this.playback_stop;
                break;
            case 'skipstart':
                button_image = this.playback_skipstart;
                break;
            case 'skipend':
                button_image = this.playback_skipend;
                break;
            case 'loop':
                button_image = this.playback_loop;
                break;
            case 'record':
                button_image = this.playback_record;
                break;
            default:
                break;
        }
     
        //if mouse if over us, make us hot. If mouse is over us and the mouse is down and nothing else is active, make us active
        if (this.regionhit(x, y, button_image.width, button_image.height)) 
        {
            cursor(HAND);
            this.uistate.hotitem = id;
            if (this.uistate.activeitem == 0 && this.uistate.mousedown) 
            {
                this.uistate.activeitem = id;
            }
        }

        if (this.uistate.hotitem == id) 
        {
            if (this.uistate.activeitem == id) //Active
            {
                push();
                    tint(226, 0, 0);
                    image(button_image, x, y);
                pop();
                

            }
            else 
            {
                push();
                    tint(255, 255, 0);
                    image(button_image, x, y);
                pop();

            }
        }
        else                                    //Normal
        {
            if(isEnabled == true)
            {
                push();
                    tint(0, 255, 0);
                    image(button_image, x, y);
                pop();
            }
            else
            image(button_image, x, y);

        }

       //return true if this has been clicked and we were hot and active and the mouse was released = clicked
        if (!this.uistate.mousedown && this.uistate.hotitem == id && this.uistate.activeitem == id) 
        {
            return true;
        }
        return false;
    }

    sizeableButton(id, x, y, w, h, isEnabled, captionSize, caption) 
    {
        var sideWidth = this.sizableButtonSide.width;

        textFont(this.font_Franklin);
        textSize(captionSize);
        textStyle(NORMAL);
        textLeading(15);
        let captionWidth = textWidth(caption) +35;

        image(this.sizableButtonSide, x, y, sideWidth, h);
        image(this.sizableButtonMiddle, x+sideWidth, y, captionWidth, h);
        push();
        scale(-1, 1);
        image(this.sizableButtonSide,-x-sideWidth-sideWidth-captionWidth, y, sideWidth, h);
        pop();

        var textOffsetX = x+sideWidth +captionWidth/2;
        var textOffsetY = y+h/1.7;// +captionSize;
        fill(255,255,255,100);
        text(caption, textOffsetX +1 , textOffsetY +1);
        fill(40);
        text(caption, textOffsetX , textOffsetY);


        //if mouse if over us, make us hot. If mouse is over us and the mouse is down and nothing else is active, make us active
        if (this.regionhit(x, y, w, h)) 
        {
            cursor(HAND);
            this.uistate.hotitem = id;
            if (this.uistate.activeitem == 0 && this.uistate.mousedown) 
            {
                this.uistate.activeitem = id;
            }
        }

        if (this.uistate.hotitem == id) 
        {
            if (this.uistate.activeitem == id) //Active
            {
                push();
                    fill(226, 0, 0, 50);
                    rect(x+3,y,sideWidth*2 +captionWidth-7,h-3,5);
                pop();
            }
            else //Hot
            {
                push();
                    fill(255, 255, 0, 50);
                    rect(x+3,y,sideWidth*2 +captionWidth-7,h-3,5);

                pop();
            }
        }
        else                                    //Normal
        {
            if(isEnabled)
            {
                push();
                    fill(0, 200, 0, 50);
                    rect(x+3,y,sideWidth*2 +captionWidth-7,h-3,5);
                pop();
            }
        }
      

       //return true if this has been clicked and we were hot and active and the mouse was released = clicked
        if (!this.uistate.mousedown && this.uistate.hotitem == id && this.uistate.activeitem == id) 
        {
            return true;
        }
        return false;
    }

    powerButton(id, x, y, w, h) 
    {
        //if mouse if over us, make us hot. If mouse is over us and the mouse is down and nothing else is active, make us active
        w =  this.powerSwitchOffImg.width;
        h =  this.powerSwitchOffImg.height;
        
        
        if (this.regionhit(x, y, this.powerSwitchOffImg.width, this.powerSwitchOffImg.height)) 
        {
            cursor(HAND);
            this.uistate.hotitem = id;
            if (this.uistate.activeitem == 0 && this.uistate.mousedown) 
            {
                this.uistate.activeitem = id;
            }
        }

        if (this.uistate.hotitem == id) 
        {
            if (this.uistate.activeitem == id) //Active
            {
                
                fill('#ffffff');
                if(this.isPowerOn)
                    image(this.powerSwitchOnImg, x, y);
                else
                    image(this.powerSwitchOffImg, x, y);
                fill('#000000');
            }
            else 
            {
                if(this.isPowerOn)
                    image(this.powerSwitchOnImg, x, y);
                else
                    image(this.powerSwitchOffImg, x, y);


                fill('#000000');
            }
        }
        else                                    //Normal
        {
            fill('#aaaaaa');
            if(this.isPowerOn)
                image(this.powerSwitchOnImg, x, y);
            else
                image(this.powerSwitchOffImg, x, y);
            fill('#ffffff');
        }

       //return true if this has been clicked and we were hot and active and the mouse was released = clicked
        if (!this.uistate.mousedown && this.uistate.hotitem == id && this.uistate.activeitem == id) 
        {
            return true;
        }
        return false;
    }

    playpauseButton(id, x, y, w, h, play) 
    {
        //if mouse if over us, make us hot. if mouse is over us and the mouse is down and nothing else is active, make us active
        if (this.regionhit(x, y, w, h)) 
        {
            this.uistate.hotitem = id;  //keep track of hot item

            //if nothing else is active, we become active
            if (this.uistate.activeitem == 0 && this.uistate.mousedown) 
            {
                this.uistate.activeitem = id;
            }
        }
        fill('#000000');
        if(play) //draw 'pause' symbol shadow
        {
            rect(x+2, y+2, w/2 - 2, h);
            rect(x +2 + (w/2), y+2, w/2 -2 , h);
        }
        else    //draw 'play' symbol shadow
        {
            triangle(x+1, y+1, x + w+1, y + h/2 +1, x+1 , y+h +1);
        }

        if (this.uistate.hotitem == id) 
        {
            if (this.uistate.activeitem == id) //Active
            {
                fill('#ffffff');
                if(play)
                {
                    rect(x+2, y+2, w/2 - 2, h);
                    rect(x +2 + (w/2), y+2, w/2 -2 , h);
                }
                else
                {
                    triangle(x+1, y+1, x + w+1, y + h/2 + 1, x+1 , y+h + 1);
                }
            }
            else 
            {
                fill('#ffffff')                 //Hot
                if(play)
                {
                    rect(x, y, w/2 - 2, h);
                    rect(x + (w/2), y, w/2 -2 , h);
                }
                else
                {
                    triangle(x, y, x + w, y + h/2, x, y+h)
                }
            }
        }
        else                                    //Normal
        {
            fill('#C0C0C0')
            stroke('#808080');
            strokeWeight(0.5);
            if(play)
            {
                rect(x, y, w/2 - 2, h);
                rect(x + (w/2), y, w/2 -2 , h);
            }
            else
            {
                triangle(x, y, x + w, y + h/2, x, y+h)
            }
        }

        //return true if this has been clicked, we were hot and active and the mouse was released = clicked
        if (!this.uistate.mousedown && this.uistate.hotitem == id && this.uistate.activeitem == id) 
        {
            return true;
        }
        return false;  //we weren't clicked
    }

    slider(id, x, y, max, value, caption) 
    {
        //the position of the sliding part
        var ypos = ( (this.sliderBG.height - this.sliderKnob.height)* (max-value.val))/max;

        //if mouse is over us, make us hot. if mouse is over us and the mouse is down and nothing else is active, make us active
        if (this.regionhit(x, y, this.sliderBG.width, this.sliderBG.height)) 
        {
            cursor(HAND);
            this.uistate.hotitem = id;  //keep track of hot item

            //if nothing else is active, we become active
            if (this.uistate.activeitem == 0 && this.uistate.mousedown) 
            {
                this.uistate.activeitem = id;
            }
        }
     
        image(this.sliderBG, x, y);

        fill('#000000');
        textFont(this.font_Franklin);
        textSize(20);
        textStyle(NORMAL);
        textAlign(CENTER, BOTTOM);
        textLeading(15);

        let captionWidth = textWidth(caption) ;
        fill(255,255,255,100);

        text(caption, x + this.sliderBG.width/2 +1 , y-5 +1);
        fill(40);
        text(caption, x + this.sliderBG.width/2 , y-5);


        //active or hot
        if (this.uistate.hotitem == id || this.uistate.activeitem == id) 
        {
            cursor(HAND);

            image(this.sliderKnob, x+3 , y +ypos);
            textSize(12);
            text(value.val.toFixed(2), x+10, y+190);

        }
        else                                    //Normal
        {
            image(this.sliderKnob, x+3 , y +ypos)
        }

        if(this.uistate.activeitem == id)
        {
            var mousepos = mouseY - (y - this.sliderKnob.height);
            //Don't take out of bounds values
            if (mousepos < 0)
            mousepos = 0;

            if(mousepos> 200)
            mousepos = 200;

            //whats the value from the slider
            var v = (mousepos * max)/200;
            v = 100 -v;
            //if the slider value doesnt match the variable from the visulaization...
            if(v != value.val)
            {
                //...set the new value
                value.val = v;
                return true;
            }
        }

        return false;  //we weren't clicked
    }

    knob(id, x, y, max, value, caption, valueScaled) 
    {
        //the rotation of the knob
        let rotation = (value.val/max)*360;

        //if mouse is over us, make us hot. if mouse is over us and the mouse is down and nothing else is active, make us active
        if (this.regionhit(x, y, this.knobBG.width, this.knobBG.height)) 
        {
            cursor(HAND);
            this.uistate.hotitem = id;  //keep track of hot item

            //if nothing else is active, we become active
            if (this.uistate.activeitem == 0 && this.uistate.mousedown) 
            {
                this.uistate.activeitem = id;
            }
        }
    
        // Draw knob background
        image(this.knobBG, x, y);

        // Make another canvas and use a pie to mask the colored indicator
        let maskCanvas = createGraphics(this.knobBG.width, this.knobBG.height);
        let maskContext = maskCanvas.canvas.getContext("2d");
        maskCanvas.noStroke();
        maskCanvas.fill(255,255,255,0);
        maskCanvas.arc(this.knobBG.width/2, this.knobBG.height/2, this.knobBG.width, this.knobBG.height, radians(110), radians(110+rotation), PIE);
        maskContext.clip();
        maskCanvas.image(this.knobLevel, 0, 0);
        blendMode(BLEND);
        image(maskCanvas, x, y); // Finally draw the masked image onto the main canvas

        // Remove the temporary canvas
        maskCanvas.remove();
        maskCanvas = null;

        push();
        {
            imageMode(CENTER);
            translate(x + this.knobBG.width/2, y + this.knobBG.height/2);
            rotate(radians(constrain(rotation,0,310)));
            image(this.knobCenter, 0,0);

        }
        pop();

        fill('#000000');
        textFont(this.font_Franklin);
        textSize(20);
        textStyle(NORMAL);
        textAlign(CENTER, BOTTOM);
        textLeading(15);

        let captionWidth = textWidth(caption) ;
        fill(255,255,255,100);

        text(caption, x + this.knobBG.width/2 +1 , y-5 +1);
        fill(40);
        text(caption, x + this.knobBG.width/2 , y-5);


        //active or hot
        if (this.uistate.hotitem == id || this.uistate.activeitem == id) 
        {
            cursor(HAND);

            textSize(12);
            if(valueScaled)
                text(valueScaled.toFixed(2), x+42, y+100);
            else
                text(value.val.toFixed(2), x+42, y+100);

        }
        else                                    //Normal
        {
        }

        if(this.uistate.activeitem == id)
        {
            var mousepos = mouseX - x;
          
            //Don't take out of bounds values
            if (mousepos < 0)
            mousepos = 0;

            if(mousepos > this.knobBG.width)
            mousepos =  this.knobBG.width;

            //whats the value from the slider
            var v = (mousepos * max)/this.knobBG.width;

            //if the slider value doesnt match the variable from the visulaization...
            if(v != value.val)
            {
                //...set the new value
                value.val = v;
                return true;
            }
        }

        return false;  //we weren't clicked
    }

    timer(id, x, y, currentTime, duration, hideTime, isRecording) 
    {
        var currentFormat = new Date(currentTime * 1000).toISOString().substr(14, 5);
        var durationFormat = new Date(duration * 1000).toISOString().substr(14, 5);

        var bgColor = color(40, 90, 5, 255);
        if(isRecording)
            bgColor = color(80,5,5,255);
    
        fill(200);
        rect(x-2,y-2, 200, 40, 5);
        fill(40);
        rect(x+2,y+2, 200, 40, 5);        
        fill(bgColor);

        rect(x,y, 200, 40, 5);
        textFont(this.font_Digital);
        textSize(30);
        fill(0,0,0,100);

        if(hideTime)
        {
            text('    MIC', x+14, y+7);
            fill(140,200,0);
            stroke(80, 150, 0);
            strokeWeight(2);
            text('    MIC', x+12, y+5);
        }
        else
        {
            text(currentFormat+ '/' + durationFormat, x+14, y+7);
            fill(140,200,0);
            stroke(80, 150, 0);
            strokeWeight(2);
            text(currentFormat+ '/' + durationFormat, x+12, y+5);
        }

    }

    spectrum(id, x, y, w, h, specData)
    {
        fill(200);
        rect(x+15-2,y+30-2, w, h-10, 5);
        fill(40);
        rect(x+15+2,y+30+2, w, h-10, 5);

        fill(40,90,0);
        rect(x+15,y+30, w, h-10, 5);


        noFill();
        strokeWeight(2);
        stroke(140,200,0);
        beginShape();
        for (var i = 0; i < specData.length-4; i++) 
        {
            //for each element of the waveform map it to screen 
			//coordinates and make a new vertex at the point.
			var vertX = map(i, 0, specData.length, 0, w);
			var vertY = map(specData[i], 0, 255, y+h+10, y+40);
            vertex(x+18+vertX, vertY);
        }
        endShape();

    }

    label(id, x, y, size, caption)
    {
        textFont(this.font_Franklin);
        textSize(size);
        textStyle(NORMAL);
        textLeading(15);

        fill(255,255,255,100);

        text(caption, x +1 , y +1);
        fill(40);
        text(caption, x , y);
    }
}