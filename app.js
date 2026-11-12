const english = document.documentElement.lang === 'en';
const ui = (es,en) => english ? en : es;
const tema = document.querySelector('#tema');
let guardado = null;
try { guardado = localStorage.getItem('curriculum-tema'); } catch {}
function aplicarTema(oscuro) {
  document.body.classList.toggle('dark', oscuro);
  tema.setAttribute('aria-pressed', String(oscuro));
  tema.textContent = oscuro ? ui('Modo claro','Light mode') : ui('Modo oscuro','Dark mode');
}
aplicarTema(guardado === 'oscuro');
tema.addEventListener('click', () => {
  const oscuro = !document.body.classList.contains('dark');
  aplicarTema(oscuro);
  try { localStorage.setItem('curriculum-tema', oscuro ? 'oscuro' : 'claro'); } catch {}
});
document.querySelector('#imprimir')?.addEventListener('click', () => window.print());

const dialogo = document.querySelector('#project-dialog');
const contenidoDialogo = document.querySelector('#dialog-content');
let botonAnterior = null;
document.querySelectorAll('.project-open').forEach(boton => {
  boton.addEventListener('click', () => {
    botonAnterior = boton;
    const tarjeta = boton.closest('.project');
    dialogo.style.setProperty('--project-card-width', `${tarjeta.getBoundingClientRect().width}px`);
    const visual = tarjeta.querySelector('.project-art').cloneNode(true);
    const contenido = tarjeta.querySelector('.project-content').cloneNode(true);
    contenido.querySelector('.project-open').remove();
    contenido.querySelector('h3').id = 'dialog-title';
    contenidoDialogo.replaceChildren(visual, contenido);
    dialogo.classList.remove('expanded');
    actualizarBotonTamano(false);
    dialogo.showModal();
    document.body.classList.add('modal-open');
    document.querySelector('#cerrar-proyecto').focus();
  });
});
document.querySelector('#cerrar-proyecto').addEventListener('click', () => dialogo.close());
dialogo.addEventListener('click', evento => {
  const rect = dialogo.getBoundingClientRect();
  if (evento.target === dialogo && (evento.clientX < rect.left || evento.clientX > rect.right || evento.clientY < rect.top || evento.clientY > rect.bottom)) dialogo.close();
});
dialogo.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (botonAnterior) botonAnterior.focus();
});

const ampliarProyecto = document.querySelector('#ampliar-proyecto');
function actualizarBotonTamano(ampliado) {
 ampliarProyecto.textContent = ampliado ? ui('Reducir ↙','Reduce ↙') : ui('Ampliar ↗','Enlarge ↗');
 ampliarProyecto.setAttribute('aria-pressed', String(ampliado));
 ampliarProyecto.setAttribute('aria-label', ampliado ? ui('Reducir ventana del proyecto','Reduce project window') : ui('Ampliar ventana del proyecto','Enlarge project window'));
}
ampliarProyecto.addEventListener('click', () => actualizarBotonTamano(dialogo.classList.toggle('expanded')));

// Cada apartado se abre desde el comienzo.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('pageshow', () => window.scrollTo(0, 0));
const paginaProyectos = document.querySelector('#proyectos-pagina');
if (paginaProyectos) {
 const tarjetas = [...document.querySelectorAll('.projects > .project')];
 const anterior = document.querySelector('#proyectos-anterior');
 const siguiente = document.querySelector('#proyectos-siguiente');
 let pagina = 0;
 const total = Math.ceil(tarjetas.length / 3);
 function mostrarPagina() {
  tarjetas.forEach((tarjeta, i) => { tarjeta.hidden = Math.floor(i / 3) !== pagina; });
  paginaProyectos.textContent = english ? `Page ${pagina + 1} of ${total}` : `Página ${pagina + 1} de ${total}`;
  anterior.disabled = pagina === 0;
  siguiente.disabled = pagina === total - 1;
 }
 anterior.addEventListener('click', () => { if (pagina > 0) { pagina--; mostrarPagina(); } });
 siguiente.addEventListener('click', () => { if (pagina < total - 1) { pagina++; mostrarPagina(); } });
 mostrarPagina();
}

const chefTabs = [...document.querySelectorAll('.chef-tabs [role="tab"]')];
function abrirChef(tab) {
 chefTabs.forEach(item => {
  const activo = item === tab;
  item.setAttribute('aria-selected', String(activo));
  item.tabIndex = activo ? 0 : -1;
  document.getElementById(item.getAttribute('aria-controls')).hidden = !activo;
 });
}
chefTabs.forEach((tab, i) => {
 tab.addEventListener('click', () => abrirChef(tab));
 tab.addEventListener('keydown', evento => {
  let next;
  if (evento.key === 'ArrowRight') next = (i + 1) % chefTabs.length;
  if (evento.key === 'ArrowLeft') next = (i - 1 + chefTabs.length) % chefTabs.length;
  if (evento.key === 'Home') next = 0;
  if (evento.key === 'End') next = chefTabs.length - 1;
  if (next !== undefined) { evento.preventDefault(); abrirChef(chefTabs[next]); chefTabs[next].focus(); }
 });
});
if (chefTabs.length) abrirChef(chefTabs[0]);

const certificadoDialogo = document.querySelector('#certificate-dialog');
if (certificadoDialogo) {
 const tarjetas = [...document.querySelectorAll('.certificate-card')];
 const foto = document.querySelector('#certificate-image');
 const zoom = document.querySelector('#cert-zoom');
 let origen = null, pagina = 0;
 function paginarCertificados() {
  tarjetas.forEach((t,i) => { t.hidden = Math.floor(i/3) !== pagina; });
  document.querySelector('#cert-pagina').textContent = english ? `Page ${pagina+1} of ${Math.ceil(tarjetas.length/3)}` : `Página ${pagina+1} de ${Math.ceil(tarjetas.length/3)}`;
  document.querySelector('#cert-anterior').disabled = pagina === 0;
  document.querySelector('#cert-siguiente').disabled = pagina === Math.ceil(tarjetas.length/3)-1;
 }
 document.querySelector('#cert-anterior').addEventListener('click',()=>{if(pagina>0){pagina--;paginarCertificados();}});
 document.querySelector('#cert-siguiente').addEventListener('click',()=>{if(pagina<Math.ceil(tarjetas.length/3)-1){pagina++;paginarCertificados();}});
 paginarCertificados();
 tarjetas.forEach(t=>t.querySelector('button').addEventListener('click',evento=>{
  origen=evento.currentTarget;
  foto.src=t.querySelector('img').getAttribute('src');foto.alt=t.querySelector('img').alt;
  document.querySelector('#certificate-title').textContent=t.querySelector('h3').textContent;
  document.querySelector('#certificate-caption').textContent=t.querySelector('p').textContent;
  certificadoDialogo.classList.remove('zoomed');zoom.textContent=ui('Ampliar ↗','Enlarge ↗');zoom.setAttribute('aria-pressed','false');
  certificadoDialogo.showModal();document.body.classList.add('modal-open');document.querySelector('#cert-cerrar').focus();
 }));
 zoom.addEventListener('click',()=>{const grande=certificadoDialogo.classList.toggle('zoomed');zoom.setAttribute('aria-pressed',String(grande));zoom.textContent=grande?ui('Reducir ↙','Reduce ↙'):ui('Ampliar ↗','Enlarge ↗');});
 document.querySelector('#cert-cerrar').addEventListener('click',()=>certificadoDialogo.close());
 certificadoDialogo.addEventListener('click',e=>{const r=certificadoDialogo.getBoundingClientRect();if(e.target===certificadoDialogo&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))certificadoDialogo.close();});
 certificadoDialogo.addEventListener('close',()=>{document.body.classList.remove('modal-open');origen?.focus();});
}
