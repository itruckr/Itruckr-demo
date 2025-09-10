import { useState } from "react";

export default function CredentialsPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Username:", username, "Password:", password);
    // Aquí puedes manejar el envío de datos al backend
  };

  return (
    <div className="flex items-center justify-center px-4 w-full">
      <div className="w-full max-w-md text-center space-y-6">
        
        {/* Título */}
        <div>
          <h1 className="text-2xl font-bold text-white">Your <br /> Credentials</h1>
          <p className="mt-2 text-gray-200 text-sm">
            Please create your login information.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Username */}
          <div className="text-center">
            <label className="block text-white mb-2">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl p-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password */}
          <div className="text-center">
            <label className="block text-white mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl p-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Botón Submit */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full rounded-xl bg-green-500 py-3 text-white font-semibold hover:bg-green-600"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
