import React from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import { Input, ErrorDisplay, Label } from '@/shared/components/ui';

export const LoginPage: React.FC = () => {
  const {
    username,
    password,
    loading,
    error,
    setUsername,
    setPassword,
    handleSubmit
  } = useLoginForm();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg border p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <ErrorDisplay error={error} />

            <div className="mb-4">
              <Label className="block mb-1">
                Username
              </Label>
              <Input
                placeholder="Digite seu username"
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <Label className="block mb-1">
                Password
              </Label>
              <Input
                placeholder="Digite sua senha"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
