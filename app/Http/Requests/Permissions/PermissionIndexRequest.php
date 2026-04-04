<?php

namespace App\Http\Requests\Permissions;

use App\Models\Permission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates query parameters for the permissions index action.
 */
class PermissionIndexRequest extends FormRequest
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
            'role' => ['nullable', 'string', 'max:100'],
            'sortBy' => ['nullable', 'string', Rule::in(Permission::SORTABLE)],
            'sortDir' => ['nullable', Rule::in(['asc', 'desc'])],
            'perPage' => ['nullable', 'integer', Rule::in(Permission::PER_PAGE_OPTIONS)],
        ];
    }

    /**
     * Return sanitised filter values with sensible defaults.
     *
     * @return array{search: string|null, role: string|null, sortBy: string, sortDir: string, perPage: int}
     */
    public function filters(): array
    {
        $search = trim($this->string('search')->toString());

        return [
            'search' => $search !== '' ? $search : null,
            'role' => $this->input('role'),
            'sortBy' => $this->input('sortBy', 'name'),
            'sortDir' => $this->input('sortDir', 'asc'),
            'perPage' => $this->integer('perPage') ?: 10,
        ];
    }
}
