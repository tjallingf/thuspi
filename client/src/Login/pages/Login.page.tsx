import { useState, FunctionComponent } from 'react';
import { Container, Button, TextInput, PasswordInput, Box, Page } from '@tjallingf/react-utils';
import FormField from '@/Forms/FormField';
import Form from '@/Forms/Form';
import fetchQuery from '@/utils/fetchQuery';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router';

const Login: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { refresh } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    fetchQuery('auth/login', {
      method: 'POST',
      data: data,
    })
      .then(() => {
        refresh().then(() => {
          setIsLoading(false);
          navigate('/devices');
        });
      })
      .catch(() => {
        setTimeout(() => setIsLoading(false), 300);
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
              Inloggen
            </Button>
            Ww vergeten?
          </Box>
        </Form>
      </Container>
    </Page>
  );
};

export default Login;
