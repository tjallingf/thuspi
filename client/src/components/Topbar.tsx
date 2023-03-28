import React from 'react';
import Box from './Box';
import Container from './Container';
import Icon from './Icon';
import Button from './Button';
import '@/styles/components/Topbar.scss';
import { neutral } from '@/utils/theme/colorpalettes';

export interface ITopbarProps {
    title: string
}

const Topbar: React.FunctionComponent<ITopbarProps> = ({
    title
}) => {
    return (
        <Box className="Topbar" align="center">
            <Container>
                <Box direction="row" align="center">
                    <h1 className="Topbar__title">
                        {title}
                    </h1>
                    <div className="ms-auto">
                        <Button 
                            variant="link" 
                            to="/login" 
                            shape="square"
                            size="lg" 
                            aria-label="Visit the login page">
                            <Icon id="user" />
                        </Button>
                    </div>
                </Box>
            </Container>
        </Box>
    )
}

export default Topbar;