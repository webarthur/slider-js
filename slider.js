// Based on https://codepen.io/cconceicao/pen/PBQawy (Claudia Conceicao)

// Define a Slider class constructor function that creates a slider instance.
// The function takes a query selector and an optional configuration object as parameters.
function Slider(query, opt = {}) {
  // Select the main slider element using the provided query selector.
  const slider = document.querySelector(query)

  // Select the container for the slides.
  const container = slider.querySelector('.slides')

  // Select the previous and next buttons for slider navigation.
  const btnPrev = slider.querySelector('.slider-prev')
  const btnNext = slider.querySelector('.slider-next')

  // Select all slide elements within the slider.
  const slides = slider.querySelectorAll('.slide')

  // Get the threshold value for slide shifting from the configuration object or use a default value.
  const threshold = opt.threshold || 30

  // Get the number of slides.
  const slidesLength = slides.length

  // Initialize the current slide index to 0.
  let index = 0

  // Flag to control whether slide shifting is allowed.
  let allowShift = true

  // Clone the first and last slides to create the infinite loop effect.
  const cloneFirst = slides[0].cloneNode(true)
  const cloneLast = slides[slidesLength - 1].cloneNode(true)

  // Append the cloned first slide at the end of the container.
  container.appendChild(cloneFirst)

  // Insert the cloned last slide at the beginning of the container.
  container.insertBefore(cloneLast, slides[0])

  // Set the container width to accommodate all slides plus the clones.
  container.style.width = `${(slidesLength + 2) * 100}%`

  // Add a class to indicate that the slider has finished loading.
  slider.classList.add('loaded')

  // Add event listeners for mouse and touch interactions.
  container.addEventListener('mousedown', dragStart)
  container.addEventListener('touchstart', dragStart, { passive: true })
  container.addEventListener('touchend', dragEnd)
  container.addEventListener('touchmove', dragAction)

  // Add click event listeners for previous and next buttons.
  btnPrev && btnPrev.addEventListener('click', previous)
  btnNext && btnNext.addEventListener('click', next)

  // Add an event listener to check for the end of slide transitions.
  container.addEventListener('transitionend', checkIndex)

  // Initialize variables to track the initial, final, and current positions of the drag action.
  let posInitial, posFinal, posX1 = 0, posY = 0, posX2 = 0

  // Function to navigate to the next slide.
  function next() {
    shift(++index)
  }

  // Function to navigate to the previous slide.
  function previous() {
    shift(--index)
  }

  // Function to handle the start of a drag action.
  function dragStart(e) {
    // Store the initial position of the container.
    posInitial = container.offsetLeft
    counter = 0

    // Check if the interaction is via touch or mouse.
    if (e.type === 'touchstart') {
      dragging = false
      posX1 = e.touches[0].clientX
      posY = e.touches[0].clientY
    } else {
      e.preventDefault()
      dragging = true
      posX1 = e.clientX
      posY = e.clientY
      document.addEventListener('mouseup', dragEnd)
      document.addEventListener('mousemove', dragAction)
    }
  }

  // Variables to track drag-related properties.
  let counter = 0
  let dragging = false

  // Function to handle the drag action.
  function dragAction(e) {
    counter++
    // Ensure a certain number of move events have occurred before activating the drag action.
    if (counter <= 4) return

    // Determine the current position of the drag.
    const { clientX, clientY } = e.type === 'touchmove' ? e.touches[0] : e
    
    // Prevent vertical dragging if the user is scrolling vertically.
    if (!dragging && Math.abs(clientY - posY) > Math.abs(clientX - posX1)) {
      return
    }
    
    // Apply the dragging effect by updating the container's position.
    container.classList.add('dragging')
    dragging = true
    posX2 = posX1 - clientX
    posX1 = clientX
    container.style.left = `${container.offsetLeft - posX2}px`
  }

  // Function to handle the end of a drag action.
  function dragEnd(e) {
    e.preventDefault()
    counter = 0
    posFinal = container.offsetLeft

    // Determine the direction and distance of the drag.
    if (posFinal - posInitial < -threshold) {
      shift(++index, 'drag')
    } else if (posFinal - posInitial > threshold) {
      shift(--index, 'drag')
    } else {
      // If the drag distance is not significant, reset the container position.
      container.style.left = `${posInitial}px`
    }

    // Remove dragging class and event listeners.
    container.classList.remove('dragging')
    document.removeEventListener('mouseup', dragEnd)
    document.removeEventListener('mousemove', dragAction)
  }

  // Function to shift the slides to a new index.
  function shift(newIndex, action) {
    container.classList.add('shifting')
    if (!allowShift) return

    // Store the initial position if the shift is not triggered by dragging.
    if (!action) posInitial = container.offsetLeft

    // Update the current index and slide positions.
    index = newIndex
    container.style.left = `${(index + 1) * -100}%`
    allowShift = false
  }

  // Function to handle the slide transition end event.
  function checkIndex() {
    container.classList.remove('shifting')

    // Ensure the index wraps around for infinite looping.
    index = (index + slidesLength) % slidesLength
    container.style.left = `${(index + 1) * -100}%`
    allowShift = true

    // Update the active state of dots for slide navigation.
    checkDots()
  }

  // Function to jump to a specific slide by index.
  function jumpTo(index) {
    if (index < 0 || index >= slidesLength) {
      console.error('Invalid index.')
      return
    }
    shift(index)
  }

  // Function to update the active state of navigation dots.
  function checkDots() {
    if (!opt.dots) return

    // Toggle the 'active' class for the corresponding dot.
    slider.querySelectorAll(`${opt.dots} span`).forEach((dot, i) => {
      dot.classList.toggle('active', i === index)
    })
  }

  // Add click event listeners for each navigation dot.
  if (opt.dots) {
    const dots = slider.querySelector(opt.dots)
    for (let i = 0; i < slidesLength; i++) {
      const dot = document.createElement('span')
      dot.addEventListener('click', () => {
        jumpTo(i)
        checkDots()
      })
      dots.appendChild(dot)
    }
    // Set the initial active state of dots.
    checkDots()
  }

  // Return methods that can be accessed externally.
  return { jumpTo, shift, previous, next }
}

// Create a new slider instance using the Slider constructor.
const slider = Slider('#slider', {
  dots: '.slider-dots', // Specify the dots for navigation.
})
