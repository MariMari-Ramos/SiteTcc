<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: ../Login/login.html');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="Perfil.css">
    <title>Perfil e Configurações do Usuario</title>
</head>
<body>
    <section>
        <div class="CaixaEditarPerfil">
        <h1>Perfil e Configurações do Usuario</h1>
        <p>Esta seção permite que você visualize e edite as configurações do seu perfil de usuário.</p>

Nome de usuário: 
Email vinculado:sadasdasdasda
Foto de perfil:
Excluir conta:
Alterar senha:



<input type ="button" value="Salvar alterações" onclick="alert('Alterações salvas com sucesso!')">
<input type="button" value="Voltar" onclick="window.location.href='../index.html'">
    </div>
    </section>
</body>
</html>