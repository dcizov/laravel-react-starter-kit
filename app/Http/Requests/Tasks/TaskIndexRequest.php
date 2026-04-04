<?php

namespace App\Http\Requests\Tasks;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates query parameters for the tasks index action.
 */
class TaskIndexRequest extends FormRequest
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
            'status' => ['nullable', 'array'],
            'status.*' => ['string', Rule::in(Task::STATUSES)],
            'label' => ['nullable', 'array'],
            'label.*' => ['string', Rule::in(Task::LABELS)],
            'priority' => ['nullable', 'array'],
            'priority.*' => ['string', Rule::in(Task::PRIORITIES)],
            'sortBy' => ['nullable', 'string', Rule::in(Task::SORTABLE)],
            'sortDir' => ['nullable', Rule::in(['asc', 'desc'])],
            'perPage' => ['nullable', 'integer', Rule::in(Task::PER_PAGE_OPTIONS)],
        ];
    }

    /**
     * Return sanitised filter values with sensible defaults.
     *
     * @return array{search: string|null, status: list<string>|null, label: list<string>|null, priority: list<string>|null, sortBy: string, sortDir: string, perPage: int}
     */
    public function filters(): array
    {
        $search = trim($this->string('search')->toString());

        return [
            'search' => $search !== '' ? $search : null,
            'status' => $this->input('status') ?: null,
            'label' => $this->input('label') ?: null,
            'priority' => $this->input('priority') ?: null,
            'sortBy' => $this->input('sortBy', 'created_at'),
            'sortDir' => $this->input('sortDir', 'desc'),
            'perPage' => $this->integer('perPage') ?: 10,
        ];
    }
}
