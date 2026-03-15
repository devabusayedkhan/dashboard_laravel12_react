import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { logout } from '@/routes';

function logOut() {
    router.post(logout());
    Swal.fire({
        icon: 'success',
        title: 'Logged out',
        text: 'You have been logged out successfully.',
        showConfirmButton: false,
        timer: 1200,
    });
}

export default logOut;
