<?php

namespace App\Http\Requests\Roles;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates query parameters for the roles index action.
 */
class RoleIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'page' => ['nullable', 'integer', 'min:1', 'max:1000'],
            'search' => ['nullable', 'string', 'max:100'],
            'guard' => ['nullable', 'string', 'max:100'],
            'sortBy' => ['nullable', 'string', Rule::in(Role::SORTABLE)],
            'sortDir' => ['nullable', Rule::in(['asc', 'desc'])],
            'perPage' => ['nullable', 'integer', Rule::in(Role::PER_PAGE_OPTIONS)],
        ];
    }

    /**
     * Return sanitised filter values with sensible defaults.
     *
     * @return array{search: string|null, guard: string|null, sortBy: string, sortDir: string, perPage: int}
     */
    public function filters(): array
    {
        $search = trim($this->string('search')->toString());

        return [
            'search' => $search !== '' ? $search : null,
            'guard' => $this->input('guard'),
            'sortBy' => $this->input('sortBy', 'name'),
            'sortDir' => $this->input('sortDir', 'asc'),
            'perPage' => $this->integer('perPage') ?: 10,
        ];
    }
}
