import Notification from '~/context/UI/NotificationContext';
function ContextContainer({ children }) {
    return (
        <>
            <Notification>
                {children}
            </Notification>
        </>
    );
}

export default ContextContainer;