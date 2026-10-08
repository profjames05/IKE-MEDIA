<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

$password = getenv('ADMIN_INITIAL_PASSWORD');
if ($password === false || $password === '' || strlen($password) < 12) {
    fwrite(STDERR, "Set ADMIN_INITIAL_PASSWORD to at least 12 characters before running this script.\n");
    exit(1);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('INSERT INTO admins (name, email, password, status) VALUES (:name, :email, :password, "active") ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), status = "active", updated_at = NOW()');
$stmt->execute([
    ':name' => 'Ike Peniel Media Admin',
    ':email' => getenv('ADMIN_INITIAL_EMAIL') ?: 'admin@designer.com',
    ':password' => password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]),
]);

fwrite(STDOUT, "Administrator account initialized successfully.\n");
