import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetInvitation, useAcceptInvite } from '../features/team/useTeam';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const acceptInviteSchema = z.object({
    fullName: z.string().min(2, 'Please enter your full name.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
});
type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>;

function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
            <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
                {children}
            </div>
        </div>
    )
}

export function AcceptInvitePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const { data: invitation, isLoading, error } = useGetInvitation(token);
    const { mutate: accept, isPending: isAccepting } = useAcceptInvite();

    const { register, handleSubmit, formState: { errors } } = useForm<AcceptInviteFormValues>({
        resolver: zodResolver(acceptInviteSchema),
    });

    if (!token) {
        return <PublicLayout><h1>Invalid Invitation Link</h1><p>The link is missing an invitation token.</p></PublicLayout>;
    }

    if (isLoading) return <PublicLayout><p>Verifying invitation...</p></PublicLayout>;
    if (error) return <PublicLayout><h1>Invitation Error</h1><p>{error.message}</p></PublicLayout>;

    const onSubmit = (data: AcceptInviteFormValues) => {
        accept({ token, ...data });
    };

    return (
        <PublicLayout>
            <h1 className="text-2xl font-bold text-center">You're Invited!</h1>
            <p className="text-center text-gray-600 mt-2">
                You have been invited to join the <strong>{invitation?.organizations?.name}</strong> organization on Cliento.
            </p>
            <p className="text-center text-gray-600 mt-4">
                Create your account for <strong>{invitation?.email}</strong> to continue.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div>
                    <label htmlFor="fullName">Full Name</label>
                    <Input id="fullName" {...register('fullName')} disabled={isAccepting} />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password</p>
                    <Input id="password" type="password" {...register('password')} disabled={isAccepting} />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
                <Button type="submit" disabled={isAccepting}>
                    {isAccepting ? 'Creating Account...' : 'Accept Invitation & Create Account'}
                </Button>
            </form>
        </PublicLayout>
    );
}
