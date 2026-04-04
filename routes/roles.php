<?php

use App\Http\Controllers\Roles\RoleController;
use App\Http\Controllers\Roles\RoleDestroyBulkController;
use App\Http\Controllers\Roles\RolePermissionsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('roles/bulk', RoleDestroyBulkController::class)
        ->name('roles.destroy-bulk');

    Route::resource('roles', RoleController::class)->except(['create', 'edit']);

    Route::put('roles/{role}/permissions', RolePermissionsController::class)
        ->name('roles.permissions.update');
});
