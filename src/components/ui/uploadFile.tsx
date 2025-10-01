import { useRef, useState } from "react";

interface UploadFileProps {
  label?: string;
  description?: string;
  accept?: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
}

export const UploadFile: React.FC<UploadFileProps> = ({
  label = "Upload File",
  description = "Upload or drag & drop your file PNG, JPG.",
  accept = "image/*",
  handleFileChange,
}: UploadFileProps ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true); // empieza el loading
        
        try {
            await handleFileChange(e);
        } finally {
            setLoading(false); // termina el loading
        }
    };
    
    return (
        <main className="flex items-center justify-center bg-gray-100 font-sans mb-16">
            <label htmlFor="dropzone-file" className="mx-auto cursor-pointer flex w-full max-w-xl flex-col items-center rounded-xl border-2 border-dashed border-blue-900 bg-white p-6 text-center">
                {
                    loading ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                                
                                        <svg fill='none' className="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                                            <path clipRule='evenodd'
                                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                                                fill='currentColor' fillRule='evenodd' />
                                        </svg>

                                
                                <div>Loading ...</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>

                            <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">{ label }</h2>

                            <p className="mt-2 text-gray-500 tracking-wide">{ description }</p>

                        </>
                    )
                }

                <input 
                    id="dropzone-file" 
                    type="file"
                    accept={ accept }
                    ref={ inputRef }
                    onChange={ onFileChange }
                    className="hidden" />
            </label>
        </main>
    )
}