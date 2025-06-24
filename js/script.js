// ===== LocalStorage Utils =====
function getPratos() {
    return JSON.parse(localStorage.getItem('pratos')) || [];
}

function salvarPratos(pratos) {
    localStorage.setItem('pratos', JSON.stringify(pratos));
}

function getCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function getFavoritos() {
    return JSON.parse(localStorage.getItem('favoritos')) || [];
}

function salvarFavoritos(favoritos) {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// ===== Exibir Pratos no Cardápio =====
function exibirPratos() {
    const lista = document.getElementById('lista-pratos');
    if (!lista) return;

    lista.innerHTML = '';
    const pratos = getPratos();

    pratos.forEach((prato, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-4';

        card.innerHTML = `
            <div class="card">
                <img src="${prato.imagem || 'assets/imagens/placeholder.jpg'}" class="card-img-top" alt="${prato.nome}">
                <div class="card-body">
                    <h5 class="card-title">${prato.nome}</h5>
                    <p class="card-text">R$ ${prato.preco.toFixed(2)}</p>
                    <button class="btn btn-primary" onclick="adicionarCarrinho(${index})">Adicionar ao Carrinho</button>
                    <button class="btn btn-warning" onclick="favoritarPrato(${index})">Favoritar</button>
                </div>
            </div>
        `;
        lista.appendChild(card);
    });
}

function adicionarCarrinho(index) {
    const pratos = getPratos();
    const carrinho = getCarrinho();

    if (index < 0 || index >= pratos.length) {
        alert("Prato inválido!");
        return;
    }

    carrinho.push(pratos[index]);
    salvarCarrinho(carrinho);
    alert(`Prato "${pratos[index].nome}" adicionado ao carrinho!`);
}

function adicionarPrato() {
    const nome = document.getElementById('nome').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const categoria = document.getElementById('categoria').value;
    const inputImagem = document.getElementById('imagem');
    
    function salvarComImagem(imagemDataUrl) {
        const pratos = getPratos();
        pratos.push({ nome, preco, categoria, imagem: imagemDataUrl });
        salvarPratos(pratos);

        document.getElementById('form-prato').reset();
        carregarListaAdmin();
    }

    if (inputImagem.files && inputImagem.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            salvarComImagem(e.target.result);
        };
        reader.readAsDataURL(inputImagem.files[0]); 
    } else {
        salvarComImagem(null); // sem imagem no prato
    }
}

// ===== Favoritar Prato =====
function favoritarPrato(index) {
    const pratos = getPratos();
    const favoritos = getFavoritos();

    favoritos.push(pratos[index]);
    salvarFavoritos(favoritos);
    alert('Prato adicionado aos favoritos!');
}

// ===== Exibir Carrinho =====
function exibirCarrinho() {
    const lista = document.getElementById('carrinho-itens');
    if (!lista) return;

    lista.innerHTML = '';
    const carrinho = getCarrinho();
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex align-items-center';

        li.innerHTML = `
            <img src="${item.imagem || 'assets/imagens/placeholder.jpg'}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
            <div class="flex-grow-1">
                <div><strong>${item.nome}</strong></div>
                <div>R$ ${item.preco.toFixed(2)}</div>
            </div>
            <button class="btn btn-danger btn-sm ms-3" onclick="removerDoCarrinho(${index})">Remover</button>
        `;

        lista.appendChild(li);
    });

    document.getElementById('total-carrinho').innerText = total.toFixed(2);
}

function removerDoCarrinho(index) {
    const carrinho = getCarrinho();
    carrinho.splice(index, 1);
    salvarCarrinho(carrinho);
    exibirCarrinho();
}

// ===== Exibir Favoritos =====
function exibirFavoritos() {
    const lista = document.getElementById('favoritos-lista');
    if (!lista) return;

    lista.innerHTML = '';
    const favoritos = getFavoritos();

    favoritos.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-4';

        card.innerHTML = `
            <div class="card">
                <img src="${item.imagem || 'assets/imagens/placeholder.jpg'}" class="card-img-top" alt="${item.nome}">
                <div class="card-body">
                    <h5 class="card-title">${item.nome}</h5>
                    <p class="card-text">R$ ${item.preco.toFixed(2)}</p>
                    <button class="btn btn-danger" onclick="removerFavorito(${index})">Remover dos Favoritos</button>
                </div>
            </div>
        `;
        lista.appendChild(card);
    });
}

function removerFavorito(index) {
    const favoritos = getFavoritos();
    favoritos.splice(index, 1);
    salvarFavoritos(favoritos);
    exibirFavoritos();
}

// ===== Admin - Gerenciar Pratos =====
let indexExcluir = null;

function inicializarAdmin() {
    const form = document.getElementById('form-prato');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            adicionarPrato();
        });
    }
    carregarListaAdmin();
}

function carregarListaAdmin() {
    const lista = document.getElementById('lista-admin');
    if (!lista) return;

    lista.innerHTML = '';
    const pratos = getPratos();

    pratos.forEach((prato, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            ${prato.nome} - R$ ${prato.preco.toFixed(2)} - ${prato.categoria}
            <div>
                <button class="btn btn-sm btn-warning me-1" onclick="editarPrato(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#modalExcluir" onclick="prepararExclusao(${index})">Excluir</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function prepararExclusao(index) {
    indexExcluir = index;
}

document.addEventListener('DOMContentLoaded', () => {
    const btnConfirmar = document.getElementById('confirmar-excluir');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            if (indexExcluir !== null) {
                excluirPrato(indexExcluir);
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalExcluir'));
                modal.hide();
            }
        });
    }
});

function excluirPrato(index) {
    const pratos = getPratos();
    pratos.splice(index, 1);
    salvarPratos(pratos);
    carregarListaAdmin();
}

function editarPrato(index) {
    const pratos = getPratos();
    const prato = pratos[index];

    const novoNome = prompt('Novo nome:', prato.nome);
    const novoPreco = parseFloat(prompt('Novo preço:', prato.preco));
    const novaCategoria = prompt('Nova categoria:', prato.categoria);

    if (novoNome && !isNaN(novoPreco) && novaCategoria) {
        pratos[index] = { nome: novoNome, preco: novoPreco, categoria: novaCategoria };
        salvarPratos(pratos);
        carregarListaAdmin();
    }
}

function exibirPratos() {
    const lista = document.getElementById('lista-pratos');
    if (!lista) return;

    const filtroNome = document.getElementById('pesquisa-prato')?.value.toLowerCase() || '';
    const filtroCategoria = document.getElementById('filtro-categoria')?.value || '';

    lista.innerHTML = '';
    const pratos = getPratos();

    pratos.forEach((prato, index) => {
        const nomeCorresponde = prato.nome.toLowerCase().includes(filtroNome);
        const categoriaCorresponde = filtroCategoria === '' || prato.categoria === filtroCategoria;

        if (nomeCorresponde && categoriaCorresponde) {
            const card = document.createElement('div');
            card.className = 'col-md-4';

            card.innerHTML = `
                <div class="card mb-3">
                    <img src="${prato.imagem || 'assets/imagens/placeholder.jpg'}" class="card-img-top" alt="${prato.nome}">
                    <div class="card-body">
                        <h5 class="card-title">${prato.nome}</h5>
                        <p class="card-text">R$ ${prato.preco.toFixed(2)}</p>
                        <button class="btn btn-primary" onclick="adicionarCarrinho(${index})">Adicionar ao Carrinho</button>
                        <button class="btn btn-warning" onclick="favoritarPrato(${index})">Favoritar</button>
                    </div>
                </div>
            `;
            lista.appendChild(card);
        }
    });
}

