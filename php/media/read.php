<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

$pdo = getDatabaseConnection();
$stmt = $pdo->query('SELECT id, name, file_path, file_type, size, created_at FROM media_files ORDER BY created_at DESC');
$files = $stmt->fetchAll();

jsonResponse(true, 'Media files loaded.', ['files' => $files], 200);
