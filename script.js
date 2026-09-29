'use strict';
const WA = '542995815109';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Navegación por globos
function show(id) {
  if (!$('#' + id)?.classList.contains('view')) id = 'inicio';
  $$('.view').forEach(v => v.classList.toggle('show', v.id === id));
  $$('.bubble').forEach(b => b.classList.toggle('active', b.dataset.view === id));
  history.replaceState(null, '', '#' + id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
$$('.bubble').forEach(b => b.addEventListener('click', () => show(b.dataset.view)));
$$('[data-go]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  if (a.dataset.space) $('#espacio').value = a.dataset.space;
  show(a.dataset.go);
}));
show(location.hash.slice(1) || 'inicio');

// Imágenes que todavía no cargan: quedan con el fondo celeste
$$('img').forEach(img => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }));

// Galería a pantalla completa
const box = $('#lightbox'), big = $('img', box);
$$('.thumb').forEach(t => t.addEventListener('click', () => {
  big.src = t.dataset.full; big.alt = $('img', t).alt; box.hidden = false;
}));
box.addEventListener('click', e => { if (e.target !== big) box.hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') box.hidden = true; });

// Consulta por WhatsApp
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const nombre = $('#nombre').value.trim(), msg = $('#msg');
  if (!nombre) { msg.textContent = 'Escribí tu nombre para continuar.'; $('#nombre').focus(); return; }
  msg.textContent = '';
  const fecha = $('#fecha').value ? new Date($('#fecha').value + 'T12:00').toLocaleDateString('es-AR') : 'a definir';
  const texto = `Hola Complejo Neuquén, soy ${nombre}. Quiero consultar por ${$('#espacio').value}, fecha: ${fecha}, personas: ${$('#personas').value || 'a definir'}.`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
});

$('#year').textContent = new Date().getFullYear();
