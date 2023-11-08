import React from 'react';
import { AuthProvider } from 'react-auth-kit';
import { BrowserRouter as Router } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

import ContextContainer from './context/ContextContainer';
import Routing from './routes/Routing';
import refreshToken from '~/api/refreshToken';

function App() {
    return (
        <ContextContainer>
            <AuthProvider
                authType={'cookie'}
                authName={'_auth'}
                refresh={refreshToken}
                cookieDomain={window.location.hostname}
                cookieSecure
            >
                <ConfigProvider locale={viVN}>
                    <Router>
                        <Routing />
                    </Router>
                </ConfigProvider>
            </AuthProvider>
        </ContextContainer>
    );
}

export default App;
