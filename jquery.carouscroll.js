/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
*/
/*global jQuery */

/*
 * jquery.carouscroll
 * ==================
 * Overview
 * --------
 * CarouScroll synchronizes the titles in a horizontal word-cloud
 * Carousel with the associated headline positions in vertical scrolling
 * content.  When the user scrolls the vertical content, the word-cloud 
 * carousel is adjusted so the correct title is selected.  Conversely,
 * the user may browse through the word-cloud Carousel, in which
 * case the scroll position of the content updates to match the
 * selected title.
 * 
 * Examples
 * --------
 *
 * Create a new carouscroll instance (returns $box):
 *
 *     $box.carouscroll({
 *       action_str   : 'create',
 *       content_html : the_html,
 *       title_list   : [ 
 *         'Summary', 'Health', 'Monitor', 'Contacts',
 *         'Interfaces', 'Software', 'Hardware', 'Config'
 *       ]
 *     });
 *
 * Destroy a single carouscroll instance (returns true or false):
 *
 *     $box.carouscroll({ action_str : 'destroy' });
 *
 * 
 * Destroy all (returns true or false):
 *
 *     $.carouscroll.destroyAll();
 *
 * Get list of all active carouscroll instances (returns list):
 *
 *     $.carouscroll.getInstanceList();
 * 
 * Please see the carouscroll-test.html file for a demonstration of use.
 * 
 * Prerequisites
 * -------------
 * jQuery 1.7+.
 * 
 * jquery.carouscroll should work in any modern browser (IE9+ and later version of
 * Chrome, Safari, and Firefox). IE9 may require edge settings:
 * 
 *     <html>
 *     <head>
 *       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 *       ....
 * 
 * Implementation
 * --------------
 * Simply create a sized div with minimal styling and then 
 * declare it as a CarouScroll instance as shown above.
 *
 * CarouScroll should automatically handle resizing....
 *
 * See carouscroll-test.html for example implementation.
 * 
 * Error handling
 * --------------
 * 
 * Like many jQuery plugins, this code does not throw exceptions. Instead,
 * it does its work quietly.
 * 
 * Release Notes
 * -------------
 * 
 * Copyright (c) 2015 Michael S. Mikowski
 *   (mike[dot]mikowski[at]gmail[dotcom])
 * Dual licensed under the MIT or GPL Version 2 http://jquery.org/license
 *
 * Version 0.1.0 - Initial development version; no public release
 *
*/

// TODO: Below is jquery.tscroll, which should be an excellent
// foundation for this work.

(function ( $ ) {
  'use strict';
  var
    configMap = {
      scroll_ratio : 24,
      bar_html : String()
        + '<div class="jq-tscroll-box jq-tscroll-ns">'
          + '<div class="jq-tscroll-zip jq-tscroll-ns"></div>'
          + '<div class="jq-tscroll-knob jq-tscroll-ns"></div>'
        + '</div>',
      style_css : String()
        + '.jq-tscroll-ns, .jq-tscroll-box, .jq-tscroll-zip,'
          + 'jq-tscroll-knob {'
          + '-webkit-user-select:none; -khtml-user-select:none;'
          + '-moz-user-select:-moz-none; -o-user-select:none;'
          + '-ms-user-select:none; user-select:none;'
          + '-webkit-user-drag:none; -moz-user-drag:none;'
          + 'user-drag:none; -webkit-tap-highlight-color:transparent;'
          + '-webkit-touch-callout:none;'
        + '}'

        + '.jq-tscroll-box {'
          + 'position:absolute; top:0; bottom:0;'
          + 'width:1em; background:#d8d8d8; z-index: 1;'
        + '}'

        + '.jq-tscroll-zip {'
          + 'position:absolute; top:0; bottom:0; right:.429em;'
          + 'width:.143em; background:#aaa; z-index:2;'
        + '}'
        + '.jq-tscroll-knob {'
          + 'position:absolute; top:0; right:0; width:1em;'
          + 'background-color:#aaa;'
          + 'background-image:-webkit-linear-gradient('
            + 'top, #888 0%, #bbb 50%,#888 100%);'
          + 'border:0.1em solid #666; border-radius: .1em;'
          + 'z-index:3;cursor:pointer;'
        + '}'
        + '.jq-tscroll-knob:hover, .jq-tscroll-knob.jq-tscroll-active {'
          + 'background-color:#bbb;'
          + 'background-image:-webkit-linear-gradient('
            + 'top, #666 0%,#ccc 50%,#666 100%);'
          + 'border-color:#666;'
        + '}'
    },
    onDragstart, onDragmove, onDragend,
    onMousedown, onMousewheel, resizeScrollbar,
    initModule;

  onMousedown = function ( event ) {
    event.preventDefault();
  };

  onDragstart = function ( event ) {
    var
      data_map   = $( this ).data( 'tscroll' ),
      jquery_map = data_map.jquery_map;

    jquery_map.$inner.addClass(      'jq-tscroll-ns'     );
    jquery_map.$scrollknob.addClass( 'jq-tscroll-active' );
    return false;
  };

  onDragmove = function ( event ) {
    var
      data_map   = $( this ).data( 'tscroll' ),
      jquery_map = data_map.jquery_map,
      state_map  = data_map.state_map,

      $outer   = jquery_map.$outer,

      top_px  = $outer.scrollTop()
        + ( event.px_delta_y / state_map.height_ratio),
      knob_top_px
      ;

    if ( top_px < 0 ) { top_px = 0; }
    else if ( top_px > state_map.max_scroll_px ) {
      top_px = state_map.max_scroll_px;
    }

    knob_top_px = top_px * state_map.height_ratio;
    jquery_map.$scrollbox.css({  top : top_px, bottom : -top_px });
    jquery_map.$scrollknob.css({ top : knob_top_px });
    $outer.scrollTop( top_px );

    state_map.knob_top_px = knob_top_px;
    return false;
  };

  onDragend = function ( event ) {
    var
      data_map   = $( this ).data( 'tscroll' ),
      jquery_map = data_map.jquery_map;

    jquery_map.$inner.removeClass( 'jq-tscroll-ns' );
    jquery_map.$scrollknob.removeClass( 'jq-tscroll-active' );
    return false;
  };

  onMousewheel = function ( event, delta_num ) {
    var
      $scrollknob = $(this).find( '.jq-tscroll-knob' ),
      data_map    = $scrollknob.data( 'tscroll' ),
      jquery_map  = data_map.jquery_map,
      state_map   = data_map.state_map,

      $outer      = jquery_map.$outer,
      top_px      = $outer.scrollTop(),
      knob_top_px
      ;

    top_px -= Number( delta_num || 0 ) * configMap.scroll_ratio;
    if ( top_px < 0 ) { top_px = 0; }
    if ( top_px > state_map.max_scroll_px ) {
      top_px = state_map.max_scroll_px;
    }
    knob_top_px = top_px * state_map.height_ratio;

    $outer.scrollTop( top_px );
    jquery_map.$scrollbox.css({  top : top_px, bottom : -top_px });
    jquery_map.$scrollknob.css({ top : knob_top_px });
    return false;
  };

  resizeScrollbar = function ( data_map ) {
    var
      jquery_map  = data_map.jquery_map,
      state_map   = data_map.state_map,

      $outer      = jquery_map.$outer,
      $inner      = jquery_map.$inner,
      $scrollbox  = jquery_map.$scrollbox,
      $scrollknob = jquery_map.$scrollknob,
      top_px      = $outer.scrollTop(),

      outer_ht   = $outer.height(),
      content_ht = $inner.height(),

      height_ratio  = outer_ht / content_ht,
      max_scroll_px = content_ht - outer_ht,

      knob_top_px;


    if ( height_ratio > 1 ) {
      $scrollbox.hide();
    }
    else {
      knob_top_px = top_px * height_ratio;
      jquery_map.$scrollknob.css({ top : knob_top_px });
      $scrollbox.css({ top : top_px, bottom: - top_px }).show();
      $scrollknob.height( Math.floor( height_ratio * outer_ht ) ).show();
    }

    state_map.height_ratio  = height_ratio;
    state_map.max_scroll_px = max_scroll_px;
  };

  initModule = function ( $outer, $inner, option_map ) {
    var
      $styles, $scrollbox, $scrollknob, jquery_map, state_map, data_map;

    if ( $outer.length !== 1 ) { return false;}
    if ( $inner.length !== 1 ) { return false;}

    $styles = $( 'style#jq-tscroll' );
    if ( $styles.length < 1 ){
      $styles = $('<style id="jq-tscroll">').appendTo('head');
      $styles.text( configMap.style_css );
    }

    if ( $outer.hasClass( 'jq-tscroll' ) ) {
      $.removeData( $outer.find( '.jq-tscroll-knob'), 'tscroll' );
      $outer.find( '.jq-tscroll-box' ).remove();
    }

    $scrollbox  = $( configMap.bar_html );
    $scrollknob = $scrollbox.find( '.jq-tscroll-knob' );

    // set to left or right side as required
    if ( option_map && option_map.pos_key && option_map.pos_key === 'left' ) {
      $scrollbox.css( 'left', 0 );
    }
    else {
      $scrollbox.css( 'right', 0 );
    }

    $outer.append( $scrollbox );

    jquery_map = {
      $outer      : $outer,
      $inner      : $inner,
      $scrollbox  : $scrollbox,
      $scrollknob : $scrollknob
    };

    state_map = {
      height_ratio  : 0,
      max_scroll_px : 0
    };

    data_map = { jquery_map : jquery_map, state_map : state_map };

    resizeScrollbar( data_map );

    $scrollknob
      .bind( 'mousedown.tscroll',  onMousedown )
      .bind( 'udragstart.tscroll', onDragstart )
      .bind( 'udragmove.tscroll',  onDragmove  )
      .bind( 'udragend.tscroll',   onDragend   )
      .data( 'tscroll',            data_map    );

    $outer.bind( 'mousewheel', onMousewheel )
      .addClass( 'jq-tscroll' );

    // call this once to ensure the position of the scrollbar is correct
    // if there was scrolling already on this div
    onDragmove.call( $scrollknob, { px_delta_y : 0 });

    return true;
  };

  $.fn.tscroll = function ( inner_data, option_map ) {
    var $outer, inner_type, $inner, data_map;

    $outer = this;

    // Initialize if we have received arguments
    if ( inner_data ) {
      inner_type = typeof inner_data;
      $inner     = inner_type === 'string'
        ? $( inner_data ) : inner_data;

      initModule( $outer, $inner, option_map );
    }
    // Otherwise refresh the scrollbar size
    else {
      if ( $outer.hasClass( 'jq-tscroll' ) ) {
        data_map = $outer.find( '.jq-tscroll-knob' ).data( 'tscroll' );
        if ( data_map ) { resizeScrollbar( data_map ); }
      }
    }
    return $outer;
  };

}( jQuery ));

