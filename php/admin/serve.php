<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

$allowedFiles = [
    'dashboard.html',
    'projects.html',
    'add-project.html',
    'edit-project.html',
    'categories.html',
    'testimonials.html',
    'messages.html',
    'hire-requests.html',
    'profile.html',
    'settings.html',
    'media.html',
    'home-content.html',
];

if (empty($_SESSION['admin_id'])) {
    header('Location: /admin/index.html', true, 302);
    exit;
}

$file = basename((string) ($_GET['file'] ?? ''));
if (!in_array($file, $allowedFiles, true)) {
    http_response_code(404);
    exit('Admin page not found.');
}

$path = __DIR__ . '/../../admin/' . $file;
if (!is_file($path)) {
    http_response_code(404);
    exit('Admin page not found.');
}

header('Content-Type: text/html; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
readfile($path);
