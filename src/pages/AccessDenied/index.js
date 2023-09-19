import { useAuthHeader } from 'react-auth-kit';

function AccessDenied() {

    const authHeader = useAuthHeader()
    console.log(authHeader())
    return (
        <div>
            <h2>AccessDenied</h2>
        </div>
    );
}

export default AccessDenied;
