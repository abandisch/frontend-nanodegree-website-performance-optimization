# Project 4: Website Performance Optimization

This is the fourth project for the Udacity Front-End Web Developer nanodegree submitted by Alexander Bandisch.

The purpose of this project is to apply various web optimization techniques to speed up pages, improve performance and reduce applicable jank within the pages of the portfolio website.  

## Installation

Source files are located under the `src` directory and the production files, including all optimized images, are located under the `dist` directory. 

To edit the source files, you'll need Grunt installed globally, then run under the root directory (where package.json is located), run the following on the command line:
```sh
$ npm install
```
Then to watch for changes, run `grunt` from the command line:
```sh
$ grunt
```

## Changes to "index.html"

The following lists the changes that were done to the index.html page in order to achieve a PageSpeed score of above 90 for both mobile and desktop:

1.Google fonts - Removed link tag and replaced 'Open Sans' with Arial:
```sh
   <link href="//fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">
```
```sh
    body, button, input, select, textarea { font-family: 'Arial', sans-serif; color: #333; } 
```

2.Added media="print" to print.css link tag to prevent render blocking on screen devices:
```sh
<link href="css/print.css" rel="stylesheet" media="print">
```

3.Added "async" attribute to script tag for Google analytics script:
```sh
<script async src="http://www.google-analytics.com/analytics.js"></script>
```

4.Used image editing application to optimize the size of the profile image
```sh
<img src="img/profilepic.jpg" alt="Profile Image">
```

5.Optimized pizzeria.jpg and created smaller image called pizzeria_100x75.jpg to use with the index.html page
```sh
<img alt="Project 4" style="width: 100px;" src="views/images/pizzeria_100x75.jpg">
```

6.Minified CSS, JS and HTML and removed comments

Used grunt's minification plugins to both minify and remove all comments from all the required CSS, javascript and HTML files.

6.Added .htaccess to leverage browser caching and use compression

This .htaccess file was obtained from https://github.com/h5bp/server-configs-apache.

*Note*: While it  depends on what the underlying web server is, as to which configuration file to use, I chose to use a .htaccess file as apache seems to be the most common web server. 

## Changes to "project-2048.html", "project-mobile.html" and "project-webperf.html"

Although not part of the evaluation matrix, similar web performance changes were done to these files as well. Please review the comments in each of these pages.

## Changes to "views/js/main.js"

### 60fps when scrolling through the pizza.html

The following changes were completed, to achieve a consistent frame rate of 60fps when scrolling through the pizza.html page

1.Added global array to store the basicLeft value of each of the pizza elements. This will allow the updatePositions() function later on to lookup these values from the array, rather than query the element itself.
```sh
var basicLeftArray = [];
```

2.Updated `DOMContentLoaded` anonymous function to:
  
  1.Reduced the number of generated pizzas from 200 to 31. This is the maximum number of pizzas that can be see on a full desktop screen - there is no need to create 200 of these pizzas
```sh
for (var i = 0; i < 31; i++) {
```

  2.Added new `left` style of 100px, because `updatePositions()` now uses `transform` style, which for some reason places the pizzas starting in the middle of the screen
```sh
elem.style.left = "100px";
```

Full code of DOMContentLoaded anonymous function is as follows:
```sh
// Generates the sliding pizzas when the page loads.
document.addEventListener('DOMContentLoaded', function() {
  var cols = 8;
  var s = 256;
  // ALEX: Reduce number of pizzas from 200 to 31. The most we can see on the screen at any given moment is 31 - I counted.
  for (var i = 0; i < 31; i++) {
    var elem = document.createElement('img');
    elem.className = 'mover';
    elem.src = "images/pizza.png";
    elem.style.height = "100px";
    elem.style.left = "100px";      // Alex: Using transform places the pizzas in the middle of the page, added this style to address that
    elem.style.width = "73.333px";
    elem.basicLeft = (i % cols) * s;
    elem.style.top = (Math.floor(i / cols) * s) + 'px';
    document.querySelector("#movingPizzas1").appendChild(elem);
    basicLeftArray[i] = (i % cols) * s; // Alex: store basicLeft value in an array for looking up later in updatePositions
  }
  updatePositions();
});
```

3.Refactored updatePositions function as follows
  
  1.Moved `document.body.scrollTop` out of for loop so it doesn't need to be re-calculated for every pizza
```sh
  // Alex: Move document.body.scrollTop out of for loop and declare a variable for it
  var items = document.querySelectorAll('.mover'),
      scrollTop = (document.body.scrollTop / 1250),
      translateX, phase;
```

  2.Pizza element's basicLeft value is now obtained from the global array `basicLeftArray`
```sh  
  translateX = basicLeftArray[i] + 100 * phase;
```  

  3.Used `transform` css style instead of `left` - according to csstriggers.com, `transform` only affects the Composite, whereas `left` affects Layout, Paint and Composite
```sh
  items[i].style.transform = "translatex(" + translateX + "px)";
```    

Full code for `updatePositions()` function is as follows:
```sh
// Moves the sliding background pizzas based on scroll position
function updatePositions() {
  frame++;
  window.performance.mark("mark_start_frame");

  // Alex: Move document.body.scrollTop out of for loop and declare a variable for it
  var items = document.querySelectorAll('.mover'),
      scrollTop = (document.body.scrollTop / 1250),
      translateX, phase;

  for (var i = 0; i < items.length; i++) {
    phase = Math.sin(scrollTop + (i % 5));
    translateX = basicLeftArray[i] + 100 * phase;

    // Alex: Using 'transform' instead of 'left' - according to csstriggers.com, 'transform' only affects
    //       the Composite, this should help with the jank.
    items[i].style.transform = "translatex(" + translateX + "px)";
  }

  // User Timing API to the rescue again. Seriously, it's worth learning.
  // Super easy to create custom metrics.
  window.performance.mark("mark_end_frame");
  window.performance.measure("measure_frame_duration", "mark_start_frame", "mark_end_frame");
  if (frame % 10 === 0) {
    var timesToUpdatePosition = window.performance.getEntriesByName("measure_frame_duration");
    logAverageFrame(timesToUpdatePosition);
  }
}
```

4.Added `will-change: transform;` to `.mover` class within `style.css`
```sh
  .mover {
    position: fixed;
    width: 256px;
    z-index: -1;
    will-change: transform;
  }
```  
  

### Rezize pizzas in less than 5ms in pizza.html

To resize pizzas in less than 5ms in pizza.html, the following was completed

1.Updated `changePizzaSizes()` function as follows
  1.Moved `document.querySelectorAll(".randomPizzaContainer")` out of for loop, into it's own variable
```sh
var pizzas = document.querySelectorAll(".randomPizzaContainer")  
```  

  2.Do not call `determineDx` function anymore, instead use switch statement to get new width, used as a percentage
```sh
  switch(size) {
    case "1":
      newWidth = 25;
      break;
    case "2":
      newWidth = 33.3;
      break;
    case "3":
      newWidth =  50;
      break;
    default:
      console.log("Invalid size: " + size + ". Using default instead.");
      newWidth = 33.3;
  }   
```  

  3.Update for loop to use new `pizzas` variable and set width as a percentage
```sh
    // iterate through each pizza element and set the new width as a percentage
    for (var i = 0; i < pizzas.length; i++) {
      pizzas[i].style.width = newWidth + '%';
    }  
```  