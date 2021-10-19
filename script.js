const input = document.querySelector('[data-palpite]');
const button = document.querySelector('[data-enviar]');

let numeroValor;

async function initFetch() {
  const startfetch = await fetch(
    'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300',
  );
  const json = await startfetch.json();
  numeroValor = json;
}

initFetch();

function log() {
  console.log(numeroValor);
}

button.addEventListener('click', log);
