import { useState } from "react";

export default function SignUpUploadDocumentsTruck() {
  const [hasTrailer, setHasTrailer] = useState<null | boolean>(null);

  return (
    <div className="flex items-center justify-center px-4 w-full">
      <div className="w-full max-w-lg text-center space-y-6">
        
        {/* Título */}
        <div>
          <h1 className="text-2xl font-bold text-white">Final <br /> Details</h1>
          <p className="mt-2 text-gray-200 text-sm">
            Please upload the following <br />
            documents to get you on the road:
          </p>
        </div>

        {/* Documentos */}
        <div className="space-y-6 text-left">
          {/* Truck Cab Card */}
          <div>
            <label className="block text-white mb-2 text-center">Truck Cab Card:</label>
            <button className="w-full rounded-xl bg-white py-3 text-center font-semibold text-gray-700 hover:bg-gray-100">
              UPLOAD
            </button>
          </div>

          {/* Truck Inspection */}
          <div>
            <label className="block text-white mb-2 text-center">Truck Inspection:</label>
            <button className="w-full rounded-xl bg-white py-3 text-center font-semibold text-gray-700 hover:bg-gray-100">
              UPLOAD
            </button>
          </div>

          {/* Trailer question */}
          <div className="text-center">
            <label className="block text-white mb-3">Do you have a trailer?</label>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setHasTrailer(true)}
                className={`w-32 py-3 rounded-xl border font-semibold ${
                  hasTrailer === true
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-transparent text-white border-white"
                }`}
              >
                YES
              </button>
              <button
                onClick={() => setHasTrailer(false)}
                className={`w-32 py-3 rounded-xl border font-semibold ${
                  hasTrailer === false
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-transparent text-white border-white"
                }`}
              >
                NO
              </button>
            </div>
          </div>

          {/* Trailer Inspection (solo si tiene trailer) */}
          {hasTrailer && (
            <div>
              <label className="block text-white mb-2">Trailer inspection:</label>
              <button className="w-full rounded-xl bg-white py-3 text-center font-semibold text-gray-700 hover:bg-gray-100">
                UPLOAD
              </button>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}
