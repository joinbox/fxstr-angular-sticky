An angular directive to stick HTML elements to the viewport (element keeps it's position even though the user scrolls down). 

**Features:**

- If the sticky element is higher than the viewport, it behaves like a regular element until it's *bottom* is reached. Only after it's bottom is reached, it sticks to the viewport.
- You may specify an element (e.g. the footer) that should not be overlapped by the sticky element.
- You may specify that the «sticky» element does only stick if another element is displayed; this allows you to easily limit the stickyness to certain display sizes.

#Installation

Download manually or through bower:

```bash
$ bower install fxstr-sticky-element
```

Plugin requires angular.

#Usage (Short version)

```html
<div data-sticky-element data-sticky-element-margin="20" data-sticky-element-bottom-selector=".footer" data-sticky-element-depend-on=".mobile"><h1>Stick me!</h1></div>
```

Makes the `<div>` sticky. For details, see [API](#api).

##<a name="api"></a>API

### Margin
Add the `data-sticky-element-margin` attribute with a numeric value to add a margin to the sticking element.

### Bottom Selector
If you don't want the sticky element to overlap another element, add the `data-sticky-bottom-selector` attribute with the other element's jQuery selector (e.g. `div.class#id`). 

### Depend On
If you want to limit the stickyness of the element to a certain display size, add the `data-sticky-depend-on` attribute with a jQuery selector (e.g. `div.class#id`). The element is only sticky if the element that is matched by this selector is visible. 

**Example:** To limit the stickyness to mobile devices, use

- HTML: 

  ```HTML
  <div data-sticky-element data-sticky-element-depends-on=".isMobile">Stick me on mobile devices</div>
  <div class="isMobile"></div>
  ```

- CSS: 

  ```CSS
  .isMobile {
    display:block; /* Not needed; just for demonstration purposes */
  }

  @media( min-width: 768px ) {
    .isMobile {
      display: none;
    }
  }
  ```
