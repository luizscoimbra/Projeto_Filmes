# [Dia 03] [AULA] Backend NodeJS com Express e consumo com Frontend JS (Vanilla) - Parte 2

## Relembrando: MVC

É um padrão em design de software comumente usado para implementar interfaces de usuário, dados e lógica de controle. Ele enfatiza a separação entre a lógica de negócios do software e a exibição. Esta "separação de interesses" proporciona uma melhor divisão do trabalho e uma manutenção aprimorada.

As três partes do padrão de design de software MVC podem ser descritas da seguinte forma:

- Model: gerencia dados e lógica de negócios.
- View: controla o layout e a exibição.
- Controller: encaminha comandos para o modelo e exibe as peças.

Como visto anteriormente, o MVC é um padrão muito adotado no mercado devido a sua praticidade e organização, mas nessa aula veremos outra forma de design de software utilizada, nela teremos:

- Route: que se refere ao roteamento, que é a determinação de como um aplicativo responde a uma solicitação do cliente por um endpoint específico, que é uma URI (ou caminho) e um método de solicitação HTTP específico (GET, POST, e assim por diante).
- Controller: que fará o tratamento inicial dos dados e tem a responsabilidade de gerenciar os comandos da aplicação.
- Service: responsável pela regra de negócio da aplicação e que tem a responsabilidade de se comunicar com as camadas mais internas, como o banco de dados.

Conhecendo melhor a estrutura, vamos separar as rotas  `GET`  nessa nova estrutura, o primeiro passo é criar as respectivas pastas e arquivos para as rotas, controller e service . Limpando o nosso arquivo index.js e deixando ele mais organizado.

Vamos começar realizando o `require` do arquivo de rotas no arquivo principal e definir que as rotas exportadas no route.js serão utilizadas como nossos endpoints.

```javascript
const route = require('./routes/route.js');
app.use('',route) 
```

## Rotas

Com os arquivos e pastas criadas, podemos começar pelo route.js, a idéia desse arquivo é manter organizado todas as rotas pelo qual serão enviadas as requisições.

Para trazer as rotas vamos trazer novamente o require do express e criar uma constante router e chamar o método `app.Router()` e a partir dele, recriaremos as rotas.

Como esse arquivo é responsável somente pelas rotas, montaremos uma requisição para trazer as funções do controller e chamaremos as respectivas funções. 

Ao fim vamos adicionar um `module.exports` para deixar essas rotas disponíveis para o nosso arquivo index.js

```javascript
const express = require("express"); //import express

const router = express.Router();

const controller = require("../controllers/controller");

module.exports = router;

router.get("/vagas", controller.getVagas);

router.get("/vaga/:id", controller.getVagaById);
```

## Controller

No nosso arquivo do controller, vamos criar as funções que serão chamadas pelo route.js, como esse arquivo é responsável pelas respostas das requisições e o tratamento básico dos dados,  a única coisa que faremos nessas funções é chamar as funções que serão preparadas no nosso service.

Assim, montaremos um require para o service e em cada função chamaremos a função responsável , dessa maneira e guardaremos o resultado em uma constante para enviar como resposta da requisição.

```javascript
const service = require("../services/service.js");

const getVagas = (req, res) => {
  let allVagas = service.getVagas();
  res.send(allVagas);
};

const getVagaById = (req, res) => {
  const urlId = req.params.id;
  const vagaEscolhida = service.getVagaById(urlId);
  res.send(vagaEscolhida);
};

module.exports = {
  getVagas,
  getVagaById,
};

```

## Service

O service será nossa camada mais interna e responsável pelo tratamento das informações, lidando com regras de negócio e contato com o banco de dados ( no nosso caso um array de objetos) .

Assim vamos trazer nossos dados para esse arquivo e criar as respectivas funções que são chamadas pelo Controller.

Nessas funções, vamos utilizar a mesma estrutura que criamos na primeira aula. Então, no `getCharacters` apenas retornaremos o `array` e no   `getCharacterById` receberemos o `id` do controller e realizaremos o `.find()` para encontrar e assim retornarmos a vaga escolhida.

```javascript
const blueVagas = [
  {
    id: 1,
    empresa: "Blue",
    salario: 3000,
    oportunidade: "Front-end Jr",
    tipo: "estágio",
  },
  {
    id: 2,
    empresa: "Google",
    salario: 6000,
    oportunidade: "Front-end Jr",
    tipo: "estágio",
  },
  {
    id: 3,
    empresa: "Tech Brasil",
    salario: 2300,
    oportunidade: "Back-end Jr",
    tipo: "CLT",
  },
  {
    id: 4,
    empresa: "Jouzer",
    salario: 5000,
    oportunidade: "Back-end Pleno",
    tipo: "PJ",
  },

];

const getVagas = () => {
  return blueVagas;
};

const getVagaById = (id) => {
  return blueVagas.find((vaga) => vaga.id == id);
};

module.exports = {
  getVagas,
  getVagaById
};

```

Ao fim dessa estrutura, teremos o arquivo index.js mais limpo e toda nossa API mais organizada e com fácil manutenção.

```javascript
const express = require("express");

const port = 3000;

const app = express();

app.use(express.json());

const route = require('./routes/route.js');
app.use('',route) 

app.all("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Methods", "*");

    res.header(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
    );

    next();
});

app.listen(port, () => {
    console.info(`App running at http://localhost:${port}`);
});

```

## Create, Update e Delete

Com essa nossa estrutura pronta, podemos criar o endpoints de `POST`,`PUT` e `DELETE` no nosso arquivo de rotas:

```javascript
router.post("/vaga", controller.postVaga);

router.put("/vaga/:id", controller.putVaga);

router.delete("/vaga/:id", controller.deleteVaga);
```

Como vemos, eles seguem a mesma estrutura do `GET`, sendo necessário o `id` para o `PUT` pois precisamos saber qual objeto será modificado e para o `DELETE` para saber qual será excluido.

Ao fim, chamamos a respectiva função no controller.

No controller, realizaremos os tratamentos iniciais dos dados, assim: 

- No `postCharacter` vamos chamar a função do Service e separar o JSON com a vaga para enviar na função. 
- No`putCharacter` vamos chamar a função e enviar o `id` e a vaga editado.
- No`putCharacter` vamos chamar a função e enviar o `id` para identificarmos no service o objeto que será deletado.

Depois de chamarmos a função do service, vamos guardar o retorno em uma constante para retornar na resposta para o front-end

```javascript
const postVaga = (req, res) => {
  const vaga = service.postVaga(req.body);
  res.send(vaga);
};

const putVaga = (req, res) => {
  const vaga = service.putVaga(req.params.id, req.body);

  res.send(vaga);
};

const deleteVaga = (req, res) => {
  service.deleteVaga(req.params.id);
  res.send("Vaga excluída com sucesso.");
};
```

No service, será onde essas informações serão tratadas,  para isso vamos começar com o `POST`. 

Nele, primeiro será necessário criar uma variável para mantermos o controle dos `ids`, assim, o ultimo utilizado será o mesmo do tamanho do nosso `array`.

Com o `id` definido podemos criar a nossa função, nele receberemos os dados da vaga e acrescentaremos em 1 o valor do id, para ser único, e colocaremos como uma propriedade da vaga.

Assim, nosso objeto com a vaga está concluido e pode ser inserido no nosso array com o `push()` .

```javascript
let startId = blueVagas.length;

const postVaga = (vaga) => {
  startId++;
  vaga.id = startId;
  blueVagas.push(vaga);
  return vaga;
};
```

No caso do `PUT` será algo semelhante ao `POST`, contudo o id será enviado na requisição, então trataremos esse id para refletir a posição no nosso array e guardaremos na constante index. 

Com essa informação definida podemos adicionar o objeto na posição correta e substituir os dados.

```javascript
const putVaga = (id, vaga) => {
  vaga["id"] = id;
  const index = id - 1;
  blueVagas[index] = vaga;
  return vaga;
};
```

Por fim, temos o delete, onde precisaremos realizar o ajuste de id para index como no PUT, e realizarmos o delete do objeto de acordo com o index correto.

```
const deleteVaga = (id) => {
  const index = id - 1;
  delete blueVagas[index];
};
```

Front-end

Com o CRUD formado no backend, vamos voltar ao front-end criando o post.

No HTML, vamos criar inputs onde o usuário irá inserir os valores, nesse caso, vamos criar uma linha na nossa tabela para inserção, lembrando de adicionar `ids` para ser possível encontrar os campos facilmente e coletar as informações.

```html
<tr>
    <td></td>
    <td><input type="text" id="empresa"></td>
    <td><input type="text" id="oportunidade"></td>
    <td><input type="text" id="tipo"></td>
    <td><input type="number" id="salario"></td>
    <td>
        <button onclick="postVaga()">
            Adicionar
        </button>
    </td>
</tr>
```

Ao fim dos campos, será adicionado um botão para chamar a função `postVagas` no nosso JavaScript.

Nessa função, vamos coletar as informações fornecidas pelo usuário e inserir em um objeto chamado `vaga` com todas as propriedades.

```javascript
const postVaga = (e)=>{
  const empresa = document.getElementById("empresa").value
  const oportunidade = document.getElementById("oportunidade").value
  const tipo = document.getElementById("tipo").value
  const salario = document.getElementById("salario").value
  const vaga = {
    "empresa": empresa,
    "salario": salario,
    "oportunidade": oportunidade,
    "tipo": tipo
  }
```

Com o objeto preparado, vamos montar o nosso `fetch`  passando:

- `URL` com o nosso endpoint
- Método `POST`  ;
- `headers` indicando que o formato enviado é um JSON;
- `mode` indicando que o modo do request é cors;
- `body` com o nosso objeto vaga.

```javascript
  const response = fetch(baseUrl + "/vaga",{
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    },
    mode:'cors',
    body: JSON.stringify(vaga)
  });
    const vagaAdicionada = await response.json();

```

Assim que recebermos o retorno da nossa API que o objeto foi inserido, vamos adicionar a nova vaga na tela e limpar os campos para o usuário poder adicionar novas vagas.

```javascript
  document.getElementById("allVagas").insertAdjacentHTML(
    "beforeend",
    `<tr>
      <td>${vagaAdicionada.id}</td>
      <td>${vagaAdicionada.empresa}</td>
      <td>${vagaAdicionada.oportunidade}</td>
      <td>${vagaAdicionada.tipo}</td>
      <td>${vagaAdicionada.salario}</td>
    </tr>`
  );
  document.getElementById("empresa").value = "";
  document.getElementById("oportunidade").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("salario").value = "";
  }
```

