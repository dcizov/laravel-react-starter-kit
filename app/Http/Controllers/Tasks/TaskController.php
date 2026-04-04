<?php

namespace App\Http\Controllers\Tasks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tasks\TaskIndexRequest;
use App\Http\Requests\Tasks\TaskStoreRequest;
use App\Http\Requests\Tasks\TaskUpdateRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     */
    public function index(TaskIndexRequest $request): Response
    {
        $this->authorize('viewAny', Task::class);

        $filters = $request->filters();

        $tasks = Task::query()
            ->filter($filters)
            ->sorted($filters['sortBy'], $filters['sortDir'], Task::SORTABLE)
            ->paginate($filters['perPage'])
            ->withQueryString();

        return Inertia::render('tasks/index', [
            'tasks' => [
                'data' => collect($tasks->items())->map(fn (Task $task) => (new TaskResource($task))->resolve())->values(),
                'current_page' => $tasks->currentPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
                'last_page' => $tasks->lastPage(),
            ],
            'filters' => $filters,
            'perPageOptions' => Task::PER_PAGE_OPTIONS,
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(TaskStoreRequest $request): RedirectResponse
    {
        $this->authorize('create', Task::class);

        Task::create($request->validated());

        return to_route('tasks.index');
    }

    /**
     * Update the specified task.
     */
    public function update(TaskUpdateRequest $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $task->update($request->validated());

        return to_route('tasks.index');
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return to_route('tasks.index');
    }
}
