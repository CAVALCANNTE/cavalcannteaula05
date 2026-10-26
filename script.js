// elementos do DOM
const formTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const erroMsg = document.getElementById('erro-msg');
const btnLimpar = document.getElementById('btn-limpar');
const btnTema = document.getElementById('btn-tema');
const contador = document.getElementById('contador');
const inputBusca = document.getElementById('input-busca');
const chkOrdenar = document.getElementById('chk-ordenar');

// estado
let tarefas = JSON.parse(localStorage.getItem('tarefas_app')) || [];
let busca = '';

// inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarTema();
  chkOrdenar.checked = JSON.parse(localStorage.getItem('ordenar')) || false;
  renderizarTarefas();
});

// eventos
formTarefa.addEventListener('submit', (e) => {
  e.preventDefault();
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

inputBusca.addEventListener('input', () => {
  busca = inputBusca.value.toLowerCase().trim();
  renderizarTarefas();
});

chkOrdenar.addEventListener('change', () => {
  localStorage.setItem('ordenar', chkOrdenar.checked);
  renderizarTarefas();
});

// funções
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

function editarTarefa(id) {
  const novoTexto = prompt('Digite o novo texto da tarefa:');

  // se cancelou ou deixou vazio não muda nada
  if (novoTexto === null || novoTexto.trim() === '') return;

  tarefas = tarefas.map(t => {
    if (t.id === id) t.texto = novoTexto.trim();
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

function atualizarContador() {
  const pendentes = tarefas.filter(t => !t.concluida).length;
  contador.textContent = 'Total: ' + tarefas.length + ' | Pendentes: ' + pendentes;
}

function renderizarTarefas() {
  listaTarefas.innerHTML = '';
  atualizarContador();

  if (tarefas.length === 0) {
    listaTarefas.innerHTML = '<li><small>Nenhuma tarefa cadastrada.</small></li>';
    return;
  }

  // filtro da busca
  let lista = tarefas.filter(t => t.texto.toLowerCase().includes(busca));

  // concluídas no final
  if (chkOrdenar.checked) {
    lista = [...lista].sort((a, b) => Number(a.concluida) - Number(b.concluida));
  }

  if (lista.length === 0) {
    listaTarefas.innerHTML = '<li><small>Nenhuma tarefa encontrada.</small></li>';
    return;
  }

  lista.forEach(t => {
    const li = document.createElement('li');
    if (t.concluida) li.classList.add('concluida');

    const div = document.createElement('div');
    div.className = 'tarefa-info';

    const span = document.createElement('span');
    span.textContent = t.texto;
    span.addEventListener('click', () => alternarStatus(t.id));

    const data = document.createElement('small');
    data.textContent = 'Criada em: ' + t.criadaEm;

    div.appendChild(span);
    div.appendChild(data);

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'btn-edit';
    btnEditar.addEventListener('click', () => editarTarefa(t.id));

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.className = 'btn-remove';
    btnExcluir.addEventListener('click', () => removerTarefa(t.id));

    const botoes = document.createElement('div');
    botoes.className = 'tarefa-botoes';
    botoes.appendChild(btnEditar);
    botoes.appendChild(btnExcluir);

    li.appendChild(div);
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
