<?php

namespace App\Models;

use App\Concerns\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static Builder<static> filter(array $filters)
 * @method static Builder<static> sorted(string $sortBy, string $sortDir, array $allowed)
 *
 * @mixin \Eloquent
 */
class Task extends Model
{
    use Filterable, HasFactory;

    /** @var list<string> */
    public const SORTABLE = ['title', 'status', 'label', 'priority', 'created_at', 'updated_at'];

    /** @var list<string> */
    public const STATUSES = ['todo', 'in-progress', 'done', 'canceled'];

    /** @var list<string> */
    public const LABELS = ['bug', 'feature', 'enhancement', 'documentation'];

    /** @var list<string> */
    public const PRIORITIES = ['low', 'medium', 'high'];

    /** @var list<int> */
    public const PER_PAGE_OPTIONS = [10, 25, 50, 100];

    /** @var list<string> */
    protected $fillable = ['title', 'status', 'label', 'priority'];

    /**
     * Apply index filters (search + status + label + priority).
     *
     * @param  Builder<static>  $query
     * @param  array{search?: string|null, status?: list<string>|null, label?: list<string>|null, priority?: list<string>|null}  $filters
     * @return Builder<static>
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->searchIn($filters['search'] ?? null, ['title'])
            ->when(
                ! empty($filters['status']),
                fn (Builder $q) => $q->whereIn('status', $filters['status']),
            )
            ->when(
                ! empty($filters['label']),
                fn (Builder $q) => $q->whereIn('label', $filters['label']),
            )
            ->when(
                ! empty($filters['priority']),
                fn (Builder $q) => $q->whereIn('priority', $filters['priority']),
            );
    }
}
