/* Aurora background — Perplexity light — Brand Themes extension */
(function () {
  const CONFIG = {
    opacity: 0.45,
    dim: 0.25,
    speed: 1.0,
    minimap: 0.55,
    sticky: 0.96,
    paletteA: [0.125, 0.722, 0.804],
    paletteB: [0.102, 0.604, 0.667],
    paletteC: [0.431, 0.906, 0.941],
    scrim: [0.96, 0.97, 0.99],
    isLight: true,
    widgetBg: 'rgba(255,255,255,0.94)',
  };

  const SCRIPT_ID = '__aurora-bg-perplexity-light';
  if (document.getElementById(SCRIPT_ID)) return;

  function readVar(name) {
    const el = document.querySelector('.monaco-workbench') || document.body;
    return getComputedStyle(el).getPropertyValue(name).trim();
  }

  (function boot() {
    if (!document.querySelector('.monaco-workbench')) return requestAnimationFrame(boot);
    injectStyle();
    startAurora();
  })();

  function injectStyle() {
    const themeSticky =
      readVar('--vscode-editorStickyScroll-background') ||
      readVar('--vscode-editor-background') ||
      '#ffffff';
    const stickyBg = `color-mix(in srgb, ${themeSticky} ${Math.round(CONFIG.sticky * 100)}%, transparent)`;

    const style = document.createElement('style');
    style.id = '__aurora-style-perplexity-light';
    style.textContent = `
      :root, .monaco-workbench {
        --vscode-editor-background: transparent !important;
        --vscode-editorGutter-background: transparent !important;
        --vscode-breadcrumb-background: transparent !important;
        --vscode-editorGroupHeader-tabsBackground: transparent !important;
        --vscode-editorGroupHeader-noTabsBackground: transparent !important;
        --vscode-editorGroup-emptyBackground: transparent !important;
        --vscode-tab-activeBackground: transparent !important;
        --vscode-tab-inactiveBackground: transparent !important;
        --vscode-tab-hoverBackground: ${CONFIG.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'} !important;
        --vscode-sideBar-background: transparent !important;
        --vscode-sideBarSectionHeader-background: transparent !important;
        --vscode-activityBar-background: transparent !important;
        --vscode-panel-background: transparent !important;
        --vscode-minimap-background: transparent !important;
        --vscode-editorStickyScroll-background: ${stickyBg} !important;
        --vscode-editorStickyScrollHover-background: ${stickyBg} !important;
        --vscode-editorWidget-background: ${CONFIG.widgetBg} !important;
        --vscode-quickInput-background: ${CONFIG.widgetBg} !important;
        --vscode-menu-background: ${CONFIG.widgetBg} !important;
      }
      .monaco-workbench, .part.editor, .part.editor > .content,
      .editor-container, .editor-group-container, .editor-group-container.empty,
      .editor-instance, .monaco-grid-view, .grid-view-container,
      .split-view-view, .monaco-pane-view,
      .monaco-editor, .monaco-editor .overflow-guard,
      .monaco-editor-background, .monaco-editor .margin,
      .monaco-scrollable-element, .monaco-scrollable-element > .scrollbar,
      .sidebar, .auxiliarybar, .panel,
      .tabs-container, .title.tabs, .editor-actions, .breadcrumbs-control {
        background-color: transparent !important;
      }
      .monaco-workbench { position: relative; z-index: 2; }
      #${SCRIPT_ID}, #__aurora-scrim-perplexity-light {
        position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none;
      }
      #${SCRIPT_ID} { z-index: 0; opacity: ${CONFIG.opacity}; }
      #__aurora-scrim-perplexity-light {
        z-index: 1;
        background: rgba(
          Math.round(CONFIG.scrim[0]*255),
          Math.round(CONFIG.scrim[1]*255),
          Math.round(CONFIG.scrim[2]*255),
          ${CONFIG.dim}
        );
      }
      .monaco-editor .minimap { opacity: ${CONFIG.minimap} !important; }
      .monaco-editor .sticky-widget,
      .monaco-editor .sticky-widget .sticky-line-content {
        background-color: ${stickyBg} !important;
      }
    `;
    document.head.appendChild(style);
  }

  function startAurora() {
    const canvas = document.createElement('canvas');
    canvas.id = SCRIPT_ID;
    const scrim = document.createElement('div');
    scrim.id = '__aurora-scrim-perplexity-light';
    document.body.prepend(scrim);
    document.body.prepend(canvas);

    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const FRAG = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float u_idle;
      uniform vec3 u_pA;
      uniform vec3 u_pB;
      uniform vec3 u_pC;

      float hash21(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
      float vnoise(vec2 p){
        vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f);
        float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+vec2(1.,1.));
        return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
      }
      float fbm(vec2 p){ float s=0.0,a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
        for(int i=0;i<6;i++){ s+=a*vnoise(p); p=m*p; a*=0.5; } return s; }
      vec3 pal(float t,vec3 a,vec3 b,vec3 c,vec3 d){ return a+b*cos(6.28318*(c*t+d)); }
      float dither(vec2 f){ return (hash21(f+fract(iTime))-0.5)*0.004; }

      void main(){
        vec2 frag=gl_FragCoord.xy;
        vec2 uv=(frag-0.5*iResolution.xy)/iResolution.y;
        float t=iTime*0.06*(0.4+u_idle);
        vec2 q=uv;
        float warp=fbm(q*2.0+vec2(0.0,t*4.0));
        float warp2=fbm(q*3.0-vec2(t*2.0,0.0)+warp);
        float curtains=fbm(vec2(q.x*3.0+warp2*1.5, q.y*1.2-t*6.0));
        float aurora=pow(max(curtains,0.0),1.8);
        float h=smoothstep(-0.65,0.75,uv.y+warp*0.3);
        aurora*=mix(0.25,1.0,h);
        float hue=warp2*0.5+q.y*0.3+t*2.0;
        vec3 col=pal(hue, u_pA, u_pB, vec3(1.0), u_pC);
        vec3 base = vec3(0.94,0.95,0.98);
        col=base+col*aurora*0.85;
        float star=pow(hash21(floor(frag*0.5)),60.0);
        col+=star*0.15*vec3(0.8,0.9,1.0);
        col*=1.0-0.12*length(uv*vec2(0.7,1.0));
        col+=dither(frag);
        gl_FragColor=vec4(col,1.0);
      }
    `;

    function sh(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const lp = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(lp);
    gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'iResolution');
    const uTime = gl.getUniformLocation(prog, 'iTime');
    const uIdle = gl.getUniformLocation(prog, 'u_idle');
    const uPA = gl.getUniformLocation(prog, 'u_pA');
    const uPB = gl.getUniformLocation(prog, 'u_pB');
    const uPC = gl.getUniformLocation(prog, 'u_pC');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }
    window.addEventListener('resize', resize);
    resize();

    const start = performance.now();
    (function loop() {
      resize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, ((performance.now() - start) / 1000) * CONFIG.speed);
      gl.uniform1f(uIdle, 0.2);
      gl.uniform3f(uPA, CONFIG.paletteA[0], CONFIG.paletteA[1], CONFIG.paletteA[2]);
      gl.uniform3f(uPB, CONFIG.paletteB[0], CONFIG.paletteB[1], CONFIG.paletteB[2]);
      gl.uniform3f(uPC, CONFIG.paletteC[0], CONFIG.paletteC[1], CONFIG.paletteC[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(loop);
    })();
  }
})();
