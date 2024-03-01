console.clear();

Splitting({ target: '.planet-title h1', by: 'chars' });

const elApp = document.querySelector('#app');

const elPlanets = Array.from(document.querySelectorAll('[data-planet]'))
  .reduce((acc, el) => {
    const planet = el.dataset.planet;
    
    acc[planet] = el;
    
    return acc;
  }, {});

const planetKeys = Object.keys(elPlanets);

function getDetails(planet) {
  // inclinação, gravidade, horas
  const details = Array.from(elPlanets[planet]
    .querySelectorAll(`[data-detail]`))
    .reduce((acc, el) => {
      acc[el.dataset.detail] = el.innerHTML.trim();
      
      return acc;
    }, { planet });
  
  return details;
}

let currentPlanetIndex = 0;
let currentPlanet = getDetails('Mercúrio');

function selectPlanet(planet) {
  const prevPlanet = currentPlanet;
  const elActive = document.querySelector('[data-active]');
  
  delete elActive.dataset.active;
  
  const elPlanet = elPlanets[planet];
  
  elPlanet.dataset.active = true;
  currentPlanet = getDetails(elPlanet.dataset.planet)
  
  console.log(prevPlanet, currentPlanet);
  
  const elhorasDetail = elPlanet.querySelector('[data-detail="horas"]')
  animate.fromTo({
    from: +prevPlanet.horas,
    to: +currentPlanet.horas
  }, value => {
    elhorasDetail.innerHTML = Math.round(value);
  })
  
  const elinclinaçãoDetail = elPlanet.querySelector('[data-detail="inclinação"]')
  animate.fromTo({
    from: +prevPlanet.inclinação,
    to: +currentPlanet.inclinação
  }, value => {
    elinclinaçãoDetail.innerHTML = (value).toFixed(2);
  })
  
  const elgravidadeDetail = elPlanet.querySelector('[data-detail="gravidade"]')
  
  animate.fromTo({
    from: +prevPlanet.gravidade,
    to: +currentPlanet.gravidade
  }, value => {
    elgravidadeDetail.innerHTML = (value).toFixed(1);
  })
}

function selectPlanetByIndex(i) {
  currentPlanetIndex = i;
  elApp.style.setProperty('--active',i);
  selectPlanet(planetKeys[i]);
}

function animate(duration, fn) {
  const start = performance.now();
  const ticks = Math.ceil(duration / 16.666667);
  let progress = 0;
  
  function tick(now) {
    if (progress >= 1) {
      fn(1);
      return;
    }
    
    const elapsed = now - start;
    progress = elapsed / duration;
    
    
    fn(progress); 
    
    requestAnimationFrame(tick);
  }
  
  tick(start);
}

function easing(progress) {
  return (1 - Math.cos(progress * Math.PI)) / 2
}

const animationDefaults = {
  duration: 1000,
  easing
}

animate.fromTo = ({
  from,
  to,
  easing,
  duration
}, fn) => {
  easing = easing || animationDefaults.easing;
  duration = duration || animationDefaults.duration;
  
  const delta = +to - +from;
  
  return animate(duration, progress => fn(from + easing(progress) * delta));
}

const svgNS = 'http://www.w3.org/2000/svg';
const elSvgNav = document.querySelector('.planet-nav svg');

const elTspans = [...document.querySelectorAll('tspan')];;
const length = elTspans.length - 1;

elSvgNav.style.setProperty('--length',length);

const elNavPath = document.querySelector('#navPath');
const elLastTspan =  elTspans[length];
const navPathLength = elNavPath.getTotalLength() - elLastTspan.getComputedTextLength();

elTspans.forEach( (tspan,i) => {
  let percent = i / length;
  
  tspan.setAttribute('x', percent * navPathLength);
  tspan.setAttributeNS(svgNS, 'x', percent * navPathLength);
  
  tspan.addEventListener('click', (e)=>{
    e.preventDefault();
    selectPlanetByIndex(i);
  });
  
});
