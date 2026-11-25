(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  $$('[data-burger]').forEach(btn => btn.addEventListener('click', () => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (menu) menu.hidden = !open;
  }));
  $$('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.filter;
    $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    $$('[data-cat]').forEach(card => card.hidden = key !== 'all' && card.dataset.cat !== key);
  }));
  $$('[data-faq-search]').forEach(input => input.addEventListener('input', () => {
    const query = input.value.trim().toLocaleLowerCase('ru');
    $$('[data-faq-item]').forEach(item => item.hidden = !item.textContent.toLocaleLowerCase('ru').includes(query));
  }));
  const date = $('[data-tuesdays]');
  if (date && !date.options.length) {
    const d = new Date(); d.setHours(0,0,0,0);
    for (let i=0; i<35 && date.options.length<8; i++, d.setDate(d.getDate()+1)) if (d.getDay()===2 && d>=new Date()) {
      const option = document.createElement('option'); option.value = d.toISOString().slice(0,10);
      option.textContent = new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long'}).format(d); date.append(option);
    }
  }
  $$('[data-form]').forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('[data-status]', form), endpoint = window.ZF_CONFIG?.formEndpoint;
    if (!form.reportValidity()) return;
    if (!endpoint) { if(status){status.hidden=false;status.textContent='Форма пока не подключена к обработчику. Позвоните нам: +7 (8712) 29-10-10.';} return; }
    const button = $('button[type="submit"]',form); if(button) button.disabled=true;
    try { const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))}); if(!res.ok) throw Error(); form.reset(); if(status){status.hidden=false;status.textContent='Заявка отправлена. Мы свяжемся с вами.';} }
    catch { if(status){status.hidden=false;status.textContent='Не удалось отправить форму. Позвоните нам: +7 (8712) 29-10-10.';} }
    finally {if(button)button.disabled=false;}
  }));
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const items = $$('.section, .plate, .project, .tile, .step'); items.forEach(x=>x.classList.add('reveal'));
    const io = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target);}}),{threshold:.08}); items.forEach(x=>io.observe(x));
  }
})();
