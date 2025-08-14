import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signupSchema } from './validation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormValues) {
    // Here you would call your authentication service to sign up the user
    // and create the organization.
    console.log('Signup data:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="organizationName">Organization Name</label>
        <Input id="organizationName" type="text" {...register('organizationName')} />
        {errors.organizationName && <p className="text-sm text-red-500">{errors.organizationName.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="fullName">Full Name</label>
        <Input id="fullName" type="text" {...register('fullName')} />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
      </div>
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
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}
