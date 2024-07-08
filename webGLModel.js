/*Esta classe descreve um modelo WebGL contendo os dados que devem ser passados da CPU para a GPU*/
/*A classe mantem uma referência para o contexto gl e para o program shader */

class WebGLModel{
    constructor(gl,program,dim,primitiveType,coords,indices,colors,normals,tangents,textureCoords,textureName){
        this.gl = gl;
        this.program = program;
        this.dim = dim;
        this.primitiveType = primitiveType; 
        this.coords = coords; // Dados das coordenadas em CPU
        this.indices = indices; // Dados dos indices em CPU
        //this.indicesPoints = null;
        //this.indicesTriangles = null;
        this.colors = colors; // Dados das cores em CPU
        this.normals = normals; // Dados das normais em CPU
        this.tangents = tangents; // Dados dos vetores tangente em CPU
        this.textureCoords = textureCoords; // Dados de coordenadas de texture em CPU
        this.VAO = null; // VAO
        this.coordsVBO = null; // Buffer de coordenadas
        this.colorsVBO = null; // Buffer de cores
        this.normalsVBO = null; // Buffer de vetores normais
        this.tangentsVBO = null; // Buffer de vetores tangentes
        this.textureCoordsVBO = null; // Buffer de coordenadas de textura
        this.IBO = null; // Buffer de indices

        this.image;
        this.texture;
        this.textureName = textureName;
  
    }

    loadTexture() {

        if ((this.textureName === undefined) || (this.textureName === null)) return;

        this.image = new Image();
        this.image.src = this.textureName;
  
        // Create a texture.
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        
        // Fill the texture with a 1x1 blue pixel.
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
                      new Uint8Array([0, 0, 255, 255]));
  
        this.image.onload = () => {
  
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
          this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
          this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
          this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
          //gl.bindTexture(gl.TEXTURE_2D, null);
        };

    }    

    useProgram(){
        this.gl.useProgram(this.program); // Habilita o shader
    }

    /* Inicializa of buffers. Somente foram implementados os buffers de coordenadas, cores e indices */
    initBuffers(){
        // Create VAO
        this.VAO = this.gl.createVertexArray();

        // Bind VAO
        this.gl.bindVertexArray(this.VAO);

        if ((this.program.aVertexPosition !== undefined) && (this.coords !== undefined)){
            //Create all VBOs
            this.coordsVBO = this.gl.createBuffer(); //VBO para as coordenadas
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.coordsVBO); // Ativar o buffer criado. Ele VBO ativo no momento atual
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.coords), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.program.aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.program.aVertexPosition);
        }
        //Passo 3
        if ((this.program.aVertexColor !== undefined) && (this.colors !== undefined)){
            this.colorsVBO = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorsVBO);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.program.aVertexColor, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.program.aVertexColor);
        }

        if ((this.program.aVertexNormal !== undefined) && (this.normals !== undefined)){
            this.normalsVBO = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalsVBO);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.program.aVertexNormal, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.program.aVertexNormal);
        }

        if ((this.program.aVertexTangent !== undefined) && (this.tangents !== undefined)){
            this.tangentsVBO = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tangentsVBO);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.tangents), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.program.aVertexTangent, dim, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.program.aVertexTangent);
        }    
        
        if ((this.program.aVertexTextureCoord !== undefined) && (this.textureCoords !== undefined)){
            this.textureCoordsVBO = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordsVBO);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.program.aVertexTextureCoord, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.program.aVertexTextureCoord);
        } 

        //Passo 4

        this.IBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);


        // Clean
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

    }

    /* Metodo auxiliar que inicializa os buffers e o program shader */
    set(attribShaderVariables,uniformShaderVariables){
        this.loadTexture();
        this.initBuffers();
        this.useProgram();
    }

    /* Desenha o model */
    draw(){

        this.useProgram(this.program);

        if ((this.textureName !== undefined)&&(this.textureName !== null)){
          this.gl.uniform1i(this.program["uTextureActive"], 1);
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        }
        else{
          this.gl.uniform1i(this.program["uTextureActive"], 0);
        }

        // Bind VAO
        this.gl.bindVertexArray(this.VAO);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        this.gl.drawElements(this.primitiveType, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
  

        // Clean
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}