<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if (empty($_SESSION['admin_id'])) {
    jsonResponse(false, 'Unauthorized access.', [], 401);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->query('SELECT * FROM hire_requests ORDER BY created_at DESC');
$requests = $stmt->fetchAll();

jsonResponse(true, 'Hire requests loaded.', ['hire_requests' => $requests], 200);
