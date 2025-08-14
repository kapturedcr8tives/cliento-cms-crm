import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In to Cliento</h1>
        <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
          <LoginForm />
        </div>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
