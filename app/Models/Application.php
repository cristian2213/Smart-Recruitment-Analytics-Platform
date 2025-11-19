<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Application extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'id',
        'uuid',
        'match_score',
        'status',
        'user_id',
        'employment_id',
        'created_at',
        'updated_at',
    ];

    protected $hidden = [
        'created_at',
        'deleted_at',
    ];

    protected $casts = [];

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class, 'employment_id');
    }
}
