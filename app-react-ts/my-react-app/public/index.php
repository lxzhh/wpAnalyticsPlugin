<?php

/**
 * Plugin Name:       Custom woocomerce report
 * Plugin URI:        https://example.com/plugins/the-basics/
 * Description:       Save Plugin or Theme Settings with using Vue.js
 * Version:           1.0
 * Author:            Mohsen Jahani
 * Author URI:        https://scriptestan.ir/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       Custom woocomerce report
 * Domain Path:       /languages
 */

const PLUGIN_SLUG_NAME = 'report';
const PLUGIN_SLUG_NAME2 = 'performance report';

const VERSION = '1.0';
const DEV_MODE = false;
function add_attribute_to_script_tag($tag, $handle)
{
    # add script handles to the array below
    $scripts_to_defer = array(PLUGIN_SLUG_NAME, PLUGIN_SLUG_NAME2);

    foreach ($scripts_to_defer as $defer_script) {
        if ($defer_script === $handle) {
            return str_replace(' src', '  type="module" crossorigin src', $tag);
        }
    }
    return $tag;
}
function my_vue_panel_page()
{
    $setting_data_option = get_option(PLUGIN_SLUG_NAME);
?>
    <script type="text/javascript">
        const vue_wp_api_url = "<?php echo get_site_url() . '/wp-json/' . PLUGIN_SLUG_NAME . '/save' ?>";
        const vue_wp_settings_data = <?php
                                        if ($setting_data_option) {
                                            echo json_encode($setting_data_option);
                                        } else {
                                            echo '{}';
                                        }
                                        ?>;
    </script>
    <div id="app-vue-admin-setting-panel"></div>
<?php

    wp_enqueue_script(
        PLUGIN_SLUG_NAME,
        plugin_dir_url(__FILE__) . 'build.js',
        array(),
        DEV_MODE ? time() : VERSION,
        true
    );
    wp_enqueue_script(
        PLUGIN_SLUG_NAME  . "vendor",
        plugin_dir_url(__FILE__) . 'vendor.js',
        array(),
        DEV_MODE ? time() : VERSION,
        true
    );
    wp_enqueue_style(
        PLUGIN_SLUG_NAME,
        plugin_dir_url(__FILE__) . 'main.css',
        array(),
        DEV_MODE ? time() : VERSION
    );
    wp_enqueue_style(
        PLUGIN_SLUG_NAME . "runtime",
        plugin_dir_url(__FILE__) . 'jsx-runtime.css',
        array(),
        DEV_MODE ? time() : VERSION
    );


    add_filter('script_loader_tag', 'add_attribute_to_script_tag', 10, 2);
}

function add_menu_item()
{
    add_menu_page(
        "Reports",
        "Reports",
        "manage_options",
        PLUGIN_SLUG_NAME,
        "my_vue_panel_page",
        'dashicons-chart-bar',
        99999
    );
}

function static_data_reports()
{
    $setting_data_option = get_option('static data reports');
?>
    <script type="text/javascript">
        const vue_wp_api_url = "<?php echo get_site_url() . '/wp-json/' . PLUGIN_SLUG_NAME2 . '/save' ?>";
        const vue_wp_settings_data = <?php
                                        if ($setting_data_option) {
                                            echo json_encode($setting_data_option);
                                        } else {
                                            echo '{}';
                                        }
                                        ?>;
    </script>
    <div id="app-vue-admin-setting-panel"></div>
<?php

    wp_enqueue_script(
        PLUGIN_SLUG_NAME2,
        plugin_dir_url(__FILE__) . 'static-data-page.js',
        array(),
        DEV_MODE ? time() : VERSION,
        true
    );
    wp_enqueue_script(
        PLUGIN_SLUG_NAME2 . "vendor",
        plugin_dir_url(__FILE__) . 'vendor.js',
        array(),
        DEV_MODE ? time() : VERSION,
        true
    );

    wp_enqueue_style(
        PLUGIN_SLUG_NAME2,
        plugin_dir_url(__FILE__) . 'main.css',
        array(),
        DEV_MODE ? time() : VERSION
    );
    wp_enqueue_style(
        PLUGIN_SLUG_NAME2 . "runtime",
        plugin_dir_url(__FILE__) . 'jsx-runtime.css',
        array(),
        DEV_MODE ? time() : VERSION
    );

    add_filter('script_loader_tag', 'add_attribute_to_script_tag', 10, 2);
}

function add_menu_item2()
{
    add_menu_page(
        "Performance reports",
        "Performance reports",
        "manage_options",
        PLUGIN_SLUG_NAME2,
        "static_data_reports",
        'dashicons-analytics',
        99999 + 1
    );
}
add_action("admin_menu", "add_menu_item");
add_action("admin_menu", "add_menu_item2");



/**
 * Rest api for saving setting
 * @param $request
 * @return mixed
 */
function save_settings_func($request)
{
    $user = wp_get_current_user();
    if (is_super_admin($user->ID)) {
        return update_option(PLUGIN_SLUG_NAME, $request->get_json_params());
    } else {
        return new WP_Error('not_allowed', null, array('status' => 403,));
    }
}
add_action('rest_api_init', function () {
    register_rest_route(PLUGIN_SLUG_NAME, '/save', array(
        'methods' => 'POST',
        'callback' => 'save_settings_func',
    ));
});
