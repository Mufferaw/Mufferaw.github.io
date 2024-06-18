class GUI 
{
    constructor(x, y, w, h) 
    {
        this.isVisible = true;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
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
        fill(150);
        rect(this.x + 1, this.y + 1, this.w, this.h, 5);
        fill(180);
        rect(this.x, this.y, this.w, this.h, 5);

        
        fill(210);
        rect(this.x + 2, this.y + 2, this.w - 4, 20, 4, 4, 2, 2);
        fill(0);
        textAlign(LEFT, TOP);
        text('Music Visualizer          Press \'space\' to hide menu', this.x + 15, this.y + 6);
        push();

        //draw GUI widgets
        for (var i = 0; i < this.widgets.length ; i++) 
        {
            this.widgets[i]();
        }
        pop();

        //Draw visulaization specific widgets
        if(this.viswidgets[this.selectedVisual] != null)
        {
            //Draw a 'sub-window' for the vusualization widgets
            fill(150);
            rect(this.x + this.w+1,40+ this.y + 1+ this.selectedVisual*40,
                this.w*0.75, 50 +this.viswidgets[this.selectedVisual].length *50, 5);
            fill(180);
            rect(this.x + this.w,40+ this.y + this.selectedVisual*40, 
                this.w*0.75, 50 +  this.viswidgets[this.selectedVisual].length *50, 5);
            fill(210);
            rect(this.x + this.w + 2, 40+ this.y + 2 + this.selectedVisual*40, 
                this.w *0.75 - 4, 20, 4, 4, 2, 2);
            fill(0);
            textAlign(LEFT, TOP);
            textStyle(NORMAL);
            text('Visualizer Settings', this.x + this.w + 15, 44 + this.y + 2 + this.selectedVisual*40);

            for (var i = 0; i < this.viswidgets[this.selectedVisual].length ; i++) 
            {
                this.viswidgets[this.selectedVisual][i]();
            }
        }

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
    
    button(id, x, y, w, h, caption) 
    {
        //if mouse if over us, make us hot. If mouse is over us and the mouse is down and nothing else is active, make us active
        if (this.regionhit(x, y, w, h)) 
        {
            this.uistate.hotitem = id;
            if (this.uistate.activeitem == 0 && this.uistate.mousedown) 
            {
                this.uistate.activeitem = id;
            }
        }
        // draw shadow
        fill('#000000');
        rect(x + 2, y + 2, w, h, 5);

        if (this.uistate.hotitem == id) 
        {
            if (this.uistate.activeitem == id) //Active
            {
                fill('#ffffff');
                rect(x + 2, y + 2, w, h, 5);
                fill('#000000');
                text(caption, x + 20 + 2, y + (h / 2) - 5 + 2);
            }
            else 
            {
                fill('#ffffff');                 //Hot
                rect(x, y, w, h, 5);
                fill('#000000');
                text(caption, x + 20, y + (h / 2) - 5);
            }
        }
        else                                    //Normal
        {
            fill('#aaaaaa');
            rect(x, y, w, h, 5);
            fill('#ffffff');
            text(caption, x + 20, y + (h / 2) - 5);
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
        var xpos = ( (200 - 20) * value.val)/max;

        //if mouse is over us, make us hot. if mouse is over us and the mouse is down and nothing else is active, make us active
        if (this.regionhit(x, y, 200, 20)) 
        {
            this.uistate.hotitem = id;  //keep track of hot item

            //if nothing else is active, we become active
            if (this.uistate.activeitem == 0 && this.uistate.mousedown) 
            {
                this.uistate.activeitem = id;
            }
        }
        fill(255, 0,0);
        fill('#000000');
        rect(x, y, 200, 20, 10);

        fill('#aaaaaa');
        rect(x+1, y+1, 200, 20, 10);

        fill('#000000');
        text(caption, x+60, y-20);

        //active or hot
        if (this.uistate.hotitem == id || this.uistate.activeitem == id) 
        {
            fill(200);
            circle(x + 7 + xpos, y + 10, 16 );
            fill('#ffffff');
            circle(x + 8 + xpos, y + 10, 16 );
        }
        else                                    //Normal
        {
            fill(120);
            circle(x + 7 + xpos, y + 10, 16 );
            fill('#C0C0C0');
            circle(x + 8 + xpos, y + 10, 16 );
        }

        if(this.uistate.activeitem == id)
        {
            var mousepos = mouseX - (x - 10);
            //Don't take out of bounds values
            if (mousepos < 0)
            mousepos = 0;

            if(mousepos> 200)
            mousepos = 200;

            //whats the value from the slider
            var v = (mousepos * max)/200;
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
}