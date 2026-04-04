<?php

use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\Users\UserDestroyBulkController;
use App\Http\Controllers\Users\UserPasswordController;
use App\Http\Controllers\Users\UserRolesController;
use App\Http\Controllers\Users\UserTwoFactorController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('users/bulk', UserDestroyBulkController::class)
        ->name('users.destroy-bulk');

    Route::resource('users', UserController::class)->except(['create', 'edit']);

    Route::put('users/{user}/password', UserPasswordController::class)
        ->name('users.password.update');

    Route::delete('users/{user}/two-factor', UserTwoFactorController::class)
        ->name('users.two-factor.destroy');

    Route::put('users/{user}/roles', UserRolesController::class)
        ->name('users.roles.update');
});
