<?php

namespace App\Models;

use App\Concerns\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Permission as SpatiePermission;

/**
 * @method static Builder<static> filter(array $filters)
 * @method static Builder<static> sorted(string $sortBy, string $sortDir, array $allowed)
 *
 * @mixin \Eloquent
 */
class Permission extends SpatiePermission
{
    use Filterable;

    /** @var list<string> */
    public const SORTABLE = ['name', 'created_at', 'updated_at'];

    /** @var list<int> */
    public const PER_PAGE_OPTIONS = [10, 25, 50, 100];

    /** @var list<string> */
    public const INDEX_COLUMNS = ['id', 'name', 'guard_name', 'created_at', 'updated_at'];

    /**
     * Apply index filters (search + role name).
     *
     * @param  Builder<static>  $query
     * @param  array{search?: string|null, role?: string|null}  $filters
     * @return Builder<static>
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->searchIn($filters['search'] ?? null, ['name'])
            ->when(
                $filters['role'] ?? null,
                fn (Builder $q, string $role) => $q->whereHas(
                    'roles',
                    fn (Builder $r) => $r->where('name', $role),
                ),
            );
    }
}
