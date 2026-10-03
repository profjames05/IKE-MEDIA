<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

$pdo = getDatabaseConnection();
$status = $_GET['status'] ?? 'published';
$stmt = $pdo->prepare('SELECT * FROM testimonials WHERE status = :status ORDER BY created_at DESC');
$stmt->execute([':status' => $status]);
$testimonials = $stmt->fetchAll();

if (isset($_GET['stats']) && $_GET['stats'] === '1') {
    $countStmt = $pdo->query('SELECT COUNT(*) FROM testimonials');
    jsonResponse(true, 'Testimonials statistics loaded.', ['stats' => ['total' => (int) $countStmt->fetchColumn()]], 200);
}

jsonResponse(true, 'Testimonials loaded.', ['testimonials' => $testimonials], 200);
