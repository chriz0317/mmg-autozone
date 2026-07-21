<?php

namespace App\Services;

use App\Models\ActivityLog;

class ActivityLogger
{
    /**
     * Log an activity in the system.
     *
     * @param string $action A short string identifying the action (e.g., 'created_intake')
     * @param string|null $description A human-readable description of what happened
     * @param array $properties Additional context data (e.g., ['intake_id' => 5])
     * @param int|null $userId Optional user ID, defaults to the currently authenticated user
     * @return ActivityLog
     */
    public static function log($action, $description = null, array $properties = [], $userId = null)
    {
        // Try to get current user ID across the three guards if not explicitly provided
        if (is_null($userId)) {
            if (auth('web')->check()) {
                $userId = auth('web')->id();
            } elseif (auth('staff')->check()) {
                $userId = auth('staff')->id();
            } elseif (auth('admin')->check()) {
                $userId = auth('admin')->id();
            }
        }

        return ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'properties' => $properties,
            'ip_address' => request()->ip(),
        ]);
    }
}
