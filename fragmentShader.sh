#version 300 es
precision mediump float;
precision mediump int;
in vec4 vColor;
in vec3 vNormal;
in vec2 vTextureCoordinate;
out vec4 fragColor;
uniform int uTextureActive;

uniform sampler2D uSampler;

void main(void) {
    if (uTextureActive==1){
        fragColor = vColor*texture(uSampler,vTextureCoordinate);
    }else{
        fragColor = vColor;
    }
}
