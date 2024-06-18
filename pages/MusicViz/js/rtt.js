function RTT ()
{
    this.name = "Rapidly Exploring Random Tree"
    
    //an array holding the positions of points
    var arr = [];

    //initial number of seed points in the array
    var numPoints = 1;

    //the kd-tree object
    var kdtree;
    
    //dimension of tree 
    var k = 2;
    
    //object to hold Nodes for the rapidly exploring random tree
    var rtt; 

    //node object for the RTT 
    var Node = function (x, y) {
        this.point = createVector(x, y);
        this.children = [];
        this.isRoot = false;
    };

    //Variables for line drawing
    //distance from kd-tree point for new points
    var branchlength=10; 
    //Color of the lines needs to be a string for the delve() function, p5.color.toString() doesnt format it properly
    var color1 ='hsl('+0+','+100+'%,'+30+'%)' ;

    var RTcanvas =  createGraphics(windowWidth, windowHeight);
    // Drawing context for the offscreen buffer (Part of an attempt to speed things up)
    var RTcanvasCTX;
    angleMode(DEGREES);

    //Same random numbers each run
    //randomSeed(99); 
        
    
    for (let i = 0; i < numPoints; i++) 
    {
        var p = createVector(random(width), random(height));
        arr.push(p);
        rtt = new Node(p.x, p.y);
        rtt.isRoot = true;
    }
    
    amplitude = new p5.Amplitude();
    
    
    
    this.draw = function () 
    {
        push();
        RTcanvas.push();
        fourier.analyze();
        var energy = fourier.getEnergy('bass', 'treble');
        
        RTcanvas.colorMode(RGB);
        //move a bit so the lines get a bit fuzzy/shaky
        RTcanvas.translate(sin(frameCount*energy) * 5, cos(frameCount*energy) * 5);
        RTcanvas.background(0, 0, 0, 25);
        RTcanvas.image(RTcanvas,-4,-4,RTcanvas.width+5,RTcanvas.height+5);
        

        //reset the RTT if it gets too big or if there is some activty in the song
        if ( (arr.length > 2000) || ( (energy > 242) && (arr.length > 100)) ) 
        {
            resetRTT();
            //String for the delve() function, p5.color.toString() doesnt format them properly.
            color1 = ('hsl('+frameCount%360+','+100+'%,'+50+'%)');
            RTcanvas.clear();
        }
        //Build the kd-tree based on the array of points
        kdtree = build_kdtree(arr);
        
        //Vary some parameters for our drawing
        var loopmul = map(amplitude.getLevel(), 0,1, 1, 20);
        //this is used in kd_add_closest() to determine the distance for new points
        branchlength = map(amplitude.getLevel(), 0,1, 2, 50);
      
        //How many points will be added each draw cycle, more points make the tree spread faster 
        for (var i = 0; i < loopmul+1; i++) 
        {
               var p = createVector((random(width)), floor(random(height)));
               kd_add_closest(p);
        }

        //Draw the RTT object
        drawRTT();
        
        //draw the offscreen buffer to the canvas
        image(RTcanvas,0,0,windowWidth,windowHeight);
        RTcanvas.pop();
        pop();
    }

    this.onResize = function()
    {
        var newPG = createGraphics(windowWidth, windowHeight);
        newPG.image(RTcanvas, 0, 0, newPG.width, newPG.height);
        RTcanvas = newPG;
        newPG.remove();
    };

    //
    function distance_squared(point1, point2) 
    {
        //So I don't need to write 'dist(pivot.x, pivot.y, p1.x, p1.y)**2' everywhere
        //https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#math-tips
        var x1 = point1.x;
        var y1 = point1.y;
        var x2 = point2.x;
        var y2 = point2.y;
        
        var dx = x1 - x2;
        var dy = y1 - y2;
        
        return dx * dx + dy * dy;
    }

    function closer_distance(pivot, p1, p2) 
    {
        //Which point is closer to 'pivot'
        if (p1 === null)
        return p2;
        
        if (p2 === null)
        return p1;
        
        var d1 = distance_squared(pivot, p1);
        var d2 = distance_squared(pivot, p2);
        
        if (d1 < d2)
        return p1;
        else
        return p2;
    }

    function drawRTT()
    {
        //Get the drawing context for the offscreen buffer (Part of an attempt to speed things up) and begin the line path here. delve() will make the lines for the path and then we'll close it and stroke it here.
        RTcanvasCTX = RTcanvas.canvas.getContext('2d');
        RTcanvasCTX.beginPath();
        RTcanvasCTX.strokeStyle = color1;
        delve(rtt);
        RTcanvasCTX.closePath();
        RTcanvasCTX.stroke();
    }
    
    function resetRTT() 
    {
        //reset the RTT object so we can start again
        var p = createVector(floor(random(width)), floor(random(height)));
        arr = [];
        arr.push(p);
        rtt = new Node(p.x, p.y);
        rtt.isRoot = true;
    }

    function rtt_add(root, point, closest) 
    {
        //the RTT object will be drawn on the screen, RTT nodes can have any number of children
        if (root.point.x == closest.x && root.point.y == closest.y) 
        {
           // root.children.push(new Node(point.x, point.y)); 
           //this is faster: https://gamealchemist.wordpress.com/2013/05/01/lets-get-those-javascript-arrays-to-work-fast/
            root.children[root.children.length] = new Node(point.x, point.y);
            return;
        }
        else 
        {
            for (var i = 0; i < root.children.length; i++) 
            {
                rtt_add(root.children[i], point, closest);
            }
        }
    }
    
    function kdtree_closest_point(root, point, depth = 0) 
    {
        //Find the closest kd-tree point to the 'point' argument
        
        //Nothing here
        if (root === null)
        return null;
        
        //Our tree is 2 dimensional (x,y), we search the points by different axes depending on our depth in the tree.
        var axis = depth % k;
        
        //We need to check the opposite branch when we recurse back up the tree, so we need to keep track of the branches
        var next_branch = null;
        var opposite_branch = null;
        
        if (axis === 0) 
        {
            if (point.x < root.point.x) 
            {
                next_branch = root.left;
                opposite_branch = root.right;
            }
            else 
            {
                next_branch = root.right;
                opposite_branch = root.left;
            }
        }
        else if (axis === 1) 
        {
            if (point.y < root.point.y) 
            {
                next_branch = root.left;
                opposite_branch = root.right;
            }
            else 
            {
                next_branch = root.right;
                opposite_branch = root.left;
            }
        }
        
        //Lets start checking. Keeping track of the 'best' closest point.
        var best = closer_distance(point, kdtree_closest_point(next_branch, point, depth + 1), root.point);
        
        //Now check the other side of the tree
        if (axis === 0) 
        {
            if (distance_squared(point, best) > (point.x - root.point.x) ** 2) 
            {
                best = closer_distance(point, kdtree_closest_point(opposite_branch, point, depth + 1), best);
            }
        }
        else if (axis === 1) 
        {
            if (distance_squared(point, best) > (point.y - root.point.y) ** 2) 
            {
                best = closer_distance(point, kdtree_closest_point(opposite_branch, point, depth + 1), best);
            }
        }
        //this is the closest one we can find, the best.
        return best;
    }
    
    function kd_add_closest(point) 
    {
        //We want to find the point in the kd-tree that is closest to the 'point' argument
        var closest = kdtree_closest_point(kdtree, point);
       
        //variable for the point we will add
        var newpoint = createVector();
                
        //We want to set the distance from the closest kd-tree point, so we will normalize the vector between the kd-tree point and our given point then set the magnitude to keep it within a radius of the kd-tree point. Changing the distance value (branchlength) can give different looks when drawing our tree. 
    
        var s = p5.Vector.sub(point, closest);
        s.normalize();
        s.setMag(branchlength); //branchlength is set in draw function
        //set the position of the newpoint
        newpoint = p5.Vector.add(closest, s);

        //Just stick it on the end
        //arr.push(newpoint);
        arr[arr.length] = newpoint; //slightly faster?

        //add to RTT object(the thing that gets drawn)
        rtt_add(rtt, newpoint, closest); 

        //This doesn't really add the point to the kd-tree, it only adds it to the array we use to build the kd-tree...and I shouldn't add the point to the RTT here either OR ...maybe this function should be renamed.
    }
    
    function kd_sort_x(a,b)
    {
        //sorting function, faster that using anonymous function
        return a.x - b.x;
    }

    function kd_sort_y(a,b)
    {
        //sorting function, faster that using anonymous function
        return a.y - b.y;
    }

    function build_kdtree(points, depth = 0) 
    {
        //How many points in this part of the tree
        var n = points.length;
        
        if (n <= 0) //No points, so we're done here
        return null;
        
        //In our case, the points are 2 dimensional (x,y), we sort the points by different axes depending on our depth in the tree. In this 2d case, we just alternate between x and y
        var axis = depth % k;
        
        //if we only have one point there is nothing to sort it against, so we just add it
        if (n === 1) 
        {
            return {
                'point': points[0],
                'left': null,
                'right': null
            };
        }
        
        //make a real copy of the points and not just a reference
        var sorted_points = [...points];
        
        // Array.sort needs to be given a sorting function to sort numbers properly, we could use an anonymous function but this is faster:https://gamealchemist.wordpress.com/2013/05/01/lets-get-those-javascript-arrays-to-work-fast/
        // Note the different sorting functions for different axes.
        if (axis === 0)
        //sorted_points.sort((a, b) => a.x - b.x); anonymous function is slow
        sorted_points.sort(kd_sort_x);
        else
        //sorted_points.sort((a, b) => a.y - b.y);
        sorted_points.sort(kd_sort_y);
        
        //We choose the middle point in the sorted array and recurse on each side to continue sorting. The points less than our middle point go to the left side and the greater-than points go right.
        return {
            'point': sorted_points[Math.floor(n / 2)],
            'left': build_kdtree(sorted_points.slice(0, Math.floor(n / 2)), depth + 1),
            'right': build_kdtree(sorted_points.slice(Math.floor(n / 2) + 1), depth + 1)
        };
    }
    
    function delve(root, depth = 0) 
    {
        //This adds RTT object points to a canvas path. It adds lines from the current node to all of its children
        //Drawing the lines is the slowest part of the sketch by far, too many points and lines will drop framerates. I've tried to speed this up, using the canvas context to make the line calls and stroke()ing it once as opposed to every node-child line.
        
        //Nothing to do here
        if (root.children.length === 0) 
        {
            return;
        }

        //try to make the lines thinner if they are further down the tree
        RTcanvasCTX.lineWidth = (2 - 0.05 * depth) * pixelDensity();
       
        for (var i = 0; i < root.children.length; i++) 
        {
            //these lines will be get closed and stroked when we return from this function
            RTcanvasCTX.moveTo(root.point.x, root.point.y);
            RTcanvasCTX.lineTo(root.children[i].point.x, root.children[i].point.y);

            //recurse through the children
            delve(root.children[i], depth + 1);
        }
    }
    
}