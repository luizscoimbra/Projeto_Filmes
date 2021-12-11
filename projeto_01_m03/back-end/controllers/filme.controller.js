
const filmeService = require('../services/filme.service');


const getFilme = (req, res) => {
    const filme = filmeService.getFilmeService();
    res.send(filme);
}


const getFilmeById = (req, res) => {
    const id = req.params.id;
    const filme = filmeService.getFilmeByIdService(id);
    res.send(filme)
}


const postFilme = (req, res) => {
    const filme = req.body;
    console.log(req.body);
    const newFilme = filmeService.addFilme(filme);
    res.send({message: `Filme ${ newFilme.nome } cadastrada com sucesso!`})
}


const putFilme = (req, res) => {
    const idParam = req.params.id
    const filmeEdit = req.body
    const edicao = filmeService.putFilme(idParam, filmeEdit);
    if(edicao) {
        res.send({message: `O filme foi editada com sucesso!`})
    } else {
        res.status(404).send({message: `Nao encontramos filme com esse id para edição!`})
    }
}


const deleteFilme = (req, res) => {
    const filmeExcluido = filmeService.deleteFilme(req.params.id);
    res.send({message: `O filme ${filmeExcluido.nome} foi excluido com sucesso!`});
}


module.exports = {
    getFilme,
    getFilmeById,
    postFilme,
    putFilme,
    deleteFilme
}