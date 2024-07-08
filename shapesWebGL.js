/* Classes com implementação WebGL dos objetos gráficos */



// Avoid using. Too much resource use for a simple point
// Prefer use WebGLPointList
class WebGLPoint2d extends Point2d{
    constructor (gl,program,x,y,color,size = 1){
        super(x,y,color,size);
        this.gl = gl;
        this.program = program;
    }

    /* Retorna um modelo WebGL do objeto gráfico */
    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        var coords = [this.x,this.y,0.0];
        var indices = [0];
        var colors = [this.color.r,this.color.g,this.color.g];

        const webGLPoint2dModel = new WebGLModel(this.gl,this.program,2,this.gl.POINTS,coords,indices,colors,null,null,null,null);
        webGLPoint2dModel.set(attribShaderVariables,uniformShaderVariables);
        return webGLPoint2dModel;
    }
}

class WebGLPoint3d extends Point3d{
    constructor (gl,program,x,y,color,size = 1){
        super(x,y,color,size);
        this.gl = gl;
        this.program = program;
    }

    /* Retorna um modelo WebGL do objeto gráfico */
    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        var coords = [this.x,this.y,this.z];
        var indices = [0];
        var colors = [this.color.r,this.color.g,this.color.g];

        const webGLPoint2dModel = new WebGLModel(this.gl,this.program,3,this.gl.POINTS,coords,indices,colors,null,null,null,null);
        webGLPoint2dModel.set(attribShaderVariables,uniformShaderVariables);
        return webGLPoint2dModel;
    }
}

class WebGLPointList extends PointList{
    constructor (gl,program){
        super();
        this.gl = gl;
        this.program = program;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var indices = [];
        var colors = [];
        var i;
        for (i=0;i<this.list.length;i++){
            var p = this.list[i];
            coords.push(p.x);
            coords.push(p.y);
            coords.push(0.0);
            indices.push(i);
            colors.push(p.color.r);
            colors.push(p.color.g);
            colors.push(p.color.b);
        }
        

        const webGLPointListModel = new WebGLModel(this.gl,this.program,2,this.gl.POINTS,coords,indices,colors,null,null,null,null);
        webGLPointListModel.set(attribShaderVariables,uniformShaderVariables);
      
        return webGLPointListModel;
    }
}

class WebGLTriangle extends Triangle{
    constructor (gl,program,p0,p1,p2,c,interpolation){
        super(p0,p1,p2,c);
        this.gl = gl;
        this.program = program;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        var coords = [this.p0.x,this.p0.y,0,
                      this.p1.x,this.p1.y,0,
                      this.p2.x,this.p2.y,0];
        
        var indices = [0,1,2]; 
        var colors;

        if (this.interpolation == true)
        {
            colors = [this.p0.color.r,this.p0.color.g,this.p0.color.b,
                      this.p1.color.r,this.p1.color.g,this.p1.color.b,
                      this.p2.color.r,this.p2.color.g,this.p2.color.b];
        }
        else{
            colors = [this.color.r,this.color.g,this.color.b,
                      this.color.r,this.color.g,this.color.b,
                      this.color.r,this.color.g,this.color.b];
        }    

        const webGLTriangleModel = new WebGLModel(this.gl,this.program,2,this.gl.TRIANGLES,coords,indices,colors,null,null,null,null);
        webGLTriangleModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLTriangleModel;
    }
}

class WebGLTriangleList extends TriangleList{
    constructor (gl,program,interpolation = false){
        super();
        this.gl = gl;
        this.program = program;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var indices = [];
        var colors = [];
        var i;
        for (i=0;i<this.list.length;i++){
            var t = this.list[i];
            coords.push(t.p0.x);
            coords.push(t.p0.y);
            coords.push(0);
            coords.push(t.p1.x);
            coords.push(t.p1.y);
            coords.push(0);
            coords.push(t.p2.x);
            coords.push(t.p2.y);
            coords.push(0);
            
            indices.push(3*i);
            indices.push(3*i+1);
            indices.push(3*i+2);

            if (this.interpolation == true)
                {
                    colors.push(t.p0.color.r);
                    colors.push(t.p0.color.g);
                    colors.push(t.p0.color.b);
                    colors.push(t.p1.color.r);
                    colors.push(t.p1.color.g);
                    colors.push(t.p1.color.b);
                    colors.push(t.p2.color.r);
                    colors.push(t.p2.color.g);
                    colors.push(t.p2.color.b);
                        }
                else{
                    colors.push(t.color.r);
                    colors.push(t.color.g);
                    colors.push(t.color.b);
                    colors.push(t.color.r);
                    colors.push(t.color.g);
                    colors.push(t.color.b);
                    colors.push(t.color.r);
                    colors.push(t.color.g);
                    colors.push(t.color.b);
            }


        }

        const webGLTriangleListModel = new WebGLModel(this.gl,this.program,2,this.gl.TRIANGLES,coords,indices,colors,null,null,null,null);
        webGLTriangleListModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLTriangleListModel;
    }
}


class WebGLPolygon extends Polygon{
    constructor (gl,program,color,interpolation){
        super(color,interpolation);
        this.gl = gl;
        this.program = program;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var indices = [];
        var colors = [];
        var i;
        for (i=0;i<this.pointList.size;i++){
            var p = this.pointList.list[i];
            coords.push(p.x);
            coords.push(p.y);
            coords.push(0.0);
            indices.push(i);

            if (this.interpolation == true){
                colors.push(this.color.r);
                colors.push(this.color.g);
                colors.push(this.color.b);
            }
            else{
                colors.push(p.color.r);
                colors.push(p.color.g);
                colors.push(p.color.b);
            }
        }
        

        const webGLPolygonModel = new WebGLModel(this.gl,this.program,2,this.gl.LINE_LOOP,coords,indices,colors,null,null,null,null);
        webGLPolygonModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLPolygonModel;
    }
}


class WebGLCircle extends Circle{
    constructor (gl,program,cx,cy,radius,color,numSubdiv,filled,interpolation){
        super(cx,cy,radius,color,numSubdiv);
        this.gl = gl;
        this.program = program;
        this.interpolation = interpolation;
        this.filled = filled;
    
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var indices = [];
        var colors = [];
        var primitiveType;

        if (this.filled == true){
            this.discreticizeFilled(this.numSubdiv,coords,indices,colors);
            primitiveType = this.gl.TRIANGLES;
        }
        else{
            this.discreticize(this.numSubdiv,coords,indices,colors);
            primitiveType = this.gl.LINE_LOOP;
        }
 
        const webGLCircleModel = new WebGLModel(this.gl,this.program,2,primitiveType,coords,indices,colors,null,null,null,null);
        webGLCircleModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLCircleModel;
    }
}


class WebGLBezier extends Bezier{
    constructor (gl,program,color,controlPoints,degree,nDiv,filled = false, interpolation = false){
        super(controlPoints,degree,color);
        this.gl = gl;
        this.program = program;
        this.nDiv = nDiv;
        this.filled = filled;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var colors = [];
        var indices = [];
        var indicesEdges = [];
        var coordsPol = [];
        var colorsPol = [];
        var indicesPol = [];
        var indicesEdgesPol = [];
        
        this.discreticize(this.nDiv,coords,colors,indices,indicesEdges,coordsPol,colorsPol,indicesPol,indicesEdgesPol);
      
        const webGLBezierControlPointsModel = new WebGLModel(this.gl,this.program,2,this.gl.POINTS,coordsPol,indicesPol,colorsPol,null,null,null,null);
        webGLBezierControlPointsModel.set(attribShaderVariables,uniformShaderVariables);

        const webGLBezierControlPointsEdgesModel = new WebGLModel(this.gl,this.program,2,this.gl.LINES,coordsPol,indicesEdgesPol,colorsPol,null,null,null,null);
        webGLBezierControlPointsEdgesModel.set(attribShaderVariables,uniformShaderVariables);

        const webGLBezierModel = new WebGLModel(this.gl,this.program,2,this.gl.LINES,coords,indicesEdges,colors,null,null,null,null);
        webGLBezierModel.set(attribShaderVariables,uniformShaderVariables);

        return [webGLBezierControlPointsModel,webGLBezierControlPointsEdgesModel,webGLBezierModel];
    }
}

class WebGLBSpline extends BSpline{
    constructor (gl,program,color,controlPoints,knots,degree,nDiv,filled = false, interpolation = false){
        super(controlPoints,knots,degree,color);
        this.gl = gl;
        this.program = program;
        this.nDiv = nDiv;
        this.filled = filled;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
        
        var coords = [];
        var colors = [];
        var indices = [];
        var indicesEdges = [];
        var coordsPol = [];
        var colorsPol = [];
        var indicesPol = [];
        var indicesEdgesPol = [];
        
        this.discreticize(this.nDiv,coords,colors,indices,indicesEdges,coordsPol,colorsPol,indicesPol,indicesEdgesPol);
      
        const webGLBSplineControlPointsModel = new WebGLModel(this.gl,this.program,2,this.gl.POINTS,coordsPol,indicesPol,colorsPol,null,null,null,null);
        webGLBSplineControlPointsModel.set(attribShaderVariables,uniformShaderVariables);

        const webGLBSplineControlPointsEdgesModel = new WebGLModel(this.gl,this.program,2,this.gl.LINES,coordsPol,indicesEdgesPol,colorsPol,null,null,null,null);
        webGLBSplineControlPointsEdgesModel.set(attribShaderVariables,uniformShaderVariables);

        const webGLBSplineModel = new WebGLModel(this.gl,this.program,2,this.gl.LINES,coords,indicesEdges,colors,null,null,null,null);
        webGLBSplineModel.set(attribShaderVariables,uniformShaderVariables);

        return [webGLBSplineControlPointsModel,webGLBSplineControlPointsEdgesModel,webGLBSplineModel];
    }
}


class WebGLCube extends Cube{
    constructor (gl,program,color,textureName,filled = false, interpolation = false){
        super(color);
        this.gl = gl;
        this.program = program;
        this.textureName = textureName;
        this.filled = filled;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
              
        const webGLCubeModel = new WebGLModel(this.gl,this.program,3,this.gl.TRIANGLES,
                                              this.coords,this.indicesTriangles,this.colors,this.normals,null,this.textureCoords,this.textureName);

        webGLCubeModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLCubeModel;
    }
}


class WebGLCylinder extends Cylinder{
    constructor (gl,program,radius,length,div_u,div_v,color,textureName,filled = false, interpolation = false){
        super(radius,length,div_u,div_v,color,textureName);
        this.gl = gl;
        this.program = program;
        this.textureName = textureName;
        this.filled = filled;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
              
        const webGLCylinderModel = new WebGLModel(this.gl,this.program,3,this.gl.TRIANGLES,
                                              this.coords,this.indicesTriangles,this.colors,this.normals,null,this.textureCoords,this.textureName);

        webGLCylinderModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLCylinderModel;
    }
}


class WebGLRevolutionSurface extends RevolutionSurface{
    constructor (gl,program,pointList,div_u,color,textureName,filled = false, interpolation = false){
        super(pointList,div_u,color,textureName);
        this.gl = gl;
        this.program = program;
        this.textureName = textureName;
        this.filled = filled;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
              
        const webGLRevolutionSurfaceModel = new WebGLModel(this.gl,this.program,3,this.gl.TRIANGLES,
                                              this.coords,this.indicesTriangles,this.colors,this.normals,null,this.textureCoords,this.textureName);

        webGLRevolutionSurfaceModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLRevolutionSurfaceModel;
    }
}

class WebGLSphere extends Sphere{
    constructor (gl,program,radius,div_u,div_v,color,textureName,filled = false, interpolation = false){
        super(radius,div_u,div_v,color,textureName);
        this.gl = gl;
        this.program = program;
        this.textureName = textureName;
        this.filled = filled;
        this.interpolation = interpolation;
    }

    getWebGLModel(attribShaderVariables = null,uniformShaderVariables = null){
              
        const webGLCubeModel = new WebGLModel(this.gl,this.program,3,this.gl.TRIANGLES,
                                              this.coords,this.indicesTriangles,this.colors,this.normals,null,this.textureCoords,this.textureName);

        webGLCubeModel.set(attribShaderVariables,uniformShaderVariables);

        return webGLCubeModel;
    }
}


