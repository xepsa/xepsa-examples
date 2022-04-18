# HTML5 Resizeable Canvas Template

## index.html

* Created using Emmet `html:5` shortcut.
* Header defined `<style>` tag
    * Define `canvas` border to let us see it.
    * Define `height` and `width`
        * NB: HTML Elements do not always expand vertically. define in JS.
    * Optional: Define a `background` colour.
* `canvas` element to define HTML5 canvas.
* `<script>` tag to load `canvas.js`.

## canvas.js

* Select `canvas` element and set the width and height from the `window`.

    ```js
    var canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ```

---

## References

* [Resize HTML5 canvas to fit window](https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window)
* [Remove Scrollbars](https://stackoverflow.com/questions/26745292/canvas-toggle-filling-whole-page-removing-scrollbar)
* [Resizing Canvas Vector Graphics Without Aliasing](https://medium.com/@doomgoober/resizing-canvas-vector-graphics-without-aliasing-7a1f9e684e4d)

