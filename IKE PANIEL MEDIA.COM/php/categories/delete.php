<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$id = (int) ($_POST['id'] ?? 0);
if ($id <= 0) {
    jsonResponse(false, 'Category ID is required.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('DELETE FROM categories WHERE id = :id');
$stmt->execute([':id' => $id]);

jsonResponse(true, 'Category deleted successfully.', [], 200);
