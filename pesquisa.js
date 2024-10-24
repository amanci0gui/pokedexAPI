const inputElemento = document.querySelector("#input-pesquisa");
const icone_pesquisa = document.querySelector("#icone-pesquisa-close");
const sort_wrapper = document.querySelector(".sort-wrapper");

inputElemento.addEventListener("input", () => {
    mudancaInput(inputElemento);
});
icone_pesquisa.addEventListener("click", pesquisaFechaClick); 
sort_wrapper.addEventListener("click", iconeOrdenarClick); 

function mudancaInput(inputElemento){
    const inputValor = inputElemento.value;

    if (inputValor !== ""){
        document.querySelector("#icone-pesquisa-close").classList.add("icone-pesquisa-close-visible"); 
    } else {
        document.querySelector("#icone-pesquisa-close").classList.remove("icone-pesquisa-close-visible"); 
    }
}

function pesquisaFechaClick(){
    document.querySelector("#input-pesquisa").value = "";
    document.querySelector("#icone-pesquisa-close").classList.remove("icone-pesquisa-close-visible");
}

function iconeOrdenarClick(){
    document.querySelector(".filtro-wrapper").classList.toggle("filtro-wrapper-open");
    document.querySelector("body").classList.toggle("filtro-wrapper-overlay"); 
}
