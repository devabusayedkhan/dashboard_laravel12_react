import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/site-settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/site-settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/site-settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/site-settings'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/site-settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SettingsController::update
 * @see app/Http/Controllers/Settings/SettingsController.php:39
 * @route '/site-settings'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const siteSettings = {
    update: Object.assign(update, update),
}

export default siteSettings