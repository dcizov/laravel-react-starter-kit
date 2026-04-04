<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * @return array{
     *   id: int,
     *   name: string,
     *   guard_name: string,
     *   permissions: array<int, array{id: int, name: string}>|null,
     *   users_count: int|null,
     *   created_at: string,
     *   updated_at: string,
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'guard_name' => $this->guard_name,
            'permissions' => $this->whenLoaded('permissions', fn () => $this->permissions->map(fn ($permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
            ])->values()),
            'users_count' => $this->whenCounted('users'),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
