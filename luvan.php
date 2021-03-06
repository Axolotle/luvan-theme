<?php
namespace Grav\Theme;

use Grav\Common\Theme;
use Grav\Common\Grav;
use RocketTheme\Toolbox\Event\Event;
use Grav\Plugin\Admin\Utils;

class Luvan extends Theme
{
    /**
     * @return array
     *
     * The getSubscribedEvents() gives the core a list of events
     *     that the plugin wants to listen to. The key of each
     *     array section is the event that the plugin listens to
     *     and the value (in the form of an array) contains the
     *     callable (or function) as well as the priority. The
     *     higher the number the higher the priority.
     */
    public static function getSubscribedEvents()
    {
        return [
            'onAdminCreatePageFrontmatter' => ['onAdminCreatePageFrontmatter', 0]
        ];
    }

    /**
     * Static method to get `database` page's elements.
     * Can be used with data-options@ for a `select` field in a page's blueprint.
     * `data-options@: ['\Grav\Theme\Luvan::data', 'people']`
     *
     * @param string $name Frontmatter's key name.
     * @return array
     */
    public static function data($name)
    {
        $pages = Grav::instance()['pages'];
        $pages->enablePages();
        $elems = $pages->find('/database')->header()->{$name};
        $list = [];
        foreach ($elems as $key => $value) {
            // For now reference is made by index, so one shouldn't remove
            // an element in the "database" page.
            $list[$key] = $elems[$key]['name'];
        }
        return $list;
    }

    /**
     * Static method to get children of a page from given route.
     * Can be used with data-options@ for a `select` field in a page's blueprint.
     * `data-options@: ['\Grav\Theme\Luvan::children', '/portfolio/books']`
     *
     * @param string $route Parent's base route.
     * @return array
     */
    public static function children($route)
    {
        $pages = Grav::instance()['pages'];
        $pages->enablePages();
        $children = $pages->find($route)->children();
        $list = [];
        foreach ($children as $child) {
            $list[$child->rawRoute()] = '> ' . str_replace(' ', ' ', $child->menu());
        }
        return $list;
    }

    /**
     * Static method to get all projects posted in /portfolio.
     * Can be used with data-options@ for a `select` field in a page's blueprint.
     * `data-options@: '\Grav\Theme\Luvan::projects'`
     *
     * @return array
     */
    public static function projects()
    {
        $pages = Grav::instance()['pages'];
        $pages->enablePages();
        $mediums = $pages->find('/portfolio')->children();
        $list = [];
        foreach ($mediums as $medium) {
            foreach ($medium->children() as $project) {
                $list[$project->rawRoute()] = $project->menu();
            }
        }
        return $list;
    }

    public function onAdminCreatePageFrontmatter(Event $event)
    {
        $header = $event['header'];

        if (!isset($header['date'])) {
            $header['date'] = date($this->grav['config']->get('system.pages.dateformat.default', 'd-m-Y H:i'));
        }

        if ($event['data']['name'] === 'post' or $event['data']['name'] === 'publication' ) {
            $header['taxonomy']['type'] = $event['data']['type'];
        }

        if ($event['data']['name'] === 'project') {
            $raw_route = $event['data']['route'] .'/'. Utils::slug($event['data']['title']);
            $header['content']['items']['@taxonomy']['project'] = $raw_route;
            $header['news']['items']['@taxonomy']['project'] = $raw_route;
        }

        $event['header'] = $header;
    }

}
