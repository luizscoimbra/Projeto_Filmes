const apiUrl = "http://localhost:3000";
let modoEdicao = false;
let idEdicao = 0;


  const lista = document.getElementById("lista");
  const getFilme = async () => {
  const response = await fetch(`${apiUrl}/filme`);
  const filme = await response.json();


  filme.map((movie) => {
    console.log(movie.nome);
    lista.insertAdjacentHTML(
      "beforeend",
      `
            <tr>
            <th scope="row">${movie.id}</th>
            <td>${movie.nome}</td>
            <td>${movie.imagem}</td>
            <td>${movie.genero}</td>
            <td>${movie.nota}</td>
                <td>
                    <button class="btn btn-primary" onclick="editaVaga(${movie.id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteVaga(${movie.id})">Deletar</button>
                </td>
            </tr>
        `
    );
  });
};

getFilme();

const escolherFilme = async () => {

  
  const idDigitado = document.getElementById("id").value;
  
  const response = await fetch(`${apiUrl}/filme/${idDigitado}`);
  
  const filmes = await response.json();

  
  document.getElementById("filme").insertAdjacentHTML(
    "beforeend",
    `
        <tr>
            <th scope="row">${filme.id}</th>
            <td>${filme.nome}</td>
            <td>${filme.imagem}</td>
            <td>${filme.genero}</td>
            <td>${filme.nota}</td>
        </tr>
    `
  );
};


const submitForm = async () => {

    
    const nome = document.getElementById('nome').value;
    const imagem = document.getElementById('imagem').value;
    const genero = document.getElementById('genero').value;
    const nota = document.getElementById('nota').value;
    console.log(nome, imagem, genero, nota);

    
    const filme = {
        nome,
        imagem,
        genero,
        nota
    }
    console.log(filme);

    
    if(modoEdicao) {
        putFilme(filme);
    }else {
        putFilme(filme);
    }
    
}


const postFilme = async (filme) => {

    const response = await fetch(`${apiUrl}/filme/add`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filme)
    })
    const data = await response.json();
    alert(data.message);
    
    lista.innerHTML = '';
    getFilme();
    limpaCampos();
}


const putFilme = async (filme) => {

    const response = await fetch(`${apiUrl}/filme/edit/${idEdicao}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filme)
    })
    const data = await response.json();
    alert(data.message);
    
    lista.innerHTML = '';
    getFilme();
    limpaCampos();

    modoEdicao = false;
    idEdicao = 0;
}


const editaFilme = async (id) => {

    modoEdicao = true;
    idEdicao = id;

    
    const filme = await getById(id);

    
    document.getElementById('nome').value = filme.nome;
    document.getElementById('imagem').value  = filme.imagem;
    document.getElementById('genero').value = filme.genero;
    document.getElementById('nota').value = filme.nota;

}



const getById = async (id) => {

    const response = await fetch(`${apiUrl}/filme/${id}`)
    const filme = await response.json();
    return filme
}


const deleteFilme = async (id) => {
    const response = await fetch(`${apiUrl}/filme/delete/${id}`, {
        method: 'DELETE'
    })
    const result = await response.json();
    alert(result.message);
    
    lista.innerHTML = '';
    getFilme();
}


const limpaCampos = () => {

    document.getElementById('nome').value = '';
    document.getElementById('imagem').value = '';
    document.getElementById('genero').value = '';
    document.getElementById('nota').value = '';
}

