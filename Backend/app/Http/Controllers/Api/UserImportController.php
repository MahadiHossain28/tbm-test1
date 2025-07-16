<?php

namespace App\Http\Controllers\Api;

use App\Exports\UsersExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserImportRequest;
use App\Imports\UsersImport;
use Illuminate\Http\Request;
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
        Excel::import($usersImport, $request->file('file'));

        $failures = $usersImport->failures();

        if (count($failures) > 0) {
            $fileName = 'imported_errors_'. time() .'.xlsx';
            $filePath = 'import/users/' . $fileName;

            Excel::store(new UsersExport($failures), $filePath, 'public');

            return response()->json([
                'message' => 'Import completed with some errors.',
                'failures' => count($failures),
                'download_url' => Storage::disk('public')->url($filePath)
            ], 422);
        }

        return response()->json([
            'message' => 'All users imported successfully!'
        ], 200);
    }
}
