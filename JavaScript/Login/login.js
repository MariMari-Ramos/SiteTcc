/* login.js  — controla modal/login e as waves.
   Inicializa só após DOMContentLoaded para garantir elementos disponíveis.
*/

document.addEventListener('DOMContentLoaded', () => {
    console.log('[login.js] DOM pronto — iniciando scripts');

    /* ---------- Referências DOM ---------- */
    const overlay = document.getElementById("overlay");
    const textoModal = overlay ? overlay.querySelector("p") : null;
    const btnEntrar = document.getElementById("ButtonEntrar");
    const btnVerSenha = document.getElementById("BtnVerSenha");
    const btnFecharModal = document.getElementById("fecharModal");
    const formLogin = document.getElementById("formLogin");

    if(!overlay || !textoModal || !btnEntrar || !btnVerSenha || !formLogin) {
        console.warn('[login.js] Alguns elementos não foram encontrados no DOM. Verifique IDs.');
    } else {
        console.log('[login.js] Elementos do formulário encontrados');
    }

    function mostrarAlerta(mensagem){
        if(!overlay || !textoModal) return console.warn('overlay/textoModal ausentes');
        textoModal.textContent = mensagem;
        overlay.style.display = "flex";
    }

    function fecharModal(){
        if(!overlay) return;
        overlay.style.display = "none";
    }

    if(btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);

    // Mostrar/ocultar senha
    btnVerSenha && btnVerSenha.addEventListener('click', () => {
        const input = document.getElementById('senha');
        if(!input) return;
        if(input.type === 'password'){
            input.type = 'text';
            btnVerSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
        } else {
            input.type = 'password';
            btnVerSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
        }
    });

    // Intercepta o clique do botão Entrar
    btnEntrar && btnEntrar.addEventListener('click', (ev) => {
        ev.preventDefault();
        fazerLogin();
    });

    // implementação de login (tenta fazer fetch para o action do form)
    async function fazerLogin(){
        const email = (document.getElementById("email") || {}).value || "";
        const senha = (document.getElementById("senha") || {}).value || "";

        if(email.trim() === "" || senha.trim() === ""){
            mostrarAlerta("Preencha todos os campos!");
            return;
        }

        // tenta enviar via fetch para o action do form (se o servidor responder JSON)
        try {
            const actionUrl = formLogin.getAttribute('action') || 'login.php';
            const formData = new FormData();
            formData.append('email', email.trim());
            formData.append('senha', senha.trim());

            const lembrar = (document.getElementById("CBXLembrarSenha") || {}).checked || false;
            formData.append('CBXLembrarSenha', lembrar ? '1' : '0');

            const res = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });

            // tenta ler JSON; se não for JSON, exibe texto
            const text = await res.text();
            try {
                const json = JSON.parse(text);
                if(json.status === 'success'){
                    mostrarAlerta(json.message || 'Login OK');
                    setTimeout(()=>location.href = json.redirect || '../A_TelaPrincipal/index.php', 1300);
                } else {
                    mostrarAlerta(json.message || 'Credenciais inválidas');
                }
            } catch(e){
                // não era JSON — usa resposta textual
                if(res.ok){
                    mostrarAlerta('Resposta do servidor recebida. Verifique rota.');
                    console.log('[login.js] resposta (texto):', text);
                } else {
                    mostrarAlerta('Erro no login: ' + res.status);
                    console.error('[login.js] erro fetch:', res.status, text);
                }
            }
        } catch (err) {
            mostrarAlerta("Erro inesperado: " + err);
            console.error('[login.js] fetch erro:', err);
        }
    }

    /* ==================== CANVAS WAVES ==================== */
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Posição do mouse com suavização (easing)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = window.innerWidth / 2;
    let targetMouseY = window.innerHeight / 2;
    const easeAmount = 0.08; // Quanto menor, mais suave (0.01 a 0.2)

    // Flag para controlar se a interatividade com o mouse está habilitada
    let interactive = true;
    let isFormFocused = false;
    let interactiveTransition = 1; // Transição suave entre ativo/inativo (0 a 1)
    const transitionSpeed = 0.06; // Velocidade da transição (quanto menor, mais lenta)

    // Controle de pressão do mouse (mouse press boost)
    let isMousePressed = false;
    let speedBoost = 0; // 0 a 1 (0 = sem boost, 1 = boost máximo)
    const maxSpeedBoost = 2.5; // Multiplicador máximo de velocidade (quanto maior, mais rápido)
    const boostDecayRate = 0.95; // Taxa de decay do boost (quanto menor, mais rápido decai)
    const boostBuildRate = 0.08; // Taxa de construção do boost (suavização do aumento)

    // Controle de direção das ondas
    let waveDirection = 1; // 1 = direita, -1 = esquerda
    let targetWaveDirection = 1;
    const directionEaseAmount = 0.1; // Suavização da mudança de direção

    // Sistema de cores quentes ao clicar nas ondas
    let heatIntensity = 0; // 0 a 1 (0 = frio, 1 = quente)
    const heatDecayRate = 0.96; // Taxa de decay do calor (mais lento agora)
    
    // Sistema de amplitude do clique (labaredas)
    let clickAmplitude = 0; // 0 a 1 - amplitude extra ao clicar
    const maxClickAmplitude = 1.5; // Amplificação máxima
    const clickAmplitudeDecayRate = 0.93; // Taxa de decay da amplitude do clique
    
    // Sistema de altura das ondas ao clicar
    let clickHeight = 0; // Sobe até a altura do mouse
    let targetClickHeight = 0;
    const clickHeightEaseAmount = 0.12; // Suavização da mudança de altura

    // Paleta de cores base (frio)
    const coresBase = [
        'rgba(255,192,192,0.7)',
        'rgba(255,170,150,0.6)',
        'rgba(255,210,180,0.5)'
    ];

    // Paleta de cores quentes (com gradiente de fogo: amarelo > laranja > vermelho)
    const coresQuentes = [
        'rgba(255,200,0,0.9)',      // Amarelo quente
        'rgba(255,140,0,0.85)',     // Laranja
        'rgba(255,69,0,0.8)'        // Vermelho-laranja
    ];

    // Função para interpolar cores (misturar frio com quente)
    function interpolarCor(frio, quente, t) {
        // Parse das cores RGBA
        const regexFrio = /rgba\((\d+),(\d+),(\d+),([\d.]+)\)/;
        const regexQuente = /rgba\((\d+),(\d+),(\d+),([\d.]+)\)/;
        
        const matchFrio = frio.match(regexFrio);
        const matchQuente = quente.match(regexQuente);
        
        if (!matchFrio || !matchQuente) return frio;
        
        const r1 = parseInt(matchFrio[1]);
        const g1 = parseInt(matchFrio[2]);
        const b1 = parseInt(matchFrio[3]);
        const a1 = parseFloat(matchFrio[4]);
        
        const r2 = parseInt(matchQuente[1]);
        const g2 = parseInt(matchQuente[2]);
        const b2 = parseInt(matchQuente[3]);
        const a2 = parseFloat(matchQuente[4]);
        
        // Interpolação linear
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        const a = a1 + (a2 - a1) * t;
        
        return `rgba(${r},${g},${b},${a})`;
    }

    // Configuração das ondas com mais variação
    const ondas = [];
    for (let i = 0; i < 3; i++) {
        ondas.push({
            amp: 45 + i * 8,          // Amplitude um pouco menor para mais suavidade
            freq: 0.0018 + i * 0.0008, // Frequência mais suave
            vel: 0.0015 + i * 0.0012,  // Velocidade um pouco menor
            fase: Math.random() * 1000,
            corBase: coresBase[i],
            corQuente: coresQuentes[i],
            corAtual: coresBase[i],
            targetAmp: 45 + i * 8,
            ampEase: 0.05  // Suavização da amplitude
        });
    }

    // Atualiza posição alvo do mouse
    window.addEventListener('mousemove', e => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;

        // Determinar direção das ondas baseado na posição do mouse
        const centerX = window.innerWidth / 2;
        if (e.clientX < centerX) {
            targetWaveDirection = 1; // Esquerda (invertido)
        } else if (e.clientX > centerX) {
            targetWaveDirection = -1; // Direita (invertido)
        }
    });

    // Detecta pressão do botão esquerdo do mouse
    window.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Botão esquerdo
            isMousePressed = true;
            
            // Criar efeito de calor e labareda ao clicar nas waves (fora do formulário)
            if (!isFormFocused && interactive) {
                heatIntensity = 1.0; // Ativa o efeito de calor
                clickAmplitude = maxClickAmplitude; // Ativa labareda
                targetClickHeight = -(canvas.height / 2 - e.clientY); // Sobe até altura do mouse
                console.log('[waves] Clique nas ondas — efeito de labareda ativado');
            }
            console.log('[waves] Mouse pressionado — BOOST começando a aumentar');
        }
    });

    // Detecta soltura do botão esquerdo do mouse
    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) { // Botão esquerdo
            isMousePressed = false;
            console.log('[waves] Mouse liberado — boost começará a decair');
        }
    });

    // Seleciona a caixa de login para detectar quando desabilitar interatividade
    const loginBox = document.querySelector('.CaixaLogin') || document.querySelector('.login');
    const formElement = document.getElementById('formLogin');

    if (formElement) {
        // Quando qualquer input dentro do formulário recebe foco
        formElement.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, button')) {
                isFormFocused = true;
                interactive = false;
                console.log('[waves] Elemento focado — interactive OFF');
            }
        }, true);

        // Quando qualquer input perde foco
        formElement.addEventListener('focusout', (e) => {
            if (e.target.matches('input, textarea, button')) {
                isFormFocused = false;
                // Só reativa se o mouse não estiver na caixa
                if (loginBox && !loginBox.matches(':hover')) {
                    interactive = true;
                    console.log('[waves] Elemento desfocado — interactive ON');
                }
            }
        }, true);
    }

    if (loginBox) {
        // Mouse entra na caixa de login -> desativa interatividade suavemente
        loginBox.addEventListener('mouseenter', () => {
            interactive = false;
            console.log('[waves] Mouse entrou na caixa — interactive OFF');
        });
        
        // Mouse sai da caixa de login -> ativa apenas se nenhum input está focado
        loginBox.addEventListener('mouseleave', () => {
            if (!isFormFocused) {
                interactive = true;
                console.log('[waves] Mouse saiu da caixa — interactive ON');
            }
        });
    }

    // Toque em dispositivos móveis
    if (loginBox) {
        loginBox.addEventListener('touchstart', () => {
            interactive = false;
            console.log('[waves] Touch started — interactive OFF');
        }, { passive: true });

        loginBox.addEventListener('touchend', () => {
            if (!isFormFocused) {
                interactive = true;
                console.log('[waves] Touch ended — interactive ON');
            }
        }, { passive: true });
    }

    // Variável para rastrear o tempo do último frame (para deltaTime)
    let lastFrameTime = Date.now();

    // Função de desenho/loop com suavização melhorada
    function desenhar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calcular deltaTime
        const currentTime = Date.now();
        const deltaTime = (currentTime - lastFrameTime) / 1000; // em segundos
        lastFrameTime = currentTime;

        // Suavizar transição entre ativo/inativo
        const targetTransition = interactive ? 1 : 0;
        interactiveTransition += (targetTransition - interactiveTransition) * transitionSpeed;

        // Suavizar movimento do mouse (easing)
        mouseX += (targetMouseX - mouseX) * easeAmount;
        mouseY += (targetMouseY - mouseY) * easeAmount;

        // Suavizar mudança de direção das ondas
        waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount;

        // Calcular posição da onda suavemente
        // Quando interactive = true, usa posição real do mouse
        // Quando interactive = false, suavemente volta para o centro
        const smoothMouseY = window.innerHeight / 2 + (mouseY - window.innerHeight / 2) * interactiveTransition;

        // Atualizar boost com delay (build rate) quando pressionado
        if (isMousePressed && speedBoost < maxSpeedBoost) {
            speedBoost += boostBuildRate;
            if (speedBoost > maxSpeedBoost) speedBoost = maxSpeedBoost;
        } else if (!isMousePressed && speedBoost > 0) {
            // Decay do boost quando o mouse não está pressionado
            speedBoost *= boostDecayRate;
            if (speedBoost < 0.01) speedBoost = 0; // Zera quando muito pequeno
        }

        // Atualizar intensidade de calor (mais lento agora)
        if (heatIntensity > 0) {
            heatIntensity *= heatDecayRate;
            if (heatIntensity < 0.01) heatIntensity = 0;
        }

        // Atualizar amplitude do clique (labareda)
        if (clickAmplitude > 0) {
            clickAmplitude *= clickAmplitudeDecayRate;
            if (clickAmplitude < 0.01) clickAmplitude = 0;
        }

        // Atualizar altura do clique (sobe até o mouse)
        clickHeight += (targetClickHeight - clickHeight) * clickHeightEaseAmount;

        ondas.forEach((o, idx) => {
            // Calcular amplitude alvo baseado no estado com transição suave
            let newTargetAmp;
            const influence = Math.abs(smoothMouseY - canvas.height / 2) * 0.03;
            
            // Adicionar amplitude do clique (labareda)
            const extraAmp = clickAmplitude * (60 + idx * 10);
            newTargetAmp = (45 + idx * 8) + influence * interactiveTransition + extraAmp;

            // Suavizar mudança de amplitude
            o.targetAmp = newTargetAmp;
            o.amp += (o.targetAmp - o.amp) * o.ampEase;

            // Cálculo de deslocamento vertical com transição suave + altura do clique
            const verticalInfluence = ((smoothMouseY - canvas.height / 2) * 0.04 * (idx + 1) * interactiveTransition) + clickHeight;

            // Atualizar cor baseado na intensidade de calor
            o.corAtual = interpolarCor(o.corBase, o.corQuente, heatIntensity);

            // === ONDAS DE BAIXO COM EFEITO DE LABAREDA (MAIS PONTUDAS) ===
            ctx.beginPath();
            
            // Aumentar frequência durante o clique para efeito mais pontudo
            const freqMultiplier = 1 + clickAmplitude * 0.8;
            const adjustedFreq = o.freq * freqMultiplier;
            
            for (let x = 0; x <= canvas.width; x += 10) {
                // Adicionar harmônico para efeito de labareda
                const baseY = Math.sin(x * adjustedFreq + o.fase) * o.amp;
                const harmonic = Math.sin(x * adjustedFreq * 2.5 + o.fase) * (o.amp * clickAmplitude * 0.6);
                const y = baseY + harmonic + canvas.height / 2 + verticalInfluence;
                
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();

            // Gradiente com cor dinâmica baseada no calor (fogo: amarelo > laranja > vermelho)
            const gradBottom = ctx.createLinearGradient(0, 0, 0, canvas.height);
            
            // Interpolar a cor atual baseado no calor
            const corMeio = interpolarCor(o.corBase, 'rgba(255,140,0,0.85)', heatIntensity); // Laranja
            const corBorda = interpolarCor(o.corBase, 'rgba(255,69,0,0.9)', heatIntensity);  // Vermelho
            
            // Gradiente de fogo: amarelo (interior) > laranja (meio) > vermelho (borda/fundo)
            gradBottom.addColorStop(0, o.corAtual);  // Topo: amarelo/rosa (conforme calor)
            gradBottom.addColorStop(0.5, corMeio);   // Meio: laranja
            gradBottom.addColorStop(1, corBorda);    // Fundo: vermelho
            
            ctx.fillStyle = gradBottom;
            ctx.fill();

            // Velocidade de animação suavizada baseada no estado + BOOST + DIREÇÃO
            // Remover a influência da posição X do mouse na velocidade base
            const baseSpeed = 0.8; // Velocidade constante
            const speedBoostMultiplier = 1 + speedBoost; // Boost adiciona ao multiplicador
            const speedMultiplier = baseSpeed * speedBoostMultiplier * (1 + Math.sin(Date.now() * 0.0005) * 0.1);
            
            // Aplicar direção das ondas
            o.fase += o.vel * speedMultiplier * waveDirection;
        });

        requestAnimationFrame(desenhar);
    }

    desenhar();
});