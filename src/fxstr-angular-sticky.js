'use strict';

/**
* Sticks an element to the browser's top if user scrolls further down
* If user 
* 
*/

angular
.module( 'fxstr.stickyElement', [] )
.directive( 'stickyElement', [ function() {

    function link( scope, element, attrs ) {






        ///////////////////////////////////////////////////
        //
        // VARS


        // Position of element if it doesn't stick
        var defaultPosition     = { 
                top: 0 
            }

            // Attributes of element before we started to stick it; on unStick, 
            // element will be reset to this state
            , initialAttributes = {
                top             : undefined
                , left          : undefined
                , position      : undefined
                , width         : undefined
            }

            // (Positive) difference between the elemtn's and the window's height
            // Don't just stick the element when it's top is reached: if it's higher
            // than the window, scroll to it's bottom
            , elementOverHeight

            // Selector for element that marks the «bottom» of the page
            , bottomSelector    = attrs.stickyElementBottomSelector ? attrs.stickyElementBottomSelector : false
            , margin            = attrs.stickyElementMargin ? parseInt( attrs.stickyElementMargin, 10 ) : 0;









        ///////////////////////////////////////////////////
        //
        // MEASURING FUNCTIONS


        // Sets initialPosition: 
        // - on init
        // - on window resize
        // - on scope changes
        // After each event, watch for loading of images and calculate position as well
        function setDefaultPosition() {

            // Height might change when images are loaded
            element
                .find( 'img' )
                .on( 'load', function() {
                    calculateDefaultPosition();
                } )
                .each( function() {
                    if( this.complete ) {
                        $( this ).load();
                    }
                } );

            calculateDefaultPosition();

        }



        /**
        * Sets defaultPosition and elementOverHeight
        */
        function calculateDefaultPosition() {

            // Unstick first to re-set original position
            unStick();

            defaultPosition.top = element.offset().top;
            elementOverHeight = Math.max( 0, element.outerHeight() - $( window ).height() );

            initialAttributes.top       = element.css( 'top' );
            initialAttributes.left      = element.css( 'left' );
            initialAttributes.position  = element.css( 'position' );
            initialAttributes.width     = element.css( 'width' );

            // Re-stick if needed
            stickAndUnstick();

        }











        ///////////////////////////////////////////////////
        //
        // STICKING FUNCTIONS
        

        function stick() {


            // When footer is reached, we need to update the 
            // top position of the sticking element; therefore can't return from here
            // element is sticking already


            // How much of the bottom element is visible?
            var bottomOverlap = 0;
            if( bottomSelector ) {

                // Does the element overlap the bottom element? 
                // Difference between sticky element's bottom and bottom element's top
                var bottomElementTop    = $( bottomSelector ).offset().top
                    , scrollTop         = $( 'body' ).scrollTop() || $( 'html' ).scrollTop()
                    , elementBottom     = scrollTop + element.outerHeight() - elementOverHeight + margin;

                bottomOverlap = elementBottom - bottomElementTop;

                bottomOverlap = Math.max( bottomOverlap, 0 );

            }

            element
                .css( 'width', element.width() ) // Set width before we set fixed!
                .css( 'position', 'fixed' )
                .css( 'top', ( elementOverHeight * -1 ) - bottomOverlap + margin )
                .css( 'left', element.offset().left )

            element.data( 'isSticking', true );

        }





        function unStick() {

            if( !element.data( 'isSticking' ) ) {
                return;
            }

            element
                .css( 'position', initialAttributes.position )
                .css( 'left', initialAttributes.left )
                .css( 'top', initialAttributes.top )
                .css( 'width', initialAttributes.width )

            element.data( 'isSticking', false );

        }






        function stickAndUnstick() {

            // Mobile: unstick
            if( $( window ).width() < 768 ) {
                unStick();
                return;
            }

            var scrollTop = $( 'body' ).scrollTop() || $( 'html' ).scrollTop()
                , stickAt = defaultPosition.top + elementOverHeight - margin;

            if( scrollTop > stickAt ) {
                stick()
            }
            else {
                unStick();
            }

        }







        ///////////////////////////////////////////////////
        //
        // Measure element's position and height

        // Store element's top and left on every window resize
        // (so we don't need to check it on every scroll event)
        $( window ).on( 'resize', setDefaultPosition );
        setDefaultPosition();

        // Change in scope might change content of element: therefore
        // watch scope changes and re-measure stuff
        scope.$watch( function() {
            setDefaultPosition();
        } );




        ///////////////////////////////////////////////////
        //
        // Scroll

        // Stick/unstick on scroll
        $( window ).on( 'scroll.stick', function() {
            stickAndUnstick();
        } );



    }

    return {
        link        : link
        , scope     : true
    }


} ] );