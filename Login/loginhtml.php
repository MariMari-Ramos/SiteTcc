
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../CSS/Login/Login.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <title>Login</title>
</head>
<body>

    <canvas id="waveCanvas" aria-hidden="true"></canvas>

    <section>
        <div class="CaixaLogin">
            <div class="login">
                <img src="../img/PETO E BANCO.png" alt="Logo" class="CaixaLoginImg">
                <label for="TituloLogin">Login</label>
               <form id="formLogin" method="POST" action="login.php" onsubmit="event.preventDefault()">


                    <label for="Subtitulo">Nome do Perfil ou E-mail:</label>
                    <input type="email" id="email" name="email" placeholder="Digite seu Perfil ou E-mail" required>

                    <label for="Subtitulo">Senha:</label>
                    <div class="password-container">
                        <input type="password" id="senha" name="senha" placeholder="Digite sua senha" required>
                        <i class="bi bi-eye-fill" id="BtnVerSenha" title="Mostrar/ocultar senha"></i>

                    </div>



                        <div class="LembrarMeContainer">
                        <input type="checkbox" id="CBXLembrarSenha" name="LembrarSenha">
                        <label for="LembrarSenhaSubtitulo">Lembrar-me</label>
                        </div>


                    <div class="form-buttons">
                        <!-- botão convertido para type="button" para que o JS controle o envio -->
                        <button type="button" id="ButtonEntrar">Entrar</button>
                        <button id="ButtonCriarConta" type="button"
                            onclick="window.location.href='../Cadastro_E_Perfil/Cadastro.html'">Criar Conta</button>
                    </div>

                    <span class="nao-quebrar-linha">
                        <h5>Esqueceu sua senha?
                            <a href="RecuperarSenha/RecuperarSenha/RecuperarSenha.html">Recuperar</a>
                        </h5>
                    </span>

                    <div class="overlay" id="overlay">
                        <div class="modal">
                            <h2>Alerta:</h2>
                            <p></p>
                            <button id="fecharModal">X</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <script src="../JavaScript/Login/login.js"></script>
</body>
</html>
