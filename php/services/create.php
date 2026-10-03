<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$title = trim((string) ($_POST['title'] ?? ''));
$description = trim((string) ($_POST['description'] ?? ''));
$icon = trim((string) ($_POST['icon'] ?? '✦'));
$sortOrder = isset($_POST['sort_order']) ? max(0, (int) $_POST['sort_order']) : 0;
$published = isset($_POST['published']) ? (int) $_POST['published'] : 1;

if ($title === '' || $description === '') {
    jsonResponse(false, 'Title and description are required.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('INSERT INTO services (title, description, icon, sort_order, published) VALUES (:title, :description, :icon, :sort_order, :published)');
$stmt->execute([
    ':title' => $title,
    ':description' => $description,
    ':icon' => $icon !== '' ? $icon : '✦',
    ':sort_order' => $sortOrder,
    ':published' => $published ? 1 : 0,
]);

jsonResponse(true, 'Service created successfully.', ['id' => (int) $pdo->lastInsertId()], 201);
