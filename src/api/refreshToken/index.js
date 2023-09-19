import { createRefresh } from 'react-auth-kit';

import { apiPostAuth } from '~/api/defaultApi';
import { getRefreshTokenInCookies, getTokenInCookies, saveRefreshTokenInCookies, saveTokenInCookies } from '~/utils';
import { TOKEN_EXPIRES_TIME } from '~/constants'

const refreshToken = createRefresh({
    interval: TOKEN_EXPIRES_TIME, // Refreshs the token in every 10 minutes
    refreshApiCallback: async (param) => {
        const data = {
            RefreshToken: getRefreshTokenInCookies(),
            AccessToken: getTokenInCookies(),
        };

        apiPostAuth('api/users/refreshToken', data)
            .then((res) => {
                saveRefreshTokenInCookies(res.data.refreshToken)
                saveTokenInCookies(res.data.accessToken)
                return {
                    isSuccess: true,
                    newAuthToken: res.data.accessToken,
                    newAuthTokenExpireIn: TOKEN_EXPIRES_TIME,
                    newRefreshTokenExpiresIn: TOKEN_EXPIRES_TIME,
                };
            })
            .catch((err) => {
                window.location.replace("/login");
                return {
                    isSuccess: false,
                };
            });
    },
});

export default refreshToken;
