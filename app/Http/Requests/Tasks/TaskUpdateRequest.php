<?php

namespace App\Http\Requests\Tasks;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates task updates.
 */
class TaskUpdateRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(Task::STATUSES)],
            'label' => ['required', 'string', Rule::in(Task::LABELS)],
            'priority' => ['required', 'string', Rule::in(Task::PRIORITIES)],
        ];
    }
}
