<?php
$token=$_GET["token"];
date_default_timezone_set('America/Sao_Paulo');
$token_hash=hash("sha256", $token);
$mysqli= require __DIR__ . "/../../conexao.php";
$sql= "SELECT * FROM usuarios
    WHERE reset_token_hash=?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $token_hash);
$stmt->execute();
$result= $stmt->get_result();
$usuario= $result->fetch_assoc();
if($usuario===null){
    die("Token inválido.");
}
if (strtotime($usuario["reset_token_expires_at"]) <= time()){
    die("Token expirado.");
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha</title>
    <link rel="stylesheet" href="../../CSS/Login/RecuperarSenha/RedefinicaoDeSenha.css">
    <script src="../../JavaScript/RecuperarSenha/RedefinicaoDeSenha.js" defer></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
</head>
<body>
    
    <div class="CaixaRedefinirSenha">
        <h1>Redefinir Senha</h1>
        <p class="SubtituloRedefinir">
            Insira sua nova senha e confirme para redefinir o acesso à sua conta.
        </p>
        
        <form class="redefinir-form" autocomplete="off" method="post" action="NovaSenha.php">
            <input type="hidden" name="token" value="<?= htmlspecialchars($token)?>">
            <label class="TextoSobreOsCampos">Nova senha:</label>
            <div class="input-group">
                <input type="password" placeholder="Insira sua nova senha" id="NovaSenha" minlength="8" required>
                <i class="bi bi-eye-fill" id="BtnVerSenha" onclick="MostrarSenha()"></i>
            </div>

            <label class="TextoSobreOsCampos">Confirmar a nova senha:</label>
            <div class="input-group">
                <input type="password" placeholder="Confirme a sua nova senha" id="ConfirmarNovaSenha" minlength="8" required>
                <i class="bi bi-eye-fill" id="BtnConfirmarVerSenha" onclick="ConfirmarMostrarSenha()"></i>
            </div>

            <div class="button-container">
                <button type="submit" id="btnRedefinirSenha">Redefinir Senha</button>
            </div>
        </form>
    </div>


    <div class="overlay" id="overlay" style="display:none;">
        <div class="modal">
            <h2>Aviso</h2>
            <p></p>
            <button onclick="fecharModal()">X</button>
        </div>
    </div>
</body>
</html>