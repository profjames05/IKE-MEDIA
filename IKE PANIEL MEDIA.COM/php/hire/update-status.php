<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$id = (int) ($_POST['id'] ?? 0);
$status = $_POST['status'] ?? 'new';
if ($id <= 0) {
    jsonResponse(false, 'Hire request ID is required.', [], 400);
}

$allowed = ['new','contacted','in_progress','completed','cancelled'];
if (!in_array($status, $allowed, true)) {
    jsonResponse(false, 'Invalid hire request status.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('UPDATE hire_requests SET status = :status, updated_at = NOW() WHERE id = :id');
$stmt->execute([':status' => $status, ':id' => $id]);

jsonResponse(true, 'Hire request status updated.', [], 200);
