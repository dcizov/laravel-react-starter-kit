<?php

namespace App\Http\Requests\Users;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates query string parameters for the users index (pagination, sort, filters).
 */
class UserIndexRequest extends FormRequest
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
            'verified' => ['nullable', Rule::in(['yes', 'no'])],
            'role' => ['nullable', 'string', 'max:100'],
            'sortBy' => ['nullable', 'string', Rule::in(User::SORTABLE)],
            'sortDir' => ['nullable', Rule::in(['asc', 'desc'])],
            'perPage' => ['nullable', 'integer', Rule::in(User::PER_PAGE_OPTIONS)],
        ];
    }

    /**
     * Return sanitised filter values with sensible defaults.
     *
     * @return array{search: string|null, verified: string|null, role: string|null, sortBy: string, sortDir: string, perPage: int}
     */
    public function filters(): array
    {
        $search = trim($this->string('search')->toString());

        return [
            'search' => $search !== '' ? $search : null,
            'verified' => $this->input('verified'),
            'role' => $this->input('role'),
            'sortBy' => $this->input('sortBy', 'name'),
            'sortDir' => $this->input('sortDir', 'asc'),
            'perPage' => $this->integer('perPage') ?: 10,
        ];
    }
}
