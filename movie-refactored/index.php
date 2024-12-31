<?php

spl_autoload_register(function ($class) {
  if (!class_exists($class)) {
    `bun phin.ts $class`;
    require_once '.phin/' . $class . '.php';
  }
});

$controller = new Controller();
$controller();
