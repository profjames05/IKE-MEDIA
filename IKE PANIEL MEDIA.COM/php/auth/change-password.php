<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

requireAdmin();
verifyCsrfToken();

$currentPassword = (string) ($_POST['current_password'] ?? '');
$newPassword = (string) ($_POST['new_password'] ?? '');

if ($currentPassword === '' || $newPassword === '') {
    jsonResponse(false, 'Current and new password are required.', [], 400);
}

if (strlen($newPassword) < 6) {
    jsonResponse(false, 'New password must be at least 6 characters long.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('SELECT password FROM admins WHERE id = :id LIMIT 1');
$stmt->execute([':id' => $_SESSION['admin_id']]);
$admin = $stmt->fetch();

if (!$admin || (!password_verify($currentPassword, (string) $admin['password']) && !hash_equals((string) $admin['password'], $currentPassword))) {
    jsonResponse(false, 'Current password is incorrect.', [], 401);
}

$hashed = password_hash($newPassword, PASSWORD_BCRYPT);
$update = $pdo->prepare('UPDATE admins SET password = :password, updated_at = NOW() WHERE id = :id');
$update->execute([':password' => $hashed, ':id' => $_SESSION['admin_id']]);

jsonResponse(true, 'Password changed successfully.', [], 200);
