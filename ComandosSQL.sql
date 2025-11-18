CREATE DATABASE bancotcc

USE bancotcc;

CREATE TABLE usuarios (
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) COLLATE latin1_general_cs NOT NULL,
    senha VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
    reset_token_hash VARCHAR(84) COLLATE latin1_swedish_ci DEFAULT NULL,
    reset_token_expires_at DATETIME DEFAULT NULL,
    
    PRIMARY KEY (id),
    UNIQUE KEY email (email),
    KEY reset_token_hash (reset_token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE perfis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    nome_perfil VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255) NULL,
    tipo_foto ENUM('upload', 'avatar') DEFAULT NULL,
    avatar_selecionado VARCHAR(100) NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);