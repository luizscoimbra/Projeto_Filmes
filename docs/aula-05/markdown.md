# [Dia 05] [AULA] Backend NodeJS com Express e consumo com Frontend JS (Vanilla) - Parte 3

# Tratamento de erros

Devemos garantir que nenhum erro que derive de uma requisão retorne em `HTML` para o front:

![image-20211128095439872](.\imagens\image-20211128095439872.png)

e também fazer sempre uma validação e retorno com a maior quantidade informações possíveis.

## Simulando um erro

 Vá na rota `Adicionar`, deixe os campos vazios e clique no botão `Adicionar` e para visualizar o erro direto no `Chrome`, devemos abrir a `DevTools`, na aba `Network`, filtrar apenas por `Fetch/XHR`:

![image-20211128095123204](.\imagens\image-20211128095123204.png)

 Em `Headers` podemos observar os `Response Headers`:

![image-20211128095213766](.\imagens\image-20211128095213766.png)

 Na parte de `Request Payload` nos mostra o possível causador do erro, que são os campos `empresa`e `salario` vazios:

![image-20211128095244633](.\imagens\image-20211128095244633.png)

 Agora devemos localizar no `back-end`o `endpoint` causador do erro, mas antes vamos ver qual foi a rota acusada no própio `DevTools`:

![image-20211128095302475](.\imagens\image-20211128095302475.png)

 E podemos ver que a rota é a `personagens` e o método foi o `POST`, agora encontrando no `back-end` que fica dentro do nosso `index.js`:

 Essa a linha de validação que checa que caso não tenha objeto ou imagem nesse objeto a resposta será `objeto inválido`:

```javascript
const postVaga = (req, res) => {
  const vaga = service.postVaga(req.body);

  if (!objeto || !objeto.empresa || !objeto.salario) {
    res.send("Vaga inválida. O nome da empresa e o salário são obrigatórios");
  }

  if(!vaga.id){
    res.send("Ocorreu um erro ao adicionar a vaga, tente novamente mais tarde.");
  }
  res.send(vaga);
};
```

 Mas a maneira mais fácil de testar isso é utilizando o `Postman` ou o `Thunder Client` e simular esse caso direto na nossa requisição, enviando um `Payload` vazio para `POST`:

![image-20211128095032613](.\imagens\image-20211128095032613.png)

 Se fomos até os `Headers` podemos observar que o `content-type` continua sendo `text/html`:

![image-20211128095439872](.\imagens\image-20211128095439872.png)

### Corrigindo o erro

Para solucionar isso, sempre que temos um erro, devemos informar um `Status` correto e na imagem acima você observa que ele está como `200 OK` sendo que a gente obteve um `objeto inválido`, ou seja, um problema!

Primeiro de tudo transfomamos a `string`da resposta em um `JSON`, passando desse código:

```javascript
res.send("Vaga inválida. O nome da empresa e o salário são obrigatórios");
```

Para esse:

```javascript
   res.send({mensagem: "Vaga inválida. O nome da empresa e o salário são obrigatórios"});
```

Lembrando que devemos sempre confirmar que seremos o mais comunicativo possível, mandando uma resposta com muitas informações:

Além disso, como a nossa requisição veio com falha, devemos adicionar um `status` correto, nesse caso ele pode ser um `400`, ou seja, um `BAD REQUEST`:

```javascript
    res.status(400).send({mensagem: "Vaga inválida. O nome da empresa e o salário são obrigatórios"});
```

Agora nosso retorno no front vai ficar parecido com isso:

![image-20211128094737846](.\imagens\image-20211128094737846.png)

E nos `Headers` também temos ele:

![image-20211128094801956](.\imagens\image-20211128094801956.png)

O mesmo deve ser aplicado para o `PUT`e o  `DELETE`, assim ficando da seguinte maneira:

- no `PUT` é necessário o objeto com os campos obrigatório e o `Id`.
- no `DELETE` é necessário ter o `Id`.

```javascript
const putVaga = (req, res) => {
  if (!req.body || !req.body.empresa || !req.body.salario || req.params.id) {
    res.status(400).send("Vaga inválida. O Id da vaga, nome da empresa e o salário são obrigatórios");
  }

  const vaga = service.putVaga(req.params.id, req.body);

  if(!vaga.id){
    res.status(500).send({mensagem: "Ocorreu um erro ao alterar a vaga, tente novamente mais tarde."});
  }

  res.send(vaga);
};

const deleteVaga = (req, res) => {
  if ( req.params.id) {
    res.status(400).send("Vaga inválida. O Id da vaga é obrigatório");
  }
  service.deleteVaga(req.params.id);
  res.send("Vaga excluída com sucesso.");
};
```

## Front-end

Para o nosso front-end, vamos aplicar as funções de alterar e deletar uma vaga da nossa aplicação.

Para isso, será necessário realizar algumas alterações:

- Adicionar uma div para criarmos dinamicamente o espaço para edição da vaga
- Adicionar uma nova coluna para os botões de edição e deleção.

Assim deixando o HTML nessa estrutura:

```html
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blue-Vagas</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <h1>Blue-Vagas</h1>
    </header>
    <main>
        <div>
            <div>
                <input type="number" id="idVaga">
                <button onclick="vagaEscolhida()">escolher</button>
            </div> 
            <div>
                <h2>Minha vaga escolhida:</h2>
                <table id="vaga">

                </table>
            </div>
        </div>
        <table class="table" id="allVagas">
            <thead>
                <th>Id</th>
                <th>Empresa</th>
                <th>Oportunidade</th>
                <th>Tipo</th>
                <th>Salario</th>
                <th>Opções</th>
            </thead>
            <tr>
                <td></td>
                <td><input type="text" id="empresa"></td>
                <td><input type="text" id="oportunidade"></td>
                <td><input type="text" id="tipo"></td>
                <td><input type="number" id="salario"></td>
                <td><button onclick="postVaga()">Adicionar</button></td>
            </tr>
        </table>
        <div id="editar"></div>
    </main>
    <script src="./script.js"></script>
</body>

</html>
```

Agora no nosso arquivo `script.js` vamos adicionar dinamicamente os botões de edição e deleção, além de adicionar um id para cada linha, assim facilitando na hora de alterar cada uma.

```javascript
const getVagas = async () => {
  const response = await fetch(baseUrl + "/vagas");

  const vagas = await response.json();

  vagas.forEach((vaga) => {
    if (vaga)
      document.getElementById("allVagas").insertAdjacentHTML(
        "beforeend",
        `<tr id="${"row" + vaga.id}">
        <td>${vaga.id}</td>
        <td>${vaga.empresa}</td>
        <td>${vaga.oportunidade}</td>
        <td>${vaga.tipo}</td>
        <td>${vaga.salario}</td>
        <td>
          <button onclick="putVaga(${vaga.id})">editar</button>
          <button  onclick="deleteVaga(${vaga.id})">deletar</button>
        </td>
      </tr>`
      );
  });
};
```

Nesse ponto, não podemos esquecer de passar o id para as nossas funções de PUT e DELETE, para que eles tenham a referencia de quem está sendo modificado.

## PUT

Assim que o usuário clicar em editar, vamos criar dinamicamente uma segunda tabela na div que definimos nos passos anteriores e adicionar as informações que ele poderá alterar.

Primeiro, faremos uma verificação para impedir que se criem duas edições simultaneas, desse modo, caso tenha uma tabela de edição criada, ela será excluída.

```javascript
const putVaga = async(id) => {
    if(document.getElementById("tableEdit")) document.getElementById("tableEdit").remove()

    document.getElementById("editar").insertAdjacentHTML(
        "beforeend",
        `<div id="tableEdit"> 
            <h2>Editar</h2>       
            <table class = "table" >
              <thead>
                  <th>Id</th>
                  <th>Empresa</th>
                  <th>Oportunidade</th>
                  <th>Tipo</th>
                  <th>Salario</th>
                  <th>Opções</th>
              </thead>
              <tr>
                  <td><input type="text" id="idPut" readonly></td>
                  <td><input type="text" id="empresaPut"></td>
                  <td><input type="text" id="oportunidadePut"></td>
                  <td><input type="text" id="tipoPut"></td>
                  <td><input type="number" id="salarioPut"></td>
                  <td>
                  	<button onclick="confirmPut(${id})">Alterar</button>
                  </td>
              </tr>
            </table>
    	</div>`
    );

    const response = await fetch(`${baseUrl}/vaga/${id}`);

    const vaga = await response.json();
    document.getElementById("idPut").value = vaga.id;
    document.getElementById("empresaPut").value = vaga.empresa;
    document.getElementById("oportunidadePut").value = vaga.oportunidade;
    document.getElementById("tipoPut").value = vaga.tipo;
    document.getElementById("salarioPut").value = vaga.salario;
};
```

Perceba que vamos utilizar novamente o nosso endpoint para pegar as informações de acordo com o `id` que recebemos, essa rota criada facilita no momento de transmitir informações, pois com apenas o `id` conseguimos achar as outras informações em qualquer parte da nossa aplicação.

Como podemos ver, criamos dinamicamente um botão para confirmar a alteração, ele que chamara a função que realmente realizará a requisição para o backend.

A estrutura desse `confirmPut` é muito similar ao do `POST`, assim que recebermos o nosso retorno do backend, podemos introduzir a nova e excluir a linha com as informações antigas.

```javascript
const confirmPut = async (id) => {
  const empresa = document.getElementById("empresaPut").value;
  const oportunidade = document.getElementById("oportunidadePut").value;
  const tipo = document.getElementById("tipoPut").value;
  const salario = document.getElementById("salarioPut").value;
  const vaga = {
    empresa: empresa,
    salario: salario,
    oportunidade: oportunidade,
    tipo: tipo,
  };

  const response = await fetch(baseUrl + "/vaga/" + id, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(vaga),
  });
  const vagaModificada = await response.json();
    

  document.getElementById("row" + (id)).insertAdjacentHTML(
    "afterend",
    `<tr>
      <td>${vagaModificada.id}</td>
      <td>${vagaModificada.empresa}</td>
      <td>${vagaModificada.oportunidade}</td>
      <td>${vagaModificada.tipo}</td>
      <td>${vagaModificada.salario}</td>
      <td>
        <button onclick="putVaga(${vaga.id})">editar</button>
        <button  onclick="deleteVaga(${vaga.id})">deletar</button>
      </td>
    </tr>`
  );  
  document.getElementById("row" + id).remove();	
  document.getElementById("tableEdit").remove();
};
```

Com isso podemos ir para o `DELETE`

## Delete

Esse é bem mais simples, por precisar apenas do `Id ` , assim como essa informação já foi passada para a nossa função, basta enviar a requisição e caso o `status` seja 200, podemos excluir a linha da nossa tabela.

```javascript
const deleteVaga = async (id) => {
  const response = await fetch(baseUrl + "/vaga/" + id, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  const resposta = await response;
  if (resposta.status == 200) {
    document.getElementById("row" + id).remove();
  }
};
```

