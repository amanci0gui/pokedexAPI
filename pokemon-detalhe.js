let idPokemonAtual = null;

// Aguarda o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMONS = 151;
    const pokemonId = new URLSearchParams(window.location.search).get("id"); // Obtém o ID da URL
    const id = parseInt(pokemonId, 10);

    // Redireciona para a página inicial se o ID for inválido
    if (id < 1 || id > MAX_POKEMONS) {
        return (window.location.href = "./index.html");
    }

    idPokemonAtual = id; // Define o Pokémon atual
    carregarPokemon(id); // Carrega os detalhes do Pokémon
});

// Função assíncrona para carregar dados do Pokémon
async function carregarPokemon(id) {
    try {
        // Faz duas requisições para obter os detalhes do Pokémon e sua espécie
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json())
        ]);

        const wrapperHabilidades = document.querySelector(".detalhe-pokemon-wrap .detalhe-pokemon-move");
        if (wrapperHabilidades) {
            wrapperHabilidades.innerHTML = ""; // Limpa a área de habilidades
        }

        if (idPokemonAtual === id) {
            mostreDetalhePokemon(pokemon); // Exibe detalhes do Pokémon
            const flavorText = getEnglishFlavorText(pokemonSpecies);
            const descricaoElemento = document.querySelector(".body3-fonts.pokemon-descricao");
            if (descricaoElemento) {
                descricaoElemento.textContent = flavorText; // Exibe a descrição do Pokémon
            }

            // Gerencia navegação entre Pokémon anterior e próximo
            const [setaEsquerda, setaDireita] = ["#setaEsquerda", "#setaDireita"].map((sel) => document.querySelector(sel));

            setaEsquerda?.removeEventListener("click", navegarPokemon);
            setaDireita?.removeEventListener("click", navegarPokemon);

            if (id !== 1 && setaEsquerda) {
                setaEsquerda.addEventListener("click", () => navegarPokemon(id - 1));
            }
            if (id !== 151 && setaDireita) {
                setaDireita.addEventListener("click", () => navegarPokemon(id + 1));
            }

            window.history.pushState({}, "", `./detalhes.html?id=${id}`); // Atualiza a URL sem recarregar a página
        }
        return true;
    } catch (error) {
        console.error("Um erro ocorreu enquanto buscava dados dos pokemons:", error);
        return false;
    }
}

// Navega para outro Pokémon
async function navegarPokemon(id) {
    idPokemonAtual = id;
    await carregarPokemon(id);
}

// Define cores para os tipos de Pokémon
const typeCores = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    // ...outros tipos
};

// Define estilo para um conjunto de elementos
function setElementos(elements, cssProperty, value) {
    elements.forEach((element) => {
        element.style[cssProperty] = value;
    });
}

// Converte uma cor HEX para RGBA
function rgbaFromHex(hexColor) {
    return [parseInt(hexColor.slice(1, 3), 16), parseInt(hexColor.slice(3, 5), 16), parseInt(hexColor.slice(5, 7), 16)].join(", ");
}

// Define as cores de fundo e borda com base no tipo do Pokémon
function setCorTipoFundo(pokemon) {
    const mainTipo = pokemon.types[0].type.name;
    const cor = typeCores[mainTipo];

    if (!cor) {
        console.warn(`Cor não definida para tipo: ${mainTipo}`);
        return;
    }

    const detalheElementoPrincipal = document.querySelector(".detalhe-main");
    setElementos([detalheElementoPrincipal], "backgroundColor", cor); // Altera o fundo principal
    setElementos([detalheElementoPrincipal], "borderColor", cor); // Altera a cor da borda

    // Aplica as cores em outros elementos de status e barras de progresso
    setElementos(document.querySelectorAll(".power-wrapper > p"), "backgroundColor", cor);
    setElementos(document.querySelectorAll(".stats-wrap > p.stats"), "color", cor);
    setElementos(document.querySelectorAll(".stats-wrap .progress-bar"), "color", cor);

    const rgbaCor = rgbaFromHex(cor); // Converte a cor HEX para RGBA
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        .stats-wrap .progressbar::-webkit-progress-bar {
            background-color: rgba(${rgbaCor}, 0.5);
        }
        .stats-wrap .progressbar::-webkit-progress-value {
            background-color: rgba(${rgbaCor});
        }
    `;

    document.head.appendChild(styleTag); // Adiciona estilos personalizados para as barras de progresso
}

// Capitaliza a primeira letra de uma string
function capitalizarPrimeiraLetra(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Cria e adiciona um novo elemento a um elemento pai
function criarEAppendElemento(parent, tag, opcoes = {}) {
    const elemento = document.createElement(tag);
    Object.keys(opcoes).forEach((key) => {
        elemento[key] = opcoes[key];
    });
    parent.appendChild(elemento);
    return elemento;
}

// Exibe os detalhes do Pokémon na tela
function mostreDetalhePokemon(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokemon;
    const capitalizarNomePokemon = capitalizarPrimeiraLetra(name);

    // Atualiza o título da página com o nome do Pokémon
    const titleElement = document.querySelector("title");
    if (titleElement) {
        titleElement.textContent = capitalizarNomePokemon;
    }

    // Adiciona a classe do Pokémon ao elemento principal
    const detalheElementoPrincipal = document.querySelector(".detalhe-main");
    if (detalheElementoPrincipal) {
        detalheElementoPrincipal.classList.add(name.toLowerCase());
    }

    // Atualiza o nome do Pokémon
    const nomeElemento = document.querySelector(".nome-wrap .nome");
    if (nomeElemento) {
        nomeElemento.textContent = capitalizarNomePokemon;
    }

    // Atualiza o ID do Pokémon
    const idElemento = document.querySelector(".id-pokemon-wrap .body2-fonts");
    if (idElemento) {
        idElemento.textContent = `#${String(id).padStart(3, "0")}`;
    }

    // Atualiza a imagem do Pokémon
    const elementoImagem = document.querySelector(".img-detalhe-wrapper img");
    if (elementoImagem) {
        elementoImagem.src = `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
        elementoImagem.alt = name;
    }

    // Exibe os tipos do Pokémon
    const tipoWrapper = document.querySelector(".power-wrapper");
    if (tipoWrapper) {
        tipoWrapper.innerHTML = "";
        types.forEach(({ type }) => {
            criarEAppendElemento(tipoWrapper, "p", {
                className: `body3-fonts type ${type.name}`,
                textContent: type.name,
            });
        });
    }

    // Exibe o peso e a altura
    const pesoElemento = document.querySelector(".detalhe-pokemon-wrap .pokemon-detail .body3-fonts.peso");
    if (pesoElemento) {
        pesoElemento.textContent = `${weight / 10} kg`;
    }

    const alturaElemento = document.querySelector(".detalhe-pokemon-wrap .pokemon-detail .body3-fonts.altura");
    if (alturaElemento) {
        alturaElemento.textContent = `${height / 10} m`;
    }

    // Exibe as habilidades do Pokémon
    const wrapperHabilidades = document.querySelector(".detalhe-pokemon-wrap .detalhe-pokemon-move");
    if (wrapperHabilidades) {
        wrapperHabilidades.innerHTML = "";
        abilities.forEach(({ ability }) => {
            criarEAppendElemento(wrapperHabilidades, "p", {
                className: "body3-fonts",
                textContent: ability.name,
            });
        });
    }

    // Exibe as estatísticas (HP, ataque, etc.)
    const statsWrapper = document.querySelector(".stats-wrapper");
    if (statsWrapper) {
        statsWrapper.innerHTML = "";

        const statNomeMapping = {
            hp: "HP",
            attack: "ATK",
            defense: "DEF",
            "special-attack": "SATK",
            "special-defense": "SDEF",
            speed: "SPD",
        };

        stats.forEach(({ stat, base_stat }) => {
            const statDiv = document.createElement("div");
            statDiv.className = "stats-wrap";
            statsWrapper.appendChild(statDiv);

            criarEAppendElemento(statDiv, "p", {
                className: "body3-fonts stats",
                textContent: statNomeMapping[stat.name],
            });

            criarEAppendElemento(statDiv, "p", {
                className: "body3-fonts",
                textContent: String(base_stat).padStart(3, "0"),
            });

            criarEAppendElemento(statDiv, "progress", {
                className: "progress-bar",
                value: base_stat,
                max: 100,
            });
        });
    }

    setCorTipoFundo(pokemon); // Aplica a cor de fundo com base no tipo do Pokémon
}

// Obtém o texto descritivo em inglês da espécie do Pokémon
function getEnglishFlavorText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) {
        if (entry.language.name === "en") {
            let flavor = entry.flavor_text.replace(/\f/g, " "); // Remove formatações desnecessárias
            return flavor;
        }
    }
    return "";
}
