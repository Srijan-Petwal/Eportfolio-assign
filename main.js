import './style.css'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger'

// import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { TextPlugin } from 'gsap/TextPlugin'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import SplitType from 'split-type';
import * as dat from 'dat.gui'
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

 const loader2 = new GLTFLoader()
// const loader = new FBXLoader()
let ring = null
let contactRotation = false
let renderer,scene,camera
 let controls=null
 document.querySelector('.introduction-video').addEventListener('click',()=>{
  window.open('https://www.youtube.com',"_blank")
 })

function initThreeJS() {

  // Debug
  const gui = new dat.GUI()
  dat.GUI.toggleHide()

  // Canvas
  const canvas = document.querySelector('canvas.webgl')

  // Scene
  scene = new THREE.Scene()

  // Middle stuff




  
    


    
  loader2.load('viking_book.glb', function(object) {
  ring = object.scene

    ring.position.set(-7.5,-1,-10)
    ring.scale.set(.04,.04,.04)
    scene.add(ring)
    ring.traverse(function(child) {
        if (child.isMesh && child.material) {
          child.material.wireframe = true;
          child.material.opacity = 0.7;
          child.material.transparent = true;
        }
      });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'section.details',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      defaults: {
        ease: 'power3.out',
        duration: 3
    },
    
    })

    tl.to(ring.position, {
      z: 10,
      y: -0.34
    })
  
   
    const tl2 = gsap.timeline()
    // let hover=false;
    // document.querySelector('.logo-svg').addEventListener('mouseover',()=>{
    //   hover=true;
    // })
    tl2.to(".logo-svg", {
    scale: 1.2,
    duration:1.9,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut"
    })
    .to(".logo-svg *", {
    fill:gsap.utils.random(["#ff0066", "pink", "green", "#ffcc00","cyan","mediumpurple","orangered"], true),
    opacity:0.7,
    duration:3,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
    },"<");
     
    
    document.querySelector('.logo-svg').addEventListener('mouseenter', () => {
      tl2.timeScale(20); // speed up
    });

    document.querySelector('.logo-svg').addEventListener('mouseleave', () => {
      tl2.timeScale(1); // back to normal speed
    });


    // Function to toggle wireframe
    // function toggleWireframe(model, isWireframe, opacity) {
    //   model.traverse(function(child) {
    //     if (child.isMesh && child.material) {
    //       child.material.wireframe = isWireframe;
    //       child.material.opacity = opacity;
    //       child.material.transparent = true;
    //     }
    //   });
    // }

    const contactTl = gsap.timeline({ 
      scrollTrigger: {
        trigger: 'section.contact',
        start: 'top 80%',
        end: 'bottom center',
        toggleActions: 'play none none reverse',
        scrub: true,
        onEnter: () => {
          // toggleWireframe(ring, true, 1)
          contactRotation = true
        },
        onEnterBack: () => {
          // toggleWireframe(ring, true, 1)
          contactRotation = true
        }

      }
    })

    contactTl.to(ring.position, {
      z: -10,
      x: 0,
      y: -.3
    })
    .to(ring.scale,{
      x:0.02,
      y:0.02,
      z:0.02
    })



    const directionalLight = new THREE.DirectionalLight('pink',5)
    directionalLight.position.z = 10
    scene.add(directionalLight)



})
    /**
   * Sizes
   */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
  }

    
  window.addEventListener('resize', () =>
  {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
  
      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
  
      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  
  /**
   * Camera
   */
  // Base camera
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 2
  scene.add(camera)

    /**
   * Renderer
   */
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//    controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // smooth rotation

}

// Preloading

function preloadFile(url) {
  return new Promise((resolve, reject) => {
    const fileType = url.split('.').pop().toLowerCase();

    if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif' || fileType === 'svg') {
      // Preload images
      const img = new Image();
      img.src = url;
      img.onload = resolve;
      img.onerror = reject;
    } else if (fileType === 'mp4' || fileType === 'webm') {
      // Preload videos
      const video = document.createElement('video');
      video.src = url;
      video.onloadeddata = resolve;
      video.onerror = reject;
    } else {
      // Preload other file types (like GLB)
      fetch(url)
        .then(response => response.blob())
        .then(resolve)
        .catch(reject);
    }
  });
}


function preloadFiles(urls) {
  const promises = urls.map(url => preloadFile(url));
  
  Promise.all(promises)
    .then(() => {
      console.log('All files preloaded');
      // Hide loading screen and show the UI
      document.querySelector('.loading-screen').classList.add('hide-loader')
      //document.querySelector('.loading-screen').style.display = 'block'

      //document.getElementById('mainUI').style.display = 'block';
    })
    .catch(error => console.error('Error preloading files:', error));
}




function animateWords() {

  const words = ["Abstract","Anicca","Esoteric","Metta","Absurdist","Shoshin","Curious","Kensho"]
  let currentIndex = 0
  let split
  const textElement = document.querySelector('.primary-h1 span')

  function updateText() {
    textElement.textContent = words[currentIndex]
    split = new SplitType(textElement, {type: 'chars' })
    animateChars(split.chars)
    currentIndex = (currentIndex + 1) % words.length
  }

  function animateChars(chars) {
    gsap.from(chars, {
      // opacity:0,
      yPercent: 100,
      stagger: 0.03,
      duration: 1.5,
      ease: 'power4.out',
      onComplete: () => {
        if (split) {
          split.revert()
        }
      }
    })
  }

  setInterval(updateText, 3000)

}

function inspectionSection() {
  const inspectionTl = gsap.timeline({ 
    scrollTrigger: {
      trigger: '.inspection',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })

  inspectionTl
    .to('.inspection h2', {
      y: -100
    })
    .to('.ring-bg', {
      y: -50,
      height: 300
    }, "<")

  gsap.to('.marquee h3', {

    scrollTrigger: {
      trigger: '.marquee h3',
      start: 'top 80%',
      end: 'bottom top',
      scrub: true
    },
    x: 200,
    yPercent:7
  })


}

function sliderSection() {

  let mm = gsap.matchMedia()

  mm.add("(min-width: 768px)", () => {

    let slider = document.querySelector('.slider')
    let sliderSections = gsap.utils.toArray('.slide')

    let sliderTl = gsap.timeline({
      defaults: {
        ease: 'none'
      },
      scrollTrigger: {
        trigger: slider,
        pin: true,
        scrub: 1,
        end: () => "+=" + slider.offsetWidth
      }
    })

    sliderTl
      .to(slider, {
        xPercent: -66
      }, "<")
      .to('.progress', {
        width: '100%'
      }, "<")

    sliderSections.forEach((stop, index) => {
      const slideText = new SplitType(stop.querySelector('.slide-p'), { types: 'chars' });

      sliderTl.from(slideText.chars, {
        opacity: 0,
        y: 10,
        stagger: .03,
        scrollTrigger: {
          trigger: stop.querySelector('.slide-p'),
          start: 'top bottom',
          end:   'bottom center',
          containerAnimation: sliderTl,
          scrub: true,
        }
      })
    })

  })

}

function contactSection()  {

  gsap.set('h4, .inner-contact span', {
    yPercent: 100
  })
  gsap.set(['.inner-contact p','.story-video'], { 
    opacity: 0
  })

  const contactTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.inner-contact',
      start: '-20% center',
      end: '10%  40%',
      scrub: true,
    }
  })

  contactTl
    .to('.line-top, .line-bottom', {
      width: '100%'
    })
    .to('h4, .inner-contact span', {
      yPercent: 0
    })
    .to(['.inner-contact p','.story-video'], {
      opacity: 1,
      stagger:0.5
    })

}

function vocabularySection(){
  gsap.from('.vocabulary-section img',{
    scale:0,
    duration:3,
    ease:"elastic.inOut(2,0.2)",
    stagger:0.1,
    scrollTrigger:{
      trigger: '.vocabulary-section',
      start: '-25% center',
      end: '50%  50%',
      toggleActions: 'play none restart reset'
      // scrub: true,
    }
  })
  gsap.from(['.vocabulary-section p','.vocabulary-section h1'],{
    opacity:0,
    duration:1,
    delay:2,
    stagger:0.2,
    // ease:"elastic.inOut(2,0.2)",
    scrollTrigger:{
      trigger: '.vocabulary-section',
      start: '-20% center',
      end: '50%  50%',
      toggleActions: 'play none restart reset'
    }
  })
}



function initRenderLoop() {

  const clock = new THREE.Clock()

  const tick = () =>
  {

      const elapsedTime = clock.getElapsedTime()

      // Update objects
      if (ring) {
        if (!contactRotation) {
          // ring.rotation.y = -.2 * elapsedTime
          ring.rotation.x = 0
          ring.rotation.z = 0
        }
        else {
          ring.rotation.y = -.05 * elapsedTime
          ring.rotation.x = 0
          // ring.rotation.z = .05 * elapsedTime
        }
      }

      // Update Orbital Controls
      // controls.update()
     
      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
     
      window.requestAnimationFrame(tick)
      
  }
 
  tick()
}

function setupSmoothScroll() {
  const lenis = new Lenis();

  // Connect Lenis to ScrollTrigger
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    pinType: document.body.style.transform ? "transform" : "fixed"
  });

  lenis.on("scroll", ScrollTrigger.update);
  ScrollTrigger.defaults({ scroller: document.body });

  // Start render loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}


document.addEventListener('DOMContentLoaded', () => {

    // Preloader
    preloadFiles(['asset2.jpg','background4.jpg','viking_book.glb','hands2.mp4','bg-2-compressed','/tinified/1.png','/tinified/2.png','/tinified/3.png','/tinified/4.png','/tinified/5.png','/tinified/6.png','/tinified/7.png']);

  initThreeJS()
  initRenderLoop()

  animateWords()
  inspectionSection()
  sliderSection()
  contactSection() 
  vocabularySection()
  setupSmoothScroll()

})