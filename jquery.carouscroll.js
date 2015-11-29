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
 *     $collection.carouscroll.create(
 *       content_html : the_html, // optional
 *       label_list   : [         // optional
 *         'Summary', 'Health', 'Monitor', 'Contacts',
 *         'Interfaces', 'Software', 'Hardware', 'Config'
 *       ],
 *       head_ds_arg_map : {}  // optional dragscroll options carousel
 *       body_ds_arg_map : {}  // optional dragscroll options vertial
 *     });
 *
 *  If $collection contains many elements, CarouScroll.create will
 *  be applied to each member indivitually. Use caution here, gang.
 *
 * Change content (returns $collection):
 *
 *     $collection.carouscroll.changeContent(
 *       content_html : new_html,
 *       label_list   : [ 'Flopsy', 'Mopsy', 'CottonTail', 'Peter' ]
 *     );
 *
 * Remove carouscroll instances (empties containers):
 *
 *     $collection.carouscroll.remove();
 *
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
  var
    __blank = '',
    __0     = 0,
    __1     = 1,
    __true  = true,
    __false = false,
    configMap = {
      tmplt_html : __blank
      + '<div class="jqcsx">'
      + '<div class="jqcsx-_head_">'
      + '<div class="jqcsx-_head_main_">'
      + '<div>{_t0_str_}</div>'
      + '<div>{_t1_str_}</div>'
      + '<div>{_t2_str_}</div>'
      + '<div>{_t3_str_}</div>'
      + '<div>{_t5_str_}</div>'
      + '<div>{_t6_str_}</div>'
      + '</div>'
      + '<div class="jqcsx-_head_inc_l_"></div>'
      + '<div class="jqcsx-_head_inc_r_"></div>'
      + '</div>'
      + '<div class="jqcsx-_si_top_">&#xf141;</div>'
      + '<div class="jqcsx-_box_">{_scroll_html_}</div>'
      + '<div class="jqcsx-_si_btm_">&#xf141;</div>'
      + '</div>',

      style_css  : __blank
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
      + 'line-height:3rem;'
      + 'background-color:#ea9999;'
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
      + 'height:1rem;'
      + 'line-height:1rem;'
      + 'background:#888;'
      + 'color:#888;'
      + '}'

      + '.jqcsx-_si_top_ { top:3rem; }'
      + '.jqcsx-_si_btm_ { bottom:0; }'
      + '.jqcsx-_si_btm_.jqcsx-_x_active_,'
      + '.jqcsx-_si_top_.jqcsx-_x_active_ { color:#fff; }'
      + '.jqcsx-_box_ {'
      + 'position:absolute;'
      + 'top:4rem;'
      + 'bottom:1rem;'
      + 'left:0;'
      + 'right:0;'
      + 'overflow-x:hidden;'
      + 'overflow-y:auto;'
      + '}'

      + '.jqcsx-_box_ h1 {'
      + 'padding:0 2rem;'
      + 'margin:.5rem __0 .5rem 0;'
      + 'color:#600;'
      + '}'

      + '.jqcsx-_box_ h1.jqcsx-_x_select_ {'
      + 'color:#fff;'
      + 'background:#ea9999;'
      + '}'

      + '.jqcsx-_box_ p {'
      + 'padding:0 2rem;'
      + 'margin:.5rem __0 .5rem 0;'
      + '}'

      + '.jqcsx-_head_main_ > div {'
      + 'position:absolute;'
      + 'top:0;'
      + 'height:3rem;'
      + 'overflow:hidden;'
      + 'transition:all 0.5s ease;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t0,'
      + '.jqcsx-_head_main_ .jqcsx-x-t6 {'
      + 'width:20%;'
      + 'opacity:.1;'
      + 'font-weight:200;'
      + 'font-size:0.5rem;'
      + 'z-index:0;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t0 {'
      + 'left:0;'
      + 'text-align:left;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t6 {'
      + 'right:0;'
      + 'text-align:right;'
      + 'direction:rtl;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t1,'
      + '.jqcsx-_head_main_ .jqcsx-x-t5 {'
      + 'width:25%;'
      + 'opacity:.3;'
      + 'font-weight:200;'
      + 'font-size:1rem;'
      + 'color:#fff;'
      + 'z-index:1;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t1 {'
      + 'left:2%;'
      + 'text-align:left;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t5 {'
      + 'right:2%;'
      + 'text-align:right;'
      + 'direction:rtl;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t2,'
      + '.jqcsx-_head_main_ .jqcsx-x-t4 {'
      + 'width:25%;'
      + 'opacity:.4;'
      + 'font-weight:400;'
      + 'font-size:1.2rem;'
      + 'z-index:2;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t2 {'
      + 'left:8%;'
      + 'text-align:left;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t4 {'
      + 'right:8%;'
      + 'text-align:right;'
      + 'direction:rtl;'
      + '}'

      + '.jqcsx-_head_main_ .jqcsx-x-t3 {'
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

    makeJqueryMap,

    updateScrollIndicators,
    changeTitle,
    syncToScroll,

    changeContentOne,
    createOne,
    invokeWrapper
    ;
  // =================== END MODULE SCOPE VARIABLES ====================

  // ===================== BEGIN UTILITY METHODS =======================
  // ====================== END UTILITY METHODS ========================

  // ======================= BEGIN DOM METHODS =========================
  makeJqueryMap = function ( $one_div ) {
    var
      $main       = $one_div.find('.jqcsx' ),
      $scroll_box = $main.find( '.jqcsx-_box_' ),
      $head_main  = $main.find( '.jqcsx-_head_main_' )
      ;

    return {
      _$head_inc_l_      : $main.find( '.jqcsx-_head_inc_l_' ),
      _$head_inc_r_      : $main.find( '.jqcsx-_head_inc_r_' ),
      _$head_main_       : $head_main,
      _$head_title_list_ : $head_main.children( 'div' ),
      _$scroll_box_      : $scroll_box,
      _$si_btm_          : $main.find( '.jqcsx-_si_btm_' ),
      _$si_top_          : $main.find( '.jqcsx-_si_top_' )
    };
  };

  updateScrollIndicators = function ( state_map, scroll_num ) {
    var jquery_map = state_map._jquery_map_;

    jquery_map._$si_top_.toggleClass(
      'jqcsx-_x_active_',
      ( scroll_num >  state_map._scroll_min_num_ )
    );
    jquery_map._$si_btm_.toggleClass(
      'jqcsx-_x_active_',
      ( scroll_num <  state_map._scroll_max_num_ )
    );
  };

  changeTitle = function ( state_map, inc_int, do_skip_scroll ) {
    var
      jquery_map       = state_map._jquery_map_,

      $head_title_list = jquery_map._$head_title_list_,
      $sect_list       = jquery_map._$sect_list_,

      sect_top_list    = state_map._sect_top_list,
      title_count      = state_map._title_count_,
      title_offset_int = state_map._title_offset_int_,

      i, next_int, next_class_str,
      scroll_num, $sect,
      anim_ms;

    state_map._is_our_scroll_ = __true;

    // BEGIN _UPDATE_TITLE_
    for ( i = __0; i < title_count; i++ ) {

      // get next class string
      next_int = i + title_offset_int + inc_int;
      while ( next_int >= title_count ) { next_int -= title_count; }
      while ( next_int < __0 ) { next_int += title_count; }
      next_class_str = 'jqcsx-x-t' + String( next_int );

      // overwrite prior classes
      $head_title_list.eq( i ).prop( 'className', next_class_str );

      // Scroll to element on title
      if ( next_int === 3 ) {
        scroll_num = sect_top_list[ i ];
        $sect      = $sect_list.eq( i );
        $sect_list.removeClass( 'jqcsx-_x_select_' );
        $sect.addClass( 'jqcsx-_x_select_' );

        if ( ! do_skip_scroll ) {
          // Do not animate if first showing or not moving
          anim_ms = inc_int === __0 ? __0 : 500;
          state_map._is_our_scroll_ = __true;
          state_map._title_idx_ = i;

          jquery_map._$scroll_box_.animate( { scrollTop : scroll_num }, anim_ms );
          updateScrollIndicators( scroll_num );
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

    setTimeout( function () { state_map._is_our_scroll_ = __false; }, 500 );
  };
  // END changeTitle

  // BEGIN syncToScroll
  syncToScroll = function ( state_map ) {
    var
      jquery_map    = state_map._jquery_map_,
      sect_top_list = state_map._sect_top_list_,
      title_count   = state_map._title_count_,
      title_idx     = state_map._title_idx_,
      scroll_num    = jquery_map._$scroll_box_.scrollTop(),
      min_delta_num = 999999,

      pos_num, delta_num, prelim_idx, i;
    if ( state_map._is_our_scroll_ ) { return; }

    // find closest title position
    for ( i = __0; i < title_count; i++ ) {
      pos_num = sect_top_list[ i ];
      if ( pos_num === undefined ) { break; }

      delta_num = Math.abs( pos_num - scroll_num );
      if ( delta_num < min_delta_num ) {
        min_delta_num = delta_num;
        prelim_idx    = i;
      }
    }

    updateScrollIndicators( scroll_num );

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
  // BEGIN createOne
  changeContentOne = function ( $one_div, arg_map, state_map ) {
    var
      jquery_map = state_map._jquery_map_,

      $scroll_box      = jquery_map._$scroll_box_,
      $head_title_list = jquery_map._$head_title_list_,

      sect_top_list  = [],
      label_list     = arg_map.label_list || [],
      label_count    = label_list.length,

      $sect_list, i
      ;

    $scroll_box.html( arg_map.content_html );
    $sect_list = $scroll_box.children( 'h1' );

    $sect_list.each( function( idx /*, el*/ ) {
      var scrolltop_num = $sect_list.eq( idx ).offset().top
        - state_map._scroll_min_num_
        ;
      if ( scrolltop_num < __0 ) { scrolltop_num = __0; }
      sect_top_list.push( scrolltop_num );
    });

    // TODO: this only works with exactly 7 labels;
    // We must normalize.
    for ( i = __0; i < label_count; i++ ) {
      $head_title_list.eq( i ).html( label_list[ i ] );
    }

    // Update state map
    jquery_map._$sect_list_   = $sect_list;
    state_map._sect_top_list_ = sect_top_list;
  };

  createOne = function ( $one_div, arg_map, in_state_map ) {
    var
      state_map,  head_ht_px,
      jquery_map, $scroll_box, $head_main
      ;

    if ( $one_div.length !== __1 ) { return; }

    // TODO do something if in_state_map is defined
    state_map = {
      _jquery_map_       : {},
      _is_our_scroll_    : __false,
      _scroll_min_num_   : __0,
      _scroll_max_num_   : 9999,
      _sect_top_list_    : [],
      _title_count_      : __0,
      _title_idx_        : __0,
      _title_offset_int_ : __0
    };

    // populate content and cache jquery elements
    $one_div.html( configMap.tmplt_html );
    jquery_map = makeJqueryMap( $one_div );

    // update state
    state_map._jquery_map_  = jquery_map;
    state_map._title_count_ = jquery_map._$head_title_list_.length;

    // if content provided, add it
    if ( arg_map.content_list && arg_map.title_list ) {
      changeContentOne.call( state_map, $one_div, arg_map);
    }

    // local common-use vars
    $scroll_box = jquery_map._$scroll_box_;
    $head_main  = jquery_map._$head_main_;

    // calculate scrolltop offset
    head_ht_px = $head_main.height();

    state_map._scroll_min_num_ = head_ht_px;
    state_map._scroll_max_num_ = $scroll_box.prop('scrollHeight')
      - $scroll_box.height()
      - head_ht_px
      ;

    // changeTitle( state_map, __0 );

    state_map._on_dragstart_main_ = function ( event_obj ) {
      // TODO: Replace with jquery.event.dragscroll
      console.warn( 'start', event_obj );
    };
    state_map._on_dragmove_main_ = function ( event_obj ) {
      // TODO: Replace with jquery.event.dragscroll
      var delta_px = event_obj.px_start_x - event_obj.px_current_x;
      console.warn( delta_px );
    };
    state_map._on_dragend_main_ = function ( event_obj ) {
      // TODO: Replace with jquery.event.dragscroll
      console.warn( 'end', event_obj );
    };
    state_map._on_box_scroll_ = function ( /*event_obj*/ ) {
      // TODO: Throttle this
      syncToScroll( state_map );
    };

    state_map._on_tap_l_ = function ( /*event_obj*/ ) {
      // TODO: Replace with jquery.event.dragscroll
      changeTitle( state_map, 1 );
    };
    state_map._on_tap_r_ = function ( /*event_obj*/ ) {
      // TODO: Replace with jquery.event.dragscroll
      changeTitle( state_map, -1 );
    };

    jquery_map._$head_inc_l_.on( 'utap', state_map._on_tap_l_ );
    jquery_map._$head_inc_r_.on( 'utap', state_map._on_tap_r_ );
    jquery_map._$head_main_
      .on( 'udragstart', state_map._on_dragstart_main_ )
      .on( 'udragmove',  state_map._on_dragmove_main_  )
      .on( 'udragend',   state_map._on_dragend_main_   );

    jquery_map._$scroll_box_.on( 'scroll', state_map.on_box_scroll );
    $one_div.data( 'jqcsx-state-map',state_map );
  };
  // END createOne

  invokeWrapper = function ( $jqcsx_list, arg_map, invoke_fn ) {
    $jqcsx_list.each( function ( idx ) {
      var
        $one_div  = $jqcsx_list.eq( idx ),
        state_map = $one_div.data( 'jqcsx-state-map' );

      invoke_fn( $one_div, arg_map, state_map );
    });
  };

  $.fn.carascroll = function ( arg_map ) {
    var $jqcsx_list = this, invoke_fn;
    switch ( arg_map.action_str ) {
      case 'create' : invoke_fn = createOne; break;
      case 'changeContent' : invoke_fn = changeContentOne; break;
      default : invoke_fn = createOne; break;
    }
    invokeWrapper( $jqcsx_list, arg_map, invoke_fn );
    return $jqcsx_list;
  };
  // ======================= END PUBLIC METHODS ========================
}( jQuery ));

