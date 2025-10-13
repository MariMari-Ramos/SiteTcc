

<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="GlobalConfig.js" defer></script>
    <link rel="stylesheet" href="../CSS/TelaPrincipal/home.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <title data-translate="title">SystemForge - Início</title>
</head>
<body>
    <header>
        <div class="logo">
            <a href="home.html">
                <img src="../img/PETO E BANCO-Photoroom.png" alt="Logo">
            </a>
        </div>
        <nav class="menu">
            <a href="guia.html">
                <img src="../img/image-Photoroom (1).png" alt="Mascote">
                <span data-translate="guia">Guia</span>
            </a>
            <a href="Configurações/config.html">
                <i class="bi bi-gear-fill" id="ConfiguraçõesButton" name="Configurações"></i>
                <span data-translate="configuracoes">Configurações</span>
            </a>
            <a href="./Perfil_ConfiguracaoDePerfil/Perfil.php">
                <i class="bi bi-person-circle"></i>
                <span data-translate="perfil">Perfil</span>
            </a>
        </nav>
    </header>

    <label for="System" data-translate="sistemas">Sistemas</label>
    <section class="carrossel">
        <div class="slides">
            <div class="card">
                <div>
                    <img src="../img/1-8d3a9a38.png" alt="Tormenta 20">
                    <p>Tormenta 20</p>
                </div>
                <div>
                    <img src="../img/cthulhu.png" alt="Call of the Cthulhu">
                    <p>Call of the Cthulhu</p>
                </div>
                <div>
                    <img src="../img/icons8-cyberpunk-512.png" alt="Cyberpunk">
                    <p>Cyberpunk</p>
                </div>
                <div>
                    <img src="../img/icons8-dungeons-and-dragons-256.png" alt="Dungeons and Dragons">
                    <p>Dungeons and Dragons</p>
                </div>
                <div>
                    <img src="../img/icons8-vampire-100.png" alt="Vampiro a Mascara">
                    <p>Vampiro a Mascara</p>
                </div>
            </div>
        </div>
    </section>
    
    <label for="MinhasFichas" data-translate="minhasFichas">Minhas Fichas</label>
    <section>
        <div class="CaixaMinhasFichas"></div>
    </section>
    <label for="MinhasFichasRandomicas" data-translate="minhasFichasRandomicas">Minhas Fichas Randomicas</label>

    <footer>
    <div class="footer-content">
        <div class="footer-links">
            <a href="#" data-translate="patrocinadores">Patrocinadores:</a>
            <a href="#">Onigiri</a>
        </div>
        
        <div class="footer-links">
            <span data-translate="linksRapidos">Links Rápidos:</span>
            <a href="#" data-translate="sistemas">Sistemas</a>
            <a href="#" data-translate="minhasFichas">Minhas fichas</a>
            <a href="#" data-translate="fichasRandomicas">Fichas Randômicas</a>
            <a href="#" data-translate="guia">Guia</a>
            <a href="#" data-translate="configuracoes">Configurações</a>
            <a href="#" data-translate="perfil">Perfil</a>
        </div>

        <div class="footer-links">
            <span data-translate="contatoSuporte">Contato & Suporte:</span>
            <a href="mailto:contato@systemforge.com">Email</a>
            <a href="https://wa.me/seunumero">Whatsapp</a>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="social-media">
            <a href="#" class="social-icon">
                <i class="bi bi-youtube"></i>
            </a>
            <a href="#" class="social-icon">
                <i class="bi bi-instagram"></i>
            </a>
            <a href="#" class="social-icon">
                <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="social-icon">
                <i class="bi bi-twitter-x"></i>
            </a>
        </div>
        <div class="footer-legal">
            <span data-translate="copyright">©2025 System Forge. Todos os direitos reservados</span>
            <div class="legal-links">
                <a href="#" data-translate="privacidade">Políticas de Privacidades</a>
                <a href="#" data-translate="termos">Termos de Uso</a>
                <a href="#" data-translate="cookies">Termos de Cookies</a>
                <a href="#" data-translate="acessibilidade">Acessibilidade</a>
            </div>
        </div>
    </div>
</footer>

    <script src="home.js"></script>
</body>
</html>