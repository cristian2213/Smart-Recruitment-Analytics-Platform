<?php

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->enum('role', RoleEnum::cases());
            $table->string('description', 255)->nullable();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->enum('permission', PermissionEnum::cases());
            $table->string('description', 255)->nullable();
        });

        Schema::create('users_roles', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
        });

        Schema::create('roles_permissions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_roles');
        Schema::dropIfExists('roles_permissions');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
