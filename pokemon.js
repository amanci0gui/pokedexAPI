const MAX_POKEMON = 151; 
// Constante que define o número máximo de Pokémons a serem carregados (os primeiros 151).

const botaoPesquisa = document.querySelector("#botao-pesquisa");

const listaWrapper = document.querySelector(".lista-wrapper"); 
// Seleciona o elemento do DOM onde a lista de Pokémons será exibida.

const inputPesquisa = document.querySelector("#input-pesquisa"); 
// Seleciona o campo de input usado para a pesquisa de Pokémons.

const numeroFiltro = document.querySelector("#numero"); 
// Seleciona o botão de filtro que permite pesquisar por número do Pokémon.

const nomeFiltro = document.querySelector("#nome"); 
// Seleciona o botão de filtro que permite pesquisar por nome do Pokémon.

const msgNaoEncontrado = document.querySelector("#mensagem-nao-encontrado"); 
// Seleciona o elemento que exibe uma mensagem quando nenhum Pokémon é encontrado.

let todosPokemons = []; 
// Variável que armazenará todos os Pokémons obtidos da API.

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
// Faz uma requisição à API para obter os dados dos primeiros 151 Pokémons.

.then((response) => response.json())
// Converte a resposta da API em formato JSON.

.then((data) => {
    todosPokemons = data.results;
    // Armazena os dados dos Pokémons na variável 'todosPokemons'.
    mostrePokemon(todosPokemons);
    // Chama a função para exibir a lista de Pokémons na página.
});

async function buscarDadosPokemon(id){
// Função assíncrona que busca os dados de um Pokémon específico com base no ID.
    try{
        const [pokemon, pokemonSpecies] = await Promise.all([
        // Faz duas requisições assíncronas em paralelo: uma para os dados básicos e outra para a espécie do Pokémon.
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
        ]);
        return true;
        // Se a busca for bem-sucedida, retorna true.
    } catch (error){
        console.error("Falha ao buscar dados dos pokemons antes de redirecionar");
        // Caso haja erro na requisição, exibe uma mensagem no console.
    }
}

function mostrePokemon(pokemon) {
// Função que exibe a lista de Pokémons na página.
    listaWrapper.innerHTML = "";
    // Limpa a lista antes de exibir os novos itens.

    pokemon.forEach((pokemon) => {
        // Itera sobre cada Pokémon e cria um elemento para exibi-lo.
        const pokemonId = pokemon.url.split("/")[6];
        // Extrai o ID do Pokémon a partir da URL fornecida pela API.

        const listaItem = document.createElement("div");
        // Cria um novo elemento <div> para cada Pokémon na lista.

        listaItem.className = "lista-item";
        // Define a classe CSS para o item da lista.

        listaItem.innerHTML = `
            <div class="numero-wrap">
                <p class="caption-fonts">#${pokemonId}</p>
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" alt="${pokemon.name}"/>
            </div>
            <div class="nome-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>
        `;
        // Preenche o conteúdo do item da lista com o número, imagem e nome do Pokémon.

        listaItem.addEventListener("click", async () => {
            // Adiciona um evento de clique para cada item da lista.
            const success = await buscarDadosPokemon(pokemonId);
            // Chama a função para buscar dados adicionais do Pokémon.

            if (success) {
                window.location.href = `./detalhes.html?id=${pokemonId}`;
                // Redireciona o usuário para uma página de detalhes do Pokémon, passando o ID como parâmetro.
            }
        });

        listaWrapper.appendChild(listaItem);
        // Adiciona o item da lista ao elemento 'listaWrapper'.
    });
}

botaoPesquisa.addEventListener("click", fazerPesquisa);
// Adiciona um evento para detectar quando o usuário digita algo no campo de pesquisa.

function fazerPesquisa() {
    // Função que realiza a pesquisa de Pokémons.
    const termoPesquisa = inputPesquisa.value.toLowerCase();
    // Obtém o termo de pesquisa e o converte para minúsculas.

    let pokemonsFiltrados;

    if(numeroFiltro.checked) {
        // Verifica se o filtro por número está selecionado.
        pokemonsFiltrados = todosPokemons.filter((pokemon) => {
            const pokemonId = pokemon.url.split("/")[6];
            // Compara o ID do Pokémon com o termo de pesquisa.
            return pokemonId.startsWith(termoPesquisa);
        });
    } else if(nomeFiltro.checked) {
        // Verifica se o filtro por nome está selecionado.
        pokemonsFiltrados = todosPokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(termoPesquisa);
            // Compara o nome do Pokémon com o termo de pesquisa.
        });
    } else {
        pokemonsFiltrados = todosPokemons;
        // Se nenhum filtro estiver selecionado, exibe todos os Pokémons.
    }

    mostrePokemon(pokemonsFiltrados);
    // Exibe os Pokémons filtrados.

    if (pokemonsFiltrados.length === 0) {
        msgNaoEncontrado.style.display = "block";
        // Exibe uma mensagem se nenhum Pokémon for encontrado.
    } else {
        msgNaoEncontrado.style.display = "none";
        // Esconde a mensagem se houver Pokémons na lista.
    }
}

const closeButton = document.querySelector(".icone-pesquisa-close");
// Seleciona o botão de fechar da pesquisa.

closeButton.addEventListener("click", limparPesquisa);
// Adiciona um evento de clique para o botão de fechar.

function limparPesquisa() {
    // Função que limpa o campo de pesquisa e restaura a lista de Pokémons original.
    inputPesquisa.value = "";
    mostrePokemon(todosPokemons);
    msgNaoEncontrado.style.display = "none";
}
