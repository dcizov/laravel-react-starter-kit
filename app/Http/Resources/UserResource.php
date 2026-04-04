<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * @return array{
     *   id: int,
     *   name: string,
     *   email: string,
     *   email_verified_at: string|null,
     *   two_factor_enabled: bool,
     *   roles: array<int, array{id: int, name: string, guard_name: string, created_at: string, updated_at: string}>|null,
     *   created_at: string,
     *   updated_at: string,
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'two_factor_enabled' => (bool) $this->two_factor_confirmed_at,
            'roles' => $this->whenLoaded('roles', fn () => $this->roles->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'created_at' => $role->created_at->toISOString(),
                'updated_at' => $role->updated_at->toISOString(),
            ])->values()),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
