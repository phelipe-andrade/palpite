/* Para a realização desta tarefa, foi nessário separar as ações em varioos blocos(Funções).
- Primero: Atraves da URL disponível, retirar o numero aleatório caso não ocorra nenhum erro ou falha na requisição;
- Segundo: Caso a requisição tenha um erro ou falha, colocar no display(LED) o numero do StatusCode e inserir o aviso de 'ERRO'; 
- Terceiro: Tratar o valor iniserido no input, eliminando os zero(s) a esquerda com a utilização do Regexp;
- Quarto: Comparar os numero da requisição com os inseridos no input(já limpos);
- Quinto: Inserir o numero limpo(sem zero a esquerda) no display(LED) para mostrar qual foi o valor digitado e,
   mostrar no campo da mensagem caso tenha acertado ou, se o numero e maior ou menor;*/

const input = document.querySelector('[data-palpite]');
const button = document.querySelector('[data-enviar]');
const digitos = document.querySelectorAll('[data-digit] li');
const message = document.querySelector('[data-message]');
const refresh = document.querySelector('[data-refresh]');
const display = document.querySelector('[data-digit]');

let numberRandom;
let colorDigit = false;
let colorRG;

// Numero na array representa os spans que
// vão ser ativados de acordo com o numero digitado.
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

// Realiza uma requisição para receber o numero aleatório.
async function initFetch() {
  const startfetch = await fetch(
    'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300',
  );
  const json = await startfetch.json();
  numberRandom = json.value;

  // Faz a comparação para saber se ocorreu algum erro
  // no recebimento do numero aleatório.
  if (numberRandom === undefined) {
    // Ativa as funções e parametros para inserir o erro no display.
    digitos[0].classList.remove('init');
    digitos.forEach((d) => {
      d.classList.add('active');
    });
    const erroNumber = String(json.StatusCode);
    setColorElements([erroNumber[0], erroNumber[1], erroNumber[2]]);
    statusButton(true);
    refresh.classList.add('active');
    setMessage('ERRO', '#CC3300', true);
    layout(true);
  }
}
initFetch();

// Redefine as configurações inicias ao click no botão "NOVA PARTIDA"
// quando ocorrer um acerto ou algum erro.
const handleRefresh = () => {
  display.classList.remove('message', 'reload');
  refresh.classList.remove('active');
  setMessage('', '#ff6600', false);
  resetColorElements(true);
  cleanDigit();
  initFetch();
  statusButton(false);
  colorDigit = false;
};

// Configura as mensagens acima do display.
const setMessage = (text, color, boolean) => {
  message.innerHTML = text;
  message.style.color = color;
  boolean
    ? message.classList.add('active')
    : message.classList.remove('active');
};

// Desabilida e habilida o input e o botão de enviar
const statusButton = (status) => {
  const father = input.parentNode;
  button.disabled = status;
  input.disabled = status;
  status ? father.classList.add('off') : father.classList.remove('off');
};

// Configura as margins do display para
// mante-lo centralizado durante a exibição
// das mensagens e do botãa de reiniciar.
const layout = (refresh) => {
  display.classList.add('message');
  if (refresh) display.classList.add('reload');
};

// Ativa e exibe as mensagens de acordo
// com o palpite inserido.
const compareNumber = (number) => {
  layout(false);
  setMessage('', '', true);
  if (numberRandom === number) {
    colorDigit = true;
    setMessage('Você acertou!!!!', '#32BF00', true);
    refresh.classList.add('active');
    statusButton(true);
    layout(true);
  } else if (number > numberRandom) {
    setMessage('É menor', '#ff6600', true);
  } else {
    setMessage('É maior', '#ff6600', true);
  }
};

// Renicia as cores do display para
// padronizar o backgroud.
const resetColorElements = (init) => {
  digitos.forEach((d) => {
    const spanDigit = Array.from(d.children);
    spanDigit.forEach((d) => {
      d.style.background = '#dddddd';
    });
  });

  // Quando ocorrer um erro ou acerto do numero,
  // insere o padrão inicial no display (igual a 0).
  if (init) {
    for (let i = 0; i <= 5; i++) {
      digitos[0].children[i].style.background = '#262a34';
    }
  }
};

// Limpa todos os espaços do display
// para que o proximo numero ocupe apenas
// a quantidade minima necessária para ser impresso.
const cleanDigit = () => {
  digitos.forEach((d) => {
    d.classList.remove('active');
  });
};

// Configura as cores do display de acordo com o resultado e,
// ativa a quantidade necessária de digitos para a impressão no display.
const setColorElements = (numbers) => {
  colorRG = numberRandom === undefined ? '#CC3300' : '#262A34';
  const colorGreen = colorDigit ? '#32BF00' : colorRG;

  let dis = 0;
  numbers.forEach((number) => {
    digitConfig[number].forEach((n) => {
      const digitFist = digitos[dis].children[n - 1];
      digitFist.style.background = colorGreen;
    });
    digitos[dis].classList.add('active');
    dis++;
  });
};

// Inicia a introdução dos numeros do palpite para o display.
const handleClick = () => {
  compareNumber(+input.value);
  // Usando o Regexp, faz a verificação se possue 1 ou 2 zeros a esqueda,
  // caso tenha, o mesmo irá remove-los.
  const regexp = input.value.length > 2 ? /^0{1,2}/ : /^0{1}/;
  const clearZero = input.value.length === 1 ? '' : regexp;
  const number = input.value.replace(clearZero, '');

  // Limpa o value do input
  input.value = '';

  resetColorElements(false);
  cleanDigit();

  //  Remove a marcação inicial de zero(0)
  digitos[0].classList.remove('init');

  // Faz a comparação da quantidade de numeros depois que o Regexp
  // removeu o(s) zero(s) da esquerda.
  if (number >= 1 && number <= 300) {
    switch (number.length) {
      // number com 3 numeros
      case 3:
        setColorElements([number[0], number[1], number[2]]);
        break;
      // number com 2 numeros
      case 2:
        setColorElements([number[0], number[1]]);
        break;
      // number com 1 numero
      case 1:
        setColorElements([number[0]]);
        break;

      default:
        break;
    }
  } else {
    setMessage('Numero fora do parametro!', '#CC3300', true);
    setColorElements([0]);
  }
};

// Modifica a cor da borda do input
const handleBorder = (event) => {
  event.preventDefault();
  if (event.target === input && input.disabled === false)
    input.style.border = '1px solid #FF6600';
  else input.style.border = '1px solid #cfcfcf';
};

refresh.addEventListener('click', handleRefresh);
button.addEventListener('click', handleClick);
document.addEventListener('click', handleBorder);
