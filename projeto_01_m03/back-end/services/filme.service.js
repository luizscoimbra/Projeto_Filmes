const filmes = [
    {
        id: 1,
        nome: "TESTE",
        imagem: "TESTE",
        genero: "TESTE",
        nota: "10"
    }
    
]

const getFilmeService = () => {
    return filmes
}

const getFilmeByIdService = (idParam) => {
    return filmes.find((filmes) => filme.id == idParam)
}


    const addFilme = (newFilme) => {
    const newId = filmes.length + 1;
    newFilme.id = newId;
    filmes.push(newFilme);
    return newFilme;
}

    const putFilme = (idParam, filmesEdit) => {
    const index = filmes.findIndex((filme) => filmes.id == idParam);

    if(index >= 0) {
        filmes[index] = {
            ...filmes[index],
            ...filmesEdit
        }
        
        return true
    } else {
        return false
    }
}

const deleteFilme = (idParam) => {
    const index = filmes.findIndex((filmes) => filmes.id == idParam)
    const filmeExcluida = filmes[index];
    filmes.splice(index, 1)
    return filmeExcluida;
}

module.exports = {
    getFilmeService,
    getFilmeByIdService,
    addFilme,
    putFilme,
    deleteFilme
}
