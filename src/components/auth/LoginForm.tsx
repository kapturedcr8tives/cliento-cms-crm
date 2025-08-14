import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema } from './validation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    // Here you would typically call your authentication service
    console.log('Login data:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
