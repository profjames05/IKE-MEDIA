<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$id = (int) ($_POST['id'] ?? 0);
$status = $_POST['status'] ?? 'read';
if ($id <= 0) {
    jsonResponse(false, 'Message ID is required.', [], 400);
}

$allowed = ['unread','read','replied'];
if (!in_array($status, $allowed, true)) {
    jsonResponse(false, 'Invalid message status.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('UPDATE messages SET status = :status, updated_at = NOW() WHERE id = :id');
$stmt->execute([':status' => $status, ':id' => $id]);

jsonResponse(true, 'Message status updated.', [], 200);
