<?php

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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            // Branding
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();

            // Contact
            $table->text('address')->nullable();
            $table->text('shop_address')->nullable();

            // Delivery
            $table->integer('inside_dhaka_delivery')->default(0);
            $table->integer('outside_dhaka_delivery')->default(0);

            // Default SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();

            // Static Pages
            $table->longText('privacy_policy')->nullable();
            $table->longText('terms_condition')->nullable();

            // Footer
            $table->text('copyright')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
