import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import { removeDataAuthInCookies } from '~/utils';

function Logout() {
    const signOut = useSignOut();

    const navigate = useNavigate();

    const hanldeLogout = () => {
        signOut();
        removeDataAuthInCookies();
        return navigate('/login');
    };

    return (
        <Button type='link' danger onClick={hanldeLogout}>
            <LogoutOutlined /> Đăng xuất
        </Button>
    );

}

export default Logout;
