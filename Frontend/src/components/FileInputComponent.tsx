import React from 'react';

interface FileInputProps {
    onFileChange: (file: File | null) => void;
    error: string | null;
}

const FileInputComponent: React.FC<FileInputProps> = ({ onFileChange, error }) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileChange(e.target.files[0]);
        } else {
            onFileChange(null);
        }
    };

    return (
        <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Choose File</label>
            <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                id="file"
                className="mt-1 w-full px-4 py-2 cursor-pointer border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
            {error && (
                <p className="text-red-500 text-sm mt-2">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FileInputComponent;

