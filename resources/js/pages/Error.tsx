import { Head, Link, router } from '@inertiajs/react';

export default function Error({ status }: { status: number }) {
    const title =
        status === 403
            ? 'Access denied'
            : status === 404
              ? 'Page not found'
              : 'Server error';

    const message =
        status === 403
            ? 'You don’t have permission to access this page.'
            : status === 404
              ? 'The page you’re looking for doesn’t exist.'
              : 'Something went wrong. Please try again.';

    return (
        <div className="min-h-screen bg-[#F7F7F5] text-[#141414] dark:bg-[#0A0A0A] dark:text-[#EDEDEC]">
            <Head title={`${status} - ${title}`} />

            <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-12">
                <div className="w-full rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-start gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black/5 text-sm font-bold dark:bg-white/10">
                            {status}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-xl font-bold">{title}</h1>
                            <p className="mt-2 text-sm text-black/70 dark:text-white/70">
                                {message}
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() =>
                                        router.visit(document.referrer || '/')
                                    }
                                    className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all duration-200 hover:bg-gray-300 sm:text-base dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    <i className="fa-regular fa-circle-left text-lg"></i>
                                    Go Back
                                </button>

                                <Link
                                    href="/"
                                    className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all duration-200 hover:bg-gray-300 sm:text-base dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Go to home
                                </Link>

                            </div>

                            {status === 403 && (
                                <p className="mt-5 text-xs text-black/50 dark:text-white/50">
                                    Tip: Contact admin to get access.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
