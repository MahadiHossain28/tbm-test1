<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $failures;

    public function __construct($failures)
    {
        $this->failures = $failures;
    }
    public function collection(): \Illuminate\Support\Collection
    {
        return $this->failures;
    }

    public function headings(): array
    {
        // Assuming the original headings are name, email, phone, gender
        // We add 'row' and 'errors' columns.
        return ['row', 'name', 'email', 'phone', 'gender', 'errors'];
    }

    public function map($failure): array
    {
        return [
            'row' => $failure->row(),
            'name' => $failure->values()['name'] ?? '',
            'email' => $failure->values()['email'] ?? '',
            'phone' => $failure->values()['phone'] ?? '',
            'gender' => $failure->values()['gender'] ?? '',
            'errors' => implode(', ', $failure->errors()),
        ];
    }
}
