import { Link } from 'react-router-dom';
import { SignupForm } from '../components/auth/SignupForm';

export function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Create Your Cliento Account</h1>
        <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
          <SignupForm />
        </div>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
