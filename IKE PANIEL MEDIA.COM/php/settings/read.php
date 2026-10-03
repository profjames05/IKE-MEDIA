<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

$pdo = getDatabaseConnection();
$stmt = $pdo->query('SELECT setting_key, setting_value FROM settings ORDER BY setting_key ASC');
$settings = $stmt->fetchAll();
$payload = [];
foreach ($settings as $row) {
    $payload[$row['setting_key']] = $row['setting_value'];
}

jsonResponse(true, 'Settings loaded.', ['settings' => $payload], 200);
