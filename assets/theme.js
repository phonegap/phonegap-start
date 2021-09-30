window.theme = window.theme || {};
window.slate = window.slate || {};

/* ================ SLATE ================ */
theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
  wrapTable: function() {
    $('.rte table').wrap('<div class="rte__table-wrapper"></div>');
  },

  iframeReset: function() {
    var $iframeVideo = $(
      '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]'
    );
    var $iframeReset = $iframeVideo.add('.rte iframe#admin_bar_iframe');

    $iframeVideo.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="video-wrapper"></div>');
    });

    $iframeReset.each(function() {
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element
      .first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element
        .first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on(
      'click',
      function(evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this)
    );
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (
        options.$container[0] !== evt.target &&
        !options.$container.has(evt.target).length
      ) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function() {
  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    src = src || '';

    var match = src.match(
      /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
    );

    if (match === null) {
      return null;
    } else {
      return match[1];
    }
  }

  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(
      /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on(
      'change',
      this._onSelectChange.bind(this)
    );
  }

  Variants.prototype = _.assignIn({}, Variants.prototype, {
    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = _.map(
        $(this.singleOptionSelector, this.$container),
        function(element) {
          var $element = $(element);
          var type = $element.attr('type');
          var currentOption = {};

          if (type === 'radio' || type === 'checkbox') {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data('index');

              return currentOption;
            } else {
              return false;
            }
          } else {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          }
        }
      );

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = _.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;

      var found = _.find(variants, function(variant) {
        return selectedValues.every(function(values) {
          return _.isEqual(variant[values.index], values.value);
        });
      });

      return found;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (
        !variant.featured_image ||
        variantImage.src === currentVariantImage.src
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (
        variant.price === this.currentVariant.price &&
        variant.compare_at_price === this.currentVariant.compare_at_price
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function(variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: 'variantSKUChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?variant=' +
        variant.id;
      window.history.replaceState({ path: newurl }, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container).val(variant.id);
    }
  });

  return Variants;
})();


/*================ MODULES ================*/
window.Drawers = (function() {
  var Drawer = function(id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.nodes = {
      $parent: $('body, html'),
      $page: $('.page-element'),
      $moved: $('.is-moved-by-drawer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);
    this.$open = $(this.config.open);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  };

  Drawer.prototype.init = function() {
    this.$open.attr('aria-expanded', 'false');
    this.$open.on('click', $.proxy(this.open, this));
    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
  };

  Drawer.prototype.open = function(evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // don't open an opened drawer
    if (this.drawerIsOpen) {
      return;
    }

    this.$open.addClass(this.config.openClass);

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.nodes.$moved.addClass('is-transitioning');
    this.$drawer.prepareTransition();

    this.nodes.$parent.addClass(
      this.config.openClass + ' ' + this.config.dirOpenClass
    );
    this.drawerIsOpen = true;

    // Set focus on drawer
    slate.a11y.trapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (
      this.config.onDrawerOpen &&
      typeof this.config.onDrawerOpen === 'function'
    ) {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();
  };

  Drawer.prototype.close = function() {
    // don't close a closed drawer
    if (!this.drawerIsOpen) {
      return;
    }

    this.$open.removeClass(this.config.openClass);

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.nodes.$moved.prepareTransition({ disableExisting: true });
    this.$drawer.prepareTransition({ disableExisting: true });

    this.nodes.$parent.removeClass(
      this.config.dirOpenClass + ' ' + this.config.openClass
    );

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'false');
    }

    this.unbindEvents();
  };

  Drawer.prototype.bindEvents = function() {
    // Lock scrolling on mobile
    this.nodes.$page.on('touchmove.drawer', function() {
      return false;
    });

    // Clicking out of drawer closes it
    this.nodes.$page.on(
      'click.drawer',
      $.proxy(function() {
        this.close();
        return false;
      }, this)
    );

    // Pressing escape closes drawer
    this.nodes.$parent.on(
      'keyup.drawer',
      $.proxy(function(evt) {
        if (evt.keyCode === 27) {
          this.close();
        }
      }, this)
    );
  };

  Drawer.prototype.unbindEvents = function() {
    this.nodes.$page.off('.drawer');
    this.nodes.$parent.off('.drawer');
  };

  return Drawer;
})();

theme.Hero = (function() {
  var selectors = {
    hero: '.hero',
    heroWrapper: '.hero-wrapper',
    heroContent: '.hero-content',
    heroTitle: '.hero-content__title',
    heroPause: '.hero__pause',
    heroAdapt: '.hero--adapt',
    heroControlsArrow: '.hero-content__controls-item--arrow',
    heroControlsCount: '.hero-content__controls-item--count',
    heroControlsText: '.hero-content__controls-item--text'
  };

  var classes = {
    heroContentActive: 'hero-content-active',
    heroTitleActive: 'hero-title-active',
    heroLinkActive: 'hero-link-active',
    isPaused: 'is-paused'
  };

  function Hero(sectionId) {
    this.namespace = '.hero';
    this.$hero = $(sectionId);
    this.$wrapper = this.$hero.closest(selectors.heroWrapper);
    this.$heroContent = this.$wrapper.find(selectors.heroContent);
    this.$heroPause = this.$wrapper.find(selectors.heroPause);
    this.$heroControlsArrow = this.$wrapper.find(selectors.heroControlsArrow);
    this.$heroAdapt = this.$wrapper.find(selectors.heroAdapt);

    this.$hero.on('init' + this.namespace, this._a11y.bind(this));
    this.$hero.on('init' + this.namespace, this._arrowsInit.bind(this));
    this.$hero.on(
      'init reInit afterChange' + this.namespace,
      this._countSlide.bind(this)
    );
    this.$hero.on(
      'init reInit afterChange' + this.namespace,
      this._showActiveContent.bind(this)
    );
    this.$hero.on(
      'init reInit afterChange' + this.namespace,
      this._showContent.bind(this)
    );
    this.$hero.on(
      'beforeChange' + this.namespace,
      this._hideContent.bind(this)
    );

    var adaptHeight = this.$hero.data('adapt-height');

    this.$hero.slick({
      accessibility: true,
      arrows: false, // this theme has custom arrows
      draggable: false,
      autoplay: this.$hero.data('autoplay'),
      autoplaySpeed: this.$hero.data('speed')
    });

    if (adaptHeight) {
      this._setSlideshowHeight();
      $(window).resize($.debounce(50, this._setSlideshowHeight.bind(this)));
    }

    this.$heroPause.on('click' + this.namespace, this._togglePause.bind(this));
  }

  Hero.prototype = _.assignIn({}, Hero.prototype, {
    _setSlideshowHeight: function() {
      var minAspectRatio = this.$hero.data('min-aspect-ratio');
      this.$hero.height(this.$heroAdapt.width() / minAspectRatio);
    },

    _countSlide: function(event, slick, currentSlide) {
      // currentSlide is undefined on init,
      // set it to 0 in this case (currentSlide is 0 based)
      var activeSlide = (currentSlide ? currentSlide : 0) + 1;
      var $heroControlsCount = this.$wrapper.find(selectors.heroControlsCount);

      if (slick.slideCount > 1) {
        $heroControlsCount.attr(
          'aria-label',
          theme.strings.slideNumber.replace('[slide_number]', activeSlide)
        );
        $heroControlsCount
          .children('.slide-counter')
          .text(activeSlide + '/' + slick.slideCount);
      }
    },

    _showActiveContent: function(event, slick, currentSlide) {
      // currentSlide is undefined on init,
      // set it to 0 in this case (currentSlide is 0 based)
      // eslint-disable-next-line
      var currentSlide = currentSlide || 0;
      var $heroControlsText = this.$wrapper.find(selectors.heroControlsText);
      var $heroTitle = this.$wrapper.find(selectors.heroTitle);

      if (slick.slideCount > 1) {
        var $currentTitle = $heroTitle.filter(
            '[data-slide-id="' + (currentSlide + 1) + '"]'
          ),
          $currentLink = $heroControlsText.filter(
            '[data-slide-id="' + (currentSlide + 1) + '"]'
          );

        $heroTitle.removeClass(classes.heroTitleActive);
        $currentTitle.addClass(classes.heroTitleActive);
        $heroControlsText.removeClass(classes.heroLinkActive);
        $currentLink.addClass(classes.heroLinkActive);
      }
    },

    _hideContent: function() {
      this.$heroContent.removeClass(classes.heroContentActive);
    },

    _showContent: function() {
      this.$heroContent.addClass(classes.heroContentActive);
    },

    _togglePause: function() {
      if (this.$heroPause.hasClass(classes.isPaused)) {
        var labelPause = this.$heroPause.data('label-pause');
        this.$heroPause.removeClass(classes.isPaused).attr({
          'aria-pressed': 'false',
          'aria-label': labelPause
        });
        this.play();
      } else {
        var labelPlay = this.$heroPause.data('label-play');
        this.$heroPause.addClass(classes.isPaused).attr({
          'aria-pressed': 'true',
          'aria-label': labelPlay
        });
        this.pause();
      }
    },

    _a11y: function(event, obj) {
      var $list = obj.$list;
      var $heroWrapper = $(event.currentTarget).parents(selectors.heroWrapper);
      var autoplay = this.$hero.data('autoplay');

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');
      this.$heroContent.removeAttr('aria-live');

      // When an element in the slider is focused
      // pause slideshow and set aria-live
      $heroWrapper
        .on(
          'focusin' + this.namespace,
          function(evt) {
            if (!$heroWrapper.has(evt.target).length) {
              return;
            }

            this.$heroContent.attr('aria-live', 'polite');
            if (autoplay) {
              this.pause();
            }
          }.bind(this)
        )
        .on(
          // Resume autoplay
          'focusout' + this.namespace,
          function(evt) {
            if ($heroWrapper.has(evt.relatedTarget).length) {
              return;
            }

            this.$heroContent.removeAttr('aria-live');

            if (autoplay && !this.$heroPause.hasClass(classes.isPaused)) {
              // Only resume playing if the user hasn't paused using the pause
              // button
              this.play();
            }
          }.bind(this)
        )
        .on('keyup', this._keyboardNavigation.bind(this));
    },

    _arrowsInit: function(event, obj) {
      // Slider is initialized. Setup custom arrows
      var count = obj.slideCount;
      var $slider = obj.$slider;
      var $arrows = this.$heroControlsArrow;

      if ($arrows.length && count > 1) {
        $arrows.on(
          'click' + this.namespace,
          function(evt) {
            evt.preventDefault();
            var $arrowButton = $(evt.currentTarget).find('button');
            var arrowButtonControl = $arrowButton.data('control');
            if (arrowButtonControl === 'previous') {
              $slider.slick('slickPrev');
            } else if (arrowButtonControl === 'next') {
              $slider.slick('slickNext');
            }
            this._scrollTop();
          }.bind(this)
        );
      } else {
        $arrows.remove();
      }
    },

    _scrollTop: function() {
      var currentScroll = $(document).scrollTop();
      var heroOffset = this.$hero.offset().top;

      if (currentScroll > heroOffset) {
        $('html')
          .add('body')
          .animate(
            {
              scrollTop: heroOffset
            },
            250
          );
      }
    },

    _keyboardNavigation: function(event) {
      if (event.keyCode === 37) {
        this.$hero.slick('slickPrev');
      }
      if (event.keyCode === 39) {
        this.$hero.slick('slickNext');
      }
    },

    goToSlide: function(slideIndex) {
      this.$hero.slick('slickGoTo', slideIndex);
    },

    pause: function() {
      if (!this.$hero.data('autoplay')) return;
      this.$hero.slick('slickPause');
    },

    play: function() {
      if (!this.$hero.data('autoplay')) return;
      this.$hero.slick('slickPlay');
    },

    destroy: function() {
      this.$hero.off(this.namespace);
      this.$heroContent.off(this.namespace);
      this.$heroPause.off(this.namespace);
      this.$wrapper.off(this.namespace);
      this.$heroControlsArrow.off(this.namespace);
      this.$heroAdapt.off(this.namespace);

      this.$hero.slick('unslick');
    }
  });

  return Hero;
})();

window.Modals = (function() {
  var Modal = function(id, name, options) {
    var defaults = {
      close: '.js-modal-close',
      open: '.js-modal-open-' + name,
      openClass: 'modal--is-active'
    };

    this.$modal = $('#' + id);

    if (!this.$modal.length) {
      return false;
    }

    this.nodes = {
      $body: $('body')
    };

    this.config = $.extend(defaults, options);

    this.modalIsOpen = false;
    this.$focusOnOpen = this.config.focusOnOpen
      ? $(this.config.focusOnOpen)
      : this.$modal;
    this.init();
  };

  Modal.prototype.init = function() {
    var $openBtn = $(this.config.open);

    // Add aria controls
    $openBtn.attr('aria-expanded', 'false');

    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$modal.find(this.config.close).on('click', $.proxy(this.close, this));
  };

  Modal.prototype.open = function(evt) {
    // Keep track if modal was opened from a click, or called by another function
    var externalCall = false;

    // don't open an opened modal
    if (this.modalIsOpen) {
      return;
    }

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the modal opens, the click event bubbles up to $nodes.page
    // which closes the modal.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.modalIsOpen && !externalCall) {
      return this.close();
    }

    this.$modal.prepareTransition().addClass(this.config.openClass);
    this.nodes.$body.addClass(this.config.openClass);

    this.modalIsOpen = true;

    // Set focus on modal
    slate.a11y.trapFocus({
      $container: this.$modal,
      namespace: 'modal_focus',
      $elementToFocus: this.$focusOnOpen
    });

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();
  };

  Modal.prototype.close = function() {
    // don't close a closed modal
    if (!this.modalIsOpen) {
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    this.$modal.prepareTransition().removeClass(this.config.openClass);
    this.nodes.$body.removeClass(this.config.openClass);

    this.modalIsOpen = false;

    // Remove focus on modal
    slate.a11y.removeTrapFocus({
      $container: this.$modal,
      namespace: 'modal_focus'
    });

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'false').focus();
    }

    this.unbindEvents();
  };

  Modal.prototype.bindEvents = function() {
    // Pressing escape closes modal
    this.nodes.$body.on(
      'keyup.modal',
      $.proxy(function(evt) {
        if (evt.keyCode === 27) {
          this.close();
        }
      }, this)
    );
  };

  Modal.prototype.unbindEvents = function() {
    this.nodes.$body.off('.modal');
  };

  return Modal;
})();

window.Meganav = (function() {
  var Meganav = function(options) {
    this.cache = {
      $document: $(document),
      $page: $('.page-element')
    };

    var defaults = {
      $meganavs: $('.meganav'),
      $megaNav: $('.meganav__nav'),
      $meganavToggle: $('.meganav-toggle'),
      $meganavDropdownContainers: $('.site-nav__dropdown-container'),
      $meganavToggleThirdLevel: $('.meganav__link-toggle'),
      $meganavLinkSecondLevel: $('.meganav__link--second-level'),
      $meganavLinkThirdLevel: $('.meganav__link--third-level'),
      $meganavDropdownThirdLevel: $('.site-nav__dropdown--third-level'),
      isOpen: false,
      preventDuplicates: false,
      closeOnPageClick: false,
      closeThirdLevelOnBlur: false,
      activeClass: 'meganav--active',
      drawerClass: 'meganav--drawer',
      meganavDropdown: '.site-nav__dropdown',
      meganavLinkClass: 'meganav__link',
      drawerToggleClass: 'drawer__nav-toggle-btn',
      drawerNavItem: '.drawer__nav-item',
      navCollectionClass: 'meganav__nav--collection',
      secondLevelClass: 'meganav__link--second-level',
      thirdLevelClass: 'meganav__link-toggle',
      thirdLevelContainerClass: 'site-nav__dropdown--third-level',
      noAnimationClass: 'meganav--no-animation'
    };

    this.config = $.extend(defaults, options);
    this.init();
  };

  Meganav.prototype.init = function() {
    var $openBtn = this.config.$meganavToggle;

    $openBtn.on('click', $.proxy(this.requestMeganav, this));

    if (this.config.closeThirdLevelOnBlur) {
      this.config.$meganavLinkThirdLevel.on(
        'blur',
        $.proxy(this.closeThirdLevelMenu, this)
      );
    }
  };

  Meganav.prototype.requestMeganav = function(evt) {
    var $targetedMeganav;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    }

    // Without this, the meganav opens, the click event bubbles up to
    // theme.cache.$page which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
    }

    var $el = $(evt.currentTarget);
    var anotherNavIsOpen = this.config.isOpen;
    var isThirdLevelBtn = $el.hasClass(this.config.thirdLevelClass);

    // The $targetedMeganav is different for the drawer and non-drawer navs
    if ($el.hasClass(this.config.drawerToggleClass)) {
      $targetedMeganav = $el
        .closest(this.config.drawerNavItem)
        .children('.' + this.config.drawerClass);
    } else {
      $targetedMeganav = $el.siblings(this.config.meganavDropdown);
    }

    // Navigate to link href or close menu if already active
    if ($el.hasClass(this.config.activeClass) && $el.is('a')) {
      window.location = $el.attr('href');
      return;
    }

    // If true, don't let multiple meganavs be open simultaneously
    if (!isThirdLevelBtn && this.config.preventDuplicates) {
      this.close();
    }

    if ($targetedMeganav.hasClass(this.config.drawerClass)) {
      var isExpanded = $el.attr('aria-expanded') === 'true';

      $el
        .toggleClass(this.config.activeClass)
        .attr('aria-expanded', !isExpanded);

      $targetedMeganav.stop().slideToggle(200);
    } else {
      $el.addClass(this.config.activeClass).attr('aria-expanded', 'true');

      // Show targeted nav, letting it know whether another meganav is already open
      this.open($el, $targetedMeganav, anotherNavIsOpen);
    }

    // Setup event handlers when meganav is open
    this.bindEvents();
    this.config.isOpen = true;

    // If dropdown has third level, calculate width for container
    var $dropdown = $el.next();
    var isCollection = $dropdown
      .find(this.config.$megaNav)
      .hasClass(this.config.navCollectionClass);

    if (isCollection) {
      this.updateThirdLevelContainerWidth($el, $dropdown);
    }
  };

  Meganav.prototype.updateThirdLevelContainerWidth = function($el, $dropdown) {
    var $thirdLevel = $dropdown.find(this.config.$meganavDropdownThirdLevel);

    if (!$thirdLevel.length) {
      return;
    }

    $.each(
      $thirdLevel,
      function(key, container) {
        var $container = $(container);
        var $lastChild = $container.find('li:last-child');

        this.updateContainerWidth($container, $lastChild);
      }.bind(this)
    );
  };

  Meganav.prototype.updateContainerWidth = function(container, element) {
    var containerRect = container[0].getBoundingClientRect();
    var elementRect = element[0].getBoundingClientRect();

    if (elementRect.left < containerRect.right) {
      return;
    }

    var columnWidth = containerRect.width;
    var containerFixedWidth =
      elementRect.left + columnWidth - containerRect.left;
    var numberOfColumns = containerFixedWidth / columnWidth;
    var containerPercentageWidth = numberOfColumns * 20;

    container
      .width(containerPercentageWidth + '%')
      .find('li')
      .css('width', 100 / numberOfColumns + '%');
  };

  Meganav.prototype.open = function($el, $target, noAnimation) {
    var isThirdLevelBtn = $el.hasClass(this.config.thirdLevelClass);

    $target.addClass(this.config.activeClass);

    if (isThirdLevelBtn) {
      this.toggleSubNav($el, $target);
    }

    // Add class to override animation - CSS determined
    if (noAnimation) {
      $target.addClass(this.config.noAnimationClass);
    }
  };

  Meganav.prototype.toggleSubNav = function($el) {
    this.removeMenuActiveState();

    $el
      .addClass(this.config.activeClass)
      .attr('aria-expanded', 'true')
      .siblings(this.config.$meganavDropdownThirdLevel)
      .addClass(this.config.activeClass);

    $el.parent().addClass(this.config.activeClass);
  };

  Meganav.prototype.close = function(evt, $target) {
    if (this.config.preventDuplicates) {
      // Close all meganavs
      this.config.$meganavs.removeClass(
        [this.config.activeClass, this.config.noAnimationClass].join(' ')
      );
      this.config.$meganavToggle
        .removeClass(this.config.activeClass)
        .attr('aria-expanded', 'false');

      this.config.$meganavDropdownContainers.removeClass(
        this.config.activeClass
      );
    } else {
      // Close targeted nav
      var $targetedMeganav = $('#' + $target.attr('aria-controls'));
      $targetedMeganav.removeClass(
        [this.config.activeClass, this.config.noAnimationClass].join(' ')
      );
      $target
        .removeClass(this.config.activeClass)
        .attr('aria-expanded', 'false');
    }

    // Remove event listeners
    this.unbindEvents();
    this.config.isOpen = false;
  };

  Meganav.prototype.closeThirdLevelMenu = function(evt) {
    var $el = $(evt.currentTarget);
    var $parent = $el.parent();

    if (!$parent.is(':last-child')) {
      return;
    }

    this.config.$meganavLinkSecondLevel.one(
      'focus.meganav',
      $.proxy(function() {
        this.removeMenuActiveState();
      }, this)
    );
  };

  Meganav.prototype.removeMenuActiveState = function() {
    var activeClasses = [this.config.activeClass, this.config.noAnimationClass];

    this.config.$meganavToggleThirdLevel
      .removeClass(activeClasses.join(' '))
      .attr('aria-expanded', 'false');

    this.config.$meganavDropdownThirdLevel.removeClass(activeClasses.join(' '));
    this.config.$meganavDropdownContainers.removeClass(this.config.activeClass);
  };

  Meganav.prototype.bindEvents = function() {
    if (!this.config.closeOnPageClick) {
      return;
    }

    // Clicking away from the meganav will close it
    this.cache.$page.on('click.meganav', $.proxy(this.close, this));

    // Exception to above: clicking anywhere on the meganav will NOT close it
    this.config.$meganavs.on(
      'click.meganav',
      function(evt) {
        // 3rd level container
        var is3rdLevelMenuTarget =
          $(evt.currentTarget).hasClass(this.config.activeClass) &&
          $(evt.currentTarget).hasClass(this.config.thirdLevelContainerClass);

        // 2nd level mega link
        var isMegaNavlink =
          $(evt.target).hasClass(this.config.meganavLinkClass) &&
          $(evt.target).hasClass(this.config.secondLevelClass);

        // If we click anything outside from the 3rd level megaNav, close the third level menu (except for 2nd level links)
        if (!is3rdLevelMenuTarget && !isMegaNavlink) {
          this.removeMenuActiveState();
        }

        evt.stopImmediatePropagation();
      }.bind(this)
    );

    // Pressing escape closes meganav and focuses the target parent link
    this.cache.$document.on(
      'keyup.meganav',
      $.proxy(function(evt) {
        if (evt.keyCode !== 27) return;

        this.config.$meganavToggle
          .filter('.' + this.config.activeClass)
          .focus();
        this.close();
      }, this)
    );
  };

  Meganav.prototype.unbindEvents = function() {
    if (!this.config.closeOnPageClick) {
      return;
    }

    this.cache.$page.off('.meganav');
    this.config.$meganavs.off('.meganav');
    this.cache.$document.off('.meganav');
    this.config.$meganavLinkSecondLevel.off('.meganav');
    this.config.$meganavLinkThirdLevel.off('.meganav');
  };

  return Meganav;
})();

window.QtySelector = (function() {
  var QtySelector = function($el) {
    this.cache = {
      $body: $('body'),
      $subtotal: $('#CartSubtotal'),
      $discountTotal: $('#cartDiscountTotal'),
      $cartTable: $('.cart-table'),
      $cartTemplate: $('#CartProducts'),
      $cartFooter: $('#CartFooter'),
      $cartFooterTemplate: $('#CartFooterTemplate')
    };

    this.settings = {
      loadingClass: 'js-qty--is-loading',
      isCartTemplate: this.cache.$body.hasClass('template-cart'),
      // On the cart template, minimum is 0. Elsewhere min is 1
      minQty: this.cache.$body.hasClass('template-cart') ? 0 : 1
    };

    this.$el = $el;
    this.qtyUpdateTimeout;
    this.createInputs();
    this.bindEvents();
  };

  QtySelector.prototype.createInputs = function() {
    var $el = this.$el;

    var data = {
      value: $el.val(),
      key: $el.attr('id'),
      name: $el.attr('name'),
      line: $el.attr('data-line')
    };
    var source = $('#QuantityTemplate').html();
    var template = Handlebars.compile(source);

    this.$wrapper = $(template(data)).insertBefore($el);

    // Remove original number input
    $el.remove();
  };

  QtySelector.prototype.validateAvailability = function(line, quantity) {
    var product = theme.cartObject.items[line - 1]; // 0-based index in API
    var handle = product.handle; // needed for the ajax request
    var id = product.id; // needed to find right variant from ajax results

    var params = {
      type: 'GET',
      url: '/products/' + handle + '.js',
      dataType: 'json',
      success: $.proxy(function(cartProduct) {
        this.validateAvailabilityCallback(line, quantity, id, cartProduct);
      }, this)
    };

    $.ajax(params);
  };

  QtySelector.prototype.validateAvailabilityCallback = function(
    line,
    quantity,
    id,
    product
  ) {
    var quantityIsAvailable = true;

    // This returns all variants of a product.
    // Loop through them to get our desired one.
    for (var i = 0; i < product.variants.length; i++) {
      var variant = product.variants[i];
      if (variant.id === id) {
        break;
      }
    }

    // If the variant tracks inventory and does not sell when sold out
    // we can compare the requested with available quantity
    if (
      variant.inventory_management !== null &&
      variant.inventory_policy === 'deny'
    ) {
      if (variant.inventory_quantity < quantity) {
        // Show notification with error message
        theme.Notify.open('error', theme.strings.noStockAvailable, true);

        // Set quantity to max amount available
        this.$wrapper.find('.js-qty__input').val(variant.inventory_quantity);

        quantityIsAvailable = false;
        this.$wrapper.removeClass(this.settings.loadingClass);
      }
    }

    if (quantityIsAvailable) {
      this.updateItemQuantity(line, quantity);
    }
  };

  QtySelector.prototype.validateQty = function(qty) {
    if (parseFloat(qty) === parseInt(qty, 10) && !isNaN(qty)) {
      // We have a valid number!
    } else {
      // Not a number. Default to 1.
      qty = 1;
    }
    return parseInt(qty, 10);
  };

  QtySelector.prototype.adjustQty = function(evt) {
    var $el = $(evt.currentTarget);
    var $input = $el.siblings('.js-qty__input');
    var qty = this.validateQty($input.val());
    var line = $input.attr('data-line');

    if ($el.hasClass('js-qty__adjust--minus')) {
      qty -= 1;
      if (qty <= this.settings.minQty) {
        qty = this.settings.minQty;
      }
    } else {
      qty += 1;
    }

    if (this.settings.isCartTemplate) {
      $el.parent().addClass(this.settings.loadingClass);
      this.updateCartItemPrice(line, qty);
    } else {
      $input.val(qty);
    }
  };

  QtySelector.prototype.bindEvents = function() {
    this.$wrapper
      .find('.js-qty__adjust')
      .on('click', $.proxy(this.adjustQty, this));

    // Select input text on click
    this.$wrapper.on('click', '.js-qty__input', function() {
      this.setSelectionRange(0, this.value.length);
    });

    // If the quantity changes on the cart template, update the price
    if (this.settings.isCartTemplate) {
      this.$wrapper.on(
        'change',
        '.js-qty__input',
        $.proxy(function(evt) {
          var $input = $(evt.currentTarget);
          var line = $input.attr('data-line');
          var qty = this.validateQty($input.val());
          $input.parent().addClass(this.settings.loadingClass);
          this.updateCartItemPrice(line, qty);
        }, this)
      );
    }
  };

  QtySelector.prototype.updateCartItemPrice = function(line, qty) {
    // Update cart after short timeout so user doesn't create simultaneous ajax calls
    clearTimeout(this.qtyUpdateTimeout);
    this.qtyUpdateTimeout = setTimeout(
      $.proxy(function() {
        this.validateAvailability(line, qty);
      }, this),
      200
    );
  };

  QtySelector.prototype.updateItemQuantity = function(line, quantity) {
    var params = {
      type: 'POST',
      url: '/cart/change.js',
      data: 'quantity=' + quantity + '&line=' + line,
      dataType: 'json',
      success: $.proxy(function(cart) {
        this.updateCartItemCallback(cart);
      }, this)
    };

    $.ajax(params);
  };

  QtySelector.prototype.updateCartItemCallback = function(cart) {
    // Reload the page to show the empty cart if no items
    if (cart.item_count === 0) {
      location.reload();
      return;
    }

    // Update cart object
    theme.cartObject = cart;

    // Handlebars.js cart layout
    var data = {};
    var items = [];
    var item = {};
    var source = $('#CartProductTemplate').html();
    var template = Handlebars.compile(source);
    var prodImg;

    // Add each item to our handlebars.js data
    $.each(cart.items, function(index, cartItem) {
      /* Hack to get product image thumbnail
       *   - If image is not null
       *     - Remove file extension, add 240x240, and re-add extension
       *     - Create server relative link
       *   - A hard-coded url of no-image
       */

      if (cartItem.image === null) {
        prodImg =
          '//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif';
      } else {
        prodImg = cartItem.image
          .replace(/(\.[^.]*)$/, '_240x240$1')
          .replace('http:', '');
      }

      if (cartItem.properties !== null) {
        $.each(cartItem.properties, function(key, value) {
          if (key.charAt(0) === '_' || !value) {
            delete cartItem.properties[key];
          }
        });
      }

      if (cartItem.line_level_discount_allocations.length !== 0) {
        for (var discount in cartItem.line_level_discount_allocations) {
          var amount =
            cartItem.line_level_discount_allocations[discount].amount;

          cartItem.line_level_discount_allocations[
            discount
          ].formattedAmount = theme.Currency.formatMoney(
            amount,
            theme.moneyFormat
          );
        }
      }

      var unitPrice = null;
      if (cartItem.unit_price_measurement) {
        unitPrice = {
          addRefererenceValue:
            cartItem.unit_price_measurement.reference_value !== 1,
          price: theme.Currency.formatMoney(
            cartItem.unit_price,
            theme.moneyFormat
          ),
          reference_value: cartItem.unit_price_measurement.reference_value,
          reference_unit: cartItem.unit_price_measurement.reference_unit
        };
      }

      // Create item's data object and add to 'items' array
      item = {
        key: cartItem.key,
        line: index + 1, // Shopify uses a 1+ index in the API
        url: cartItem.url,
        img: prodImg,
        name: cartItem.product_title,
        variation: cartItem.variant_title,
        sellingPlanAllocation: cartItem.selling_plan_allocation,
        properties: cartItem.properties,
        itemQty: cartItem.quantity,
        price: theme.Currency.formatMoney(cartItem.price, theme.moneyFormat),
        vendor: cartItem.vendor,
        unitPrice: unitPrice,
        linePrice: theme.Currency.formatMoney(
          cartItem.final_line_price,
          theme.moneyFormat
        ),
        originalLinePrice: theme.Currency.formatMoney(
          cartItem.original_line_price,
          theme.moneyFormat
        ),
        discounts: cartItem.line_level_discount_allocations,
        discountsApplied:
          cartItem.line_level_discount_allocations.length === 0 ? false : true
      };

      items.push(item);
    });

    // Gather all cart data and add to DOM
    data = {
      items: items
    };
    this.cache.$cartTemplate.empty().append(template(data));

    this.updateCartFooter(cart);

    // Create new quantity selectors
    this.cache.$cartTable.find('input[type="number"]').each(function(i, el) {
      new QtySelector($(el));
    });

    // Set focus on cart table
    slate.a11y.pageLinkFocus(this.cache.$cartTable);
  };

  QtySelector.prototype.updateCartFooter = function(cart) {
    if (cart.cart_level_discount_applications.length !== 0) {
      for (var cartDiscount in cart.cart_level_discount_applications) {
        var cartAmount =
          cart.cart_level_discount_applications[cartDiscount]
            .total_allocated_amount;

        cart.cart_level_discount_applications[
          cartDiscount
        ].formattedAmount = theme.Currency.formatMoney(
          cartAmount,
          theme.moneyFormat
        );
      }
    }

    var source = this.cache.$cartFooterTemplate.html();
    var template = Handlebars.compile(source);
    var data = {
      totalPrice: theme.Currency.formatMoney(
        cart.total_price,
        theme.moneyFormat
      ),
      cartDiscounts: cart.cart_level_discount_applications,
      cartDiscountsApplied:
        cart.cart_level_discount_applications.length === 0 ? false : true
    };

    this.cache.$cartFooter.empty().append(template(data));
  };

  return QtySelector;
})();

/*
  Allow product to be added to cart via ajax with
  custom success and error responses.
*/
window.AjaxCart = (function() {
  var cart = function($form) {
    this.cache = {
      $cartIconIndicator: $('.site-header__cart-indicator')
    };

    this.$form = $form;
    this.eventListeners();
  };

  cart.prototype.eventListeners = function() {
    if (this.$form.length) {
      this.$form.on('submit', $.proxy(this.addItemFromForm, this));
    }
  };

  cart.prototype.addItemFromForm = function(evt) {
    evt.preventDefault();

    var params = {
      type: 'POST',
      url: '/cart/add.js',
      data: this.$form.serialize(),
      dataType: 'json',
      success: $.proxy(function(lineItem) {
        this.success(lineItem);
      }, this),
      error: $.proxy(function(XMLHttpRequest, textStatus) {
        this.error(XMLHttpRequest, textStatus);
      }, this)
    };

    $.ajax(params);
  };

  cart.prototype.success = function() {
    theme.Notify.open('success', false, true);

    // Update cart notification bubble's state
    this.cache.$cartIconIndicator.removeClass('hide');
  };

  // Error handling reference from Shopify.onError in api.jquery.js
  cart.prototype.error = function(XMLHttpRequest) {
    var data = JSON.parse(XMLHttpRequest.responseText);

    if (data.message) {
      theme.Notify.open('error', data.description, true);
    }
  };

  return cart;
})();

window.Notify = (function() {
  var notify = function() {
    this.cache = {
      $scrollParent: $('html').add('body'),
      $notificationSuccess: $('#NotificationSuccess'),
      $notificationSuccessLink: $('#NotificationSuccess').find('a'),
      $notificationError: $('#NotificationError'),
      $notificationPromo: $('#NotificationPromo'),
      $notificationClose: $('.notification__close'),
      $notificationErrorMessage: $('.notification__message--error')
    };

    this.settings = {
      notifyActiveClass: 'notification--active',
      closeTimer: 5000,
      promoKeyName: 'promo-' + this.cache.$notificationPromo.data('text')
    };

    this.notifyTimer;
    this.$lastFocusedElement = null;

    this.isLocalStorageSupported = isLocalStorageSupported();

    this.cache.$notificationClose.on('click', this.close.bind(this));
    this.showPromo();
    this.adaptNotification();
  };

  function isLocalStorageSupported() {
    // Return false if we are in an iframe without access to sessionStorage
    if (window.self !== window.top) {
      return false;
    }

    var testKey = 'test';
    try {
      var storage = window.sessionStorage;
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  notify.prototype.open = function(state, message, autoclose) {
    this.close();

    if (state === 'success') {
      this.cache.$notificationSuccess
        .attr('aria-hidden', false)
        .addClass(this.settings.notifyActiveClass);

      // Set last focused element to return to once success
      // notification is dismissed (by timeout)
      this.$lastFocusedElement = $(document.activeElement);

      // Set focus on link to cart after transition
      this.cache.$notificationSuccess.one(
        'TransitionEnd webkitTransitionEnd transitionend oTransitionEnd',
        $.proxy(function() {
          slate.a11y.pageLinkFocus(this.cache.$notificationSuccessLink);
        }, this)
      );

      // Fallback for no transitions
      if (this.cache.$scrollParent.hasClass('no-csstransitions')) {
        slate.a11y.pageLinkFocus(this.cache.$notificationSuccessLink);
      }
    } else {
      this.cache.$notificationErrorMessage.html(message);
      this.cache.$notificationError
        .attr('aria-hidden', false)
        .addClass(this.settings.notifyActiveClass);
    }

    // Timeout to close the notification
    if (autoclose) {
      clearTimeout(this.notifyTimer);
      this.notifyTimer = setTimeout(
        this.close.bind(this),
        this.settings.closeTimer
      );
    }
  };

  notify.prototype.close = function(evt) {
    if (evt && $(evt.currentTarget).attr('id') === 'NotificationPromoClose') {
      if (this.isLocalStorageSupported) {
        localStorage.setItem(this.settings.promoKeyName, 'hidden');
      }
    }

    // Return focus to previous element if one is defined
    // and the user has not strayed from the success notification link
    if (
      this.$lastFocusedElement &&
      this.cache.$notificationSuccessLink.is(':focus')
    ) {
      slate.a11y.pageLinkFocus(this.$lastFocusedElement);
    }

    // Close all notification bars
    this.cache.$notificationSuccess
      .attr('aria-hidden', true)
      .removeClass(this.settings.notifyActiveClass);
    this.cache.$notificationError
      .attr('aria-hidden', true)
      .removeClass(this.settings.notifyActiveClass);
    this.cache.$notificationPromo
      .attr('aria-hidden', true)
      .removeClass(this.settings.notifyActiveClass);

    // Reset last focused element
    this.$lastFocusedElement = null;
  };

  notify.prototype.showPromo = function(SFEevent) {
    // If reloaded in the storefront editor, update selectors/settings
    if (SFEevent) {
      this.initCache();
    }

    if (
      this.isLocalStorageSupported &&
      localStorage[this.settings.promoKeyName] === 'hidden'
    ) {
      return;
    }

    this.cache.$notificationPromo
      .attr('aria-hidden', false)
      .addClass(this.settings.notifyActiveClass);
  };

  notify.prototype.adaptNotification = function() {
    var adaptHeight = $('.hero').data('adapt-height'),
      $notification = $('#NotificationPromo'),
      $notificationInner = $notification.children('.notification__inner');

    if (!$notification.length) {
      return;
    }

    $notification.toggleClass(
      'notification-adapt page-width',
      adaptHeight === true
    );
    $notificationInner.toggleClass('page-width', adaptHeight === false);
  };

  return notify;
})();

theme.Maps = (function() {
  var config = {
    zoom: 14,
    styles: [
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#cacaca' }, { lightness: 17 }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#e1e1e1' }, { lightness: 20 }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }, { lightness: 17 }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }, { lightness: 18 }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }, { lightness: 16 }]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#e1e1e1' }, { lightness: 21 }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#bbbbbb' }, { lightness: 21 }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }]
      },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#f2f2f2' }, { lightness: 19 }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{ color: '#fefefe' }, { lightness: 20 }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }]
      }
    ] // eslint-disable-line key-spacing, comma-spacing
  };
  var apiStatus = null;
  var mapsToLoad = [];

  function Map(container) {
    theme.$currentMapContainer = this.$container = $(container);
    var key = this.$container.data('api-key');

    if (typeof key !== 'string' || key === '') {
      return;
    }

    if (apiStatus === 'loaded') {
      var self = this;

      // Check if the script has previously been loaded with this key
      var $script = $('script[src*="' + key + '&"]');
      if ($script.length === 0) {
        $.getScript(
          'https://maps.googleapis.com/maps/api/js?key=' + key
        ).then(function() {
          apiStatus = 'loaded';
          self.createMap();
        });
      } else {
        this.createMap();
      }
    } else {
      mapsToLoad.push(this);

      if (apiStatus !== 'loading') {
        apiStatus = 'loading';
        if (typeof window.google === 'undefined') {
          $.getScript(
            'https://maps.googleapis.com/maps/api/js?key=' + key
          ).then(function() {
            apiStatus = 'loaded';
            initAllMaps();
          });
        }
      }
    }
  }

  function initAllMaps() {
    // API has loaded, load all Map instances in queue
    $.each(mapsToLoad, function(index, instance) {
      instance.createMap();
    });
  }

  function geolocate($map) {
    var deferred = $.Deferred();
    var geocoder = new google.maps.Geocoder();
    var address = $map.data('address-setting');

    geocoder.geocode({ address: address }, function(results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        deferred.reject(status);
      }

      deferred.resolve(results);
    });

    return deferred;
  }

  Map.prototype = _.assignIn({}, Map.prototype, {
    createMap: function() {
      var $map = this.$container.find('.map-section__container');

      return geolocate($map)
        .then(
          function(results) {
            var mapOptions = {
              zoom: config.zoom,
              styles: config.styles,
              center: results[0].geometry.location,
              draggable: false,
              clickableIcons: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
              disableDefaultUI: true
            };

            var map = (this.map = new google.maps.Map($map[0], mapOptions));
            var center = (this.center = map.getCenter());
            var enablePin = $map.data('enable-pin');

            var markerColor = $map.data('marker-color');

            var markerIcon = {
              path:
                'M57.7,0C25.8,0,0,25.8,0,57.7C0,89.5,50,170,57.7,170s57.7-80.5,57.7-112.3C115.3,25.8,89.5,0,57.7,0z M57.7,85 c-14.9,0-27-12.1-27-27c0-14.9,12.1-27,27-27c14.9,0,27,12.1,27,27C84.7,72.9,72.6,85,57.7,85z',
              fillColor: markerColor,
              fillOpacity: 0.9,
              scale: 0.2,
              strokeWeight: 0
            };

            //eslint-disable-next-line no-unused-vars
            var marker = new google.maps.Marker({
              map: map,
              position: center,
              icon: markerIcon,
              visible: enablePin
            });

            google.maps.event.addDomListener(
              window,
              'resize',
              $.debounce(250, function() {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
              })
            );
          }.bind(this)
        )
        .fail(function() {
          var errorMessage;

          switch (status) {
            case 'ZERO_RESULTS':
              errorMessage = theme.strings.addressNoResults;
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = theme.strings.addressQueryLimit;
              break;
            default:
              errorMessage = theme.strings.addressError;
              break;
          }

          // Only show error in the theme editor
          if (Shopify.designMode) {
            var $mapContainer = $map.parents('.map-section');

            $mapContainer.addClass('page-width map-section--load-error');
            $mapContainer.find('.map-section__content-wrapper').remove();
            $mapContainer
              .find('.map-section__wrapper')
              .html(
                '<div class="errors text-center" style="width: 100%;">' +
                  errorMessage +
                  '</div>'
              );
          }
        });
    },

    onUnload: function() {
      if (typeof window.google !== 'undefined') {
        google.maps.event.clearListeners(this.map, 'resize');
      }
    }
  });

  return Map;
})();

// Global function called by Google on auth errors.
// Show an auto error message on all map instances.
// eslint-disable-next-line camelcase, no-unused-vars
function gm_authFailure() {
  if (!Shopify.designMode) return;

  theme.$currentMapContainer.addClass('page-width map-section--load-error');
  theme.$currentMapContainer.find('.map-section__content-wrapper').remove();
  theme.$currentMapContainer
    .find('.map-section__wrapper')
    .html(
      '<div class="errors text-center" style="width: 100%;">' +
        theme.strings.authError +
        '</div>'
    );
}

theme.stickyHeader = (function() {
  var selectors = {
    searchCartWrapper: '#SiteNavSearchCart',
    stickyNavSearchCart: '#StickyNavSearchCart',
    stickyNavWrapper: '#StickNavWrapper',
    stickyBar: '#StickyBar'
  };

  var config = {
    lastScroll: 0,
    navClass: 'sticky--active',
    openTransitionClass: 'sticky--open',
    closeTransitionClass: 'sticky--close'
  };

  var cache = {};

  function cacheSelectors() {
    cache = {
      $window: $(window),
      $siteNavSearchCart: $(selectors.searchCartWrapper),
      $stickyBar: $(selectors.stickyBar)
    };
  }

  function init() {
    cacheSelectors();
    config.isActive = false;

    // Clone search/cart icons into fixed nav
    if (cache.$siteNavSearchCart.contents().length) {
      cache.$siteNavSearchCart
        .contents()
        .clone()
        .appendTo($(selectors.stickyNavSearchCart));
    }

    cache.$window.on('scroll.stickynav', $.throttle(15, stickyHeaderOnScroll));
  }

  function stickyHeaderOnScroll() {
    var scroll = cache.$window.scrollTop();
    var $el = $(selectors.stickyNavWrapper);
    var threshold = $el.offset().top + $el.height() + 10; // default for scrolling down

    // Check if scrolling up
    if (scroll < config.lastScroll) {
      threshold = $el.offset().top;
    }

    if (scroll > threshold) {
      stickNav();
    } else {
      unstickNav();
    }

    config.lastScroll = scroll;
  }

  function stickNav() {
    if (config.isActive) {
      return;
    }

    config.isActive = true;

    cache.$stickyBar.addClass(config.navClass);

    // Add open transition class after element is set to fixed
    // so CSS animation is applied correctly
    setTimeout(function() {
      cache.$stickyBar.addClass(config.openTransitionClass);
    }, 0);
  }

  function unstickNav() {
    if (!config.isActive) {
      return;
    }

    cache.$stickyBar
      .removeClass(config.openTransitionClass)
      .removeClass(config.navClass);

    config.isActive = false;
  }

  function unload() {
    $(window).off('.stickynav');
  }

  return {
    init: init,
    unload: unload
  };
})();

theme.headerNav = (function() {
  var selectors = {
    siteNav: '#SiteNav',
    siteNavCompressed: '#SiteNavCompressed',
    siteNavParent: '#SiteNavParent',
    siteNavItem: '.site-nav__item',
    stickyNavWrapper: '#StickNavWrapper',
    stickyNav: '#StickyNav'
  };

  var config = {
    lastScroll: 0,
    isActive: false,
    navClass: 'sticky--active',
    openTransitionClass: 'sticky--open',
    closeTransitionClass: 'sticky--close',
    searchInputClass: 'site-header__search-input',
    searchSubmitClass: 'site-header__search-submit',
    searchInnerActiveClass: 'search-header__search-inner--active'
  };

  function init() {
    sizeNav();
    initMegaNavs();
    initHeaderSearch();

    // Re-execute sizeNav after the page is fully loaded
    // so it gets the correct width after the custom typeface is loaded.
    var mql = window.matchMedia('(min-width: 750px)');
    if (mql.matches) {
      $(window).on('load', sizeNav);
    }
    $(window).on('resize.headernav', $.debounce(250, sizeNav));
  }

  function sizeNav() {
    var navWidth = 0;
    var parentWidth = $(selectors.siteNavParent).width();
    var hideClass = 'hide';

    // Set height on nav-bar wrapper so when fixed, doesn't break layout
    $(selectors.stickyNavWrapper).height($(selectors.stickyNav).height());

    // Calculate the width of each nav item
    // after forcing them to be visible for the calculations
    $(selectors.siteNav).removeClass(hideClass);
    $(selectors.siteNavItem).each(function(i, el) {
      navWidth += $(el).width();
    });

    if (navWidth > parentWidth) {
      $(selectors.siteNav).addClass(hideClass);
      $(selectors.siteNavCompressed).removeClass(hideClass);
    } else {
      $(selectors.siteNav).removeClass(hideClass);
      $(selectors.siteNavCompressed).addClass(hideClass);
    }
  }

  function initMegaNavs() {
    new window.Meganav({
      $meganavs: $('.site-nav__dropdown'),
      $meganavToggle: $('.site-nav__link-toggle'),
      preventDuplicates: true,
      closeOnPageClick: true,
      closeThirdLevelOnBlur: true
    });

    new window.Meganav({
      $meganavs: $('.meganav--index'),
      $meganavToggle: $('.index__meganav-toggle')
    });

    new window.Meganav({
      $meganavs: $('.meganav--drawer'),
      $meganavToggle: $('.drawer__meganav-toggle')
    });
  }

  function initHeaderSearch() {
    // This function runs after the header search element
    // is duplicated into the sticky nav, meaning there are
    // two search fields to be aware of at this point.
    var $searchForm = $('.site-header__search');

    $searchForm.each(function(i, el) {
      var $form = $(el);
      var $input = $form.find('.' + config.searchInputClass);
      var $submit = $form.find('.' + config.searchSubmitClass);

      $input.add($submit).on('focus blur', function() {
        $form.toggleClass('active-form');
      });

      $submit.on('mousedown', function() {
        if ($form.hasClass('active-form')) {
          $form.submit();
        }
      });
    });
  }

  function unload() {
    $(window).off('.stickynav');
  }

  return {
    init: init,
    unload: unload
  };
})();


/*================ TEMPLATES ================*/
theme.customerTemplates = (function() {
  function initEventListeners() {
    // Show reset password form
    $('#RecoverPassword').on('click', function(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    });

    // Hide reset password form
    $('#HideRecoverPasswordLink').on('click', function(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    });
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    // check if reset password form was successfully submited
    if (!$('.reset-password-success').length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var $newAddressForm = $('#AddressNewForm');

    if (!$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        'AddressCountryNew',
        'AddressProvinceNew',
        {
          hideElement: 'AddressProvinceContainerNew'
        }
      );
    }

    // Initialize each edit form's country/province selector
    $('.address-country-option').each(function() {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });

    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', function() {
      $newAddressForm.toggleClass('hide');
    });

    $('.address-edit-toggle').on('click', function() {
      var formId = $(this).data('form-id');
      $('#EditAddress_' + formId).toggleClass('hide');
    });

    $('.address-delete').on('click', function() {
      var $el = $(this);
      var addressUrl = $el.data('address-url');
      var confirmMessage = $el.data('confirm-message');

      // eslint-disable-next-line no-alert
      if (
        confirm(
          confirmMessage || 'Are you sure you wish to delete this address?'
        )
      ) {
        Shopify.postLink(addressUrl, {
          parameters: { _method: 'delete' }
        });
      }
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  return {
    init: function() {
      checkUrlHash();
      initEventListeners();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();


/*================ SECTIONS ================*/
theme.HeaderSection = (function() {
  function Header() {
    theme.stickyHeader.init();
    theme.headerNav.init();
    theme.Notify = new window.Notify();
    theme.NavDrawer = new window.Drawers('NavDrawer', 'left');
    drawerSearch();
  }

  function drawerSearch() {
    var $drawerSearch = $('.drawer__search-input');
    var $drawerSearchSubmit = $('.drawer__search-submit');

    $drawerSearchSubmit.on('click', function(evt) {
      if ($drawerSearch.val().length !== 0) {
        return;
      }

      evt.preventDefault();
      $drawerSearch.focus();
    });
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onSelect: function() {
      theme.Notify.adaptNotification();
    },
    onUnload: function() {
      theme.stickyHeader.unload();
      theme.headerNav.unload();
    }
  });

  return Header;
})();

theme.Filters = (function() {
  var selectors = {
    filterSelection: '#SortTags',
    sortSelection: '#SortBy'
  };

  function Filters() {
    this.$filterSelect = $(selectors.filterSelection);
    this.$sortSelect = $(selectors.sortSelection);

    this.$filterSelect.on('change', this._onFilterChange.bind(this));
    this.$sortSelect.on('change', this._onSortChange.bind(this));
  }

  Filters.prototype = _.assignIn({}, Filters.prototype, {
    _onFilterChange: function() {
      location.href = this.$filterSelect.val();
    },

    _onSortChange: function() {
      Shopify.queryParams.sort_by = this.$sortSelect.val();
      if (Shopify.queryParams.page) {
        delete Shopify.queryParams.page;
      }
      location.search = decodeURIComponent($.param(Shopify.queryParams));
    },

    onUnload: function() {
      this.$filterSelect.off('change', this._onFilterChange);
      this.$sortSelect.off('change', this._onSortChange);
    }
  });

  return Filters;
})();

theme.Product = (function() {
  var defaults = {
    smallBreakpoint: 750, // copied from variables.scss
    productThumbIndex: 0,
    productThumbMax: 0,
    ajaxCart: false,
    stockSetting: false
  };

  function Product(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');

    this.selectors = {
      originalSelectorId: '#ProductSelect-' + sectionId,
      modal: 'ProductModal',
      productZoomImage: '#ProductZoomImg',
      addToCart: '#AddToCart-' + sectionId,
      productPrice: '#ProductPrice-' + sectionId,
      comparePrice: '#ComparePrice-' + sectionId,
      addToCartText: '#AddToCartText-' + sectionId,
      SKU: '.variant-sku',
      productImageContainers: '.product__photo-container-' + sectionId,
      productImageWrappers: '.product__photo-wrapper-' + sectionId,
      productThumbContainers: '.product-single__thumbnail-item-' + sectionId,
      productThumbsWrapper: '.product-single__thumbnails-' + sectionId,
      productThumbs: '.product-single__thumbnail-' + sectionId,
      saleTag: '#ProductSaleTag-' + sectionId,
      productStock: '#ProductStock-' + sectionId,
      singleOptionSelector: '.single-option-selector-' + sectionId,
      shopifyPaymentButton: '.shopify-payment-button',
      unitPrice: '[data-unit-price]',
      unitPriceBaseUnit: '[data-unit-price-base-unit]',
      unitPriceContainer: '[data-unit-price-container]'
    };

    this.settings = $.extend({}, defaults, {
      sectionId: sectionId,
      ajaxCart: $container.data('ajax'),
      stockSetting: $container.data('stock'),
      enableHistoryState: $container.data('enable-history-state') || false,
      namespace: '.product-' + sectionId
    });

    // Stop parsing if we don't have the product json script tag
    if (!$('#ProductJson-' + sectionId).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      $('#ProductJson-' + sectionId).html()
    );
    this.addVariantInfo();

    this.init();
  }

  Product.prototype = _.assignIn({}, Product.prototype, {
    init: function() {
      this._stringOverrides();
      this._initVariants();
      this._productZoomImage();
      this._productThumbSwitch();
      this._productThumbnailSlider();
      this._initQtySelector();

      if (this.settings.ajaxCart) {
        theme.AjaxCart = new window.AjaxCart(
          $('#AddToCartForm-' + this.settings.sectionId)
        );
      }
    },

    _stringOverrides: function() {
      window.productStrings = window.productStrings || {};
      $.extend(theme.strings, window.productStrings);
    },

    addVariantInfo: function() {
      if (!this.productSingleObject || !this.settings.stockSetting) {
        return;
      }

      var variantInfo = JSON.parse(
        $('#VariantJson-' + this.settings.sectionId).html()
      );

      for (var i = 0; i < variantInfo.length; i++) {
        $.extend(this.productSingleObject.variants[i], variantInfo[i]);
      }
    },

    _initVariants: function() {
      var options = {
        $container: this.$container,
        enableHistoryState: this.settings.enableHistoryState,
        product: this.productSingleObject,
        singleOptionSelector: this.selectors.singleOptionSelector,
        originalSelectorId: this.selectors.originalSelectorId
      };

      // eslint-disable-next-line no-new
      this.variants = new slate.Variants(options);

      this.$container.on(
        'variantChange' + this.settings.namespace,
        this._updateVariantChange.bind(this)
      );
      this.$container.on(
        'variantPriceChange' + this.settings.namespace,
        this._updatePrice.bind(this)
      );
      this.$container.on(
        'variantSKUChange' + this.settings.namespace,
        this._updateSKU.bind(this)
      );
      this.$container.on(
        'variantImageChange' + this.settings.namespace,
        this._updateImages.bind(this)
      );
    },

    _updateStock: function(variant) {
      if (!this.settings.stockSetting) return;

      var $stock = $(this.selectors.productStock);

      // If we don't track variant inventory, hide stock
      if (!variant || !variant.inventory_management) {
        $stock.addClass('hide');
        return;
      }

      if (variant.inventory_quantity < 10 && variant.inventory_quantity > 0) {
        $stock
          .html(
            theme.strings.stockAvailable.replace(
              '1',
              variant.inventory_quantity
            )
          )
          .removeClass('hide');
        return;
      }

      if (variant.inventory_quantity <= 0 && variant.incoming) {
        $stock
          .html(
            theme.strings.willNotShipUntil.replace(
              '[date]',
              variant.next_incoming_date
            )
          )
          .removeClass('hide');
        return;
      }

      // If there's more than 10 available, hide stock
      $stock.addClass('hide');
    },

    _updateIncomingInfo: function(variant) {
      if (!this.settings.stockSetting) return;

      var $stock = $(this.selectors.productStock);

      if (variant.incoming) {
        $stock
          .html(
            theme.strings.willBeInStockAfter.replace(
              '[date]',
              variant.next_incoming_date
            )
          )
          .removeClass('hide');
        return;
      }

      // If there is no stock incoming, hide stock
      $stock.addClass('hide');
    },

    _updateVariantChange: function(evt) {
      var variant = evt.variant;

      var cache = {
        $addToCart: $(this.selectors.addToCart),
        $addToCartText: $(this.selectors.addToCartText)
      };

      if (variant) {
        // Select a valid variant if available
        if (variant.available) {
          // We have a valid product variant, so enable the submit button
          cache.$addToCart.removeClass('btn--sold-out').prop('disabled', false);
          cache.$addToCartText.html(theme.strings.addToCart);
          $(this.selectors.shopifyPaymentButton, this.$container).show();
          // Show how many items are left, if below 10
          this._updateStock(variant);
        } else {
          // Variant is sold out, disable the submit button
          cache.$addToCart.prop('disabled', true).addClass('btn--sold-out');
          cache.$addToCartText.html(theme.strings.soldOut);
          $(this.selectors.shopifyPaymentButton, this.$container).hide();
          // Update when stock will be available
          this._updateIncomingInfo(variant);
        }

        $(this.selectors.unitPriceContainer, this.$container).addClass('hide');

        if (variant.unit_price_measurement) {
          var $unitPrice = $(this.selectors.unitPrice, this.$container);
          var $unitPriceBaseUnit = $(
            this.selectors.unitPriceBaseUnit,
            this.$container
          );

          $unitPrice.html(
            theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
          );
          $unitPriceBaseUnit.html(this._getBaseUnit(variant));

          $(this.selectors.unitPriceContainer, this.$container).removeClass(
            'hide'
          );
        }
      } else {
        cache.$addToCart.prop('disabled', true).removeClass('btn--sold-out');
        cache.$addToCartText.html(theme.strings.unavailable);
        $(this.selectors.shopifyPaymentButton, this.$container).hide();
        // Hide stock display
        this._updateStock();
      }
    },

    _updatePrice: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(this.selectors.productPrice).html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );

        // Update and show the product's compare price if necessary
        if (variant.compare_at_price > variant.price) {
          $(this.selectors.comparePrice)
            .html(
              theme.Currency.formatMoney(
                variant.compare_at_price,
                theme.moneyFormat
              )
            )
            .removeClass('hide');
          $(this.selectors.saleTag).removeClass('hide');
        } else {
          $(this.selectors.comparePrice).addClass('hide');
          $(this.selectors.saleTag).addClass('hide');
        }
      } else {
        $(this.selectors.comparePrice).addClass('hide');
      }
    },

    _getBaseUnit: function(variant) {
      return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value +
            variant.unit_price_measurement.reference_unit;
    },

    _updateSKU: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(this.selectors.SKU).html(variant.sku);
      }
    },

    _updateImages: function(evt) {
      var variant = evt.variant;

      if (variant && variant.featured_image) {
        var imageId = variant.featured_image.id;
        this.switchProductImage(imageId);
        this.setActiveThumbnail(imageId);
      }
    },

    switchProductImage: function(imageId) {
      var $imageToShow = $(
        this.selectors.productImageContainers +
          "[data-image-id='" +
          imageId +
          "']",
        this.$container
      );
      var $imagesToHide = $(
        this.selectors.productImageContainers +
          ":not([data-image-id='" +
          imageId +
          "'])",
        this.$container
      );
      $imagesToHide.addClass('hide');
      $imageToShow.removeClass('hide');
    },

    setActiveThumbnail: function(imageId) {
      var $thumbnailToShow = $(
        this.selectors.productThumbContainers +
          "[data-image-id='" +
          imageId +
          "']",
        this.$container
      );
      var $thumbnailsToHide = $(
        this.selectors.productThumbContainers +
          ":not([data-image-id='" +
          imageId +
          "'])",
        this.$container
      );
      $thumbnailsToHide.removeClass('is-active');
      $thumbnailToShow.addClass('is-active');

      var $thumbnails = $(this.selectors.productThumbsWrapper, this.$container);

      // If there is a slick carousel, get the slide index, and position it into view with animation.
      if ($thumbnails.hasClass('slick-initialized')) {
        // eslint-disable-next-line shopify/jquery-dollar-sign-reference
        var currentActiveSlideIndex = $thumbnails.slick('slickCurrentSlide');
        var newActiveSlideIndex = parseInt(
          $thumbnailToShow.attr('data-slick-index')
        );
        if (currentActiveSlideIndex !== newActiveSlideIndex) {
          $thumbnails.slick('slickGoTo', newActiveSlideIndex, false);
        }
      }
    },

    _productZoomImage: function() {
      // The zoom image is only used on the product template, so return early
      // even if a featured product section is present.
      if (
        !$('.product-single ' + this.selectors.productImageContainers).length
      ) {
        return;
      }

      var self = this;

      $(this.selectors.productImageWrappers).on(
        'click' + this.settings.namespace,
        function(evt) {
          evt.preventDefault();
          // Empty src before loadig new image to avoid awkward image swap
          $(self.selectors.productZoomImage)
            .attr('src', '')
            .attr('src', $(this).attr('href'));
        }
      );

      this.ProductModal = new window.Modals(
        this.selectors.modal,
        'product-modal'
      );

      // Close modal if clicked, but not if the image is clicked
      this.ProductModal.$modal.on('click' + this.settings.namespace, function(
        evt
      ) {
        if (evt.target.nodeName !== 'IMG') {
          self.ProductModal.close();
        }
      });
    },

    _productThumbSwitch: function() {
      if (!$(this.selectors.productThumbs).length) {
        return;
      }

      var self = this;

      $(this.selectors.productThumbs).on(
        'click' + this.settings.namespace,
        function(evt) {
          evt.preventDefault();
          var imageId = $(this)
            .parent()
            .data('image-id');
          self.setActiveThumbnail(imageId);
          self.switchProductImage(imageId);
        }
      );
    },

    /*
      Thumbnail slider
     */
    _productThumbnailSlider: function() {
      var $productThumbsWrapper = $(this.selectors.productThumbsWrapper);
      var $productThumbs = $(this.selectors.productThumbs);
      if (!$productThumbs.length) {
        return;
      }

      if ($productThumbs.length > 2) {
        $productThumbsWrapper.on(
          'init' + this.settings.namespace,
          this._productSwipeInit.bind(this)
        );

        var nextArrow;
        var prevArrow;
        var sliderArrows = window.sliderArrows || false;

        // sliderArrows is an object defined in product.liquid to set custom
        // SVG arrow icons.
        if (sliderArrows) {
          nextArrow =
            '<button type="button" class="slick-next"><span class="medium-up--hide">' +
            sliderArrows.right +
            '</span><span class="small--hide">' +
            sliderArrows.down +
            '</span></button>';
          prevArrow =
            '<button type="button" class="slick-prev"><span class="medium-up--hide">' +
            sliderArrows.left +
            '</span><span class="small--hide">' +
            sliderArrows.up +
            '</span></button>';
        }

        $productThumbsWrapper.slick({
          accessibility: false,
          arrows: true,
          dots: false,
          infinite: false,
          autoplay: false,
          slidesToShow: 3,
          slidesToScroll: 3,
          vertical: true,
          verticalSwiping: true,
          nextArrow: nextArrow,
          prevArrow: prevArrow,
          responsive: [
            {
              breakpoint: this.settings.smallBreakpoint,
              settings: {
                vertical: false,
                verticalSwiping: false
              }
            }
          ]
        });

        // Show highlighted thumbnail by repositioning slider
        $productThumbsWrapper.slick(
          'slickGoTo',
          $productThumbsWrapper.find('.is-active').attr('data-slick-index'),
          true
        );
      }
    },

    _productSwipeInit: function(evt, obj) {
      // Slider is initialized. Setup custom swipe events
      this.settings.productThumbIndex = obj.currentSlide;
      this.settings.productThumbMax = obj.slideCount - 1; // we need the 0-based index

      var self = this;

      $(this.selectors.productImageWrappers).on(
        'swipeleft swiperight',
        function(event) {
          if (event.type === 'swipeleft') {
            self._goToNextThumbnail();
          }

          if (event.type === 'swiperight') {
            self._goToPrevThumbnail();
          }

          // Trigger click on newly requested thumbnail
          $(
            '.product-single__thumbnail-item[data-slick-index="' +
              self.settings.productThumbIndex +
              '"]'
          )
            .find('.product-single__thumbnail')
            .trigger('click');
        }
      );
    },

    _goToNextThumbnail: function() {
      this.settings.productThumbIndex++;

      if (this.settings.productThumbIndex > this.settings.productThumbMax) {
        this.settings.productThumbIndex = 0;
      }

      $(this.selectors.productThumbsWrapper).slick(
        'slickGoTo',
        this.settings.productThumbIndex,
        true
      );
    },

    _goToPrevThumbnail: function() {
      this.settings.productThumbIndex--;

      if (this.settings.productThumbIndex < 0) {
        this.settings.productThumbIndex = this.settings.productThumbMax;
      }

      $(this.selectors.productThumbsWrapper).slick(
        'slickGoTo',
        this.settings.productThumbIndex,
        true
      );
    },

    _initQtySelector: function() {
      this.$container.find('.product-form__quantity').each(function(i, el) {
        // eslint-disable-next-line no-new
        new QtySelector($(el));
      });
    },

    onUnload: function() {
      $(this.selectors.productImageWrappers).off(this.settings.namespace);
      $(this.selectors.productThumbs).off(this.settings.namespace);
      $(this.selectors.productThumbs).slick('unslick');
      if (this.ProductModal) {
        this.ProductModal.$modal.off(this.settings.namespace);
      }
    }
  });

  return Product;
})();

theme.slideshows = {};

theme.Slideshow = (function() {
  function Slideshow(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');
    this.slideshow = '#Slideshow-' + sectionId;

    theme.slideshows[this.slideshow] = new theme.Hero(this.slideshow);
  }

  Slideshow.prototype = _.assignIn({}, Slideshow.prototype, {
    onUnload: function() {
      theme.slideshows[this.slideshow].destroy();
    },

    onSelect: function() {
      theme.slideshows[this.slideshow].pause();
      theme.Notify.adaptNotification();
    },

    onDeselect: function() {
      theme.slideshows[this.slideshow].play();
    },

    onBlockSelect: function(evt) {
      var $slide = $(
        '.hero__slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      theme.slideshows[this.slideshow].pause();
      theme.slideshows[this.slideshow].goToSlide(slideIndex);
    },

    onBlockDeselect: function() {
      theme.slideshows[this.slideshow].play();
    }
  });

  return Slideshow;
})();

theme.Cart = (function() {
  var selectors = {
    cartNote: '#CartSpecialInstructions',
    cartQtyInput: '.cart__quantity',
    cartNoCookiesClass: 'cart--no-cookies'
  };

  function Cart(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');

    theme.cartObject = JSON.parse($('#CartJson-' + sectionId).html());

    this.init($container);
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    init: function($container) {
      this._initQtySelector();
      this._initCartNote();

      if (!this._cookiesEnabled()) {
        $container.addClass(selectors.cartNoCookiesClass);
      }
    },

    _initQtySelector: function() {
      $(selectors.cartQtyInput).each(function(i, el) {
        // eslint-disable-next-line no-new
        new QtySelector($(el));
      });
    },

    _initCartNote: function() {
      if (!$(selectors.cartNote).length) {
        return;
      }

      var $el = $(selectors.cartNote);
      var noteText;
      var params;
      var noteOffset = $el[0].offsetHeight - $el[0].clientHeight;

      // Auto grow the cart note if text fills it up
      $el.on('keyup input', function() {
        $(this)
          .css('height', 'auto')
          .css('height', $el[0].scrollHeight + noteOffset);
      });

      // Save the cart note via ajax. A safeguard in case
      // a user decides to leave the page before clicking 'Update Cart'
      $el.on(
        'change',
        $.proxy(function() {
          noteText = $el.val();
          params = {
            type: 'POST',
            url: '/cart/update.js',
            data: 'note=' + this._attributeToString(noteText),
            dataType: 'json'
          };
          $.ajax(params);
        }, this)
      );
    },

    _attributeToString: function(attr) {
      if (typeof attr !== 'string') {
        attr = String(attr);
        if (attr === 'undefined') {
          attr = '';
        }
      }
      return $.trim(attr);
    },

    _cookiesEnabled: function() {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
      }
      return cookieEnabled;
    }
  });

  return Cart;
})();

theme.Quotes = (function() {
  function Quotes(container) {
    this.$container = $(container).on('init', this._a11y.bind(this));

    this.$container.slick({
      accessibility: true,
      arrows: false,
      dots: true,
      draggable: true,
      autoplay: false
    });
  }

  Quotes.prototype = _.assignIn({}, Quotes.prototype, {
    _a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = this.$container.parent();

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    },

    _goToSlide: function(slideIndex) {
      this.$container.slick('slickGoTo', slideIndex);
    },

    onUnload: function() {
      delete this.$container;
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.quote__slide-wrapper--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      this._goToSlide(slideIndex);
    }
  });

  return Quotes;
})();

theme.Video = (function() {
  var promiseYoutubeAPI;
  var promiseVimeoAPI;

  var youtube = {
    promiseAPI: function() {
      if (!promiseYoutubeAPI) {
        var tag = document.createElement('script');

        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        promiseYoutubeAPI = $.Deferred(function(defer) {
          window.onYouTubeIframeAPIReady = defer.resolve;

          setTimeout(function() {
            defer.reject('Request for YouTube API timed out after 30 seconds.');
          }, 30000);
        });
      }

      return promiseYoutubeAPI;
    },
    promisePlayer: function(id, options) {
      return this.promiseAPI().then(function() {
        return $.Deferred(function(defer) {
          if (typeof window.YT === 'undefined') {
            defer.reject(
              "We're sorry, something went wrong. The YouTube API has not loaded correctly."
            );
          }

          /* eslint-disable no-undef */
          var player = new YT.Player(id, options); // global YT variable injected by YouTube API

          player.addEventListener('onReady', function() {
            defer.resolve(player);
          });

          setTimeout(function() {
            defer.reject(
              'Request for YouTube player has timed out after 30 seconds.'
            );
          }, 30000);
        });
      });
    }
  };

  var vimeo = {
    promiseAPI: function() {
      if (!promiseVimeoAPI) {
        promiseVimeoAPI = $.Deferred(function(defer) {
          var tag = document.createElement('script');
          tag.src = 'https://player.vimeo.com/api/player.js';
          tag.onload = tag.onreadystatechange = function() {
            if (!this.readyState || this.readyState === 'complete') {
              defer.resolve();
            }
          };

          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          setTimeout(function() {
            defer.reject('Request for Vimeo API timed out after 30 seconds.');
          }, 30000);
        });
      }

      return promiseVimeoAPI;
    },

    promisePlayer: function(id, options) {
      return this.promiseAPI().then(function() {
        return $.Deferred(function(defer) {
          if (typeof window.Vimeo === 'undefined') {
            defer.reject(
              "We're sorry, something went wrong. The Vimeo API has not loaded correctly."
            );
          }

          var player = new window.Vimeo.Player(id, options);

          setTimeout(function() {
            defer.reject(
              'Request for Vimeo player has timed out after 30 seconds.'
            );
          }, 30000);

          player.ready().then(function() {
            defer.resolve(player);
          });
        });
      });
    }
  };

  var selectors = {
    loadPlayerButton: '.video-section__load-player-button',
    closePlayerButton: '.video-section__player-close',
    playerContainer: '.video-section__player',
    cover: '.video-section__cover',
    errorMessage: '.video-section__error',
    bodyOverlay: '.video-section__body-overlay',
    body: 'body'
  };
  var classes = {
    playerLoading: 'video-section--loading',
    playerLoaded: 'video-section--loaded',
    playerError: 'video-section--error',
    videoPlaying: 'video-playing'
  };

  function Video(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');
    this.namespace = '.' + sectionId;
    this.onLoad();
  }

  Video.prototype = _.assignIn({}, Video.prototype, {
    onLoad: function() {
      this.$container
        .on('click', selectors.loadPlayerButton, this._loadPlayer.bind(this))
        .on('click', selectors.closePlayerButton, this._closePlayer.bind(this))
        .on('click', selectors.bodyOverlay, this._closePlayer.bind(this));
    },

    _loadPlayer: function() {
      var $container = this.$container;
      var $playerContainer = $(selectors.playerContainer, $container);
      var playerType = this.$container.attr('data-video-type');

      var promiseVideoPlayer;

      if (playerType === 'youtube') {
        promiseVideoPlayer = this._loadYoutubePlayer($playerContainer[0]);
      } else if (playerType === 'vimeo') {
        promiseVideoPlayer = this._loadVimeoPlayer($playerContainer[0]);
      }

      return promiseVideoPlayer
        .then(this._onPlayerLoadReady.bind(this))
        .fail(this._onPlayerLoadError.bind(this));
    },

    _loadYoutubePlayer: function(container) {
      return youtube
        .promisePlayer(container, {
          videoId: this.$container.attr('data-video-id'),
          ratio: 16 / 9,
          playerVars: {
            modestbranding: 1,
            autoplay: 1,
            showinfo: 0,
            rel: 0
          }
        })
        .then(
          function(player) {
            this.player = player;
          }.bind(this)
        );
    },

    _loadVimeoPlayer: function(container) {
      return vimeo
        .promisePlayer(container, {
          id: this.$container.attr('data-video-id')
        })
        .then(
          function(player) {
            this.player = player;
            this.player.play();
          }.bind(this)
        );
    },

    _onPlayerLoadReady: function() {
      $(selectors.closePlayerButton, this.$container)
        .show()
        .focus();
      $(selectors.cover, this.$container).addClass(classes.playerLoaded);
      this.$container.addClass(classes.playerLoaded);

      this._setScrollPositionValues();

      $(selectors.body).addClass(classes.videoPlaying);

      $(document).on('keyup' + this.namespace, this._closeOnEscape.bind(this));
      $(window).on(
        'resize' + this.namespace,
        this._setScrollPositionValues.bind(this)
      );
      slate.a11y.trapFocus({
        $container: this.$container,
        namespace: this.namespace
      });
    },

    _onPlayerLoadError: function(err) {
      this.$container.addClass(classes.playerError);
      $(selectors.errorMessage, this.$container).text(err);
    },

    _closeOnEscape: function(evt) {
      if (evt.keyCode !== 27) {
        return;
      }

      this._closePlayer();
      $(selectors.loadPlayerButton, this.$container).focus();
    },

    _onScroll: function() {
      var scrollTop = $(window).scrollTop();

      if (
        scrollTop > this.videoTop + 0.25 * this.videoHeight ||
        scrollTop + this.windowHeight <
          this.videoBottom - 0.25 * this.videoHeight
      ) {
        // Debounce DOM edits to the next frame with requestAnimationFrame
        requestAnimationFrame(this._closePlayer.bind(this));
      }
    },

    _setScrollPositionValues: function() {
      this.videoHeight = this.$container.outerHeight(true);
      this.videoTop = this.$container.offset().top;
      this.videoBottom = this.videoTop + this.videoHeight;
      this.windowHeight = $(window).innerHeight();
    },

    _closePlayer: function() {
      $(selectors.body).removeClass(classes.videoPlaying);
      $(selectors.cover, this.$container).removeClass(classes.playerLoaded);
      this.$container.removeClass(classes.playerLoaded);
      $(selectors.closePlayerButton, this.$container).hide();

      slate.a11y.removeTrapFocus({
        $container: this.$container,
        namespace: this.namespace
      });

      if (typeof this.player.destroy === 'function') {
        this.player.destroy();
      } else if (typeof this.player.unload === 'function') {
        this.player.unload();
      }

      $(document).off(this.namespace);
      $(window).off(this.namespace);
    }
  });

  return Video;
})();

theme.CollectionsList = (function() {
  function CollectionsList(container) {
    var $container = (this.$container = $(container));
    var stretchImage = $container.is('[data-stretch-image]');

    // Early return if 'secondary image layout' is enabled
    if (stretchImage) return;

    var namespace = (this.namespace = '.' + $container.attr('data-section-id'));
    var self = this;

    self._collectionListFix();
    $(window).on(
      'resize' + namespace,
      $.debounce(250, function() {
        self._collectionListFix();
      })
    );
  }

  CollectionsList.prototype = _.assignIn({}, CollectionsList.prototype, {
    onUnload: function() {
      $(window).off(this.namespace);
    },

    _collectionListFix: function() {
      var numberRows = this.$container.find('.grid').data('number-rows');
      var $featureCards = this.$container.find('.featured-card');

      // We can exit if 'Use secondary image layout' is enabled
      if ($featureCards.is('[data-stretch-image]')) return;

      // Go through each of the rows
      for (var i = 0; i < numberRows; i++) {
        var maxWrapperHeight = 0;
        var maxHeaderHeight = 0;
        var $currentRow = $featureCards.filter(
          "[data-row-number='" + (i + 1) + "']"
        );
        var $cardHeaders = $currentRow.find('.featured-card__header');

        // Find the max heights for each row
        $currentRow.each(function() {
          var $cardTitle = $(this).find('.featured-card__title');
          var $cardAction = $(this).find('.featured-card__action');
          var $cardImageWrapper = $(this).find('.featured-card__image-wrapper');
          var headerHeight =
            $cardTitle.outerHeight() + $cardAction.outerHeight() + 65;
          var wrapperHeight = $cardImageWrapper.outerHeight();
          if (headerHeight > maxHeaderHeight) {
            maxHeaderHeight = headerHeight;
          }
          if (wrapperHeight > maxWrapperHeight) {
            maxWrapperHeight = wrapperHeight;
          }
        });

        // Set the heights of the headers and cards for this row with padding
        $cardHeaders.outerHeight(maxHeaderHeight);
        $currentRow.height(maxWrapperHeight + maxHeaderHeight + 40);
      }
    }
  });

  return CollectionsList;
})();

theme.ProductRecommendations = (function() {
  function ProductRecommendations(container) {
    this.$container = $(container);

    var baseUrl = this.$container.data('baseUrl');
    var productId = this.$container.data('productId');
    var recommendationsSectionUrl =
      baseUrl +
      '?section_id=product-recommendations&product_id=' +
      productId +
      '&limit=6';

    $.get(recommendationsSectionUrl).then(
      function(section) {
        var recommendationsMarkup = $(section).html();
        if (recommendationsMarkup.trim() !== '') {
          this.$container.html(recommendationsMarkup);
        }
      }.bind(this)
    );
  }

  return ProductRecommendations;
})();


theme.init = function() {
  theme.customerTemplates.init();
  slate.rte.wrapTable();
  slate.rte.iframeReset();

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on('click', function(evt) {
    evt.preventDefault();
  });

  // Sections
  var sections = new theme.Sections();
  sections.register('header', theme.HeaderSection);
  sections.register('product', theme.Product);
  sections.register('featured-product', theme.Product);
  sections.register('collection-filters', theme.Filters);
  sections.register('map', theme.Maps);
  sections.register('slideshow', theme.Slideshow);
  sections.register('cart', theme.Cart);
  sections.register('quotes', theme.Quotes);
  sections.register('video', theme.Video);
  sections.register('collections-list', theme.CollectionsList);
  sections.register('product-recommendations', theme.ProductRecommendations);

  // Standalone modules
  $(window).on('load', theme.articleImages);
  theme.passwordModalInit();
  theme.productCardImageLoadingAnimation();
};

theme.articleImages = function() {
  var $indentedRteImages = $('.rte--indented-images');
  if (!$indentedRteImages.length) {
    return;
  }

  $indentedRteImages.find('img').each(function(i, el) {
    var $el = $(el);
    var attr = $el.attr('style');

    // Check if undefined or float: none
    if (!attr || attr === 'float: none;') {
      // Add class to parent paragraph tag if image is wider than container
      if ($el.width() >= $indentedRteImages.width()) {
        $el.parent('p').addClass('rte__image-indent');
      }
    }
  });
};

theme.passwordModalInit = function() {
  var $loginModal = $('#LoginModal');
  if (!$loginModal.length) {
    return;
  }

  // Initialize modal
  theme.PasswordModal = new window.Modals('LoginModal', 'login-modal', {
    focusOnOpen: '#Password'
  });

  // Open modal if errors exist
  if ($loginModal.find('.errors').length) {
    theme.PasswordModal.open();
  }
};

theme.productCardImageLoadingAnimation = function() {
  var selectors = {
    image: '[data-image]',
    imagePlaceholder: '[data-image-placeholder]',
    imageWithPlaceholderWrapper: '[data-image-with-placeholder-wrapper]'
  };

  var classes = {
    hidden: 'placeholder-background--hide'
  };

  $(document).on('lazyloaded', function(e) {
    var $target = $(e.target);

    if (!$target.is(selectors.image)) {
      return;
    }

    $target
      .closest(selectors.imageWithPlaceholderWrapper)
      .find(selectors.imagePlaceholder)
      .addClass(classes.hidden);
  });

  // When the theme loads, lazysizes might load images before the "lazyloaded"
  // event listener has been attached. When this happens, the following function
  // hides the loading placeholders.
  function onLoadHideLazysizesAnimation() {
    $(selectors.image + '.lazyloaded')
      .closest(selectors.imageWithPlaceholderWrapper)
      .find(selectors.imagePlaceholder)
      .addClass(classes.hidden);
  }

  onLoadHideLazysizesAnimation();
};

$(theme.init);
