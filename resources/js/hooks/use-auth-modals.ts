import { useCallback, useEffect, useState } from 'react';

export function useAuthModals() {
    const [loginModal, setLoginModal] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);

    const openLoginModal = useCallback(() => setLoginModal(true), []);
    const closeLoginModal = useCallback(() => setLoginModal(false), []);

    const openRegisterModal = useCallback(() => setRegisterModal(true), []);
    const closeRegisterModal = useCallback(() => setRegisterModal(false), []);

    const switchToLogin = useCallback(() => {
        setRegisterModal(false);
        setLoginModal(true);
    }, []);

    const switchToRegister = useCallback(() => {
        setLoginModal(false);
        setRegisterModal(true);
    }, []);

    const closeAllAuthModals = useCallback(() => {
        setLoginModal(false);
        setRegisterModal(false);
    }, []);

    useEffect(() => {
        window.addEventListener('open-login-modal', openLoginModal);
        window.addEventListener('open-register-modal', openRegisterModal);

        return () => {
            window.removeEventListener('open-login-modal', openLoginModal);
            window.removeEventListener('open-register-modal', openRegisterModal);
        };
    }, [openLoginModal, openRegisterModal]);

    return {
        loginModal,
        registerModal,
        openLoginModal,
        closeLoginModal,
        openRegisterModal,
        closeRegisterModal,
        switchToLogin,
        switchToRegister,
        closeAllAuthModals,
    };
}