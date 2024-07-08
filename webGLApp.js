/* Classe base para uma aplicação WebGL              */
/* Aplicações WebGL devem ser derivadas desta classe */
class WebGLMainApp{
    
    constructor(){
        this.canvas = null;
        this.gl = null;
        
        this.canvas = document.getElementById("webgl-canvas");
        if (!this.canvas){
            alert("canvas could no be obtained");
        }
        this.gl = this.canvas.getContext('webgl2');
        if (!this.gl){
            alert("no webgl-context could be obtained");
        }

    }

    /* Obtem um shader em funcao do id no documento html */
    getShader(id) {
        const script = document.getElementById(id);
        const shaderString = script.text.trim();

        var shader;
        if (script.type === 'x-shader/x-vertex') {
          shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        }
        else if (script.type === 'x-shader/x-fragment') {
          shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        }
        else {
          return null;
        }

        this.gl.shaderSource(shader, shaderString);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          console.error(this.gl.getShaderInfoLog(shader));
          return null;
        }

        return shader;
    }

    getShaderSource(type, source) {
        //const script = document.getElementById(id);
        const shaderString = source;
    
        let shader;
        if (type === 'vertex') {
          shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        }
        else if (type === 'fragment') {
          shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        }
        else {
          return null;
        }
    
        this.gl.shaderSource(shader, shaderString);
        this.gl.compileShader(shader);
    
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          console.error(this.gl.getShaderInfoLog(shader));
          return null;
        }
    
        return shader;
      }
    

    /* Cria um programa. Devem ser passados os nomes dos scripts correspondentes aos shaders */
    createProgram(vertexShaderName,fragmentShaderName) {
        const vertexShader = this.getShader(vertexShaderName);
        const fragmentShader = this.getShader(fragmentShaderName);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
          console.error('Could not initialize shaders');
        }

        this.gl.useProgram(this.program);

        return this.program;
    }

    async loadVertexShader(shaderName){
        var shaderSource;
        return await fetch(shaderName)
          .then(response => response.text())
          .then((shaderSource) => {
            this.vertexShaderSource = shaderSource;
            console.log(shaderSource);
          }).catch((err) => console.error(err, ...arguments));
      }
    
    async loadFragmentShader(shaderName){
        var shaderSource;
        return await fetch(shaderName)
          .then(response => response.text())
          .then((shaderSource) => {
            this.fragmentShaderSource = shaderSource;
            console.log(shaderSource);
          }).catch((err) => console.error(err, ...arguments));
      }
    

    async loadProgram(vertexShaderName,fragmentShaderName){
        var program;
        await this.loadVertexShader(vertexShaderName);
        await this.loadFragmentShader(fragmentShaderName);



        const vertexShader = this.getShaderSource('vertex',this.vertexShaderSource.trim());
        const fragmentShader = this.getShaderSource('fragment',this.fragmentShaderSource.trim());

        program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
          console.error('Could not initialize shaders');
        }


        return program;


    }

    setProgramAttribShaderVariablesLocation(program,variables){
        this.gl.useProgram(program);
        if (variables == null) return;
        var v;
        for (v in variables){
            program[v] = this.gl.getAttribLocation(program,variables[v]);
        }
    }        

    /* Armazena na variavel program a localizacao das variaveis de tipo uniform do shader */
    setProgramUniformShaderVariablesLocation(program,variables){
        this.gl.useProgram(program);
        if (variables == null) return;
        var i;
        for (i=0;i<variables.length;i++){
            program[variables[i]] = this.gl.getUniformLocation(program,variables[i]);
        }
    }


    /* Atribui valores as variaveis de tipo uniform no program                                                          */
    /* Os valores devem ser passados em um object contendo o identificador da variável e um array contendo o            */
    /* tipo dos valores e os valores em sequência                                                                       */
    /* Exemplo:                                                                                                         */
    /* {"uTime":["1f","5.2"],"matrix":["mat4",false,[1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0]]} */
    /* No exemplo acima a variavel uniforme uTime e um float "1f" e o valor é 5.2. A variavel matrix e uma matriz 4x4,  */
    /* false indica que não deve ser transposta e o array é o valor a ser atribuido a matriz                            */
    /* Para ver os tipos admissíveis ver a função abaixo                                                                */

    setProgramUniformShaderVariablesValues(program,variables){
        this.gl.useProgram(program);
        if (variables == null) return;
        var v;
        for (v in variables){
            var type = variables[v][0];

            if (type==="1i"){
                this.gl.uniform1i(program[v],variables[v][1]);
            }
            else if (type === "2i"){
                this.gl.uniform2i(program[v],variables[v][1],variables[v][2]);
            }
            else if (type === "3i"){
                this.gl.uniform3i(program[v],variables[v][1],variables[v][2],variables[v][3]);
            }
            else if (type === "4i"){
                this.gl.uniform4i(program[v],variables[v][1],variables[v][2],variables[v][3],variables[v][4]);
            }
            else if (type ==="1f"){
                this.gl.uniform1f(program[v],variables[v][1]);
            }
            else if (type === "2f"){
                this.gl.uniform2f(program[v],variables[v][1],variables[v][2]);
            }
            else if (type === "3f"){
                this.gl.uniform3f(program[v],variables[v][1],variables[v][2],variables[v][3]);
            }
            else if (type === "3fv"){
                this.gl.uniform3fv(program[v],variables[v][1]);
            }
            else if (type === "4f"){
                this.gl.uniform3f(program[v],variables[v][1],variables[v][2],variables[v][3],variables[v][4]);
            }
            else if (type === "mat2"){
                this.gl.uniformMatrix2fv(program[v],variables[v][1],variables[v][2]);
            }
            else if (type === "mat3"){
                this.gl.uniformMatrix3fv(program[v],variables[v][1],variables[v][2]);
            }
            else if (type === "mat4"){
                this.gl.uniformMatrix4fv(program[v],variables[v][1],variables[v][2]);
            }
        }
    }

    setProgramUniformShaderVariable(program,v){
        this.gl.useProgram(program);
        if (v == null) return;
        
        var type = variables[v][0];

        if (type==="1i"){
            this.gl.uniform1i(program[v],variables[v][1]);
        }
        else if (type === "2i"){
            this.gl.uniform2i(program[v],variables[v][1],variables[v][2]);
        }
        else if (type === "3i"){
            this.gl.uniform3i(program[v],variables[v][1],variables[v][2],variables[v][3]);
        }
        else if (type === "4i"){
            this.gl.uniform4i(program[v],variables[v][1],variables[v][2],variables[v][3],variables[v][4]);
        }
        else if (type === "1f"){
            this.gl.uniform1f(program[v],variables[v][1]);
        }
        else if (type === "2f"){
            this.gl.uniform2f(program[v],variables[v][1],variables[v][2]);
        }
        else if (type === "3f"){
            this.gl.uniform3f(program[v],variables[v][1],variables[v][2],variables[v][3]);
        }
        else if (type === "3fv"){
            this.gl.uniform3fv(program[v],variables[v][1]);
        }
        else if (type === "4f"){
            this.gl.uniform3f(program[v],variables[v][1],variables[v][2],variables[v][3],variables[v][4]);
        }
        else if (type === "mat2"){
            this.gl.uniformMatrix2fv(program[v],variables[v][1],variables[v][2]);
        }
        else if (type === "mat3"){
            this.gl.uniformMatrix3fv(program[v],variables[v][1],variables[v][2]);
        }
        else if (type === "mat4"){
            this.gl.uniformMatrix4fv(program[v],variables[v][1],variables[v][2]);
        }        
    }
      
    updateModelViewMatrix(program,modelViewMatrix,modelViewMatrixShdVar){
        this.gl.useProgram(program);
        this.gl.uniformMatrix4fv(program[modelViewMatrixShdVar], false, modelViewMatrix);
    }

    updateNormalMatrix(program,normalMatrix,normalMatrixShdVar){
        this.gl.useProgram(program);
        this.gl.uniformMatrix4fv(program[normalMatrixShdVar], false, normalMatrix);
    }

    updateProjectionMatrix(program,projectionMatrix,projectionMatrixShdVar){
        this.gl.useProgram(program);
        this.gl.uniformMatrix4fv(program[projectionMatrixShdVar], false, projectionMatrix);
    }

    computeNormalMatrix(normalMatrix,modelViewMatrix){
        mat4.identity(normalMatrix);
        mat4.invert(normalMatrix,modelViewMatrix);
        mat4.transpose(normalMatrix,normalMatrix);
        return normalMatrix;
    }

    rotate(mat,rx,ry,rz){
        mat4.rotateX(mat,mat,rx);
        mat4.rotateY(mat,mat,ry);
        mat4.rotateZ(mat,mat,rz);

        return mat;
    }


    scale(mat,sx,sy,sz){
        var s = vec3.fromValues(sx,sy,sz);
        mat4.scale(mat,mat,s);

        return mat;
    }

    translate(mat,tx,ty,tz){
        var tv = vec3.fromValues(tx,ty,tz);
        mat4.translate(mat,mat,tv);

        return mat;
    }

    transform(mat,sx,sy,sz,tx,ty,tz,rx,ry,rz){
        var tv = vec3.fromValues(tx,ty,tz);
        mat4.translate(mat,mat,tv);
        var s = vec3.fromValues(sx,sy,sz);
        mat4.scale(mat,mat,s);
        mat4.rotateX(mat,mat,rx);
        mat4.rotateY(mat,mat,ry);
        mat4.rotateZ(mat,mat,rz);

        return mat;
    }
  
    
    async create(){
        throw new Error("Method 'create()' must be implemented.");
    }


    draw() {
        throw new Error("Method 'draw()' must be implemented.");
    } 

    render() {
        
        var now;
             elapsed_time;
        if (this.animate_active){
        
            now = Date.now();
            elapsed_time = now - this.previous_time;

            if (elapsed_time >= 1000/this.frame_rate){

                this.draw();
                this.previous_time = now;
            }

        requestAnimationFrame(this.render.bind(this));

        }
        
        // RequestAnimationFrame asks the browser to call the callback function before repaint for Animation purposes
        // We need to attach the this object to the callback otherwise the context of the call (the WebGLMainApp) will be lost
    }

    initControls(){
        throw new Error("Method 'initControls()' must be implemented.");
    }

    /* Configura os buffer a serem limpos com o comando gl.clearBuffer(), configura o viewport, cria os modelos e renderiza */
    async init() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        await this.create()
        this.initControls();
        this.previous_time = 0;
        this.animate_active = true;
        this.frame_rate = 60;
        this.render();
    }
 
}