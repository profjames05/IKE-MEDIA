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
$search = trim((string) ($_GET['search'] ?? ''));
$sql = 'SELECT * FROM messages';
$params = [];
if ($status || $search) {
    $sql .= ' WHERE 1=1';
    if ($status) {
        $sql .= ' AND status = :status';
        $params[':status'] = $status;
    }
    if ($search) {
        $sql .= ' AND (name LIKE :search OR email LIKE :search OR phone LIKE :search OR subject LIKE :search OR message LIKE :search)';
        $params[':search'] = '%' . $search . '%';
    }
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

$countSql = 'SELECT COUNT(*) FROM messages';
$countParams = [];
if ($status || $search) {
    $countSql .= ' WHERE 1=1';
    if ($status) {
        $countSql .= ' AND status = :status';
        $countParams[':status'] = $status;
    }
    if ($search) {
        $countSql .= ' AND (name LIKE :search OR email LIKE :search OR phone LIKE :search OR subject LIKE :search OR message LIKE :search)';
        $countParams[':search'] = '%' . $search . '%';
    }
}
$countStmt = $pdo->prepare($countSql);
$countStmt->execute($countParams);
$total = (int) $countStmt->fetchColumn();

jsonResponse(true, 'Messages loaded.', ['messages' => $messages, 'total' => $total, 'page' => $page, 'limit' => $limit], 200);
