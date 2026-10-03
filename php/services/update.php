<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$title = trim((string) ($_POST['title'] ?? ''));
$description = trim((string) ($_POST['description'] ?? ''));
$icon = trim((string) ($_POST['icon'] ?? '✦'));
$sortOrder = isset($_POST['sort_order']) ? max(0, (int) $_POST['sort_order']) : 0;
$published = isset($_POST['published']) ? (int) $_POST['published'] : 1;

if ($id <= 0 || $title === '' || $description === '') {
    jsonResponse(false, 'Invalid service payload.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('UPDATE services SET title = :title, description = :description, icon = :icon, sort_order = :sort_order, published = :published, updated_at = NOW() WHERE id = :id');
$stmt->execute([
    ':title' => $title,
    ':description' => $description,
    ':icon' => $icon !== '' ? $icon : '✦',
    ':sort_order' => $sortOrder,
    ':published' => $published ? 1 : 0,
    ':id' => $id,
]);

jsonResponse(true, 'Service updated successfully.', [], 200);
