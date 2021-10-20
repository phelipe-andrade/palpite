const input = document.querySelector('[data-palpite]');
const button = document.querySelector('[data-enviar]');
const digitos = document.querySelectorAll('[data-digitos] li');
const message = document.querySelector('[data-message]');
const refresh = document.querySelector('[data-refresh]');
const display = document.querySelector('[data-digitos]');

let numberRandom;
let colorDigit = false;

async function initFetch() {
  const startfetch = await fetch(
    'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300',
  );
  const json = await startfetch.json();
  numberRandom = json.value;
  console.log(json.value);
}
initFetch();

function layout() {
  display.classList.add('reload', 'message');
}

function compareNumber() {
  layout();
  message.classList.add('active');
  if (numberRandom === +input.value) {
    message.innerText = 'Você acertou!!!!';
    message.style.color = '#32BF00';
    colorDigit = true;
    refresh.classList.add('active');
  } else if (+input.value > numberRandom) {
    message.innerText = 'É menor';
  } else {
    message.innerText = 'É maior';
  }
}

const digitConfig = {
  0: [1, 2, 3, 4, 5, 6],
  1: [5, 6],
  2: [1, 3, 4, 6, 7],
  3: [1, 4, 5, 6, 7],
  4: [2, 5, 6, 7],
  5: [1, 2, 4, 5, 7],
  6: [1, 2, 3, 4, 5, 7],
  7: [1, 5, 6],
  8: [1, 2, 3, 4, 5, 6, 7],
  9: [1, 2, 4, 5, 6, 7],
};

function resetColorElements() {
  digitos.forEach((d) => {
    const spanDigit = Array.from(d.children);
    spanDigit.forEach((d) => {
      d.style.background = '#dddddd';
    });
  });
}

function cleanDigit() {
  digitos.forEach((d) => {
    d.classList.remove('active');
  });
}

function handleClick() {
  const regexp = input.value.length > 2 ? /^0{1,2}/ : /^0{1}/;
  const clearZero = input.value.length === 1 ? '' : regexp;
  const number = input.value.replace(clearZero, '');
  compareNumber();
  input.value = '';

  resetColorElements();
  cleanDigit();

  function setColorElements(n1, n2, n3) {
    const colorGreen = colorDigit ? '#32BF00' : '#262A34';
    if (n1) {
      digitConfig[n1].forEach((n) => {
        const digitFist = digitos[0].children[n - 1];
        digitFist.style.background = colorGreen;
      });
    }
    if (n2) {
      digitConfig[n2].forEach((n) => {
        const digitSecond = digitos[1].children[n - 1];
        digitSecond.style.background = colorGreen;
      });
    }

    if (n3) {
      digitConfig[n3].forEach((n) => {
        const digitThird = digitos[2].children[n - 1];
        digitThird.style.background = colorGreen;
      });
    }
  }

  switch (number.length) {
    case 3:
      {
        digitos.forEach((d) => {
          d.classList.add('active');
          setColorElements(number[0], number[1], number[2]);
        });
      }
      break;

    case 2:
      {
        digitos[1].classList.add('active');
        digitos[0].classList.add('active');
        setColorElements(number[0], number[1]);
      }
      break;

    case 1:
      {
        digitos[0].classList.add('active');
        setColorElements(number[0]);
      }
      break;

    default:
      break;
  }
}

button.addEventListener('click', handleClick);
