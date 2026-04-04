<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * Base controller.
 *
 * @see App\Providers\AppServiceProvider::configureAuthorization()
 * @see https://laravel.com/docs/authorization#authorizing-actions-using-policies
 */
abstract class Controller
{
    use AuthorizesRequests;
}
