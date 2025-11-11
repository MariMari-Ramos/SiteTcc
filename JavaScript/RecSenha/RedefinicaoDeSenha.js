(function(){
    'use strict';

    // ===== Form & UI =====
    const form = document.getElementById('resetPasswordForm');
    const nova = document.getElementById('NovaSenha');
    const confirma = document.getElementById('ConfirmarNovaSenha');
    const messageDiv = document.getElementById('message');
    const overlay = document.getElementById('overlay');
    const fecharModalBtn = document.getElementById('fecharModal');

    function showMessage(text,type='info',persist=false){
        if(!messageDiv) return;
        messageDiv.textContent = text;
        messageDiv.className = `message ${type} show`;
        if(!persist){
            setTimeout(()=> messageDiv.classList.remove('show'),5000);
        }
    }

    function validar(){
        const v1 = nova.value.trim();
        const v2 = confirma.value.trim();
        if(v1.length<8) return 'A senha deve ter pelo menos 8 caracteres.';
        if(v1!==v2) return 'As senhas não coincidem.';
        return null;
    }

    form?.addEventListener('submit',(e)=>{
        e.preventDefault();
        const erro = validar();
        if(erro){ showMessage(erro,'error'); nova.focus(); return; }
        showMessage('Senha redefinida!','success',true);
        form.submit(); // remova se for tratar via AJAX
    });

    nova?.addEventListener('input',()=> messageDiv.classList.remove('show'));
    confirma?.addEventListener('input',()=> messageDiv.classList.remove('show'));

    fecharModalBtn?.addEventListener('click',()=> overlay.style.display='none');

    document.querySelectorAll('.toggle-pass').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const id = btn.getAttribute('data-target');
            const input = document.getElementById(id);
            if(!input) return;
            const icon = btn.querySelector('i');
            if(input.type==='password'){
                input.type='text';
                icon.classList.replace('bi-eye-fill','bi-eye-slash-fill');
            }else{
                input.type='password';
                icon.classList.replace('bi-eye-slash-fill','bi-eye-fill');
            }
        });
    });

    // ===== Configurações =====
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const resetSettings = document.getElementById('resetSettings');

    const defaultSettings = {
        enableWaves:true,
        enableClickEffect:true,
        enableHoldEffect:true,
        theme:'light',
        highContrast:false,
        largerText:false
    };
    const STORAGE_KEY = 'resetPageSettings';

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
            const el=document.querySelector(sel);
            if(el) el.checked=!!s[k];
        });
        const themeRadio = document.querySelector(`input[name="theme"][value="${s.theme}"]`);
        themeRadio && (themeRadio.checked=true);
    }

    function applySettings(s){
        document.body.classList.remove('dark-theme','high-contrast','large-text');
        document.documentElement.classList.remove('dark-theme','high-contrast','large-text');

        if(s.theme==='dark'){
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
        }else if(s.theme==='auto'){
            if(window.matchMedia('(prefers-color-scheme: dark)').matches){
                document.body.classList.add('dark-theme');
                document.documentElement.classList.add('dark-theme');
            }
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
            canvas.style.display = wavesEnabled ? 'block':'none';
            if(!wavesEnabled) ctx?.clearRect(0,0,canvas.width,canvas.height);
        }
    }

    function saveSettings(){
        const s = {
            enableWaves: document.getElementById('enableWaves')?.checked ?? true,
            enableClickEffect: document.getElementById('enableClickEffect')?.checked ?? true,
            enableHoldEffect: document.getElementById('enableHoldEffect')?.checked ?? true,
            theme: document.querySelector('input[name="theme"]:checked')?.value || 'light',
            highContrast: document.getElementById('highContrast')?.checked || false,
            largerText: document.getElementById('largerText')?.checked || false
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        applySettings(s);
    }

    function restoreDefaults(){
        if(!confirm('Restaurar configurações padrão?')) return;
        localStorage.removeItem(STORAGE_KEY);
        const s = loadSettings();
        syncUI(s);
        applySettings(s);
        alert('Padrões restaurados.');
    }

    function openSettings(){
        settingsModal?.classList.add('active');
        document.body.classList.add('settings-open');
        isSettingsOpen = true;
        interactive = false;
        isMousePressed = false;
        speedBoost = 0;
        heat = 0;
        clickAmp = 0;
        targetClickHeight = 0;
    }
    function closeSettingsModal(){
        settingsModal?.classList.remove('active');
        document.body.classList.remove('settings-open');
        isSettingsOpen = false;
        if(!isFieldFocused) interactive = true;
    }

    settingsBtn?.addEventListener('click', openSettings);
    closeSettings?.addEventListener('click', closeSettingsModal);
    settingsModal?.addEventListener('click',e=>{
        if(e.target===settingsModal) closeSettingsModal();
    });
    closeSettingsBtn?.addEventListener('click',()=>{
        saveSettings();
        closeSettingsModal();
    });
    resetSettings?.addEventListener('click', restoreDefaults);
    document.querySelectorAll('.settings-option input').forEach(i=>{
        i.addEventListener('change', saveSettings);
    });
    document.querySelectorAll('.settings-option').forEach(opt=>{
        opt.addEventListener('click',e=>{
            const input = opt.querySelector('input');
            if(!input) return;
            if(e.target.tagName==='INPUT') return;
            if(input.type==='checkbox'){
                input.checked=!input.checked;
                input.dispatchEvent(new Event('change'));
            }else if(input.type==='radio'){
                input.checked=true;
                input.dispatchEvent(new Event('change'));
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
    let isSettingsOpen = false;
    let interactive = true;
    let isMousePressed = false;
    let isFieldFocused = false;

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

    let heat = 0;
    const heatDecay = 0.96;

    let clickAmp = 0;
    const maxClickAmp = 1.5;
    const clickAmpDecay = 0.93;

    let clickHeight = 0;
    let targetClickHeight = 0;
    const clickHeightEase = 0.12;

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
        const a=parseRGBA(c1), b=parseRGBA(c2);
        return `rgba(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)},${a[3]+(b[3]-a[3])*t})`;
    }

    window.addEventListener('mousemove',e=>{
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        const center = window.innerWidth/2;
        targetWaveDir = e.clientX < center ? 1 : -1;
    });

    window.addEventListener('mousedown',e=>{
        if(e.button!==0) return;
        isMousePressed=true;
        const s=loadSettings();
        if(s.enableClickEffect && wavesEnabled && interactive && !isSettingsOpen){
            heat=1;
            clickAmp=maxClickAmp;
            targetClickHeight = -(canvas.height/2 - e.clientY);
        }
    });
    window.addEventListener('mouseup',e=>{
        if(e.button!==0) return;
        isMousePressed=false;
    });

    form?.addEventListener('focusin',ev=>{
        if(ev.target.matches('input,button')){
            interactive=false;
            isFieldFocused=true;
        }
    },true);
    form?.addEventListener('focusout',ev=>{
        if(ev.target.matches('input,button')){
            isFieldFocused=false;
            if(!isSettingsOpen) interactive=true;
        }
    },true);

    settingsBtn?.addEventListener('mouseenter',()=> interactive=false);
    settingsBtn?.addEventListener('mouseleave',()=>{
        if(!isFieldFocused && !isSettingsOpen) interactive=true;
    });

    function draw(){
        requestAnimationFrame(draw);
        if(!canvas || !ctx) return;
        if(!wavesEnabled){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            return;
        }
        ctx.clearRect(0,0,canvas.width,canvas.height);

        const s=loadSettings();

        mouseX += (targetMouseX - mouseX)*ease;
        mouseY += (targetMouseY - mouseY)*ease;
        waveDir += (targetWaveDir - waveDir)*0.1;

        if(s.enableHoldEffect && interactive && !isSettingsOpen && !isFieldFocused){
            if(isMousePressed && speedBoost < maxSpeedBoost){
                speedBoost += boostBuild;
            } else if(!isMousePressed && speedBoost>0){
                speedBoost *= boostDecay;
                if(speedBoost<0.01) speedBoost=0;
            }
        }else{
            speedBoost=0;
        }

        if(heat>0){ heat*=heatDecay; if(heat<0.01) heat=0; }
        if(clickAmp>0){ clickAmp*=clickAmpDecay; if(clickAmp<0.01) clickAmp=0; }
        clickHeight += (targetClickHeight - clickHeight)*clickHeightEase;

        const baseColors=[cssVar('--wave1'),cssVar('--wave2'),cssVar('--wave3')];
        const hotColors=[cssVar('--waveHot1'),cssVar('--waveHot2'),cssVar('--waveHot3')];

        waves.forEach((w,i)=>{
            const influence = Math.abs(mouseY - canvas.height/2)*0.03;
            const extra = clickAmp * (60 + i*10);
            w.targetAmp = w.baseAmp + influence*(interactive?1:0) + extra;
            w.amp += (w.targetAmp - w.amp)*w.ampEase;

            const verticalInfluence = ((mouseY - canvas.height/2)*0.04*(i+1)*(interactive?1:0)) + clickHeight;
            const freqAdj = w.freq * (1 + clickAmp*0.8);

            ctx.beginPath();
            for(let x=0;x<=canvas.width;x+=10){
                const baseY = Math.sin(x*freqAdj + w.fase)*w.amp;
                const harmonic = Math.sin(x*freqAdj*2.5 + w.fase)*(w.amp*clickAmp*0.6);
                const y = baseY + harmonic + canvas.height/2 + verticalInfluence;
                x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
            }
            ctx.lineTo(canvas.width,canvas.height);
            ctx.lineTo(0,canvas.height);
            ctx.closePath();

            const cMix1 = mixColor(baseColors[i],hotColors[i],heat);
            const cMix2 = mixColor(baseColors[i],hotColors[(i+1)%3],heat*0.6);
            const grad = ctx.createLinearGradient(0,0,0,canvas.height);
            grad.addColorStop(0,cMix1);
            grad.addColorStop(1,cMix2);
            ctx.fillStyle=grad;
            ctx.fill();

            const baseSpeed=0.8;
            const mult = baseSpeed*(1+speedBoost)*(1+Math.sin(Date.now()*0.0005)*0.1);
            w.fase += w.vel * mult * waveDir;
        });
    }
    draw();

    const initial = loadSettings();
    syncUI(initial);
    applySettings(initial);
})();