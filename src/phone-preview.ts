/** Same-origin iframe provides a genuine mobile viewport, including Ionic overlays. */
export function mountPhonePreview(): void {
  document.title = 'Расписание — Angular / Ionic';
  document.documentElement.classList.add('hydrated');
  document.body.classList.add('phone-preview');
  const root=document.querySelector('app-root')!;
  root.innerHTML=`<main class="phone-stage"><section class="phone-intro"><a class="back-link" href="https://komaroff-dev.ru/">← Портфолио</a><h1>Расписание.<br>В мобильном<br>формате.</h1><p>Angular, Ionic и таблицы — в интерфейсе телефона. Попробуйте фильтры, формы и редактирование данных.</p><nav aria-label="О проекте"><a href="https://komaroff-dev.ru/projects/ionic/">Разбор проекта ↗</a><a href="https://komaroff-dev.ru/projects/ionic/docs/">Документация ↗</a></nav></section><div class="phone-device"><div class="phone-speaker" aria-hidden="true"></div><iframe id="phone-app" title="Мобильное демо расписания" referrerpolicy="same-origin"></iframe><div class="phone-home" aria-hidden="true"></div></div></main>`;
  const frame=root.querySelector<HTMLIFrameElement>('iframe')!;
  frame.src=location.href;
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='ionic-demo-route')return;
    const route=event.data.url;
    if(typeof route!=='string'||!route.startsWith('/')||route.startsWith('//'))return;
    const next=new URL(route,location.origin);
    if(next.origin===location.origin&&next.href!==location.href)history.replaceState(null,'',next.pathname+next.search+next.hash);
  });
}
