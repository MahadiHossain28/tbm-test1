<?php

namespace App\Http\Controllers\Api;

use App\Exports\UsersExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserImportRequest;
use App\Imports\UsersImport;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Exception;

class UserImportController extends Controller
{
    /**
     * @throws Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     */
    public function import(UserImportRequest $request, UsersImport $usersImport)
    {
        try {
            Excel::import($usersImport, $request->file('file'));

            $failures = $usersImport->failures();

            if (count($failures) > 0) {
                $fileName = 'imported_errors_' . time() . '.xlsx';
                $filePath = 'import/users/' . $fileName;

                Excel::store(new UsersExport($failures), $filePath, 'public');

                Log::info('User import completed with errors.', [
                    'failures_count' => count($failures),
                    'failures' => $failures
                ]);

                return response()->json([
                    'message' => 'Import completed with some errors.',
                    'failures' => count($failures),
                    'download_link' => Storage::disk('public')->url($filePath),
                    //                    'errors' => $usersImport->failures()->map(function ($failure) {
                    //                        return [
                    //                            'row' => $failure->row(),
                    //                            'attribute' => $failure->attribute(),
                    //                            'errors' => $failure->errors(),
                    //                            'values' => $failure->values(),
                    //                        ];
                    //                    })
                ], 422);
            }

            return response()->json([
                'message' => 'All users imported successfully!'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error during user import.', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'An error occurred during import.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
