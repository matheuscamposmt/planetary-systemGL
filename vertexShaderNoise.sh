    #version 300 es
    precision mediump float;
    precision mediump int;

    in vec3 aVertexPosition;
    in vec3 aVertexColor;
    in vec3 aVertexNormal;
    in vec2 aTextureCoordinate;
    

    smooth out vec4 vColor;
    smooth out vec3 vNormal;
    out vec2 vTextureCoordinate;
    uniform float uVertexPointSize;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uNormalMatrix;
    uniform mat4 uProjectionMatrix;
    uniform int uTextureActive;
    uniform int uNormalsDefined;
    uniform vec3 uLightPos;
    uniform vec3 uEyePos;


    highp float rand(vec2 co)
    {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
    }


    void main(void) {
      

      vec3 coord = aVertexPosition;
      vec2 c = vec2(coord.x*coord.y,coord.x*coord.x);
      
      float displacement = rand(c)/8.0;
      
   
      mat4 normalMatrix = inverse(uModelViewMatrix);
      normalMatrix = transpose(normalMatrix);

      vec4 normal = normalMatrix*vec4(aVertexNormal,0.0);
      vec4 light =  vec4(uLightPos,0.0);
     
      vec4 pos = vec4(coord,1.0)+displacement*normalize(vec4(aVertexNormal,0.0));
      vec4 newPos = uProjectionMatrix*uModelViewMatrix * pos;
      vColor = vec4(aVertexColor,1.0); 

      vec3 normalVec = normalize(vec3(normal));
      vec3 lightVec = normalize(vec3(light));
      vec3 eyeVec = normalize(vec3(uEyePos));

      float lambert = dot(normalVec,lightVec);
      vec4 matDiff,matSpec;

      //Se houver textura, o material da superficie e definido pela cor dos vertices
      if (uTextureActive==0){
        matDiff = vColor;
        matSpec = vColor;
      }
      else{// se nao é um cor branca
        matDiff = vec4(1.0,1.0,1.0,1.0);
        matSpec = vec4(1.0,1.0,1.0,1.0);
      }

      vec3 Ia; //Iluminacao ambiental
      vec3 Id; //Iluminacao Difusa
      vec3 Is; //Iluminacao Especular
      float Ka = 0.4;
      float Kd = 0.5;
      float Ks = 0.5;
      float ns = 8.0;

      //Calculo da compoenente ambiental
      Ia = Ka*vec3(1.0,1.0,1.0);

      //Se o coeficiente de atenuacao difusa for positivo
      if (lambert>0.0){//multiplica o coeficiente pelo material
        vec3 refVec = reflect(lightVec,normalVec);
        float angSpec = max(0.0,dot(refVec,eyeVec));
        float specular = pow(angSpec,ns);
        Id = Kd*vec3(lambert*matDiff);
        Is = Ks*vec3(specular*matSpec);
      }
      else{//senao a iluminacao difusa e zero
        Id = vec3(0.0,0.0,0.0);
        Is = vec3(0.0,0.0,0.0);
      }

      vColor = vec4(Ia+Id+Is,1.0);

      gl_PointSize = 8.0;
      gl_Position = newPos;
      vTextureCoordinate = aTextureCoordinate;
      //vNormal = aVertexNormal;
    }