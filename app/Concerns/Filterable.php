<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Reusable search & sort scopes for index queries.
 *
 * @mixin Model
 */
trait Filterable
{
    /**
     * Case-insensitive LIKE search across the given columns.
     *
     * @param  Builder<static>  $query
     * @param  list<string>  $columns
     * @return Builder<static>
     */
    public function scopeSearchIn(Builder $query, ?string $search, array $columns): Builder
    {
        $term = trim((string) $search);

        return $query->when($term !== '', function (Builder $q) use ($term, $columns): void {
            $pattern = '%'.self::escapeLike(Str::lower($term)).'%';

            $q->where(function (Builder $inner) use ($pattern, $columns): void {
                foreach ($columns as $column) {
                    $inner->orWhereRaw("lower({$column}) like ?", [$pattern]);
                }
            });
        });
    }

    /**
     * Validated sort against an explicit allow-list.
     *
     * @param  Builder<static>  $query
     * @param  list<string>  $allowed
     * @return Builder<static>
     */
    public function scopeSorted(Builder $query, string $sortBy, string $sortDir, array $allowed): Builder
    {
        $column = in_array($sortBy, $allowed, true) ? $sortBy : $allowed[0];
        $direction = $sortDir === 'desc' ? 'desc' : 'asc';

        return $query->orderBy($column, $direction);
    }

    /**
     * Escape LIKE wildcards so user input is treated literally.
     */
    private static function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
    }
}
