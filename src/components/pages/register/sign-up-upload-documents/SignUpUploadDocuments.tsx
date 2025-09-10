export default function SignUpUploadDocuments() {
  return (
    <div className="flex items-center justify-center px-4 w-full">
      <div className="w-full max-w-lg text-center space-y-6">
        
        {/* Título */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Thank you <br /> for signing up!
          </h1>
          <p className="mt-2 text-gray-200 text-sm">
            Please upload the following <br />
            documents to get you on the road:
          </p>
        </div>

        {/* Documentos */}
        <div className="space-y-6 text-left">
          {/* Driver License */}
          <div className="text-center">
            <label className="block text-white mb-2">Driver License:</label>
            <button className="w-full rounded-xl bg-white py-3 text-center font-semibold text-gray-700 hover:bg-gray-100">
              UPLOAD
            </button>
          </div>

          {/* Medical Card */}
          <div className="text-center">
            <label className="block text-white mb-2">Medical Card:</label>
            <button className="w-full rounded-xl bg-white py-3 text-center font-semibold text-gray-700 hover:bg-gray-100">
              UPLOAD
            </button>
          </div>

          {/* Social Security */}
          <div className="text-center">
            <label className="block text-white mb-2">Social Security:</label>
            <button className="w-full rounded-xl bg-white py-3 text-center font-semibold text-gray-700 hover:bg-gray-100">
              UPLOAD
            </button>
          </div>

          {/* Profile Picture */}
          <div className="text-center">
            <label className="block text-white mb-2">Profile Picture:</label>
            <button className="w-full rounded-xl bg-white py-3 text-center font-semibold text-gray-700 hover:bg-gray-100">
              TAKE A PHOTO :)
            </button>
          </div>
        </div>

        
      </div>
    </div>
  );
}
