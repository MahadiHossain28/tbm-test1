import {useState} from "react";
import api from '@/api/axios.ts'
import axios from "axios";
import DropZoneComponent from "@/components/DropZoneComponent.tsx";
// import FileInputComponent from "@/components/FileInputComponent.tsx";

interface ImportResponse {
    message: string;
    failures?: number;
    download_link?: string;
}
const ExcelImporterPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<ImportResponse | null>(null);
    
    const handleUpload = async () => {
        if (!file) {
            setError('No file uploaded');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try{
            const response = await api.post<ImportResponse>('/api/users/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setResponse(response.data);
            setError(null);
            setFile(null);
        }
        catch(err){
            if(axios.isAxiosError(err) && (err.response && err.response.data)){
                console.log(err.response.data);
                if(err.response.data.failures){
                    setResponse(err.response.data as ImportResponse);
                }else{
                    setError(err.response.data.message);
                }
            }else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Import Users from Excel</h2>

            {/*<FileInputComponent onFileChange={setFile} error={error} />*/}

            <DropZoneComponent onFileAccepted={setFile} error={error} />

            <div className="flex justify-center items-center mb-4">
                <button
                    onClick={handleUpload}
                    disabled={!file}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    Upload
                </button>
            </div>

            {response && (
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">Import Results:</h3>
                    <p className="mt-2 text-gray-600">{response.message}</p>
                    {response.failures && (
                        <p className="mt-2 text-gray-500">Number of failed rows: {response.failures}</p>
                    )}
                    {response.download_link && (
                        <a
                            href={response.download_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-indigo-600 hover:text-indigo-800"
                        >
                            Download Error Report
                        </a>
                    )}
                </div>
            )}
        </div>


    );
}

export default ExcelImporterPage;