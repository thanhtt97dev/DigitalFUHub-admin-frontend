import React from 'react';
import { AuthProvider } from 'react-auth-kit';
import { BrowserRouter as Router } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

import Notification from './context/NotificationContext';
import Routing from './routes/Routing';
import refreshToken from '~/api/refreshToken';

function App() {
    return (
        <Notification>
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
        </Notification>
    );
}

export default App;
