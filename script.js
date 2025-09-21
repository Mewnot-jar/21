// Configura aquí el título y el subtítulo
const CONFIG = {
  title: 'Para mi mor',
  subtitle: 'Un pequeño jardín lleno de cariño.',
  layout: 'garden' // opciones: 'garden' | 'heart' | 'circle' | 'grid'
};

// Medidas del componente flor (coinciden con CSS)
const PLOT_W = 120; // ancho del .plot
const PLOT_H = 160; // alto del .plot

// Mensajes/recuerdos: personalízalos libremente
const MESSAGES = [
  'Tu sonrisa ilumina mis días como el sol a las flores.',
  'Recuerdo la primera vez que te vi: todo se detuvo.',
  'Gracias por ser mi lugar seguro y mi aventura favorita.',
  'Contigo, cada día tiene un motivo para sonreír.',
  'Me haces creer en la magia de las pequeñas cosas.',
  'Nuestro abrazo es mi hogar.',
  'Eres mi casualidad favorita que se volvió destino.',
  'Si volviera a empezar, te elegiría mil veces.',
  'Me encanta cómo haces sencillo lo difícil.',
  'Tus manos encajan perfecto con las mías.',
  'A tu lado todo es más bonito.',
  'Gracias por existir y por elegirme cada día.'
];

// Paletas suaves para los pétalos
const PALETTES = [
  ['#f59e0b', '#fbbf24', '#fde68a'],
];

// Utilidad: barajar array
function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Crea el SVG de una flor simple (6 pétalos + centro)
function createFlowerSVG(colors){
  const [c1,c2,c3] = colors;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');

  const defs = document.createElementNS(svg.namespaceURI, 'defs');
  const grad = document.createElementNS(svg.namespaceURI, 'radialGradient');
  grad.id = 'petalGrad-' + Math.random().toString(36).slice(2,7);
  const s1 = document.createElementNS(svg.namespaceURI, 'stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color', c2);
  const s2 = document.createElementNS(svg.namespaceURI, 'stop'); s2.setAttribute('offset','100%'); s2.setAttribute('stop-color', c1);
  grad.append(s1,s2); defs.appendChild(grad); svg.appendChild(defs);

  // pétalos (elipses rotadas)
  for(let i=0;i<6;i++){
    const petal = document.createElementNS(svg.namespaceURI,'ellipse');
    petal.setAttribute('cx','50');
    petal.setAttribute('cy','38');
    petal.setAttribute('rx','14');
    petal.setAttribute('ry','28');
    petal.setAttribute('fill', `url(#${grad.id})`);
    petal.setAttribute('transform', `rotate(${i*60} 50 50)`);
    svg.appendChild(petal);
  }

  // centro
  const center = document.createElementNS(svg.namespaceURI,'circle');
  center.setAttribute('cx','50');
  center.setAttribute('cy','50');
  center.setAttribute('r','12');
  center.setAttribute('fill', c3);
  center.setAttribute('stroke', '#d1d5db');
  center.setAttribute('stroke-width','1');
  svg.appendChild(center);

  return svg;
}

function createPlot(message, i){
  const colors = PALETTES[i % PALETTES.length];
  const plot = document.createElement('div');
  plot.className = 'plot';

  const flower = document.createElement('div');
  flower.className = 'flower';
  flower.style.setProperty('--delay', `${i*0.18}s`);
  flower.dataset.index = String(i);
  flower.dataset.message = message;

  const stem = document.createElement('div');
  stem.className = 'stem';
  const leafL = document.createElement('div'); leafL.className = 'leaf leaf--l';
  const leafR = document.createElement('div'); leafR.className = 'leaf leaf--r';

  const svg = createFlowerSVG(colors);
  // Asegura que el tallo y hojas queden detrás de los pétalos
  flower.append(stem, leafL, leafR, svg);
  plot.appendChild(flower);
  return plot;
}

function mountGarden(){
  const titleEl = document.getElementById('title');
  const subtitleEl = document.getElementById('subtitle');
  if (CONFIG.title) titleEl.textContent = CONFIG.title;
  if (CONFIG.subtitle) subtitleEl.textContent = CONFIG.subtitle;

  const garden = document.getElementById('garden');
  garden.innerHTML = '';
  const msgs = MESSAGES; // mantener orden para simetría
  msgs.forEach((m, i) => garden.appendChild(createPlot(m, i)));

  // Aplicar layout de forma
  garden.classList.remove('layout-garden');
  if (CONFIG.layout === 'grid'){
    garden.classList.remove('layout-free');
  } else {
    garden.classList.add('layout-free');
    if (CONFIG.layout === 'garden') garden.classList.add('layout-garden');
    positionFlowers(garden, CONFIG.layout);
    // Reposicionar al redimensionar
    window.addEventListener('resize', () => positionFlowers(garden, CONFIG.layout));
  }
}

// Modal simple
const modal = {
  el: null,
  textEl: null,
  isOpen: false,
  idx: 0,
  messages: [],
  open(index){
    this.idx = index;
    this.textEl.textContent = this.messages[this.idx];
    this.el.classList.add('open');
    this.el.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
  },
  close(){
    this.el.classList.remove('open');
    this.el.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
  },
  next(){
    this.idx = (this.idx + 1) % this.messages.length;
    this.textEl.textContent = this.messages[this.idx];
  },
  prev(){
    this.idx = (this.idx - 1 + this.messages.length) % this.messages.length;
    this.textEl.textContent = this.messages[this.idx];
  }
};

// Corazones al hacer clic
function burstHearts(x, y){
  const colors = ['#ff4d7e','#fb7185','#f59e0b','#a78bfa'];
  const n = 6;
  for(let i=0;i<n;i++){
    const span = document.createElement('span');
    span.className = 'heart-burst';
    span.textContent = '❤';
    const dx = (Math.random()*60 - 30);
    const dy = (Math.random()*20 + 10);
    span.style.left = x + 'px';
    span.style.top = y + 'px';
    span.style.color = colors[i % colors.length];
    span.style.animation = `rise ${600 + Math.random()*400}ms ease-out forwards`;
    span.style.setProperty('--x', dx + 'px');
    span.style.setProperty('--y', dy + 'px');
    document.body.appendChild(span);
    span.addEventListener('animationend', ()=> span.remove());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  mountGarden();

  // Quitar avatares si existen (revertir ilustración)
  const avatars = document.querySelector('.avatars');
  if (avatars) avatars.remove();
  const oldPhoto = document.querySelector('.photo');
  if (oldPhoto) oldPhoto.remove();

  // Insertar imagen centrada bajo el subtítulo
  const subtitleEl = document.getElementById('subtitle');
  if (false && subtitleEl){
    const fig = document.createElement('figure');
    // Foto eliminada: no agregar clase ni contenedor
    // Contenido de foto eliminado
    // subtitleEl.insertAdjacentElement('afterend', fig);
  }

  // Modal refs
  modal.el = document.getElementById('message-modal');
  modal.textEl = document.getElementById('modal-text');
  modal.messages = Array.from(document.querySelectorAll('.flower')).map(el => el.dataset.message);

  document.getElementById('modal-close').addEventListener('click', ()=> modal.close());
  modal.el.addEventListener('click', (e)=>{ if(e.target === modal.el) modal.close(); });

  // Click en flores
  document.getElementById('garden').addEventListener('click', (e) => {
    const target = e.target.closest('.flower');
    if(!target) return;
    const i = Number(target.dataset.index || 0);
    modal.open(i);
    burstHearts(e.clientX, e.clientY);
  });
});

// Calcula posiciones normalizadas (0..1) para n puntos en distintas formas
function computePositions(n, mode='heart'){
  if (mode === 'circle') return circlePositions(n);
  if (mode === 'heart') return heartPositions(n);
  if (mode === 'garden') return gardenPositions(n);
  return circlePositions(n);
}

function circlePositions(n){
  const pts = [];
  const r = 0.38, cx = 0.5, cy = 0.52;
  for(let i=0;i<n;i++){
    const a = (i/n) * Math.PI * 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    pts.push({x, y});
  }
  return pts;
}

function heartPositions(n){
  // Ecuación de corazón (paramétrica)
  const xs = [], ys = [];
  const raw = [];
  for(let i=0;i<n;i++){
    const t = (i / n) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    raw.push({x, y}); xs.push(x); ys.push(y);
  }
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  // Normaliza a 0..1 y voltea Y (pantalla)
  const pts = raw.map(({x,y}) => ({
    x: (x - minX) / (maxX - minX),
    y: 1 - (y - minY) / (maxY - minY)
  }));
  // Compacta ligeramente el corazón para que no toque bordes
  return pts.map(p => ({
    x: 0.08 + p.x * 0.84,
    y: 0.10 + p.y * 0.80
  }));
}

function positionFlowers(garden, mode){
  const plots = Array.from(garden.querySelectorAll('.plot'));
  const n = plots.length;
  const rect = garden.getBoundingClientRect();
  const W = rect.width, H = rect.height;

  if (mode === 'garden'){
    const pixels = gardenPixelPositions(n, W, H);
    plots.forEach((plot, i) => {
      const {left, baseY} = pixels[i];
      plot.style.left = left + 'px';
      plot.style.top = (baseY - PLOT_H) + 'px';
      const yNorm = baseY / H;
      plot.style.zIndex = String(Math.floor(yNorm * 1000));
    });
    return;
  }

  // Otros modos usan posiciones normalizadas
  const pts = computePositions(n, mode);
  plots.forEach((plot, i) => {
    const {x,y} = pts[i];
    const px = x * W;
    const py = y * H;
    plot.style.left = px + 'px';
    plot.style.top = (py - PLOT_H) + 'px';
    plot.style.zIndex = String(Math.floor(y * 1000));
  });
}

// Posiciones deterministas tipo jardín con separación mínima
function gardenPixelPositions(n, W, H){
  const marginX = 32; // margen lateral
  const groundY = H * 0.90; // referencia del suelo
  const usableW = Math.max(0, W - marginX * 2);
  const minStepX = PLOT_W + 24; // separación mínima horizontal (px)
  const maxPerRow = Math.max(1, Math.floor(usableW / minStepX) + 1);

  // Número de filas necesarias (sin límite superior)
  const rows = Math.max(1, Math.ceil(n / maxPerRow));
  const counts = new Array(rows).fill(0);
  // Distribuye balanceando y llenando desde la fila inferior
  let remaining = n;
  for (let r = 0; r < rows; r++){
    const slotsLeft = rows - r;
    const ideal = Math.ceil(remaining / slotsLeft);
    const take = Math.min(maxPerRow, ideal);
    counts[r] = take;
    remaining -= take;
  }

  // Alturas: de 0.90 hacia arriba, manteniendo separación vertical mínima
  const minStepY = 84; // px entre filas
  const totalSpanY = Math.max(minStepY * (rows - 1), 1);
  const topStart = groundY - totalSpanY; // px de la fila superior

  const res = [];
  let index = 0;
  for (let r = 0; r < rows; r++){
    const k = counts[r];
    if (k <= 0) continue;
    const xStart = marginX + PLOT_W/2;
    const xEnd = W - marginX - PLOT_W/2;
    const span = Math.max(0, xEnd - xStart);
    const baseY = Math.round(topStart + r * minStepY);
    for (let j = 0; j < k; j++){
      const stagger = rows > 1 && (r % 2 === 1);
      let center;
      if (stagger){
        const stepOff = span / k; // crea márgenes a ambos lados
        center = xStart + stepOff * (j + 0.5);
      } else {
        const step = k === 1 ? 0 : span / (k - 1);
        center = k === 1 ? (xStart + xEnd)/2 : xStart + j * step;
      }
      res[index++] = { left: Math.round(center - PLOT_W/2), baseY };
    }
  }
  return res;
}

// Distribución estilo jardín: filas orgánicas con ligera variación
function gardenPositions(n){
  // Determina filas según cantidad
  let rows = 3;
  if (n < 7) rows = 1; else if (n < 14) rows = 2;

  const weights = rows === 1 ? [1] : rows === 2 ? [0.6, 0.4] : [0.5, 0.32, 0.18];
  let counts = weights.map(w => Math.max(1, Math.round(n * w)));
  // Ajuste para sumar exactamente n
  let diff = n - counts.reduce((a,b)=>a+b,0);
  let i = 0;
  while (diff !== 0){
    if (diff > 0){ counts[i%rows]++; diff--; }
    else { if (counts[i%rows] > 1){ counts[i%rows]--; diff++; } i++; }
    i++;
  }

  const rangesY = rows === 1
    ? [[0.80, 0.88]]
    : rows === 2
      ? [[0.78, 0.86], [0.62, 0.72]]
      : [[0.80, 0.88], [0.64, 0.74], [0.50, 0.58]]; // bottom -> top

  const jitterX = rows === 1 ? [0.05] : rows === 2 ? [0.05, 0.06] : [0.05, 0.06, 0.07];

  const pts = [];
  const marginX = 0.08, spanX = 0.84;

  for (let r=0; r<rows; r++){
    const k = counts[r];
    for (let j=0; j<k; j++){
      const base = (j+1)/(k+1);
      const jx = (Math.random()*2 - 1) * jitterX[r];
      const x = marginX + clamp01(base + jx) * spanX;
      const [ymin, ymax] = rangesY[r];
      const y = randBetween(ymin, ymax);
      pts.push({x,y});
    }
  }

  // Mezcla ligera para no quedar por filas exactas
  return pts.sort((a,b) => a.x - b.x);
}

function clamp01(v){ return Math.min(1, Math.max(0, v)); }
function randBetween(a,b){ return a + Math.random()*(b-a); }
