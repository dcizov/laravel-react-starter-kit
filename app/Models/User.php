<?php

namespace App\Models;

use App\Concerns\Filterable;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @method static Builder<static> filter(array $filters)
 * @method static Builder<static> sorted(string $sortBy, string $sortDir, array $allowed)
 *
 * @mixin \Eloquent
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use Filterable, HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    /** @var list<string> */
    public const SORTABLE = ['name', 'email', 'email_verified_at', 'created_at', 'updated_at'];

    /** @var list<int> */
    public const PER_PAGE_OPTIONS = [10, 25, 50, 100];

    /** @var list<string> */
    public const INDEX_COLUMNS = ['id', 'name', 'email', 'email_verified_at', 'two_factor_confirmed_at', 'created_at', 'updated_at'];

    /**
     * Apply index filters (search + verified status).
     *
     * @param  Builder<static>  $query
     * @param  array{search?: string|null, verified?: string|null}  $filters
     * @return Builder<static>
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->searchIn($filters['search'] ?? null, ['name', 'email'])
            ->when(
                ($filters['verified'] ?? null) === 'yes',
                fn (Builder $q) => $q->whereNotNull('email_verified_at'),
            )
            ->when(
                ($filters['verified'] ?? null) === 'no',
                fn (Builder $q) => $q->whereNull('email_verified_at'),
            )
            ->when(
                $filters['role'] ?? null,
                fn (Builder $q, string $role) => $q->whereHas(
                    'roles',
                    fn (Builder $r) => $r->where('name', $role),
                ),
            );
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
