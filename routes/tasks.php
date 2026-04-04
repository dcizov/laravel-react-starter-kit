<?php

use App\Http\Controllers\Tasks\TaskController;
use App\Http\Controllers\Tasks\TaskDestroyBulkController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('tasks/bulk', TaskDestroyBulkController::class)
        ->name('tasks.destroy-bulk');

    Route::resource('tasks', TaskController::class)->except(['create', 'edit', 'show']);
});
