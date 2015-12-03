/*
 * jquery.carouscroll.js
 *
 * Synchronized carousell and long scroll window.
 * An excellent interface for transversing large data sets
 * with ease on both Desktop and Touch devices.
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
 */

/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
*/
/*global jQuery*/

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
 * Create a new CarouScroll instance (returns $collection):
 *
 *     $collection.carouscroll({
 *       _action_str_   : '_create_',
 *       _content_html_ : the_html, // required
 *       // A label_list will be pulled from <h1> tags in content,
 *       // e.g. 'Summary', 'Health', 'Monitor', 'Contacts',
 *       //  'Interfaces', 'Software', 'Hardware', 'Config'
 *       _head_ds_arg_map_ : {}  // optional dragscroll options carousel
 *       _body_ds_arg_map_ : {}  // optional dragscroll options vertial
 *     });
 *
 *  If $collection contains many elements, CarouScroll.create will
 *  be applied to each member indivitually. Use caution here, gang.
 *
 * Change content (returns $collection):
 *
 *     $collection.carouscroll({
 *       _action_str_    : _change_,
 *       _content_html_  : new_html
 *       // label_list example: [ 'Flopsy', 'Mopsy', 'CottonTail', 'Peter' ]
 *     });
 *
 * Remove carouscroll instances (empties containers):
 *
 *     $collection.carouscroll({
 *       _action_str_ : '_remove_'
 *     });
 *
 * Please the carouscroll.html for a demonstration of use.
 *
 * Prerequisites
 * -------------
 * font-awesome 4.0.0+
 * jQuery 1.7+
 * jquery.event.gevent 1.0.0+
 * jquery.event.ue 1.1.0+
 * jquery.event.dragscroll+
 *
 * jquery.carouscroll should work in any modern browser (IE9+).
 * IE9 may require edge settings under <html><head> like so:
 *
 *       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 *
 * Implementation
 * --------------
 *
 * Error handling
 * --------------
 *
 * Like many jQuery plugins, CarouScroll does not throw exceptions.
 * Instead, it does its work quietly.
 *
 * Release Notes
 * -------------
 *
 * Copyright (c) 2015 Michael S. Mikowski
  *  (mike[dot]mikowski[at]gmail[dotcom])
 * Dual licensed under the MIT or GPL Version 2
 *
 * Version 0.1.0 - Initial development version; no public release
 *
*/

(function ( $ ) {
  'use strict';
  // ================== BEGIN MODULE SCOPE VARIABLES ===================
  //noinspection MagicNumberJS
  var
    __blank = '',
    __0     = 0,
    __1     = 1,
    __false = false,
    __true  = true,
    __undef = ( function () { return; }() ), // jslint hack for undef

    configMap = {
      _amin_scroll_ms_ : 200,

      _title_midpoint_idx_ : 3,
      _title_total_count_  : 7,
      _stop_velocity_num_  : 0.1,

      _tmplt_html_ : __blank
        + '<div class="jqcsx-_head_">'
        + '<div class="jqcsx-_head_main_"></div>'
        + '<div class="jqcsx-_head_inc_l_"></div>'
        + '<div class="jqcsx-_head_inc_r_"></div>'
        + '</div>'
        + '<div class="jqcsx-_si_top_">&#xf141;</div>'
        + '<div class="jqcsx-_box_"></div>'
        + '<div class="jqcsx-_si_btm_">&#xf141;</div>',

      _style_css_ : __blank
        + '.jqcsx, .jqcsx * {'
        + 'box-sizing:border-box;'
        + '-webkit-user-select:none;'
        + '-khtml-user-select:none;'
        + '-moz-user-select:-moz-none;'

        + '-o-user-select:none;'
        + 'user-select:none;'
        + '-webkit-user-drag:none;'
        + '-moz-user-drag:none;'
        + 'user-drag:none;'

        + '-webkit-touch-callout:none;'
        + '-webkit-tap-highlight-color:transparent;'
        + 'font:normal 16px Arial, Helvetica, sans-serif;'
        + '}'
        + '.jqscx input, .jqcsx textarea, .jqcsx .jqcsx-_x_uselect_ {'
        + '-webkit-user-select:text;'
        + '-khtml-user-select:text;'
        + '-moz-user-select:text;'
        + '-o-user-select:text;'
        + 'user-select:text;'
        + '}'

        + '.jqcsx-_head_ {'
        + 'position:absolute;'
        + 'top:0;'
        + 'left:0;'
        + 'right:0;'
        + 'height:3rem;'
        + 'color:#600;'
        + '}'

        + '.jqcsx-_head_main_,'
        + '.jqcsx-_head_inc_l_,'
        + '.jqcsx-_head_inc_r_ {'
        + 'position:absolute;'
        + 'top:0;'
        + 'bottom:0;'
        + '}'

        + '.jqcsx-_head_main_ {'
        + 'left:0.5rem;'
        + 'right:0.5rem;'
        + 'cursor:ew-resize;'
        + 'line-height:3rem;'
        + '}'

        + '.jqcsx-_head_inc_l_,'
        + '.jqcsx-_head_inc_r_ {'
        + 'width:1.5rem;'
        + 'font-size:1.5rem;'
        + 'text-align:center;'
        + 'cursor:pointer;'
        + '}'

        + '.jqcsx-_head_inc_l_ { left:0; }'
        + '.jqcsx-_head_inc_r_ { right:0; }'
        + '.jqcsx-_si_btm_,'
        + '.jqcsx-_si_top_ {'
        + 'position:absolute;'
        + 'left:0;'
        + 'right:0;'
        + 'text-align:center;'
        + 'height:.75rem;'
        + 'line-height:.75rem;'
        + 'font-family:FontAwesome;'
        + 'color:transparent;'
        + '}'

        + '.jqcsx-_si_top_ { top:3rem; }'
        + '.jqcsx-_si_btm_ { bottom:0; }'

        + '.jqcsx-_si_btm_.jqcsx-_x_active_,'
        + '.jqcsx-_si_top_.jqcsx-_x_active_ { color:#fff; }'

        + '.jqcsx-_box_ {'
        + 'position:absolute;'
        + 'top:3.75rem;'
        + 'bottom:.75rem;'
        + 'left:0;'
        + 'right:0;'
        + 'background:#fff;'
        + 'overflow-x:hidden;'
        + 'overflow-y:auto;'
        + '}'

        + '.jqcsx-_box_ h1 {'
        + 'font-size:1.75rem;'
        + 'padding:0 2rem;'
        + 'margin:.5rem 0 .5rem 0;'
        + 'color:#ea9999;'
        + 'font-weight:800;'
        + '}'

        + '.jqcsx-_box_ h1.jqcsx-_x_select_ {'
        + 'color:#844;'
        + '}'

        + '.jqcsx-_box_ p {'
        + 'padding:0 2rem;'
        + 'margin:.5rem 0 .5rem 0;'
        + '}'

        + '.jqcsx-_head_main_ > div {'
        + 'display:none;'
        + 'position:absolute;'
        + 'top:0;'
        + 'height:3rem;'
        + 'line-height:3.75rem;'
        + 'overflow:hidden;'
        + 'transition:all 0.2s ease;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t0,'
        + '.jqcsx-_head_main_ .jqcsx--t6 {'
        + 'display:block;'
        + 'width:20%;'
        + 'opacity:.1;'
        + 'font-weight:200;'
        + 'font-size:0.5rem;'
        + 'z-index:0;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t0 {'
        + 'left:0;'
        + 'text-align:left;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t6 {'
        + 'right:0;'
        + 'text-align:right;'
        + 'direction:rtl;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t1,'
        + '.jqcsx-_head_main_ .jqcsx--t5 {'
        + 'display:block;'
        + 'width:25%;'
        + 'opacity:.3;'
        + 'font-weight:200;'
        + 'font-size:1rem;'
        + 'color:#fff;'
        + 'z-index:1;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t1 {'
        + 'left:2%;'
        + 'text-align:left;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t5 {'
        + 'right:2%;'
        + 'text-align:right;'
        + 'direction:rtl;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t2,'
        + '.jqcsx-_head_main_ .jqcsx--t4 {'
        + 'display:block;'
        + 'width:25%;'
        + 'opacity:.4;'
        + 'font-weight:400;'
        + 'font-size:1.2rem;'
        + 'z-index:2;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t2 {'
        + 'left:8%;'
        + 'text-align:left;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t4 {'
        + 'right:8%;'
        + 'text-align:right;'
        + 'direction:rtl;'
        + '}'

        + '.jqcsx-_head_main_ .jqcsx--t3 {'
        + 'display:block;'
        + 'left:50%;'
        + 'margin-left:-30%;'
        + 'width:60%;'
        + 'opacity:1;'
        + 'font-weight:800;'
        + 'font-size:2.2rem;'
        + 'text-align:center;'
        + 'z-index:3;'
        + 'color:#fff;'
        + '}'
    },
    stateMap = { _do_init_ : __true },

    makeJqueryMap,

    updateScrollMarks,
    changeTitle,
    scrollTheBox,
    syncToScroll,

    addContent,
    createOne,
    invokeWrapper
    ;
  // =================== END MODULE SCOPE VARIABLES ====================

  // ===================== BEGIN UTILITY METHODS =======================
  // ====================== END UTILITY METHODS ========================

  // ======================= BEGIN DOM METHODS =========================
  makeJqueryMap = function ( $one_div ) {
    var
      $scroll_box = $one_div.find( '.jqcsx-_box_' ),
      $head_main  = $one_div.find( '.jqcsx-_head_main_' )
      ;

    return {
      _$head_inc_l_ : $one_div.find( '.jqcsx-_head_inc_l_' ),
      _$head_inc_r_ : $one_div.find( '.jqcsx-_head_inc_r_' ),
      _$head_main_  : $head_main,
      _$scroll_box_ : $scroll_box,
      _$si_btm_     : $one_div.find( '.jqcsx-_si_btm_' ),
      _$si_top_     : $one_div.find( '.jqcsx-_si_top_' )
    };
  };

  updateScrollMarks = function ( state_map, scroll_num ) {
    var jquery_map = state_map._jquery_map_;

    jquery_map._$si_top_.toggleClass(
      'jqcsx-_x_active_',
      ( scroll_num >  state_map._min_scrollnum_ )
    );
    jquery_map._$si_btm_.toggleClass(
      'jqcsx-_x_active_',
      ( scroll_num <  state_map._max_scrollnum_ )
    );
  };

  // BEGIN DOM method /changeTitle/
  changeTitle = function ( state_map, inc_int, do_skip_scroll ) {
    var
      jquery_map  = state_map._jquery_map_,

      $title_list = jquery_map._$title_list_,
      $h1_list    = jquery_map._$h1_list_,

      scrollto_list    = state_map._scrollto_list_,
      title_count      = state_map._title_count_,
      h1_count         = state_map._h1_count_,
      title_offset_int = state_map._title_offset_int_,

      i, next_int, next_class_str,
      scroll_num, $h1, h1_idx, anim_ms;

    // BEGIN _UPDATE_TITLE_
    for ( i = __0; i < title_count; i++ ) {
      // get next class string
      next_int = i + title_offset_int + inc_int;
      while ( next_int >= title_count ) { next_int -= title_count; }
      while ( next_int < __0 ) { next_int += title_count; }
      next_class_str = 'jqcsx--t' + String( next_int );

      // overwrite prior classes
      $title_list.eq( i ).prop( 'className', next_class_str );

      // Scroll to element on title
      if ( next_int === configMap._title_midpoint_idx_ ) {
        scroll_num = scrollto_list[ i ];

        h1_idx = i;
        while( h1_idx >= h1_count ) { h1_idx -= h1_count; }

        $h1 = $h1_list.eq( h1_idx );
        $h1_list.removeClass( 'jqcsx-_x_select_' );
        $h1.addClass( 'jqcsx-_x_select_' );

        if ( ! do_skip_scroll ) {
          // Do not animate if first showing or not moving
          anim_ms = inc_int === __0 ? __0 : configMap._anim_scroll_ms_;
          state_map._is_our_scroll_ = __true;
          state_map._title_idx_ = i;

          scrollTheBox( state_map, scroll_num, anim_ms );
        }
      }
    }
    // END _UPDATE_TITLE_

    // Increment offset for next round
    title_offset_int += inc_int;
    while ( title_offset_int >= title_count ) {
      title_offset_int -= title_count;
    }
    while ( title_offset_int < __0 ) { title_offset_int += title_count; }
    state_map._title_offset_int_ = title_offset_int;
  };
  // END DOM method /changeTitle/

  // BEGIN DOM method /scrollTheBox/
  scrollTheBox = function ( state_map, scroll_num, anim_ms ) {
    var $scroll_box = state_map._jquery_map_._$scroll_box_;

    state_map._is_our_scroll_ = __true;
    $scroll_box.animate(
      { scrollTop : scroll_num },
      anim_ms,
      function () {
        // Remove the "_is_our_scroll_" flag after our scrollTo has completed
        state_map._is_our_scroll_ = __false;
        updateScrollMarks( state_map, scroll_num );
      }
    );
  };
  // END COM method /scrollTheBox/

  // BEGIN syncToScroll
  syncToScroll = function ( state_map ) {
    var
      jquery_map    = state_map._jquery_map_,
      scrollto_list = state_map._scrollto_list_,
      h1_count      = state_map._h1_count_,
      title_idx     = state_map._title_idx_,
      scroll_num    = jquery_map._$scroll_box_.scrollTop(),
      min_delta_num = 999999,

      pos_num, delta_num, prelim_idx, i;
    if ( state_map._is_our_scroll_ ) { return; }

    // find closest title position
    for ( i = __0; i < h1_count; i++ ) {
      pos_num = scrollto_list[ i ];
      if ( pos_num === __undef ) { break; }

      delta_num = Math.abs( pos_num - scroll_num );
      if ( delta_num < min_delta_num ) {
        min_delta_num = delta_num;
        prelim_idx    = i;
      }
    }
    updateScrollMarks( state_map, scroll_num );

    // do not do anything if no change
    if ( prelim_idx === title_idx ) { return; }

    // update title, WITHOUT scroll-to
    state_map._title_idx_ = prelim_idx;
    changeTitle( state_map, title_idx - prelim_idx, __true );
  };
  // END syncToScroll

  // ======================== END DOM METHODS ==========================

  // ====================== BEGIN EVENT HANDLERS =======================
  // ======================= END EVENT HANDLERS ========================

  // ====================== BEGIN PUBLIC METHODS =======================
  // changeOne = function ( $one_div, arg_map, state_map ) {
  // BEGIN addContent
  addContent = function ( arg_map ) {
    var
      jquery_map, content_html, label_list,

      $scroll_box, $h1_list, h1_count, $h1, h1_ht_num, i,

      scrollto_list, vert_offset_num, scrolltop_num,

      label_str, scroll_ht_num, box_ht_num, end_sect_ht_num,
      delta_ht_num, max_scroll_num, min_scroll_num,

      norm_title_count,   norm_label_list,
      norm_scrollto_list, title_count,

      title_html_list, title_html, $title_list
      ;

    jquery_map   = arg_map._jquery_map_;
    content_html = arg_map._content_html_;

    if ( ! ( jquery_map && content_html ) ) { return false; }

    // Fill the scroll box and get the h1 tags
    $scroll_box = jquery_map._$scroll_box_;
    $scroll_box.html( content_html );

    // Loop through all h1 tags
    $h1_list = $scroll_box.children( 'h1' );
    h1_count = $h1_list.length;
    label_list    = [];
    scrollto_list = [];
    for ( i = __0; i < h1_count; i++ ) {
      $h1 = $h1_list.eq( i );

      // Build label list
      label_str = $h1.text();
      label_list.push( label_str );

      // Build scroll-top list for h1 tags.
      //   Use the offset().top of the first h1 as our baseline y=0
      if ( i === __0 ) {
        vert_offset_num = $h1.offset().top;
        h1_ht_num       = $h1.height();
      }
      scrolltop_num = $h1.offset().top - vert_offset_num;
      scrollto_list.push( scrolltop_num );
    }

    // Adjust spacer div at end to allow last title to reach top
    scroll_ht_num    = $scroll_box.prop( 'scrollHeight' );
    box_ht_num       = $scroll_box.height();
    end_sect_ht_num  = scroll_ht_num - scrollto_list[ h1_count - __1 ];
    delta_ht_num     = box_ht_num - end_sect_ht_num;

    if (  delta_ht_num > __0 ) {
      $scroll_box.css( { 'padding-bottom' : delta_ht_num } );
      scroll_ht_num += delta_ht_num;
    }
    else {
      $scroll_box.css( { 'padding-bottom' : h1_ht_num } );
    }

    min_scroll_num = h1_ht_num;
    max_scroll_num = scroll_ht_num - box_ht_num;

    // Normalize label list and scrollto_list to have at least 7 elements
    norm_title_count   = __0;
    norm_label_list    = [];
    norm_scrollto_list = [];
    while ( norm_title_count < configMap._title_total_count_ ) {
      norm_label_list     = norm_label_list.concat( label_list );
      norm_scrollto_list  = norm_scrollto_list.concat( scrollto_list );
      norm_title_count    = norm_label_list.length;
    }
    label_list    = norm_label_list;
    scrollto_list = norm_scrollto_list;
    title_count   = norm_title_count;

    // Populate titles. Those greater than 6 are hidden
    title_html_list = [];
    for ( i = __0; i < title_count; i++ ) {
      title_html_list.push( '<div>' + label_list[ i ] + '</div>' );
    }
    title_html = title_html_list.join( __blank );

    jquery_map._$head_main_.html( title_html );
    $title_list = jquery_map._$head_main_.children( 'div' );
    title_count = $title_list.length;

    // Update state map
    return {
      _$h1_list_        : $h1_list,
      _label_list_      : label_list,
      _h1_count_        : h1_count,

      _max_scrollnum_   : max_scroll_num,
      _min_scrollnum_   : min_scroll_num,

      _scrollto_list_   : scrollto_list,

      _$title_list_     : $title_list,
      _title_count_     : title_count
    };
  };
  // END addContent

  // BEGIN createOne
  createOne = function ( $one_div, arg_map, in_state_map ) {
    var state_map, jquery_map, content_map, box_drag_obj;

    // Arg check
    if ( $one_div.length !== __1 ) { return; }
    if ( ! arg_map._content_html_ ) {
      console.error( '_content_html_is_required_' );
      return;
    }

    // populate content and cache jquery elements
    $one_div.addClass( 'jqcsx' ).html( configMap._tmplt_html_ );
    jquery_map = makeJqueryMap( $one_div );

    // Add content and set title
    content_map = addContent({
      _jquery_map_   : jquery_map,
      _content_html_ : arg_map._content_html_ || __blank
    });

    // Remove previous carouscroll if present
    if ( in_state_map ) {
      $one_div.data( 'jqcsx-state-map', __undef );
    }

    // Begin create instance
    jquery_map._$h1_list_    = content_map._$h1_list_;
    jquery_map._$title_list_ = content_map._$title_list_;
    state_map = {
      _jquery_map_       : jquery_map,
      _scrollto_list_    : content_map._scrollto_list_,
      _is_our_scroll_    : __false,
      _$h1_list_         : content_map._$h1_list_,
      _h1_count_         : content_map._h1_count_,

      _label_list_       : content_map._label_list_,
      _title_count_      : content_map._title_count_,
      _title_idx_        : __0,
      _title_offset_int_ : __0,

      _max_scrollnum_    : content_map._max_scrollnum_,
      _min_scrollnum_    : content_map._min_scrollnum_,

      _box_drag_obj_ : __undef,
      _on_dragstart_box_  : __undef,
      _on_dragmove_box_   : __undef,
      _on_dragend_box_    : __undef
    };
    // End create instance

    // Initialize title
    changeTitle( state_map, __0 );

    // Configure handlers
    box_drag_obj = $.makeDragScrollObj({
      _$scroll_box_ : jquery_map._$scroll_box_,
      // TODO: use settings from constructor
      // _head_ds_arg_map_ and _body_ds_arg_map_
      _prop_mode_key_ : '_stop_now_'
    });

    state_map._box_drag_obj_      = box_drag_obj;
    state_map._on_dragstart_box_  = box_drag_obj._onstartHandler_;
    state_map._on_dragmove_box_   = box_drag_obj._onmoveHandler_;
    state_map._on_dragend_box_    = box_drag_obj._onendHandler_;

    state_map._on_tap_l_ = function ( /*event_obj*/ ) {
      changeTitle( state_map, 1 );
      return __false;
    };
    state_map._on_tap_r_ = function ( /*event_obj*/ ) {
      changeTitle( state_map, -1 );
      return __false;
    };
    state_map._on_scroll_box = function ( /*event_obj*/ ) {
      // TODO: consider throttling; currently ~40ms per event
      syncToScroll( state_map );
    };
    state_map._on_tap_box_ = function ( /*event_obj */ ) {
      var vxvy_list = box_drag_obj._getVxVyList_();
      box_drag_obj._stopScroll_();
      // If we are moving slow enough, let the click bubble
      if (
        vxvy_list[__0 ] + vxvy_list[__1] < configMap._stop_velocity_num_
      ) { return __false; }
      // Do stuff here
      return __false;
    };

    // Bind handlers
    jquery_map._$head_inc_l_.on( 'utap', state_map._on_tap_l_ );
    jquery_map._$head_inc_r_.on( 'utap', state_map._on_tap_r_ );
    jquery_map._$scroll_box_
      .on( 'udragstart', state_map._on_dragstart_box_ )
      .on( 'udragmove',  state_map._on_dragmove_box_  )
      .on( 'udragend',   state_map._on_dragend_box_   )
      .on( 'utap',       state_map._on_tap_box_       )
      .on( 'scroll',     state_map._on_scroll_box     );

    // Save state with DOM element
    $one_div.data( 'jqcsx-state-map',state_map );
  };
  // END createOne

  // BEGIN invokeWrapper
  // Invokes a function for each DOM element in a collection
  // with a standard set of arguments.
  //
  invokeWrapper = function ( $jqcsx_list, arg_map, invoke_fn ) {
    $jqcsx_list.each( function ( idx ) {
      var
        $one_div  = $jqcsx_list.eq( idx ),
        state_map = $one_div.data( 'jqcsx-state-map' );

      invoke_fn( $one_div, arg_map, state_map );
    });
  };
  // END invokeWrapper

  $.fn.carouscroll = function ( arg_map ) {
    var $jqcsx_list = this, $stylesheet, invoke_fn;
    if ( stateMap._do_init_ ) {
      $stylesheet = $( 'style#jqscx' );
      if ( $stylesheet.length < 1 ) {
        $stylesheet = $( '<style id="jqcsx">' );
        $stylesheet.text( configMap._style_css_ ).appendTo( 'head' );
      }
      stateMap._do_init_ = __false;
    }

    // Dispatch by action
    switch ( arg_map._action_str_ ) {
      case '_create_' : invoke_fn = createOne; break;
      case '_change_' : invoke_fn = null; break;
      default         : invoke_fn = createOne; break;
    }
    if ( invoke_fn ) {
      invokeWrapper( $jqcsx_list, arg_map, invoke_fn );
    }
    return $jqcsx_list;
  };
  // ======================= END PUBLIC METHODS ========================
}( jQuery ));

