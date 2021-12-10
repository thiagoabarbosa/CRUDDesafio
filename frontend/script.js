//Constantes:
//baseURL: Url base para acessar o banco de dados.
var baseurl = "http://localhost:8080/destination";
//header: Header da tabela, para uso na conversao para CSV.
var header = "ID, Destination\r\n";
//Variaveis globais:
//editingId: Indica o ID do elemento que esta sendo modificado. Recebe um novo valor quando
//um click e identificado no botao de Edit.
var editingId;
//currentJSON: JSON a ser utilizado na funcao de conversao para CSV. Recebe um novo valor quando
//a tabela e atualizada, para que possa conter todos os elementos.
var currentJSON;
//currentPage: Variavel que indica a "pagina" atual para paginacao da tabela.
//10 elementos por pagina. A pagina inicial e sempre 0, essa variavel e modificada
// pela funcao changePage.
var currentPage = 0;

//Funcao que carrega a tabela, executando a requisicao GET: 
//A funcao recebe como parametros o id e destination pelo qual deseja filtrar.
//Caso nao haja filtro, a funcao recebe como parametro uma string vazia ("")
function loadDestinations(id, destination){
    //document.getElementById("tableinfo").innerHTML = "";
    let xmlhttp =  new XMLHttpRequest();
    xmlhttp.open("GET", baseurl+"?id="+id+"&destination="+destination,true);
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState ===4 && xmlhttp.status ===200){
            let destinations = JSON.parse(xmlhttp.responseText);
            currentJSON = destinations;
            let tbltop = `<table id="dtnTable" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">DESTINATION</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>`;
            let main = "";
            let tableSize = 10 * (currentPage + 1);
            if(tableSize > destinations.length){
                tableSize = destinations.length;
            }
            for(i = currentPage * 10; i < tableSize; i++){
                main+=  "<tr>"+
                           "<th scope='row' id='table-dtn-"+destinations[i].dtn_id+"'>"+destinations[i].dtn_id+"</th>"+
                                "<td>"+destinations[i].dtn_destination+"</td>"+
                                `<td><button type='button' class='btn btn-primary btn-sm editar' onclick='editForm(1, "table-dtn-${destinations[i].dtn_id}")'>Editar</button><button type='button' class='btn btn-danger btn-sm' onclick='deleteElement("table-dtn-${destinations[i].dtn_id}")'>Remover</button></td>`+
                        "</tr>";
            }
            let tblbottom = "</tbody></table>";
            let tbl = tbltop + main + tblbottom;
            document.getElementById("tableinfo").innerHTML = tbl;
        }
    };
    xmlhttp.send();
}

//Funcao pra aplicar os filtros na tabela
function applyFilter(){
    loadDestinations(document.getElementById("idFormField").value, document.getElementById("destinationFormField").value);
}

//Funcao para limpar o filtro, mostrando a tabela com todos os elementos
//Tambem limpa os campos onde o ID e Destination utilizados para filtrar estavam
function clearFields(){
    document.getElementById("idFormField").value = "";
    document.getElementById("destinationFormField").value = "";
    loadDestinations("","");
}

//Deleta o elemento especificado. A funcao recebe como parametro o ID do elemento
//Requisicao DELETE
function deleteElement(eltId){
    let id = document.getElementById(eltId).innerHTML;
    let xmlhttp =  new XMLHttpRequest();
    xmlhttp.open("DELETE", baseurl+"/"+id, true);
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState ===4){
            loadDestinations("","");
        }
    };
    xmlhttp.send();
}

//Funcao para abrir/fechar o formulario de adicao de um novo elemento na tabela. Recebe como parametro
//"num", que indica se o formulario deve abrir ou fechar.
function addForm(num){
    if(num == 0){
        document.getElementById("myAddForm").style.display = "none";
    }else if(num == 1){
        document.getElementById("myEditForm").style.display = "none";
        document.getElementById("myAddForm").style.display = "block";
    }
    document.getElementById("idAddFormField").value = "";
    document.getElementById("dtnAddFormField").value = "";
}

//Funcao pra abrir/fechar o formulario de edicao de um dado elemento da tabela. Recebe como parametros
//"num", que indica se o formulario deve abrir(1) ou fechar(0), e o ID do elemento sendo editado.
function editForm(num, eltId){
    if(num == 0){
        document.getElementById("myEditForm").style.display = "none";
    }else if(num == 1){
        editingId = eltId;
        document.getElementById("myAddForm").style.display = "none";
        document.getElementById("myEditForm").style.display = "block";
    }
    document.getElementById("dtnEditFormField").value = "";
}

//Funcao para adicionar um elemento a tabela. Busca o ID e Destination do elemento a ser adicionado
//nos formularios mencionados previamente.
//Requisicao PUT
function addElement(){
    let id = document.getElementById("idAddFormField").value;
    let body = document.getElementById("dtnAddFormField").value;
    let xmlhttp =  new XMLHttpRequest();
    xmlhttp.open("PUT", baseurl+"/"+id, true);
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState ===4){
            loadDestinations("","");
        }
    };
    xmlhttp.send(body);
    addForm(0);
}

//Funcao para adicionar um elemento a tabela. Busca o Destination do elemento a ser adicionado
//nos formularios mencionados previamente. Pega o ID baseado na coluna na qual foi pressionado o botao.
//Requisicao PUT
function editElement(){
    let id = document.getElementById(editingId).innerHTML
    let body = document.getElementById("dtnEditFormField").value;
    let xmlhttp =  new XMLHttpRequest();
    xmlhttp.open("PUT", baseurl+"/"+id, true);
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState ===4){
            loadDestinations("","");
        }
    };
    xmlhttp.send(body);
    editForm(0, null);
}

//Funcao para converter a tabela(com todos os elementos) para um CSV.
//Importante mencionar: Na duvida, decidi converter a tabela com todos os elementos, 
//porque nao achei que ia receber uma resposta em tempo habil para modificar o programa.
function convertTableToCSV(fileTitle) {
    let array = currentJSON;
    let str = '';
    let csv = header;

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }
    csv += str;
    console.log(csv);
    let exportedFilename = fileTitle + '.csv' || 'export.csv';

    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilename);
    } else {
        let link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

//Funcao para controlar a paginacao da tabela. 
//Recebe como parametro "num", que indica se a tabela deve andar para frente(1) ou para tras(0).
function changePage(num){
    if(num == 0){
        if(currentPage > 0){
            currentPage--;
        }
    }else if(num == 1){
        currentPage++;
    }
    loadDestinations("","");
}

//Carrega a tabela com todos os elementos, sem filtro, ao carregar a pagina inicialmente.
window.onload = function(){
    loadDestinations("","");
}