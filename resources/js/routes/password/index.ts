import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import confirmD7e05f from './confirm'
/**
* @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route '/user/confirm-password'
 */
export const confirm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirm.url(options),
    method: 'get',
})

confirm.definition = {
    methods: ["get","head"],
    url: '/user/confirm-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route '/user/confirm-password'
 */
confirm.url = (options?: RouteQueryOptions) => {
    return confirm.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route '/user/confirm-password'
 */
confirm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirm.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route '/user/confirm-password'
 */
confirm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: confirm.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route '/user/confirm-password'
 */
    const confirmForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: confirm.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route '/user/confirm-password'
 */
        confirmForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: confirm.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route '/user/confirm-password'
 */
        confirmForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: confirm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    confirm.form = confirmForm
/**
* @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route '/user/confirmed-password-status'
 */
export const confirmation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirmation.url(options),
    method: 'get',
})

confirmation.definition = {
    methods: ["get","head"],
    url: '/user/confirmed-password-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route '/user/confirmed-password-status'
 */
confirmation.url = (options?: RouteQueryOptions) => {
    return confirmation.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route '/user/confirmed-password-status'
 */
confirmation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirmation.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route '/user/confirmed-password-status'
 */
confirmation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: confirmation.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route '/user/confirmed-password-status'
 */
    const confirmationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: confirmation.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route '/user/confirmed-password-status'
 */
        confirmationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: confirmation.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route '/user/confirmed-password-status'
 */
        confirmationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: confirmation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    confirmation.form = confirmationForm
/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::phone
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:22
 * @route '/forgot-password'
 */
export const phone = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: phone.url(options),
    method: 'post',
})

phone.definition = {
    methods: ["post"],
    url: '/forgot-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::phone
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:22
 * @route '/forgot-password'
 */
phone.url = (options?: RouteQueryOptions) => {
    return phone.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::phone
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:22
 * @route '/forgot-password'
 */
phone.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: phone.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::phone
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:22
 * @route '/forgot-password'
 */
    const phoneForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: phone.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::phone
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:22
 * @route '/forgot-password'
 */
        phoneForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: phone.url(options),
            method: 'post',
        })
    
    phone.form = phoneForm
/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::request
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:15
 * @route '/forgot-password'
 */
export const request = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: request.url(options),
    method: 'get',
})

request.definition = {
    methods: ["get","head"],
    url: '/forgot-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::request
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:15
 * @route '/forgot-password'
 */
request.url = (options?: RouteQueryOptions) => {
    return request.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::request
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:15
 * @route '/forgot-password'
 */
request.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: request.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::request
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:15
 * @route '/forgot-password'
 */
request.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: request.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::request
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:15
 * @route '/forgot-password'
 */
    const requestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: request.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::request
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:15
 * @route '/forgot-password'
 */
        requestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: request.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::request
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:15
 * @route '/forgot-password'
 */
        requestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: request.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    request.form = requestForm
/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::reset
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:59
 * @route '/reset-password'
 */
export const reset = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reset.url(options),
    method: 'get',
})

reset.definition = {
    methods: ["get","head"],
    url: '/reset-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::reset
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:59
 * @route '/reset-password'
 */
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::reset
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:59
 * @route '/reset-password'
 */
reset.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reset.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::reset
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:59
 * @route '/reset-password'
 */
reset.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reset.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::reset
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:59
 * @route '/reset-password'
 */
    const resetForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reset.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::reset
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:59
 * @route '/reset-password'
 */
        resetForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reset.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::reset
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:59
 * @route '/reset-password'
 */
        resetForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reset.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reset.form = resetForm
/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::update
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:67
 * @route '/reset-password'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::update
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:67
 * @route '/reset-password'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::update
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:67
 * @route '/reset-password'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::update
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:67
 * @route '/reset-password'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\PhonePasswordResetController::update
 * @see app/Http/Controllers/Auth/PhonePasswordResetController.php:67
 * @route '/reset-password'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const password = {
    confirm: Object.assign(confirm, confirmD7e05f),
confirmation: Object.assign(confirmation, confirmation),
phone: Object.assign(phone, phone),
request: Object.assign(request, request),
reset: Object.assign(reset, reset),
update: Object.assign(update, update),
}

export default password