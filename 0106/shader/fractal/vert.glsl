#version 300 es
precision highp float;

in highp vec3 in_pos;
in highp vec3 in_norm;

out highp vec3 pos;
out highp vec3 norm;

uniform mat4 MatrVP;
uniform float x;
uniform float y;
uniform float z;

void main() {
  vec3 p = in_pos +  + vec3(x, y, 0);
  p = p * vec3(z, z, 0);
  gl_Position = /*MatrVP */ vec4(p, 1);
  pos = in_pos;
  norm = in_norm;
}