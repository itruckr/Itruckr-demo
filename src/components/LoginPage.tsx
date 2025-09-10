import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Bot, Eye, EyeOff, Shield, Truck } from 'lucide-react';
import React, { useState } from 'react';
import Logo from './Logo';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const loginSuccess = login(username, password);

    if (!loginSuccess) {
      setError('Invalid username or password. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-absolute-black via-absolute-black to-green-accent flex items-center justify-center p-4">
      <div className="flex flex-col gap-6 w-100 max-w-100">
        <Logo height={25} width={250} isComplete />

        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="flex flex-col gap-2 text-start">
            <CardTitle className="text-2xl font-bold text-absolute-black">
              Sign In
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor="Username" className=" text-sm text-absolute-black">
                  Username
                </Label>
                <div className="relative w-full">
                  <Input
                    id="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="h-12 px-4 border border-absolute-gray-200 focus:border-green-accent"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor="password" className="pl-1 text-sm text-absolute-black">
                  Password
                </Label>
                <div className="relative w-full">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 px-4 pr-12 border border-absolute-gray-200 focus:border-green-accent"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-absolute-gray-400 hover:text-absolute-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <Shield size={16} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !password || !username}
                className="w-full h-12 bg-green-accent hover:bg-green-accent-hover hover:opacity-80 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Truck size={20} />
                    Sign In
                    <ArrowRight size={16} />
                  </div>
                )}
              </Button>
            </form>
            <div className='flex items-endflex justify-end'>
              <a href="/register"
                className="relative text-indigo-400 font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-indigo-400 after:transition-all hover:after:w-full">
                Sign up
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Bot size={20} className="shrink-0 text-green-accent" />
            <h3 className="text-sm font-medium text-white">AI Assistance</h3>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Shield size={20} className="text-green-accent" />
            <h3 className="text-sm font-medium text-white">Secure Platform</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
