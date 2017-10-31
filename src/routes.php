<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes

$app->get('/[{name}]', function (Request $request, Response $response, array $args) {
    // Sample log message
    $this->logger->info("Price Check ToDo App '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

// API group
$app->group('/api', function () use ($app) {
    // Version group
  $app->group('/v1', function () use ($app) {
    $app->get('/tasks', 'getTasks');
    $app->get('/tasks/{id}', 'getTask');
    $app->post('/task', 'addTask');
    $app->put('/task/{id}', 'updateTask');
    $app->delete('/task/{id}', 'deleteTask');
 });
});

?>
