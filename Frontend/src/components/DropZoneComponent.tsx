import React, {useCallback, useState} from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
    onFileAccepted: (file: File) => void;
    error: string | null;
}

const DropZoneComponent: React.FC<DropzoneProps> = ({ onFileAccepted, error }) => {
    const [acceptedFiles, setAcceptedFiles] = useState<File | null>(null);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileAccepted(acceptedFiles[0]);
            setAcceptedFiles(acceptedFiles[0]);
        }
    }, [onFileAccepted]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
    });

    const baseStyle: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px',
        borderWidth: 2,
        borderRadius: '8px',
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out',
        cursor: 'pointer',
    };

    const activeStyle = {
        borderColor: '#2196f3',
    };

    const style = React.useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
    }), [isDragActive]);

    return (
        <div className="mb-4">
            <div {...getRootProps({ style } as any)}>
                <input {...getInputProps()} />
                <p className="text-center text-gray-500">
                    {isDragActive
                        ? 'Drop the file here ...'
                        : "Drag 'n' drop an Excel file here, or click to select one"}
                </p>
            </div>
            {acceptedFiles && <p className="text-center text-gray-600 my-4">Selected file: <span className="font-medium">{acceptedFiles.name}</span></p>}
            {error && <p className="text-red-500 my-3 text-center">{error}</p>}
        </div>
    );
};

export default DropZoneComponent; 