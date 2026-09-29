'use strict';
const WA = '542995815109';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Chispas de fondo + explosión al tocar un globo */
const cv = $('#fx'), cx = cv.getContext('2d');
let W, H, stars = [], burst = [];
function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
resize(); addEventListener('resize', resize);
const mk = () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2 + .6, p: Math.random() * 6.28, s: Math.random() * .02 + .01 });
stars = Array.from({ length: 45 }, mk);
function spark(x, y) {
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * 6.28, v = Math.random() * 3 + 1;
    burst.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, c: Math.random() > .5 ? '255,220,120' : '160,230,255' });
  }
}
function loop() {
  cx.clearRect(0, 0, W, H);
  stars.forEach(s => {
    s.p += s.s; cx.fillStyle = `rgba(255,255,255,${.25 + Math.sin(s.p) * .25})`;
    cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.28); cx.fill();
  });
  burst = burst.filter(b => b.l > 0);
  burst.forEach(b => {
    b.x += b.vx; b.y += b.vy; b.vy += .05; b.l -= .025;
    cx.fillStyle = `rgba(${b.c},${b.l})`; cx.beginPath(); cx.arc(b.x, b.y, 2.4 * b.l + .5, 0, 6.28); cx.fill();
  });
  requestAnimationFrame(loop);
}
if (!calm) loop();

/* Globos = menú */
function show(id) {
  const sec = $('#' + id);
  if (!sec || !sec.classList.contains('view')) id = 'inicio';
  $$('.view').forEach(v => v.classList.toggle('show', v.id === id));
  $$('.bubble').forEach(b => b.classList.toggle('active', b.dataset.view === id));
  $('#title').textContent = $('#' + id).dataset.title;
  history.replaceState(null, '', '#' + id);
}
$$('.bubble').forEach(b => b.addEventListener('click', e => {
  const r = b.getBoundingClientRect();
  if (!calm) spark(r.left + r.width / 2, r.top + r.height / 2);
  show(b.dataset.view);
  $('.main').scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
}));
$$('[data-go]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  if (a.dataset.space) $('#espacio').value = a.dataset.space;
  show(a.dataset.go);
}));
show(location.hash.slice(1) || 'inicio');

/* Imágenes que aún no cargan */
$$('img').forEach(i => i.addEventListener('error', () => { i.style.visibility = 'hidden'; }));

/* Galería */
const box = $('#lightbox'), big = $('img', box);
$$('.thumb').forEach(t => t.addEventListener('click', () => { big.src = t.dataset.full; big.alt = $('img', t).alt; box.hidden = false; }));
box.addEventListener('click', e => { if (e.target !== big) box.hidden = true; });
addEventListener('keydown', e => { if (e.key === 'Escape') box.hidden = true; });

/* Consulta por WhatsApp */
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const nombre = $('#nombre').value.trim(), msg = $('#msg');
  if (!nombre) { msg.textContent = 'Escribí tu nombre para continuar.'; $('#nombre').focus(); return; }
  msg.textContent = '';
  const f = $('#fecha').value ? new Date($('#fecha').value + 'T12:00').toLocaleDateString('es-AR') : 'a definir';
  const t = `Hola Complejo Neuquén, soy ${nombre}. Quiero consultar por ${$('#espacio').value}, fecha: ${f}, personas: ${$('#personas').value || 'a definir'}.`;
  open(`https://wa.me/${WA}?text=${encodeURIComponent(t)}`, '_blank', 'noopener');
});
$('#year').textContent = new Date().getFullYear();
