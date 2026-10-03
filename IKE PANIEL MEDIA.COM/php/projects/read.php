<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

$pdo = getDatabaseConnection();

if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    $stmt = $pdo->prepare('SELECT p.*, c.name AS category_name FROM projects p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $project = $stmt->fetch();

    if (!$project) {
        jsonResponse(false, 'Project not found.', [], 404);
    }

    jsonResponse(true, 'Project loaded.', ['project' => $project], 200);
}

$where = [];
$params = [];

if (isset($_GET['featured'])) {
    $where[] = 'p.featured = :featured';
    $params[':featured'] = (int) $_GET['featured'];
}

if (!empty($_GET['category_id'])) {
    $where[] = 'p.category_id = :category_id';
    $params[':category_id'] = (int) $_GET['category_id'];
}

if (!empty($_GET['search'])) {
    $where[] = '(p.title LIKE :search OR p.client LIKE :search OR c.name LIKE :search)';
    $params[':search'] = '%' . trim((string) $_GET['search']) . '%';
}

$limit = isset($_GET['limit']) ? max(1, (int) $_GET['limit']) : 12;
$page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
$offset = ($page - 1) * $limit;

$baseQuery = 'SELECT p.*, c.name AS category_name FROM projects p LEFT JOIN categories c ON c.id = p.category_id';
if ($where) {
    $baseQuery .= ' WHERE ' . implode(' AND ', $where);
}
$baseQuery .= ' ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset';

$stmt = $pdo->prepare($baseQuery);
foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$projects = $stmt->fetchAll();

$countStmt = $pdo->prepare('SELECT COUNT(*) AS total FROM projects p LEFT JOIN categories c ON c.id = p.category_id' . ($where ? ' WHERE ' . implode(' AND ', $where) : ''));
foreach ($params as $key => $value) {
    $countStmt->bindValue($key, $value);
}
$countStmt->execute();
$total = (int) $countStmt->fetch()['total'];

if (isset($_GET['stats']) && $_GET['stats'] === '1') {
    $counts = [
        'total' => $total,
        'featured' => (int) $pdo->query('SELECT COUNT(*) FROM projects WHERE featured = 1')->fetchColumn(),
    ];
    jsonResponse(true, 'Project statistics loaded.', ['stats' => $counts], 200);
}

jsonResponse(true, 'Projects loaded.', ['projects' => $projects, 'total' => $total, 'page' => $page, 'limit' => $limit], 200);
