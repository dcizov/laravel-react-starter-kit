<?php

namespace App\Http\Requests\Users;

use App\Concerns\ProfileValidationRules;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Validates user profile updates. Unique email ignores current user.
 */
class UserUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->profileRules($this->route('user')->id);
    }
}
