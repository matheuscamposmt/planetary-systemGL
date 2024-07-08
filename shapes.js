/* Classes contendo a definição de objetos gráficos e classes básicas como cor, vetores 2d e 3d */
    
class Vec2d{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class Vec3d{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Color{
    constructor (r,g,b,a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}


class Shape{
    constructor (color){
        this.color = color;
    }
    draw() {
        throw new Error("Method 'draw()' must be implemented.");
    }
}

//Represents a point
class Point2d extends Shape{
    constructor (x,y,color,size = 1){
        super(color);
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
    }
}

class Point3d extends Shape{
    constructor (x,y,z,color,size = 1){
        super(color);
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
        this.size = size;
    }
}


class Circle extends Shape{
    constructor(cx,cy,radius,color,numSubdiv){
        super(color);
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.numSubdiv = numSubdiv;
    }

    evaluate(ang){
        var x,y;
        x = this.radius*Math.cos(ang)+this.cx;
        y = this.radius*Math.sin(ang)+this.cy;
        return [x,y];
    }

    discreticize(numSubdiv,coords,indices,colors){
        var delta = 2*Math.PI/numSubdiv;
        var i;
        for (i=0;i<numSubdiv;i++){
            var p = this.evaluate(i*delta);
            coords[3*i] = p[0];
            coords[3*i+1] = p[1];
            coords[3*i+2] = 0.0;

            colors[3*i] = this.color.r;
            colors[3*i+1] = this.color.g;
            colors[3*i+2] = this.color.b;

            indices[i] = i;
        }
    }

    discreticizeFilled(numSubdiv,coords,indices,colors){
        var delta = 2*Math.PI/numSubdiv;
        var i,j;

        coords[0] = 0.0+this.cx;
        coords[1] = 0.0+this.cy;
        coords[2] = 0.0;
        
        colors[0] = this.color.r;
        colors[1] = this.color.g;
        colors[2] = this.color.b;
        
        for (i=0,j=3;i<numSubdiv;){
            var p = this.evaluate(i*delta);
            //alert("("+p[0]+","+p[1]+")");
            coords[j] = p[0];
            coords[j+1] = p[1];
            coords[j+2] = 0.0;

            //colors[j] = 3*Math.random()/5;
            //colors[j+1] = 2*Math.random()/5;
            //colors[j+2] = 1*Math.random()/5;

            colors[j] = this.color.r;
            colors[j+1] = this.color.g;
            colors[j+2] = this.color.b;

            indices[3*i] = 0;
            indices[3*i+1] = (i+2)>numSubdiv?1:(i+2);
            indices[3*i+2] = i+1;
            i++;
            j+=3

        }
    }
}

class Triangle extends Shape{
    constructor (p0,p1,p2,color){
        super(color);
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        //this.color = c;
    }  
}


class TriangleList{
    constructor(){
        this.list = []
    }

    get size(){
        return this.list.length;
    }

    push(triangle){
        this.list.push(triangle);
    }

    // Draw all points in the poit list
    draw(){
    
        var i;
        for (i=0;i<this.size;i++){
            //Get a point
            var triangle = this.list[i];
            triangle.draw();
        }
    }
}

//Describes a point list data structure
class PointList{
    constructor(){
        this.list = []
    }

    get size(){
        return this.list.length;
    }


    push(point){
        this.list.push(point);
    }

    // Draw all points in the poit list
    draw(){
    
        var i;
        for (i=0;i<this.size;i++){
            //Get a point
            var point = this.list[i];
            point.draw();
        }
    }
}

class Polygon extends Shape{
    constructor(color,interpolation){
        super(color);
        this.pointList = new PointList();
        this.interpolation = interpolation;
    }

    push(point){
        this.pointList.push(point);
    }
}    


function gcd(a, b) {
    var resto = a%b;
    if (resto==0) {
        return b;
    }
    else{
        return gcd(b, resto);
    }
}

//Baseado em: https://www.geeksforgeeks.org/program-to-calculate-the-value-of-ncr-efficiently/

function nCr(n, r){
    
    // p holds the value of n*(n-1)*(n-2)...,
    // k holds the value of r*(r-1)...
    var p = 1;
    var k = 1;

    // C(n, r) == C(n, n-r),
    // choosing the smaller value
    if (n - r < r){
        r = n - r;
    }

    if (r != 0) {
        while (r) {
            p *= n;
            k *= r;
            // gcd of p, k
            m = gcd(p, k);
            // dividing by gcd, to simplify
            // product division by their gcd
            // saves from the overflow
            p /= m;
            k /= m;
            n--;
            r--;
        }
        // k should be simplified to 1
        // as C(n, r) is a natural number
        // (denominator should be 1 ) .
    }
    else{
        p = 1;
    }

    return p;
}  
    
function bezier_func(t,n,pts){
    var i;
    var pt = [0.0,0.0,0.0];

    for (i=0;i<=n;i++){
        var a = Math.pow(1-t,n-i);
        var b = Math.pow(t,i);
        var comb = nCr(n,i);
        pt[0] += comb*a*b*pts.list[i].x; //x(t)
        pt[1] += comb*a*b*pts.list[i].y; //y(t)
        if (pts.list[i].z !== undefined){
            pt[2] += comb*a*b*pts.list[i].z; //z(t)
        }
        else{
            pt[2] += 0.0;
        }
    }

    return pt;
}
  

class Bezier extends Shape{
    constructor (controlPoints, degree, color){
        super(color);  
        this.degree = degree;
        this.controlPoints = controlPoints;
        this.color = color;
        }
        
    discreticize(n_div,coords,colors,indices,indicesEdges,coordsPol,colorsPol,indicesPol,indicesEdgesPol){
        var delta = 1/n_div;

        var i = 0;
        var pt;
        for (i = 0;i<=n_div;i++){
            var t = i*delta;
            pt = bezier_func(t,this.degree,this.controlPoints);

            coords.push(pt[0]);
            coords.push(pt[1]);
            coords.push(pt[2]);

            colors.push(this.color.r);
            colors.push(this.color.g);
            colors.push(this.color.b);
            
            indices.push(i);
        }

        
        for (i = 0;i<n_div;i++){
            indicesEdges.push(i);
            indicesEdges.push((i+1));
        }
        
        for (i = 0; i<this.controlPoints.size;i++){
            coordsPol.push(this.controlPoints.list[i].x);
            coordsPol.push(this.controlPoints.list[i].y);
            if (this.controlPoints.list[i].z !== undefined){
                coordsPol.push(this.controlPoints.list[i].z);
            }
            else{
                coordsPol.push(0.0);
            }
    
            colorsPol.push(1.0);
            colorsPol.push(0.0);
            colorsPol.push(0.0);

            indicesPol.push(i);

        }

        for (i = 0;i<this.controlPoints.size-1;i++){
            indicesEdgesPol.push(i);
            indicesEdgesPol.push(i+1);
        }          
    }
}


function NB(i, p, t, knots){

    var m = knots.length-1;
    
    if (((i==0)&&(t==knots[0]))||((i==m-p-1)&&(t==knots[m]))){
        return 1;
    }
    /* else if (t<knots[i]||t>=knots[i+p+1]){
    return 0;
    }*/
    else 
    if (p==0){
    if ((knots[i]<=t) && (t<knots[i+1])){
        return 1;
    }
    else{
        return 0;
    }
    }
    else{
        
    var a = t - knots[i];
    var b = knots[i+p] - knots[i];
    var c = knots[i+p+1] - t;
    var d = knots[i+p+1] - knots[i+1];

    var m = 0;
    var n = 0;
    if (b!=0){
        m = a/b;
    }
    if (d!=0){
        n = c/d;
    }
    
    return m*NB(i,p-1,t,knots)+n*NB(i+1,p-1,t,knots);
    }
    
}

function find_span(t,p,knots,m){
    /*var n = m-p-1;
    if (t==knots[n]){
        return n-1;
    }
    else{*/
        var i;
        for (i=0;i<m;i++){
        if ((knots[i]<=t)&&(t<knots[i+1])){
            return i;
        }
        }
    //}
}


function compute_basis(span,t,p,knots,nPts,N){
    var i;
    var sum = 0.0;
    var res = false;
    for (i=0;i<nPts;i++){
        N[i] = 0.0;
    }
    for (i=0;i<nPts;i++){
        N[i] = NB(i,p,t,knots);
        if (N[i]!=0){
        sum += N[i];
        }
    }
    if ((sum - 1.0) < 0.01){
        res = true;
    }
    return res;
}
  
function bspline_func(t,p,pts,knots,m,pt){
    var i  = 0;

    span = find_span(t,p,knots,m);
    var N = [];
    var res = compute_basis(span,t,p,knots,pts.size,N);
    if (res == false){
        alert("erro");
    }
    for (i=0;i<pts.size;i++){
            pt[0] = pt[0] + pts.list[i].x*N[i];
            pt[1] = pt[1] + pts.list[i].y*N[i];
            if (pts.list[i].z !== undefined){
                pt[2] = pt[2] + pts.list[i].z*N[i];
            }
            else{
                pt[2] += 0.0;
            }
    }
    //return res;
}
  
  
class BSpline extends Shape{   
    constructor (controlPoints, knots, degree, color){
        super(color);
        this.controlPoints = controlPoints;
        this.knots = knots;
        this.degree = degree;
        //this.color = color;    
    }

    discreticize(n_div,coords,colors,indices,indicesEdges,coordsPol,colorsPol,indicesPol,indicesEdgesPol){
        var m = this.knots.length;
        var p = this.degree;
        var ini = this.knots[p];
        var end = this.knots[m-p-1];
        var delta = (end-ini)/n_div;

        var pt = []; 
        var t = ini;
        var pts = this.controlPoints;

        var i = 0;
        for (i=0;i<=n_div;i++){
            pt[0] = 0.0;
            pt[1] = 0.0;
            pt[2] = 0.0;

            bspline_func(t,p,pts,this.knots,m,pt);

            coords.push(pt[0]);
            coords.push(pt[1]);
            coords.push(pt[2]);

            colors.push(this.color.r);
            colors.push(this.color.g);
            colors.push(this.color.b);
            
            indices.push(i);
            t += delta;
            if (t>end){t=end;}
        

        }

        var j = 0;
        for (j = 0;j<n_div;j++){
            indicesEdges.push(j);
            indicesEdges.push((j+1));
        }

        for (i = 0; i<this.controlPoints.size;i++){
            coordsPol.push(this.controlPoints.list[i].x);
            coordsPol.push(this.controlPoints.list[i].y);
            if (this.controlPoints.list[i].z !== undefined){
                coordsPol.push(this.controlPoints.list[i].z);
            }
            else{
                coordsPol.push(0.0);
            }
    
            colorsPol.push(1.0);
            colorsPol.push(0.0);
            colorsPol.push(0.0);

            indicesPol.push(i);

        }

        for (i = 0;i<this.controlPoints.size-1;i++){
            indicesEdgesPol.push(i);
            indicesEdgesPol.push(i+1);
        }
    }
}
  
class Cube extends Shape{
    constructor(color,textureName){
        super(color);

        this.coords = [
            -1.0, -1.0, -1.0,  //A0
            -1.0, -1.0, -1.0,  //A1
            -1.0, -1.0, -1.0,  //A2
            -1.0, -1.0,  1.0,  //B0  
            -1.0, -1.0,  1.0,  //B1  
            -1.0, -1.0,  1.0,  //B2  
            -1.0, -1.0,  1.0,  //B3  
            -1.0, -1.0,  1.0,  //B4  
            -1.0, -1.0,  1.0,  //B5 
            1.0, -1.0,  1.0,  //C0  
            1.0, -1.0,  1.0,  //C1  
            1.0, -1.0,  1.0,  //C2  
            1.0, -1.0, -1.0,  //D0
            1.0, -1.0, -1.0,  //D1
            1.0, -1.0, -1.0,  //D2
            1.0, -1.0, -1.0,  //D3
            1.0, -1.0, -1.0,  //D4
            1.0, -1.0, -1.0,  //D5
            -1.0,  1.0, -1.0,  //E0
            -1.0,  1.0, -1.0,  //E1
            -1.0,  1.0, -1.0,  //E2
            -1.0,  1.0, -1.0,  //E3
            -1.0,  1.0, -1.0,  //E4
            -1.0,  1.0, -1.0,  //E5
            -1.0,  1.0,  1.0,  //F0
            -1.0,  1.0,  1.0,  //F1
            -1.0,  1.0,  1.0,  //F2
            1.0,  1.0,  1.0,  //G0  
            1.0,  1.0,  1.0,  //G1  
            1.0,  1.0,  1.0,  //G2  
            1.0,  1.0,  1.0,  //G3  
            1.0,  1.0,  1.0,  //G4  
            1.0,  1.0,  1.0,  //G5
            1.0,  1.0, -1.0,  //H0  
            1.0,  1.0, -1.0,  //H1  
            1.0,  1.0, -1.0,  //H2  
        ];
        
        var i;

        if (color != undefined){
            this.colors = [];
            for (i = 0; i < this.coords.length;i++){
                this.colors.push(this.color.r);
                this.colors.push(this.color.g);
                this.colors.push(this.color.b);
            }
        }
        else{      
            this.colors = [
                1.0,  0.0,  0.0,  //A0 - 0
                1.0,  1.0,  0.0,  //A1 - 1
                0.5,  0.5,  0.5,  //A2 - 2
                1.0,  0.0,  0.0,  //B0 - 3 
                1.0,  0.0,  0.0,  //B1 - 4 
                0.0,  1.0,  0.0,  //B2 - 5 
                0.0,  1.0,  0.0,  //B3 - 6 
                0.5,  0.5,  0.5,  //B4 - 7 
                0.5,  0.5,  0.5,  //B5 - 8 
                1.0,  0.0,  0.0,  //C0 - 9 
                0.0,  1.0,  0.0,  //C1 - 10 
                0.0,  0.0,  1.0,  //C2 - 11 
                1.0,  0.0,  0.0,  //D0 - 12
                1.0,  0.0,  0.0,  //D1 - 13
                0.0,  0.0,  1.0,  //D2 - 14
                0.0,  0.0,  1.0,  //D3 - 15
                1.0,  1.0,  0.0,  //D4 - 16
                1.0,  1.0,  0.0,  //D5 - 17
                1.0,  1.0,  0.0,  //E0 - 18
                1.0,  1.0,  0.0,  //E1 - 19
                0.5,  0.5,  0.5,  //E2 - 20
                0.5,  0.5,  0.5,  //E3 - 21
                1.0,  0.0,  1.0,  //E4 - 22
                1.0,  0.0,  1.0,  //E5 - 23
                0.0,  1.0,  0.0,  //F0 - 24
                0.5,  0.5,  0.5,  //F1 - 25
                1.0,  0.0,  1.0,  //F2 - 26
                0.0,  1.0,  0.0,  //G0 - 27   
                0.0,  1.0,  0.0,  //G1 - 28 
                0.0,  0.0,  1.0,  //G2 - 29 
                0.0,  0.0,  1.0,  //G3 - 30 
                1.0,  0.0,  1.0,  //G4 - 31 
                1.0,  0.0,  1.0,  //G5 - 32
                0.0,  0.0,  1.0,  //H0 - 33 
                1.0,  1.0,  0.0,  //H1 - 34 
                1.0,  0.0,  1.0,  //H2 - 35 
            ];
        }
        
        this.normals = [
            0.0, -1.0,  0.0,  //A0 - 0
            0.0,  0.0, -1.0,  //A1 - 1
            -1.0,  0.0,  0.0,  //A2 - 2
            0.0, -1.0,  0.0,  //B0 - 3 
            0.0, -1.0,  0.0,  //B1 - 4 
            0.0,  0.0,  1.0,  //B2 - 5 
            0.0,  0.0,  1.0,  //B3 - 6 
            -1.0,  0.0,  0.0,  //B4 - 7 
            -1.0,  0.0,  0.0,  //B5 - 8 
            0.0, -1.0,  0.0,  //C0 - 9 
            0.0,  0.0,  1.0,  //C1 - 10 
            1.0,  0.0,  0.0,  //C2 - 11 
            0.0, -1.0,  0.0,  //D0 - 12
            0.0, -1.0,  0.0,  //D1 - 13
            1.0,  0.0,  0.0,  //D2 - 14
            1.0,  0.0,  0.0,  //D3 - 15
            0.0,  0.0, -1.0,  //D4 - 16
            0.0,  0.0, -1.0,  //D5 - 17
            0.0,  0.0, -1.0,  //E0 - 18
            0.0,  0.0, -1.0,  //E1 - 19
            -1.0,  0.0,  0.0,  //E2 - 20
            -1.0,  0.0,  0.0,  //E3 - 21
            0.0,  1.0,  0.0,  //E4 - 22
            0.0,  1.0,  0.0,  //E5 - 23
            0.0,  0.0,  1.0,  //F0 - 24
            -1.0,  0.0,  0.0,  //F1 - 25
            0.0,  1.0,  0.0,  //F2 - 26
            0.0,  0.0,  1.0,  //G0 - 27   
            0.0,  0.0,  1.0,  //G1 - 28 
            1.0,  0.0,  0.0,  //G2 - 29 
            1.0,  0.0,  0.0,  //G3 - 30 
            0.0,  1.0,  0.0,  //G4 - 31 
            0.0,  1.0,  0.0,  //G5 - 32
            1.0,  0.0,  0.0,  //H0 - 33 
            0.0,  0.0, -1.0,  //H1 - 34 
            0.0,  1.0,  0.0,  //H2 - 35 
            ];
        
            
        this.textureCoords = [
            0.0,  0.0,  //A0 - 0
            1.0,  0.0,  //A1 - 1
            0.0,  0.0,  //A2 - 2
            0.0,  1.0,  //B0 - 3 
            0.0,  1.0,  //B1 - 4 
            0.0,  0.0,  //B2 - 5 
            0.0,  0.0,  //B3 - 6 
            1.0,  0.0,  //B4 - 7 
            1.0,  0.0,  //B5 - 8 
            1.0,  1.0,  //C0 - 9 
            1.0,  0.0,  //C1 - 10 
            0.0,  0.0,  //C2 - 11 
            1.0,  0.0,  //D0 - 12
            1.0,  0.0,  //D1 - 13
            1.0,  0.0,  //D2 - 14
            1.0,  0.0,  //D3 - 15
            0.0,  0.0,  //D4 - 16
            0.0,  0.0,  //D5 - 17
            1.0,  1.0,  //E0 - 18
            1.0,  1.0,  //E1 - 19
            0.0,  1.0,  //E2 - 20
            0.0,  1.0,  //E3 - 21
            0.0,  1.0,  //E4 - 22
            0.0,  1.0,  //E5 - 23
            0.0,  1.0,  //F0 - 24
            1.0,  1.0,  //F1 - 25
            0.0,  0.0,  //F2 - 26
            1.0,  1.0,  //G0 - 27   
            1.0,  1.0,  //G1 - 28 
            0.0,  1.0,  //G2 - 29 
            0.0,  1.0,  //G3 - 30 
            1.0,  0.0,  //G4 - 31 
            1.0,  0.0,  //G5 - 32
            1.0,  1.0,  //H0 - 33 
            0.0,  1.0,  //H1 - 34 
            1.0,  1.0,  //H2 - 35 
        ];
        
            
        this.indicesTriangles = [  
            0, 12,  3, //A0 D0 B0
            4, 13,  9, //B1 D1 C0
            5, 27, 24, //B2 G0 F0
            6, 10, 28, //B3 C1 G1
            11, 14, 29, //C2 D2 G2
            15, 33, 30, //D3 H0 G3
            16, 18, 34, //D4 E0 H1
            1, 17, 19, //A1 D5 E1
            2,  7, 20, //A2 B4 E2
            8, 25, 21, //B5 F1 E3
            22, 26, 31, //E4 F2 G4
            23, 32, 35  //E5 G5 H2
        ];

        this.indicesLines = [];
        
        var i;  
        
        for (i = 0; i<this.indicesTriangles.length;i+=3){
            this.indicesLines.push(this.indicesTriangles[i]);
            this.indicesLines.push(this.indicesTriangles[i+1]);
            this.indicesLines.push(this.indicesTriangles[i+1]);
            this.indicesLines.push(this.indicesTriangles[i+2]);
            this.indicesLines.push(this.indicesTriangles[i+2]);
            this.indicesLines.push(this.indicesTriangles[i]);
        }
        
        this.indicesPoints = [];
        for (i=0;i<Math.floor(this.coords.length/3.0);i++){
            this.indicesPoints.push(i);
        }
        
        this.textureName = textureName;
    }
}


class Cylinder extends Shape{
    constructor(radius,length,div_u,div_v,color,textureName){
      super(color,textureName);
      this.div_u = div_u;
      this.div_v = div_v;
      this.length = length;
      this.radius = radius;
  
      var delta_u = 2*Math.PI/div_u;
      var delta_v = this.length/div_v;
      var teta, rho = this.radius;
  
      this.coords = [];
      this.colors = [];
      this.normals = [];
      this.textureCoords = [];
  
      var i,j;
  
      for (i=0;i<=this.div_v;i++){
        for (j=0;j<=this.div_u;j++){
              
              teta = j*delta_u;
              var x,y,z;
              var nx,ny,nz;
  
              x = rho*Math.cos(teta);
              y = rho*Math.sin(teta);
              z = (-this.length/2.0)+i*delta_v;
              this.coords.push(x);
              this.coords.push(y);
              this.coords.push(z);
              
              var normal_norm = Math.sqrt(x*x+y*y);
              
              if (normal_norm>GeomUtils.EPS){
                x /=normal_norm;
                y /=normal_norm;
              }
  
              this.normals.push(x);
              this.normals.push(y);
              this.normals.push(0.0);
  
              this.colors.push(this.color.r);
              this.colors.push(this.color.g);
              this.colors.push(this.color.b);
  
          }
      }
  
      
      // Front cap and Back cap
      // First the front and back rings are defined and
      // finally the two last central vertices
      for (j=0;j<=this.div_u;j++){
              
        teta = j*delta_u;
        var x,y,z;
        var nx,ny,nz;
  
        x = rho*Math.cos(teta);
        y = rho*Math.sin(teta);
        z = -this.length/2.0;
        this.coords.push(x);
        this.coords.push(y);
        this.coords.push(z);
        
        var normal_norm = Math.sqrt(x*x+y*y);
        
        if (normal_norm>GeomUtils.EPS){
          x /=normal_norm;
          y /=normal_norm;
        }
  
        this.normals.push(0.0);
        this.normals.push(0.0);
        this.normals.push(-1.0);
        this.colors.push(this.color.r);
        this.colors.push(this.color.g);
        this.colors.push(this.color.b);
  
      }
  
      for (j=0;j<=this.div_u;j++){
              
        teta = j*delta_u;
        var x,y,z;
        var nx,ny,nz;
  
        x = rho*Math.cos(teta);
        y = rho*Math.sin(teta);
        z = this.div_v*delta_v-this.length/2.0;
        this.coords.push(x);
        this.coords.push(y);
        this.coords.push(z);
        
        var normal_norm = Math.sqrt(x*x+y*y);
        
        if (normal_norm>GeomUtils.EPS){
          x /=normal_norm;
          y /=normal_norm;
        }
  
        this.normals.push(0.0);
        this.normals.push(0.0);
        this.normals.push(1.0);
        this.colors.push(this.color.r);
        this.colors.push(this.color.g);
        this.colors.push(this.color.b);
      }
  
  
      this.coords.push(0.0);
      this.coords.push(0.0);
      this.coords.push(-this.length/2.0);
      this.colors.push(this.color.r);
      this.colors.push(this.color.g);
      this.colors.push(this.color.b);
      this.normals.push(0.0);
      this.normals.push(0.0);
      this.normals.push(-1.0);
  
      this.coords.push(0.0);
      this.coords.push(0.0);
      this.coords.push(this.length/2.0);
      this.colors.push(this.color.r);
      this.colors.push(this.color.g);
      this.colors.push(this.color.b);
      this.normals.push(0.0);
      this.normals.push(0.0);
      this.normals.push(1.0);
  
      for (i=0;i<=this.div_v;i++){
        for (j=0;j<=this.div_u;j++){
              var x = i*1.0/div_u;
              var y = j*1.0/div_v;
              this.textureCoords.push(x);
              this.textureCoords.push(y);
          
          }
      }
  
      this.indicesTriangles = [];
      var i,j;
      for (i = 0; i<this.div_v;i++){
          for (j=0; j<this.div_u;j++){
            
            var index = (j)+(i)*(div_u+1);
            var indexR = ((j+1))+(i)*(div_u+1);
            var indexU = (j)+(i+1)*(div_u+1);
            var indexRU = ((j+1))+(i+1)*(div_u+1);
  
            this.indicesTriangles.push(index);
            this.indicesTriangles.push(indexR);
            this.indicesTriangles.push(indexRU);
            this.indicesTriangles.push(index);
            this.indicesTriangles.push(indexRU);
            this.indicesTriangles.push(indexU);
          }
      }
  
      for (j = 0; j<this.div_u;j++){
        var index = (j)+(div_v+1)*(div_u+1);
        var indexR = ((j+1))+(div_v+1)*(div_u+1);
        var indexD = (div_v+3)*(div_u+1);
        this.indicesTriangles.push(indexR);
        this.indicesTriangles.push(index);
        this.indicesTriangles.push(indexD);
      }
  
      for (j = 0; j<this.div_u;j++){
        var index = (j)+(div_v+2)*(div_u+1);
        var indexR = ((j+1))+(div_v+2)*(div_u+1);
        var indexD = (div_v+3)*(div_u+1)+1;
        this.indicesTriangles.push(index);
        this.indicesTriangles.push(indexR);
        this.indicesTriangles.push(indexD);
      }
  
  
      this.indicesLines = [];
  
      var i;  
      for (i = 0; i<this.indicesTriangles.length;i+=3){
        this.indicesLines.push(this.indicesTriangles[i]);
        this.indicesLines.push(this.indicesTriangles[i+1]);
        this.indicesLines.push(this.indicesTriangles[i+1]);
        this.indicesLines.push(this.indicesTriangles[i+2]);
        this.indicesLines.push(this.indicesTriangles[i+2]);
        this.indicesLines.push(this.indicesTriangles[i]);
      }
  
      this.indicesPoints = [];
      for (i=0;i<Math.floor(this.coords.length/3.0);i++){
        this.indicesPoints.push(i);
      }
    }  
  } 

  
  class RevolutionSurface extends Shape{
    constructor(pointList,div_u,color,textureName){
      super(color,textureName);
      this.div_u = div_u;
      
      var delta_u = 2*Math.PI/div_u;
      var teta,rho;
  
      this.coords = [];
      this.colors = [];
      this.normals = [];
      this.textureCoords = [];
  
      var i,j;

      // compute point list normals

      var pointListNormals = [];

      pointListNormals.push(new Vec3d(1.0,0.0,0.0));
     
      for (i=1;i<pointList.size-1;i++){
        var pa = pointList.list[i-1];
        var pb = pointList.list[i+1];
        var p = pointList.list[i];

        var u = new Vec3d(p.z-pa.z,0.0,-(p.x-pa.x));
        var v = new Vec3d(pb.z-p.z,0.0,-(pb.x-p.x));
        var w = new Vec3d(u.x+v.x,0.0,u.z+v.z);
        var norm = Math.sqrt(w.x*w.x+w.y*w.y+w.z*w.z);

        if (norm>GeomUtils.EPS){
            w.x /= norm;
            w.y /= norm;
            w.z /= norm;
        }

        pointListNormals.push(new Vec3d(w.x,w.y,w.z));
      }

      pointListNormals.push(new Vec3d(1.0,0.0,0.0));

  
      for (i=0;i<pointList.size;i++){

        var p = pointList.list[i];
        var normal = pointListNormals[i];

        for (j=0;j<=this.div_u;j++){
              
              teta = j*delta_u;
              rho = Math.sqrt(p.x*p.x+p.y*p.y);
              var x,y,z;
       
  
              x = rho*Math.cos(teta);
              y = rho*Math.sin(teta);
              z = p.z;

              this.coords.push(x);
              this.coords.push(y);
              this.coords.push(z);
    
              var nx,ny,nz;

              nx = normal.x*Math.cos(teta)-normal.y*Math.sin(teta); 
              ny = normal.x*Math.sin(teta)+normal.y*Math.cos(teta);
              nz = normal.z;

              var normal_norm = Math.sqrt(nx*nx+ny*ny+nz*nz);
              
              if (normal_norm>GeomUtils.EPS){
                nx /=normal_norm;
                ny /=normal_norm;
                nz /=normal_norm;
              }
  
              this.normals.push(nx);
              this.normals.push(ny);
              this.normals.push(nz);


              this.colors.push(this.color.r);
              this.colors.push(this.color.g);
              this.colors.push(this.color.b);
  
          }
      }
  
     
      // Front cap and Back cap
      // First the front and back rings are defined and
      // finally the two last central vertices
      for (j=0;j<=this.div_u;j++){

        var p = pointList.list[0];      
        var teta = j*delta_u;
        var x,y,z;
        var rho = Math.sqrt(p.x*p.x+p.y*p.y);
  
        x = rho*Math.cos(teta);
        y = rho*Math.sin(teta);
        z = p.z;
        this.coords.push(x);
        this.coords.push(y);
        this.coords.push(z);
        
        this.normals.push(0.0);
        this.normals.push(0.0);
        this.normals.push(-1.0);
        this.colors.push(this.color.r);
        this.colors.push(this.color.g);
        this.colors.push(this.color.b);
  
      }
  
      for (j=0;j<=this.div_u;j++){
        var p = pointList.list[pointList.size-1];      
        var teta = j*delta_u;
        var x,y,z;
        var rho = Math.sqrt(p.x*p.x+p.y*p.y);
             
        x = rho*Math.cos(teta);
        y = rho*Math.sin(teta);
        z = p.z;
        this.coords.push(x);
        this.coords.push(y);
        this.coords.push(z);
        
        this.normals.push(0.0);
        this.normals.push(0.0);
        this.normals.push(1.0);
        this.colors.push(this.color.r);
        this.colors.push(this.color.g);
        this.colors.push(this.color.b);
      }
  
  

      this.coords.push(0.0);
      this.coords.push(0.0);
      this.coords.push(pointList.list[0].z);
      this.colors.push(this.color.r);
      this.colors.push(this.color.g);
      this.colors.push(this.color.b);
      this.normals.push(0.0);
      this.normals.push(0.0);
      this.normals.push(-1.0);
 
      this.coords.push(0.0);
      this.coords.push(0.0);
      this.coords.push(pointList.list[pointList.size-1].z);
      this.colors.push(this.color.r);
      this.colors.push(this.color.g);
      this.colors.push(this.color.b);
      this.normals.push(0.0);
      this.normals.push(0.0);
      this.normals.push(1.0);
 
      var pos = pointList.size-1;
      
      for (i=0;i<=pos;i++){
        for (j=0;j<=this.div_u;j++){
              var x = i*1.0/div_u;
              var y = j*1.0/pos;
              this.textureCoords.push(x);
              this.textureCoords.push(y);
          
          }
      }


      
      this.indicesTriangles = [];
      var i,j;
      for (i = 0; i<pos; i++){
          for (j=0; j<this.div_u;j++){
            
            var index = (j)+(i)*(div_u+1);
            var indexR = ((j+1))+(i)*(div_u+1);
            var indexU = (j)+(i+1)*(div_u+1);
            var indexRU = ((j+1))+(i+1)*(div_u+1);
  
            this.indicesTriangles.push(index);
            this.indicesTriangles.push(indexR);
            this.indicesTriangles.push(indexRU);
            this.indicesTriangles.push(index);
            this.indicesTriangles.push(indexRU);
            this.indicesTriangles.push(indexU);
          }
      }
  
      
      for (j = 0; j<this.div_u;j++){
        var index = (j)+(pos+1)*(div_u+1);
        var indexR = ((j+1))+(pos+1)*(div_u+1);
        var indexD = (pos+3)*(div_u+1);
        this.indicesTriangles.push(indexR);
        this.indicesTriangles.push(index);
        this.indicesTriangles.push(indexD);
      }
  
      for (j = 0; j<this.div_u;j++){
        var index = (j)+(pos+2)*(div_u+1);
        var indexR = ((j+1))+(pos+2)*(div_u+1);
        var indexD = (pos+3)*(div_u+1)+1;
        this.indicesTriangles.push(index);
        this.indicesTriangles.push(indexR);
        this.indicesTriangles.push(indexD);
      }
  
  
      this.indicesLines = [];
  
      var i;  
      for (i = 0; i<this.indicesTriangles.length;i+=3){
        this.indicesLines.push(this.indicesTriangles[i]);
        this.indicesLines.push(this.indicesTriangles[i+1]);
        this.indicesLines.push(this.indicesTriangles[i+1]);
        this.indicesLines.push(this.indicesTriangles[i+2]);
        this.indicesLines.push(this.indicesTriangles[i+2]);
        this.indicesLines.push(this.indicesTriangles[i]);
      }
  
      this.indicesPoints = [];
      for (i=0;i<Math.floor(this.coords.length/3.0);i++){
        this.indicesPoints.push(i);
      }
    }  
  } 


  class Sphere extends Shape{
    constructor(radius,div_u,div_v,color,textureName){
      super(color,textureName);
      this.div_u = div_u;
      this.div_v = div_v;
      this.radius = radius;
    
      var delta_u = 2*Math.PI/div_u;
      var delta_v = Math.PI/div_v;
      var teta, phi, rho = this.radius;
  
      this.coords = [];
      this.colors = [];
      this.normals = [];
      this.textureCoords = [];
  
      var i,j;
  
      /*
      var colors = [
        1.0,  1.0,  1.0,
        0.0,  1.0,  0.0,
        0.0,  0.0,  1.0, 
        1.0,  1.0,  0.0,
        0.0,  1.0,  1.0,
        1.0,  0.0,  1.0,
        0.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
      ];*/
    
      for (i=0;i<=this.div_v;i++){
        for (j=0;j<=this.div_u;j++){
              phi =  i*delta_v;
              teta = j*delta_u;
              var x,y,z;
  
              x = rho*Math.sin(phi)*Math.cos(teta);
              y = rho*Math.sin(phi)*Math.sin(teta);
              z = rho*Math.cos(phi);
              
              var ex = Math.random();
              var ey = Math.random();
              var ez = Math.random();
   
              var normal_norm = Math.sqrt(x*x+y*y+z*z);
              
              var nx,ny,nz;

              if (normal_norm>GeomUtils.EPS){
                nx = x/normal_norm;
                ny = y/normal_norm;
                nz = z/normal_norm;
              }
  

              this.coords.push(x);
              this.coords.push(y);
              this.coords.push(z);
              this.colors.push(color.r);
              this.colors.push(color.g);
              this.colors.push(color.b);
              
   
              
              this.normals.push(nx);
              this.normals.push(ny);
              this.normals.push(nz);
              //this.colors.push(colors[(3*i)%4]);
              //this.colors.push(colors[(3*i+1)%4]);
              //this.colors.push(colors[(3*i+2)%4]);
  
          }
      }
  
      for (i=0;i<=this.div_v;i++){
        for (j=0;j<=this.div_u;j++){
              var x = j*1.0/(div_u);
              var y = i*1.0/(div_v);
              this.textureCoords.push(x);
              this.textureCoords.push(y);
          
          }
      }
      
  
      this.indicesTriangles = [];
      var i,j;
      for (i = 0; i<this.div_v;i++){
          for (j=0; j<this.div_u;j++){
          
            var index = (j)+(i)*(div_u+1);
            var indexR = ((j+1))+(i)*(div_u+1);
            var indexU = (j)+(i+1)*(div_u+1);
            var indexRU = ((j+1))+(i+1)*(div_u+1);
  
            this.indicesTriangles.push(index);
            this.indicesTriangles.push(indexR);
            this.indicesTriangles.push(indexRU);
            this.indicesTriangles.push(index);
            this.indicesTriangles.push(indexRU);
            this.indicesTriangles.push(indexU);
          }
      }
  
  
  
      this.indicesLines = [];
  
      var i;  
      for (i = 0; i<this.indicesTriangles.length;i+=3){
        this.indicesLines.push(this.indicesTriangles[i]);
        this.indicesLines.push(this.indicesTriangles[i+1]);
        this.indicesLines.push(this.indicesTriangles[i+1]);
        this.indicesLines.push(this.indicesTriangles[i+2]);
        this.indicesLines.push(this.indicesTriangles[i+2]);
        this.indicesLines.push(this.indicesTriangles[i]);
      }
  
      this.indicesPoints = [];
      for (i=0;i<Math.floor(this.coords.length/3.0);i++){
        this.indicesPoints.push(i);
      }
    }
  }
  