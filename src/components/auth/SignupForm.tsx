import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signupSchema } from './validation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useSignup } from './useAuth';

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signup, isSigningUp } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(data: SignupFormValues) {
    signup(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="organizationName">Organization Name</label>
        <Input id="organizationName" type="text" {...register('organizationName')} disabled={isSigningUp} />
        {errors.organizationName && <p className="text-sm text-red-500">{errors.organizationName.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="fullName">Full Name</label>
        <Input id="fullName" type="text" {...register('fullName')} disabled={isSigningUp} />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" {...register('email')} disabled={isSigningUp} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" {...register('password')} disabled={isSigningUp} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={isSigningUp}>
        {isSigningUp ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}
