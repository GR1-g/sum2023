import { _vec3, vec } from "./mth/mth_vec.js";
import { _camera, cam, camRot } from "./mth/mth_camera.js";
import { icosahedronInit, octahedronInit, cubeInit, tetrahedronInit,
         icosahedronDraw, octahedronDraw, cubeDraw, tetrahedronDraw } from "./platon.js";
import { primCreate, primDraw, primLoad } from "./anim/render/prim.js";
import { loadShader } from "./anim/render/res/shaders.js";

export let posZ = 1;
let posX = 0, posY = 0;
let deltaX = 0, deltaY = 0;

export function mouseMove( dx, dy, flag ) {
  if (flag === 0) {
    posX = dx - deltaX;
    posY = -dy - deltaY;
  } else if (flag === 1) {
    deltaX = dx;
    deltaY = -dy;
  }
  if (posX < -1) {
    posX = -1;
  } else if (posX > 1) {
    posX = 1;
  }
  if (posY < -1) {
    posY = -1;
  } else if (posY > 1) {
    posY = 1;
  }

  if (deltaX < -1) {
    deltaX = -1;
  } else if (deltaX > 1) {
    deltaX = 1;
  }
  if (deltaY < -1) {
    deltaY = -1;
  } else if (deltaY > 1) {
    deltaY = 1;
  }
}

export function mouseWheel( deltaW ) {
  posZ += deltaW / 1000;
  if (posZ < 0.1) {
    posZ = 0.1;
  } else if (posZ > 5) {
    posZ = 5;
  }
}

export function initGL() {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl2");  

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  let vs, fs, text;
//  let filename = "default";
  let filename = "fractal";

  const ft1 = fetch(`shader/${filename}/vert.glsl`).then((res) => res.text()).then((data) => {
    vs = data;
  });
  const ft2 = fetch(`shader/${filename}/frag.glsl`).then((res) => res.text()).then((data) => {
    fs = data;
  });
  const ft3 = fetch('cow.obj').then((res) => res.text()).then((data) => {
    text = data.split("\n");
  });
  /*
  const vs = `#version 300 es
              in highp vec4 in_pos;
              out highp vec2 color;

              void main() {
                gl_Position = in_pos;
                color = in_pos.xy;
              }`

  const fs = `#version 300 es
              out highp vec4 o_color; 
              in highp vec2 color;

              uniform highp float time;
              void main()
              {
                o_color = vec4(color.xy * cos(time) * cos(time), 1, 1);
              }`
 
  const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);
  const program = gl.createProgram();

  gl.attachShader(program, vertexSh);
  gl.attachShader(program, fragmentSh);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      alert("fail");        
  */

  const allData = Promise.all([ft1, ft2, ft3]);
  allData.then((res) => {
    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);
    const program = gl.createProgram();

    gl.attachShader(program, vertexSh);
    gl.attachShader(program, fragmentSh);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const Buf = gl.getProgramInfoLog(program);
      console.log(Buf);
    }

    const uniformTime = gl.getUniformLocation(program, "time");
    const uniformX = gl.getUniformLocation(program, "x");
    const uniformY = gl.getUniformLocation(program, "y");
    const uniformZ = gl.getUniformLocation(program, "z");
    const uniformVP = gl.getUniformLocation(program, "MatrVP");
    const posLoc = gl.getAttribLocation(program, "in_pos");
    const normLoc = gl.getAttribLocation(program, "in_norm");

    const pos = [-1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, -1];
    const norm = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const vert = {
      pos: pos,
      norm: norm
    };
    const ind = [0, 1, 2, 3];

    const beginTime = Date.now();

    let prim = primCreate(gl, gl.TRIANGLE_STRIP, vert, ind, posLoc, normLoc);
//    let prim = primLoad(gl, text, posLoc, normLoc);

    const v1 = vec(0, 0, -2);
    const v2 = vec(0 , 0, 0);
    const v3 = vec(0, 0, 2);
    const v4 = vec(0, 0, 4);
//    let vertex1 = icosahedronInit(v1);
//    let vertex2 = octahedronInit(1, v2);
//    let vertex3 = cubeInit(1, v3);
//    let vertex4 = tetrahedronInit(1, v4);

    const draw = () => {
      gl.useProgram(program);
 
//      icosahedronDraw(gl, vertex1, posLoc, normLoc);
//      octahedronDraw(gl, vertex2, posLoc, normLoc);
//      cubeDraw(gl, vertex3, posLoc, normLoc);
//      tetrahedronDraw(gl, vertex4, posLoc, normLoc);

      primDraw(gl, prim);

      /*
      let Loc = vec(8, 8, 8);
      let At = vec(0, 0, 0);
      let Up1 = vec(0, 1, 0);
      camera = cam(0.1, 0.1, 300, Loc, At, Up1, 47, 47);
      let MatrVP = camera.MatrVP;
      let buf = new Float32Array([
        ...MatrVP.A[0],
        ...MatrVP.A[1],
        ...MatrVP.A[2],
        ...MatrVP.A[3]
      ]);
      */
      const timeFromStart = Date.now() - beginTime;
      gl.uniform1f(uniformTime, (timeFromStart) / 1000);
      gl.uniform1f(uniformX, posX);
      gl.uniform1f(uniformY, posY);
      gl.uniform1f(uniformZ, posZ);

//      gl.uniformMatrix4fv(uniformVP, false, buf);

      window.requestAnimationFrame(draw);
    };

    draw();      
  });
}