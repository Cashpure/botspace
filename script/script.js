const headerLink = document.querySelectorAll('.header-top__nav-link')
const hoverColors = ['#743a75', '#619adc', '#cc8291']
const overlay = document.querySelector('.overlay')
const formWrapper = document.querySelector('.form-wrapper')
const forms = Array.from(document.getElementsByClassName('header-main__form'))
const sign = document.querySelector('.header-main__sign')
const log = document.querySelector('.header-main__log')
const confirm = document.querySelector('.header-main__sign-confirm')
const planets = document.querySelectorAll('.main-astro__planet-wrapper')
let astroInner = document.querySelector('.main-astro__inner')
const footerLink = document.querySelectorAll('.footer-main__link')

let hoverColorsIndex = 0

headerLink.forEach(el => {
   el.onmouseover = () => {
      el.style.color = hoverColors[hoverColorsIndex]
   }
   el.onmouseout = () => {
      if (hoverColorsIndex == hoverColors.length - 1) {
         hoverColorsIndex = 0
      } else hoverColorsIndex++

      el.style.color = 'white'
   }
})

footerLink.forEach(el => {
   el.onmouseover = () => {
      el.style.color = hoverColors[hoverColorsIndex]
   }
   el.onmouseout = () => {
      if (hoverColorsIndex == hoverColors.length - 1) {
         hoverColorsIndex = 0
      } else hoverColorsIndex++

      el.style.color = 'white'
   }
})



sign.onclick = () => {
   overlay.classList.toggle('overlay--active')
   formWrapper.classList.toggle('form-wrapper--active')
   forms[0].classList.toggle('header-main__form--active')
   forms[1].style.display = 'none'
}
log.onclick = () => {
   overlay.classList.toggle('overlay--active')
   formWrapper.classList.toggle('form-wrapper--active')
   forms[1].classList.toggle('header-main__form--active')
   forms[0].style.display = 'none'
}



overlay.onclick = () => {
   overlay.classList.toggle('overlay--active')
   formWrapper.classList.toggle('form-wrapper--active')
   forms.forEach(el => {
      if (el.classList.contains('header-main__form--active')) {
         el.classList.remove('header-main__form--active')
      }
   })
}

let radius = 0;
let centerX = 0;
let centerY = 0;

let rotationVelocity = 0;
let scrollDelta = 0;
const friction = 0.95;
const sensitivity = 0.0001;

const defaultCursor = () => {
   const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
   const isMobileUA = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
   return isTouch || isMobileUA;
}

if (defaultCursor()) {
   const customCursor = document.getElementById('cursor')
   customCursor.style.display = 'block'
}

function resize() {
   radius = (astroInner.offsetWidth - planets[0].offsetWidth) / 2;
   centerX = astroInner.offsetWidth / 2;
   centerY = astroInner.offsetHeight / 2;
   const customCursor = document.getElementById('cursor')
   if (defaultCursor() && customCursor) {
      customCursor.style.display = 'none'
   } else {
      customCursor.style.display = 'block'
   }
}
resize();
window.addEventListener('resize', resize);

planets.forEach((planet, i) => {
   planet.angle = (2 * Math.PI / planets.length) * i;
   planet.style.position = 'absolute';
});

function rotate() {
   rotationVelocity += scrollDelta * sensitivity;
   scrollDelta = 0;

   rotationVelocity *= friction;

   planets.forEach(planet => {
      planet.angle += rotationVelocity;

      const x = centerX + radius * Math.cos(planet.angle) - planet.offsetWidth / 2;
      const y = centerY + radius * Math.sin(planet.angle) - planet.offsetHeight / 2;

      planet.style.left = `${x}px`;
      planet.style.top = `${y}px`;
   });

   requestAnimationFrame(rotate);
}
rotate();

let lastScroll = window.scrollY;
window.addEventListener('scroll', () => {
   const currentScroll = window.scrollY;
   const delta = currentScroll - lastScroll;
   lastScroll = currentScroll;

   scrollDelta += delta;
});

const lerp = (a, b, n) => (1 - n) * a + n * b;
class Cursor {
   constructor() {
      this.target = { x: 0.5, y: 0.5 };
      this.cursor = { x: 0.5, y: 0.5 };
      this.speed = 1;
      this.init();
   }
   bindAll() {
      ["onMouseMove", "render"].forEach((fn) => (this[fn] = this[fn].bind(this)));
   }
   onMouseMove(e) {
      this.target.x = e.clientX / window.innerWidth;
      this.target.y = e.clientY / window.innerHeight;

      if (!this.raf) this.raf = requestAnimationFrame(this.render);
   }
   render() {
      this.cursor.x = lerp(this.cursor.x, this.target.x, this.speed);
      this.cursor.y = lerp(this.cursor.y, this.target.y, this.speed);
      document.documentElement.style.setProperty("--cursor-x", this.cursor.x);
      document.documentElement.style.setProperty("--cursor-y", this.cursor.y);

      const delta = Math.sqrt(
         Math.pow(this.target.x - this.cursor.x, 2) +
         Math.pow(this.target.y - this.cursor.y, 2)
      );
      if (delta < 0.001) {
         cancelAnimationFrame(this.raf);
         this.raf = null;
         return;
      }

      this.raf = requestAnimationFrame(this.render);
   }
   init() {
      this.bindAll();
      window.addEventListener("mousemove", this.onMouseMove);
      this.raf = requestAnimationFrame(this.render);
   }
}
let cursor = new Cursor();

