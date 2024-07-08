    #version 300 es
    precision mediump float;
    precision mediump int;

    in vec3 aVertexPosition;
    in vec3 aVertexColor;
    in vec2 aTextureCoordinate;
    

    smooth out vec4 vColor;
    out vec2 vTextureCoordinate;
    uniform float uVertexPointSize;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform int uTextureActive;


    void main(void) {
      

      vec4 pos = vec4(aVertexPosition,1.0);
      vec4 newPos = uProjectionMatrix*uModelViewMatrix * pos;
      vColor = vec4(aVertexColor,1.0); 


      gl_PointSize = 8.0;
      gl_Position = newPos;
      vTextureCoordinate = aTextureCoordinate;
    }