(() => {
  const rub = n => new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(Math.round(n))+' ₽';
  const num = el => Number((el?.value||'').replace(/[^\d]/g,''))||0;
  const calc = root => {
    const amount=num(root.querySelector('#calc-amount')), graceEl=root.querySelector('#calc-grace'), termEl=root.querySelector('#calc-term');
    const grace=Math.max(0,Math.min(12,num(graceEl))), term=Math.max(1,Math.min(60,num(termEl)));
    const rate=root.querySelector('[data-program="lamanho"][aria-pressed="true"]')?0.06:0.13;
    const principal=amount*(1+rate*grace/12), r=rate/12, pay=principal*r/(1-Math.pow(1+r,-term)), markup=principal-amount;
    const out=(key,value)=>{const el=root.querySelector(`[data-out="${key}"]`);if(el)el.textContent=value;};
    out('big',rub(pay));out('markup',rub(markup));out('pct',((principal/Math.max(amount,1)-1)*100).toFixed(1).replace('.',',')+'%');out('total-term',`${term+grace} мес.`);out('total',rub(principal+pay*term));
    const barG=root.querySelector('[data-out="barG"]'),barP=root.querySelector('[data-out="barP"]');if(barG&&barP){barG.style.height='70%';barP.style.height=`${Math.max(12,Math.min(90,30+grace*4))}%`;}
  };
  document.querySelectorAll('[data-calc]').forEach(root=>{
    root.addEventListener('input',()=>calc(root));
    root.addEventListener('click',e=>{const b=e.target.closest('[data-program],[data-mode],[data-grace]');if(!b)return;const group=b.dataset.program?'[data-program]':b.dataset.mode?'[data-mode]':'[data-grace]';root.querySelectorAll(group).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(b.dataset.grace){const g=root.querySelector('#calc-grace'),t=root.querySelector('#calc-term');if(g)g.value=b.dataset.grace;if(t)t.value=b.dataset.term;}calc(root);});
    calc(root);
  });
})();
