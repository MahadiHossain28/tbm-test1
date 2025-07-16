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
                setResponse(err.response.data as ImportResponse);
            }else {
                setError(err);
            }
        }
    }

    return (
        <>
            <h2>Import Users from Excel</h2>
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange}/>

            <button onClick={handleUpload} disabled={!file} style={{marginLeft: '10px'}}>Upload</button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            {response && (
                <div style={{marginTop: '20px'}}>
                    <h3>Import Results:</h3>
                    <p>{response.message}</p>
                    {response.failures && <p>Number of failed rows: {response.failures}</p>}
                    {response.download_link && (
                        <a href={response.download_link} target="_blank" rel="noopener noreferrer">
                            Download Error Report
                        </a>
                    )}
                </div>
            )}
        </>
    );
}

export default ExcelImporterPage;