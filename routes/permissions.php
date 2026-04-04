<?php

use App\Http\Controllers\Permissions\PermissionController;
use App\Http\Controllers\Permissions\PermissionDestroyBulkController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('permissions/bulk', PermissionDestroyBulkController::class)
        ->name('permissions.destroy-bulk');

    Route::resource('permissions', PermissionController::class)->except(['create', 'edit']);
});
