import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema } from './validation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useLogin } from './useAuth';

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoggingIn } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormValues) {
    login(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" {...register('email')} disabled={isLoggingIn} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" {...register('password')} disabled={isLoggingIn} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
