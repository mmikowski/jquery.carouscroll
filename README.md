# jquery.carouscroll
## Use libraries, not frameworks
This is a library that strives to be best-in-class.
If you are considering using an SPA framework, please read [Do you
really want an SPA framework?][0] first.

## Overview
CarouScroll synchronizes the titles in a horizontal word-cloud
Carousel with the associated headline positions in vertical scrolling
content.  When the user scrolls the vertical content, the word-cloud 
carousel is adjusted so the correct title is selected.  Conversely,
the user may browse through the word-cloud Carousel, in which
case the scroll position of the content updates to match the
selected title.

## Style
This plugin is written in the style presented in the book
book **Single Page Web Applications - JavaScript end-to-end**
which is available from [Amazon][1] and directly from [Manning][2].
It passes JSLint.  If you dislike K&R indentation, think that JSLint
is a waste of time, and want to make closures and line endings
impossible to find, go ahead and port it to CoffeeScript.  Just
don't expect any help from me :)

## Examples
Create a new carouscroll instance (returns $box):

    $box.carouscroll({
      action_str   : 'create',
      content_html : the_html,
      title_list   : [ 
        'Summary', 'Health', 'Monitor', 'Contacts',
        'Interfaces', 'Software', 'Hardware', 'Config'
      ]
    });

Destroy a single carouscroll instance (returns true or false):

    $box.carouscroll({ action_str : 'destroy' });


Destroy all (returns true or false):

    $.carouscroll.destroyAll();

Get list of all active carouscroll instances (returns list):

    $.carouscroll.getInstanceList();

Please see the carouscroll-test.html file for a demonstration of use.

## Prerequisites
jQuery 1.7+.

jquery.carouscroll should work in any modern browser (IE9+ and later version of
Chrome, Safari, and Firefox). IE9 may require edge settings:

    <html>
    <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      ....

## Implementation
Simply create a sized div with minimal styling and then 
declare it as a CarouScroll instance as shown above.

CarouScroll should automatically handle resizing....

See carouscroll-test.html for example implementation.

## Error handling
Like many jQuery plugins, this code does not throw exceptions. Instead,
it does its work quietly.

## Release Notes
### Copyright (c)
2015 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

### License
Dual licensed under the MIT or GPL Version 2 http://jquery.org/license

### Version 0.1.0
Initial development version; no public release

## TODO
Enable common styling options

## Contribute!
If you want to help out, like all jQuery plugins this is hosted at
GitHub. Any improvements or suggestions are welcome! You can reach me at
mike[dot]mikowski[at]gmail[dotcom].

Cheers, Mike

## End
[0]:http://mmikowski.github.io/no-frameworks
[1]:http://www.amazon.com/dp/1617290750
[2]:http://manning.com/mikowski
