<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if (empty($_SESSION['admin_id'])) {
    jsonResponse(false, 'Unauthorized access.', [], 401);
}

$pdo = getDatabaseConnection();
$page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
$limit = isset($_GET['limit']) ? max(1, (int) $_GET['limit']) : 10;
$offset = ($page - 1) * $limit;

$status = $_GET['status'] ?? null;
$sql = 'SELECT * FROM messages';
$params = [];
if ($status) {
    $sql .= ' WHERE status = :status';
    $params[':status'] = $status;
}
$sql .= ' ORDER BY created_at DESC LIMIT :limit OFFSET :offset';

$stmt = $pdo->prepare($sql);
foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$messages = $stmt->fetchAll();

$countStmt = $pdo->prepare('SELECT COUNT(*) FROM messages' . ($status ? ' WHERE status = :status' : ''));
if ($status) {
    $countStmt->execute([':status' => $status]);
} else {
    $countStmt->execute();
}
$total = (int) $countStmt->fetchColumn();

jsonResponse(true, 'Messages loaded.', ['messages' => $messages, 'total' => $total, 'page' => $page, 'limit' => $limit], 200);
