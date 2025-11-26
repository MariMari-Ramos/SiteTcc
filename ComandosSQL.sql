CREATE DATABASE bancotcc;

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
    usuario_id INT(11) UNSIGNED NOT NULL UNIQUE,
    nome_perfil VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255) NULL,
    tipo_foto ENUM('upload', 'avatar') DEFAULT NULL,
    avatar_selecionado VARCHAR(100) NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

UPDATE perfis
SET foto_perfil = CONCAT('/SiteTcc/', REPLACE(foto_perfil, '../', ''))
WHERE foto_perfil LIKE '../%';


/* Tabela para armazenar as configurações do usuário (JSON) */
CREATE TABLE user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT(11) UNSIGNED NOT NULL UNIQUE,
    settings JSON NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE Sis_RPG (
    id_sistema INT AUTO_INCREMENT PRIMARY KEY,
    nome_sistema VARCHAR(100) NOT NULL,
    descricao TEXT,
    url_regras VARCHAR(255)
);


INSERT INTO Sis_RPG (nome_sistema, descricao, url_regras)
VALUES
('D&D 5e', 
 'Sistema medieval fantástico com foco em exploração de masmorras e progressão por níveis.',
 'https://dnd5e.wikidot.com/');



CREATE TABLE Ficha_Per (
    id_ficha INT AUTO_INCREMENT PRIMARY KEY,
    nome_personagem VARCHAR(150) NOT NULL,
    nivel INT DEFAULT 1,
    dados_json JSON,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    id_usuario INT(11) UNSIGNED NOT NULL,
    id_sistema INT NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (id_sistema) REFERENCES Sis_RPG(id_sistema)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

