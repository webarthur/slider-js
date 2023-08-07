# Slider.js

Draggable infinite slider/carousel responsible in JavaScript (vanilla js)

Simples, small e clean. And semantic too.

```html
<div id="slider" class="slider">
  <div class="slider-wrapper">
    <ul class="slides">
      <li class="slide">Slide 1</li>
      <li class="slide">Slide 2</li>
      <li class="slide">Slide 3</li>
      <li class="slide">Slide 4</li>
      <li class="slide">Slide 5</li>
    </ul>
  </div>
  <a class="control slider-prev"></a>
  <a class="control slider-next"></a>
  <div class="slider-dots"></div>
</div>
```

```javascript
const slider = Slider('#slider', {
  dots: '.slider-dots',
})
```

## Demo

https://codepen.io/devarthur/pen/ZEmZryK
