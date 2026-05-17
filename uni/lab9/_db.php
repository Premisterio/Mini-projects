<?php
define('DB_HOST', 'sql311.infinityfree.com');
define('DB_NAME', 'if0_41948527_lab8');
define('DB_USER', 'if0_41948527');
define('DB_PASS', 'jWpbdRsQhWfLx');

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    }
    return $pdo;
}
