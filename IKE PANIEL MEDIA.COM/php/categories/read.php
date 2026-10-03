<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

$pdo = getDatabaseConnection();
$stmt = $pdo->query('SELECT * FROM categories ORDER BY name ASC');
$categories = $stmt->fetchAll();

jsonResponse(true, 'Categories loaded.', ['categories' => $categories], 200);
