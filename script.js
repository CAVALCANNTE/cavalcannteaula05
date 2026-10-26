// Captura de Elementos do DOM
const formTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const erroMsg = document.getElementById('erro-msg');
const btnLimpar = document.getElementById('btn-limpar');
const btnTema = document.getElementById('btn-tema');
const contador = document.getElementById('contador');
const inputBusca = document.getElementById('input-busca');
const chkOrdenar = document.getElementById('chk-ordenar');

// Estado da Aplicação
let tarefas = JSON.parse(localStorage.getItem('tarefas_app')) || [];
let termoBusca = '';

// 1. Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarTema();
  chkOrdenar.checked = JSON.parse(localStorage.getItem('ordenar_concluidas')) || false;
  renderizarTarefas();
});

// 2. Escutadores de Eventos (addEventListener)
formTarefa.addEventListener('submit', (e) => {
  e.preventDefault(); // Impede o recarregamento da página
  adicionarTarefa();
});

btnLimpar.addEventListener('click', () => {
  if (confirm("Tem certeza que deseja apagar todas as tarefas?")) {
    tarefas = [];
    salvarERenderizar();
  }
});

btnTema.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const eEscuro = document.body.classList.contains('dark-mode');
  localStorage.setItem('tema_escuro', eEscuro);
});

// Exercício 2: filtro em tempo real (evento input)
inputBusca.addEventListener('input', () => {
  termoBusca = inputBusca.value.toLowerCase().trim();
  renderizarTarefas();
});

// Exercício 4: ordenação
chkOrdenar.addEventListener('change', () => {
  localStorage.setItem('ordenar_concluidas', chkOrdenar.checked);
  renderizarTarefas();
});

// 3. Funções Práticas
function adicionarTarefa() {
  const texto = inputTarefa.value.trim();

  if (texto === '') {
    erroMsg.textContent = 'Por favor, digite uma descrição para a tarefa.';
    return;
  }

  erroMsg.textContent = '';

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false,
    // Exercício 5: data/hora de criação
    criadaEm: new Date().toLocaleString('pt-BR')
  };

  tarefas.push(novaTarefa);
  salvarERenderizar();
  inputTarefa.value = '';
  inputTarefa.focus();
}

function alternarStatus(id) {
  tarefas = tarefas.map(t => {
    if (t.id === id) t.concluida = !t.concluida;
    return t;
  });
  salvarERenderizar();
}

// Exercício 3: edição de tarefas
function editarTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  const novoTexto = prompt('Edite a descrição da tarefa:', tarefa.texto);
  if (novoTexto === null) return; // usuário cancelou

  const textoLimpo = novoTexto.trim();
  if (textoLimpo === '') {
    alert('A descrição da tarefa não pode ficar vazia.');
    return;
  }

  tarefas = tarefas.map(t => {
    if (t.id === id) t.texto = textoLimpo;
    return t;
  });
  salvarERenderizar();
}

function removerTarefa(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  salvarERenderizar();
}

function salvarERenderizar() {
  localStorage.setItem('tarefas_app', JSON.stringify(tarefas));
  renderizarTarefas();
}

// Exercício 1: contador de total e pendentes
function atualizarContador() {
  const total = tarefas.length;
  const pendentes = tarefas.filter(t => !t.concluida).length;
  contador.textContent = `Total: ${total} | Pendentes: ${pendentes}`;
}

function renderizarTarefas() {
  listaTarefas.innerHTML = '';
  atualizarContador();

  if (tarefas.length === 0) {
    listaTarefas.innerHTML = '<li><small>Nenhuma tarefa cadastrada.</small></li>';
    return;
  }

  // Filtro (Exercício 2)
  let tarefasExibidas = tarefas.filter(t =>
    t.texto.toLowerCase().includes(termoBusca)
  );

  // Ordenação sobre uma cópia (Exercício 4)
  if (chkOrdenar.checked) {
    tarefasExibidas = [...tarefasExibidas].sort(
      (a, b) => Number(a.concluida) - Number(b.concluida)
    );
  }

  if (tarefasExibidas.length === 0) {
    listaTarefas.innerHTML = '<li><small>Nenhuma tarefa encontrada para essa busca.</small></li>';
    return;
  }

  tarefasExibidas.forEach(t => {
    const li = document.createElement('li');
    if (t.concluida) li.classList.add('concluida');

    const info = document.createElement('div');
    info.className = 'tarefa-info';

    const span = document.createElement('span');
    span.textContent = t.texto;
    span.addEventListener('click', () => alternarStatus(t.id));

    const small = document.createElement('small');
    small.textContent = `Criada em: ${t.criadaEm || 'data não registrada'}`;

    info.appendChild(span);
    info.appendChild(small);

    const botoes = document.createElement('div');
    botoes.className = 'tarefa-botoes';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'btn-edit';
    btnEditar.addEventListener('click', () => editarTarefa(t.id));

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.className = 'btn-remove';
    btnExcluir.addEventListener('click', () => removerTarefa(t.id));

    botoes.appendChild(btnEditar);
    botoes.appendChild(btnExcluir);

    li.appendChild(info);
    li.appendChild(botoes);
    listaTarefas.appendChild(li);
  });
}

function carregarTema() {
  const eEscuro = JSON.parse(localStorage.getItem('tema_escuro'));
  if (eEscuro) {
    document.body.classList.add('dark-mode');
  }
}
