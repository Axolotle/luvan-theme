<?php
namespace Grav\Theme;

use Grav\Common\Theme;
use RocketTheme\Toolbox\Event\Event;

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

    public function onAdminCreatePageFrontmatter(Event $event)
    {
        if ($event['data']['name'] === 'post' ) {
            $header = $event['header'];
            if (!isset($header['taxonomy']['type'])) {
                $header['taxonomy']['type'] = $event['data']['type'];
                $event['header'] = $header;
            }
        }
    }
}
