import { useState, useEffect, FunctionComponent } from 'react';
import { Container, Button, TextInput, PasswordInput, Box, Page } from '@tjallingf/react-utils';
import FormField from '@/Forms/FormField';
import Form from '@/Forms/Form';
import fetchQuery from '@/utils/fetchQuery';
import { FormattedMessage } from 'react-intl';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { trpc } from '@/utils/trpc';

const Login: FunctionComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const login = trpc.auth.login.useMutation();

    const { refresh } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (data: any) => {
        setIsLoading(true);
        login.mutate(data, {
            onSuccess: () => {
                refresh().then(() => {
                    setIsLoading(false);
                    navigate('/devices');
                });
            }
        });
    };

    return (
        <Page id="login">
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
                        <Button size="lg" loading={isLoading}>
                            <FormattedMessage id="@zylax/core.global.actions.login" />
                        </Button>
                        <FormattedMessage id="@zylax/core.pages.login.forgotPasswordButton.label" />
                    </Box>
                </Form>
            </Container>
        </Page>
    );
};

export default Login;
