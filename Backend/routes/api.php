<?php

use App\Http\Controllers\Api\UserImportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/users/import', [UserImportController::class, 'import']);
