import {useState} from "react";
import api from '../api/axios'
import axios from "axios";

interface ImportResponse {
    message: string;
    failures?: number;
    download_link?: string;
}
const ExcelImporterPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<ImportResponse | null>(null);

    const handleFileChange = (e:any) => {
        setFile(e.target.files[0]);
    }
    
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
        catch(err:any){
            if(axios.isAxiosError(err) && (err.response && err.response.data)){
                console.log(err.response.data);
                if(err.response.data.failures){
                    setResponse(err.response.data as ImportResponse);
                }else{
                    setError(err.response.data.message);
                }
            }else {
                setError(err);
            }
        }
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Import Users from Excel</h2>

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