(function(){
    'use strict';

    // ===== Form =====
    const form = document.getElementById('formRecSenha');
    const btnEnviar = document.getElementById('btnEnviar');
    const btnVoltar = document.getElementById('btnVoltar');
    const emailInput = document.getElementById('email');
    const messageDiv = document.getElementById('message');
    // Modal de alerta (mesmo estilo do Login)
    const overlay = document.getElementById('overlay');
    const overlayModal = overlay?.querySelector('.modal');
    const overlayTitle = overlayModal?.querySelector('h2');
    const overlayText = overlayModal?.querySelector('p');
    const overlayCloseBtn = document.getElementById('fecharModal');

    function openAlert(title, text){
        if(overlay){
            if(overlayTitle) overlayTitle.textContent = title || 'Alerta';
            if(overlayText) overlayText.textContent = text || '';
            overlay.style.display = 'flex';
            isAlertOpen = true;
            interactive = false;
            isMousePressed = false;
        } else {
            // Fallback
            alert((title? title+': ' : '') + (text || ''));
        }
    }
    function closeAlert(){
        if(overlay){
            overlay.style.display = 'none';
            isAlertOpen = false;
            if(!isFieldFocused && !isSettingsOpen && !isMouseInsideForm){
                interactive = true;
            }
        }
    }
    function showMessage(text,type='info'){
        const title = type==='error' ? 'Alerta' : (type==='success' ? 'Sucesso' : 'Aviso');
        openAlert(title, text);
    }
    function validateInput(v){
        const value = v.trim();
        if(!value) return {valid:false,message:'Preencha o campo.'};
        if(value.length<3) return {valid:false,message:'Mínimo 3 caracteres.'};
        return {valid:true};
    }

    form?.addEventListener('submit',(e)=>{
       // e.preventDefault();
        const res = validateInput(emailInput.value);
        if(!res.valid){ showMessage(res.message,'error'); emailInput.focus(); return; }
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
        setTimeout(()=>{
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar Código';
            showMessage('Código enviado! Verifique seu e-mail.','success');
        },1500);
    });
    btnVoltar?.addEventListener('click',()=> window.location.href='../loginhtml.php');
    // Mensagem inline removida (substituída por modal)
    emailInput?.focus();

    // ===== Configurações =====
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');

    const defaultSettings = {
        enableWaves:true,
        enableClickEffect:true,
        enableHoldEffect:true,
        theme:'light',
        highContrast:false,
        largerText:false
    };
    const STORAGE_KEY = 'recPageSettings';

    function loadSettings(){
        try{
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? {...defaultSettings,...JSON.parse(raw)} : {...defaultSettings};
        }catch{ return {...defaultSettings}; }
    }
    function syncUI(s){
        const map = {
            enableWaves:'#enableWaves',
            enableClickEffect:'#enableClickEffect',
            enableHoldEffect:'#enableHoldEffect',
            highContrast:'#highContrast',
            largerText:'#largerText'
        };
        Object.entries(map).forEach(([k,sel])=>{
            const el = document.querySelector(sel);
            if(el) el.checked = !!s[k];
        });
        const themeRadio = document.querySelector(`input[name="theme"][value="${s.theme}"]`);
        themeRadio && (themeRadio.checked = true);
    }
    function applySettings(s){
        // aplica classes no body e html (igual Login)
        document.body.classList.remove('light-theme','dark-theme','large-text','high-contrast','settings-open');
        document.documentElement.classList.remove('light-theme','dark-theme','large-text','high-contrast');

        if(s.theme==='dark'){
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
        } else if(s.theme==='auto'){
            if(window.matchMedia('(prefers-color-scheme: dark)').matches){
                document.body.classList.add('dark-theme');
                document.documentElement.classList.add('dark-theme');
            } else {
                document.body.classList.add('light-theme');
                document.documentElement.classList.add('light-theme');
            }
        } else {
            document.body.classList.add('light-theme');
            document.documentElement.classList.add('light-theme');
        }

        if(s.highContrast){
            document.body.classList.add('high-contrast');
            document.documentElement.classList.add('high-contrast');
        }
        if(s.largerText){
            document.body.classList.add('large-text');
            document.documentElement.classList.add('large-text');
        }

        wavesEnabled = s.enableWaves;
        if(canvas){
            if(s.enableWaves){
                if(!wavesEnabled){
                    wavesFadingOut = false;
                    waveFadeOpacity = 0;
                    canvas.style.display = 'block';
                    
                    const fadeInInterval = setInterval(() => {
                        waveFadeOpacity += 0.02;
                        if(waveFadeOpacity >= 1){
                            waveFadeOpacity = 1;
                            clearInterval(fadeInInterval);
                        }
                    }, 16);
                }
            } else {
                if(wavesEnabled){
                    wavesFadingOut = true;
                    
                    setTimeout(() => {
                        if(!wavesEnabled){
                            canvas.style.display = 'none';
                            ctx.clearRect(0,0,canvas.width,canvas.height);
                            
                            heat = 0;
                            clickAmp = 0;
                            clickHeight = 0;
                            targetClickHeight = 0;
                            speedBoost = 0;
                            wavesFadingOut = false;
                        }
                    }, 1500);
                }
            }
        }
    }
    function saveSettings(){
        const settings = {
            enableWaves: document.getElementById('enableWaves')?.checked ?? true,
            enableClickEffect: document.getElementById('enableClickEffect')?.checked ?? true,
            enableHoldEffect: document.getElementById('enableHoldEffect')?.checked ?? true,
            theme: document.querySelector('input[name="theme"]:checked')?.value || 'light',
            highContrast: document.getElementById('highContrast')?.checked || false,
            largerText: document.getElementById('largerText')?.checked || false
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        applySettings(settings);
    }

    function openSettings(){
        settingsModal?.classList.add('active');
        isSettingsOpen = true;
        interactive = false;
        isMousePressed = false;
        speedBoost = 0;
        heat = 0;
        clickAmp = 0;
        targetClickHeight = 0;
    }
    function closeSettingsModal(){
        const settingsContent = settingsModal.querySelector('.settings-content');
        
        settingsModal.classList.add('closing');
        if (settingsContent) {
            settingsContent.classList.add('closing');
        }
        
        setTimeout(() => {
            settingsModal.classList.remove('active', 'closing');
            if (settingsContent) {
                settingsContent.classList.remove('closing');
            }
            
            isSettingsOpen = false;
            if (!isFieldFocused) interactive = true;
        }, 300);
    }

    settingsBtn?.addEventListener('click', openSettings);
    closeSettings?.addEventListener('click', closeSettingsModal);
    settingsModal?.addEventListener('click',(e)=>{
        if(e.target===settingsModal) closeSettingsModal();
    });
    
    document.querySelectorAll('.settings-option input').forEach(i=>{
        i.addEventListener('change', saveSettings);
    });
    // Permite clicar no nome/linha para alternar a opção (checkbox/radio)
    document.querySelectorAll('.settings-option').forEach(option=>{
        option.addEventListener('click',(e)=>{
            // Evita duplo toggle quando clica direto no input
            if((e.target instanceof HTMLInputElement)) return;
            const input = option.querySelector('input');
            if(!input || input.disabled) return;
            if(input.type === 'checkbox'){
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            } else if(input.type === 'radio'){
                if(!input.checked){
                    input.checked = true;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });
    });

    // ===== Ondas =====
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas?.getContext('2d');
    function resizeCanvas(){
        if(!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let wavesEnabled = true;
    let wavesFadingOut = false;
    let waveFadeOpacity = 1;
    let isSettingsOpen = false;
    let interactive = true;
    let isMousePressed = false;
    let isFieldFocused = false;
    let isMouseInsideForm = false; // bloqueia direção das waves quando cursor está sobre o formulário
    let isAlertOpen = false; // modal de alerta aberto

    let mouseX = window.innerWidth/2;
    let mouseY = window.innerHeight/2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    const ease = 0.08;

    let speedBoost = 0;
    const maxSpeedBoost = 4;
    const boostDecay = 0.95;
    const boostBuild = 0.15;

    let waveDir = 1;
    let targetWaveDir = 1;
    // Transição suave de interatividade (igual Login)
    let interactiveTransition = 1; // 1 = totalmente interativo, 0 = bloqueado
    const transitionSpeed = 0.06;

    let heat = 0;
    const heatDecay = 0.96;

    let clickAmp = 0;
    const maxClickAmp = 1.5;
    const clickAmpDecay = 0.93;

    let clickHeight = 0;
    let targetClickHeight = 0;
    const clickHeightEase = 0.12;
    
    // Ponto de clique para direcionar as ondas
    let clickPointX = window.innerWidth / 2;
    let clickDirectionTarget = 1;

    function cssVar(name){
        return getComputedStyle(document.body).getPropertyValue(name).trim();
    }

    const waves = [];
    for(let i=0;i<3;i++){
        waves.push({
            baseAmp:45 + i*8,
            amp:45 + i*8,
            targetAmp:45 + i*8,
            freq:0.0018 + i*0.0008,
            vel:0.0015 + i*0.0012,
            fase:Math.random()*1000,
            ampEase:0.05
        });
    }

    function parseRGBA(rgba){
        const m = rgba.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
        return m? [ +m[1], +m[2], +m[3], +m[4] ] : [0,0,0,1];
    }
    function mixColor(c1,c2,t){
        const a = parseRGBA(c1), b=parseRGBA(c2);
        return `rgba(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)},${a[3]+(b[3]-a[3])*t})`;
    }

    window.addEventListener('mousemove',(e)=>{
        // Não atualiza alvo quando modal de alerta está aberto
        if(isAlertOpen) return;
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        // Não mude a direção das ondas se o mouse estiver sobre o formulário
        if(!isMouseInsideForm){
            const center = window.innerWidth/2;
            targetWaveDir = e.clientX < center ? 1 : -1;
        }
    });

    window.addEventListener('mousedown',(e)=>{
        if(e.button!==0) return;
        isMousePressed = true;
        const s = loadSettings();
        if(s.enableClickEffect && wavesEnabled && interactive && !isSettingsOpen && !isAlertOpen){
            heat = 1;
            clickAmp = maxClickAmp;
            targetClickHeight = -(canvas.height/2 - e.clientY);
        }
    });
    window.addEventListener('mouseup',(e)=>{
        if(e.button!==0) return;
        isMousePressed = false;
    });

    form?.addEventListener('focusin',(ev)=>{
        if(ev.target.matches('input,button')){
            interactive = false;
            isFieldFocused = true;
        }
    },true);
    form?.addEventListener('focusout',(ev)=>{
        if(ev.target.matches('input,button')){
            isFieldFocused = false;
            if(!isSettingsOpen && !isMouseInsideForm) interactive = true;
        }
    },true);

    // Detecta mouse dentro/fora da caixa para travar interatividade e direção
    const formBox = document.querySelector('.CaixaRecuperarSenha');
    formBox?.addEventListener('mouseenter',()=>{
        isMouseInsideForm = true;
        interactive = false;
    });
    formBox?.addEventListener('mouseleave',()=>{
        isMouseInsideForm = false;
        if(!isFieldFocused && !isSettingsOpen){
            interactive = true;
        }
    });

    settingsBtn?.addEventListener('mouseenter',()=> interactive=false);
    settingsBtn?.addEventListener('mouseleave',()=>{
        if(!isFieldFocused && !isSettingsOpen) interactive=true;
    });

    // Eventos do modal de alerta
    overlayCloseBtn?.addEventListener('click', closeAlert);
    overlay?.addEventListener('click',(e)=>{ if(e.target===overlay) closeAlert(); });
    window.addEventListener('keydown',(e)=>{ if(e.key==='Escape' && isAlertOpen) closeAlert(); });

    function draw(){
        requestAnimationFrame(draw);
        if(!canvas || !ctx) return;
        
        if (!wavesEnabled) {
            if (wavesFadingOut) {
                waveFadeOpacity -= 0.015;
                if (waveFadeOpacity <= 0) {
                    waveFadeOpacity = 0;
                    wavesFadingOut = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    return;
                }
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }
        }
        
        ctx.clearRect(0,0,canvas.width,canvas.height);

        const s = loadSettings();

        // Ajusta transição de interatividade (0..1) suavemente
        const targetTransition = (interactive && !isSettingsOpen && !isFieldFocused && !isMouseInsideForm && !isAlertOpen) ? 1 : 0;
        interactiveTransition += (targetTransition - interactiveTransition) * transitionSpeed;

        mouseX += (targetMouseX - mouseX)*ease;
        mouseY += (targetMouseY - mouseY)*ease;
        
        // Sempre segue a direção do mouse, clique não altera a direção
        waveDir += (targetWaveDir - waveDir)*0.1 * interactiveTransition;

        // Usa uma posição de mouse "suavizada" para reduzir salto ao entrar/sair do form
        const centerY = canvas.height/2;
        const smoothMouseY = centerY + (mouseY - centerY) * interactiveTransition;

        if(s.enableHoldEffect && interactive && !isSettingsOpen && !isFieldFocused && !isAlertOpen && !isMouseInsideForm){
            if(isMousePressed && speedBoost < maxSpeedBoost){
                speedBoost += boostBuild;
            } else if(!isMousePressed && speedBoost>0){
                speedBoost *= boostDecay;
                if(speedBoost < 0.01) speedBoost = 0;
            }
        } else {
            speedBoost = 0;
        }

        if(heat>0){ heat *= heatDecay; if(heat<0.01) heat=0; }
        if(clickAmp>0){ clickAmp *= clickAmpDecay; if(clickAmp<0.01) clickAmp=0; }
        clickHeight += (targetClickHeight - clickHeight)*clickHeightEase;

        const baseColors = [cssVar('--wave1'),cssVar('--wave2'),cssVar('--wave3')];
        const hotColors  = [cssVar('--waveHot1'),cssVar('--waveHot2'),cssVar('--waveHot3')];

        waves.forEach((w,i)=>{
            const influence = Math.abs(smoothMouseY - centerY) * 0.03; // influencia suavizada
            const extra = clickAmp * (60 + i*10);
            w.targetAmp = w.baseAmp + influence*interactiveTransition + extra;
            w.amp += (w.targetAmp - w.amp)*w.ampEase;

            const verticalInfluence = ((smoothMouseY - centerY) * 0.04 * (i+1) * interactiveTransition) + clickHeight;
            const freqAdj = w.freq * (1 + clickAmp*0.8);

            ctx.beginPath();
            for(let x=0;x<=canvas.width;x+=10){
                const baseY = Math.sin(x*freqAdj + w.fase)*w.amp;
                const harmonic = Math.sin(x*freqAdj*2.5 + w.fase)*(w.amp*clickAmp*0.6);
                const y = baseY + harmonic + canvas.height/2 + verticalInfluence;
                x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
            }
            ctx.lineTo(canvas.width,canvas.height);
            ctx.lineTo(0,canvas.height);
            ctx.closePath();

            const cMix1 = mixColor(baseColors[i], hotColors[i], heat);
            const cMix2 = mixColor(baseColors[i], hotColors[(i+1)%3], heat*0.6);

            const grad = ctx.createLinearGradient(0,0,0,canvas.height);
            grad.addColorStop(0,cMix1);
            grad.addColorStop(1,cMix2);
            ctx.fillStyle = grad;
            ctx.globalAlpha = waveFadeOpacity;
            ctx.fill();
            ctx.globalAlpha = 1;

            const baseSpeed = 0.8;
            const mult = baseSpeed*(1+speedBoost)*(1+ Math.sin(Date.now()*0.0005)*0.1);
            w.fase += w.vel * mult * waveDir;
        });
    }
    draw();

    const initial = loadSettings();
    syncUI(initial);
    applySettings(initial);
})();