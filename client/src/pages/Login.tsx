import { useState, FunctionComponent } from 'react';
import TextInput from '@/components/Inputs/TextInput';
import FormField from '@/components/FormField';
import Container from '@/components/Container';
import PasswordInput from '@/components/Inputs/PasswordInput';
import Form from '@/components/Form';
import Button from '@/components/Button';
import queryClient from '@/utils/queryClient';
import Box from '@/components/Box';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router';

const Login: FunctionComponent = () => {
    const [ isLoading, setIsLoading ] = useState(false);

    const { refresh } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (data: any) => {
        setIsLoading(true);
        queryClient.fetchQuery([
            'auth/login',
            {
                method: 'POST',
                data: data
            }
        ]).then(() => {
            refresh().then(() => {
                setIsLoading(false);
                navigate('/devices');
            })
        }).catch(() => {
            setTimeout(() => setIsLoading(false), 300);
        })
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <FormField name="username" label="Username">
                        <TextInput autoComplete="username" />
                    </FormField>
                    <FormField name="password" label="Password">
                        <PasswordInput autoComplete="current-password" revealable />
                    </FormField>
                </div>
                <Box align="center" gutterX={3}>
                    <Button size="lg" loading={isLoading}>Inloggen</Button>
                    Ww vergeten?
                </Box>
            </Form>
        </Container>
    )
}

export default Login;