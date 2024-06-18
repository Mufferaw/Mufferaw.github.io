function wave3d()
{
        this.name = "3D Waves";
        this.renderer = createGraphics(windowWidth, windowHeight,WEBGL);;
        this.obj = new p5.Geometry(); ///this is our mesh grid

        this.gid = 'custom';
        this.cam = this.renderer.createCamera();

        this.waves = [];// array to hold history of waves

        this.xSize = 64; //number of vertices along x
        this.zSize = 64; //number of vertices along z

        this.makeobj = function(a)
        {
        //set vertex positions
        for (var y = 0; y <= this.zSize; y++) 
        {
            for (var x = 0; x <= this.xSize; x++) 
            {
                a.vertices.push(createVector(x*5,0, y*3));
               // a.vertexColors.push(createVector(random(1), random(1), random(1)));
            }
        }
        //make an empty array of faces
        // for(var i = 0; i<(this.xSize*this.zSize* 2); i++)
        // {
        //     a.faces.push([0,0,0]);
        // }
        // a.faces=[];

        //Shorter way to do this (but probably slower): https://stackoverflow.com/questions/4852017/how-to-initialize-an-arrays-length-in-javascript?rq=1
        //https://gamealchemist.wordpress.com/2013/05/01/lets-get-those-javascript-arrays-to-work-fast/
        a.faces = Array(this.xSize*this.zSize* 2).fill([0,0,0]);

        //fancy loop to assign the vertices to faces. Reference: https://catlikecoding.com/unity/tutorials/procedural-grid/
        for (var ti = 0, vi = 0, y = 0; y < this.zSize; y++, vi++) 
        {
            for (var x = 0; x < this.xSize; x++, ti += 2, vi++) 
            {
                a.faces[ti] = [vi,vi + this.xSize + 1,vi + 1];
                a.faces[ti + 1] =[vi + 1, vi + this.xSize + 1, vi + this.xSize + 2];
            }
        }
    };

    this.makeNormals = function(obj)
    { 
        //https://www.iquilezles.org/www/articles/normals/normals.htm
        for(var v = 0; v< obj.vertices.length; v++)
        {
           obj.vertexNormals[v] = createVector(0,0,0);
        }
       
        for(var i= 0; i< obj.faces.length; i++)
        {
           var ia = obj.vertices[obj.faces[i][0]];
           var ib = obj.vertices[obj.faces[i][1]];
           var ic = obj.vertices[obj.faces[i][2]];
           
           var e1 = p5.Vector.sub(ia, ib);
           var e2 = p5.Vector.sub(ic, ib);
           var no = p5.Vector.cross(e1, e2);
   
           /*  use this to check if the mesh is messed up: From p5.normalize
           var mg = p5.Vector.mag(no);
   
           var sinAlpha =mg / (e1.mag() * e2.mag());
           if (sinAlpha === 0 || isNaN(sinAlpha)) 
           {
           console.warn('p5.Geometry.prototype._getFaceNormal:', 'face has colinear sides or a repeated vertex' );
           }
           */
           obj.vertexNormals[obj.faces[i][0]].add(no);
           obj.vertexNormals[obj.faces[i][1]].add(no);
           obj.vertexNormals[obj.faces[i][2]].add(no);
   
           obj.vertexNormals[obj.faces[i][0]].normalize();
           obj.vertexNormals[obj.faces[i][1]].normalize();
           obj.vertexNormals[obj.faces[i][2]].normalize();
        }
    }
        this.makeobj(this.obj); //build vertices and faces
        this.makeNormals(this.obj);// calculate normals, could proabably use the p5 function but it does some extra checks (like the one above) and god knows what else.
        this.renderer.background(0);
    

    this.draw = function()
    {
        this.renderer.reset();
        this.renderer.noStroke();

        //fourier.smooth();
        var wave = fourier.waveform(); //get the current waveform
    
        this.waves.push(wave); //and put it in the array
        //keep an array of waves, discard old ones
        if(this.waves.length > 32)
        {
          //remove from the top of the array
          this.waves.shift();
        }

        this.renderer.colorMode(HSB);
        // this.renderer.background(frameCount%360, 100, 0);
        this.renderer.background(0, 0, 0);
    
    
        //if we have some waves, map the heights of the waves to the mesh
        if(this.waves.length> 0)
        {
          for(var x = 0, i = 0; x<= this.xSize; x++)
          {       
              for (var  y = 0; y <= this.zSize; y++, i++) 
              {
                  var m = map(x, 0, this.xSize, 0, this.waves[0].length);
                  var w = map(y, 0, this.zSize, 0, this.waves.length-1);
                  this.obj.vertices[i].y = this.waves[round(w)][round(m)]*w*3; //taper the scaling off as the 'age' of the wave increases  
                }
            }
        }
        //we moved the vertices around in the loop above, so lets redo the normals
        this.makeNormals(this.obj);

        //position camera
        this.cam.setPosition(-100, 100, 400);
        this.cam.lookAt(0, 90, 400);

        this.renderer.colorMode(HSB);

        //lights
        this.renderer.pointLight(frameCount%360, 100, 100, -200, 50, 800);
        this.renderer.pointLight((90+frameCount)%360, 100, 100, -200, 50, 000);
        
        //set the material
        this.renderer.specularMaterial(frameCount%360, 100, 100);
        this.renderer.shininess(1);
        
        //make everything bigger
        this.renderer.scale(4, 4, 4);

        //p5js github had info about drawing custom meshes https://github.com/processing/p5.js/issues/2369
        this.renderer._renderer.createBuffers(this.gid, this.obj);
        this.renderer._renderer.drawBuffers(this.gid);
        //flip and draw again
        this.renderer.scale(1, -1, 1);
        this.renderer.translate(0, -40.0, 0);
        this.renderer.specularMaterial((180+frameCount)%360, 100, 20);
        this.renderer._renderer.drawBuffers(this.gid);
        //copy buffer to the canvas
        image(this.renderer, 0, 0, width, height);
    };
}