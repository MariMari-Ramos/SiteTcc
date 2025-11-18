<?php
session_start();
session_destroy();
header('Location: ../../Login/loginhtml.php');
exit();
?>