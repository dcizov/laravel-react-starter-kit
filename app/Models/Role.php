<?php

namespace App\Models;

use App\Concerns\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Role as SpatieRole;

/**
 * @method static Builder<static> filter(array $filters)
 * @method static Builder<static> sorted(string $sortBy, string $sortDir, array $allowed)
 *
 * @mixin \Eloquent
 */
class Role extends SpatieRole
{
    use Filterable;

    /** @var list<string> */
    public const SORTABLE = ['name', 'created_at', 'updated_at'];

    /** @var list<int> */
    public const PER_PAGE_OPTIONS = [10, 25, 50, 100];

    /** @var list<string> */
    public const INDEX_COLUMNS = ['id', 'name', 'guard_name', 'created_at', 'updated_at'];

    /**
     * Apply index filters (search + guard name).
     *
     * @param  Builder<static>  $query
     * @param  array{search?: string|null, guard?: string|null}  $filters
     * @return Builder<static>
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->searchIn($filters['search'] ?? null, ['name'])
            ->when(
                $filters['guard'] ?? null,
                fn (Builder $q, string $guard) => $q->where('guard_name', $guard),
            );
    }
}
