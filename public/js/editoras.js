function displayEditoras(Editoras) {
    const tbody = document.getElementById("listaEditoras");
    tbody.innerHTML = ""; // Limpar a tabela

    Editoras.forEach(editoras => {
        const row = tbody.insertRow();

        const nomeCell = row.insertCell(0); 
        nomeCell.textContent = editoras.nome;

        const enderecoCell = row.insertCell(1);
        enderecoCell.textContent = editoras.endereco;

        const telefoneCell = row.insertCell(2);
        telefoneCell.textContent = editoras.telefone;

        const actionsCell = row.insertCell(3);
        actionsCell.innerHTML = `<button class="icon-btn" onclick='editareditora(${JSON.stringify(editoras)})'>
        <i class="fas fa-edit"></i> Editar
    </button>
    <button class="icon-btn" onclick="deleteeditora(${editoras.id})">
    <i class="fas fa-trash"></i> Excluir
    </button>`;
    });
}

function fetchEditoras() {
    fetch("/api/editoras")
        .then(res => res.json())
        .then(telefone => {
            displayEditoras(telefone);
        })
        .catch(error => {
            console.error("Erro ao buscar Editoras:", error);
        });
}

function deleteeditora(id) {
    fetch(`/api/editoras/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        fetchEditoras();
    })
    .catch(error => {
        console.error("Erro ao deletar editoras:", error);
    });
}

function editareditora(editoras) {
    const addEditBtn = document.getElementById("addEditBtn");
    const nome = document.getElementById("nome_e");
    const endereco = document.getElementById("endereco");
    const telefonePublicacao = document.getElementById("telefone");
    const editoraId= document.getElementById("id_editora");
    nome.value = editoras.nome;
    endereco.value = editoras.endereco;
    telefonePublicacao.value = editoras.telefone;
    editoraId.value = editoras.id;
    addEditBtn.click();
/**/
}

function limparFormulario(){
    const nome = document.getElementById("nome_e");
    const endereco = document.getElementById("endereco");
    const telefonePublicacao = document.getElementById("telefone");
    const editoraId= document.getElementById("id_editora");

    nome.value = "";
    endereco.value = "";
    telefonePublicacao.value = "";
    editoraId.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "/api/editoras";
    const EditForm = document.getElementById("bookForm");
    const EditPopup = document.getElementById("bookPopup");
    const addEditBtn = document.getElementById("addEditBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Carregar Editoras ao carregar a página
    fetchEditoras();
    // carregarenderecoes();
    // carregarEditoras();

    // Mostrar popup ao clicar no botão "Adicionar editora"
    addEditBtn.addEventListener("click", function() {
        EditPopup.classList.add("show");
        EditPopup.classList.remove("hidden");
    });

    // Fechar popup
    closePopupBtn.addEventListener("click", function() {
        EditPopup.classList.add("hidden");
        EditPopup.classList.remove("show");
        limparFormulario();
    });

    // Adicionar novo editoras ou atualizar um existente
    EditForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome_e").value;
        const endereco = document.getElementById("endereco").value;
        const telefonePublicacao = document.getElementById("telefone").value;
        const editoraId= document.getElementById("id_editora").value;

        let methodSalvar = "POST";
        let apiUrlSalvar = apiUrl;
        if(editoraId != "" && editoraId > 0){
            methodSalvar = "PUT";
            apiUrlSalvar += "/" + editoraId;
        }
    
        fetch(apiUrlSalvar, {
            method: methodSalvar,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, endereco, telefonePublicacao })
        })
        .then(res => {
            if (res.ok && res.status == "201") return res.json();
            else if (res.ok && res.status == "204") return;
            throw new Error(res.statusText);
        })
        .then(telefone => {
            fetchEditoras();
            limparFormulario();
            closePopupBtn.click();
        })
        .catch(error => {
            console.error("Erro ao adicionar/atualizar editoras:", error);
        });
    
    });
});

function carregarenderecoes() {
    fetch("/api/enderecoes")
    .then(response => response.json())
    .then(enderecoes => {
      const enderecoSelect = document.getElementById("endereco");
      enderecoes.forEach(endereco => {
        const option = document.createElement("option");
        option.value = endereco.id;
        option.textContent = endereco.nome;
        enderecoSelect.appendChild(option);
      });
    })
    .catch(error => console.error("Erro ao carregar enderecoes:", error));
  }

function carregarEditoras() {
    fetch("/api/editoras")
    .then(response => response.json())
    .then(editoras => {
      const editoraSelect = document.getElementById("editora");
      editoras.forEach(editora => {
        const option = document.createElement("option");
        option.value = editora.id;
        option.textContent = editora.nome;
        editoraSelect.appendChild(option);
      });
    })
    .catch(error => console.error("Erro ao carregar editoras:", error));
  }
