<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

$pdo = getDatabaseConnection();
$publishedOnly = isset($_GET['published']) ? (int) $_GET['published'] : null;

$sql = 'SELECT id, title, description, icon, sort_order, published, created_at FROM services';
$params = [];
if ($publishedOnly !== null) {
    $sql .= ' WHERE published = :published';
    $params[':published'] = $publishedOnly;
}
$sql .= ' ORDER BY sort_order ASC, created_at DESC';

$stmt = $pdo->prepare($sql);
foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value, PDO::PARAM_INT);
}
$stmt->execute();
$services = $stmt->fetchAll();

jsonResponse(true, 'Services loaded.', ['services' => $services], 200);
