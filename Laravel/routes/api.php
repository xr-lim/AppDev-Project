<?php

use App\Http\Controllers\API\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Report API Routes
Route::prefix('reports')->group(function () {
    // Public routes (no authentication required for Flutter app)
    Route::post('/', [ReportController::class, 'store']);
    Route::get('/', [ReportController::class, 'index']);
    Route::get('/{id}', [ReportController::class, 'show']);

    // Admin routes (can add authentication later)
    Route::patch('/{id}/status', [ReportController::class, 'updateStatus']);
    Route::delete('/{id}', [ReportController::class, 'destroy']);
});
