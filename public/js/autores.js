function displayAutores(Autores) {
    const tbody = document.getElementById("listaAutores");
    tbody.innerHTML = ""; // Limpar a tabela

    Autores.forEach(autores => {
        const row = tbody.insertRow();

        const nomeCell = row.insertCell(0);
        nomeCell.textContent = autores.nome;

        const biografiaCell = row.insertCell(1);
        biografiaCell.textContent = autores.biografia;

        const dataNascimentoCell = row.insertCell(2);
        dataNascimentoCell.textContent = autores.dataNascimento;

        const actionsCell = row.insertCell(3);
        actionsCell.innerHTML = `<button class="icon-btn" onclick='editarautor(${JSON.stringify(autores)})'>
        <i class="fas fa-edit"></i> Editar
    </button>
    <button class="icon-btn" onclick="deleteautor(${autores.id})">
    <i class="fas fa-trash"></i> Excluir
    </button>`;
    });
}

function fetchAutores() {
    fetch("/api/autores")
        .then(res => res.json())
        .then(dataNascimento => {
            displayAutores(dataNascimento);
        })
        .catch(error => {
            console.error("Erro ao buscar Autores:", error);
        });
}

function deleteautor(id) {
    fetch(`/api/autores/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        fetchAutores();
    })
    .catch(error => {
        console.error("Erro ao deletar Autores:", error);
    });
}

function editarautor(Autores) {
    const addAutBtn = document.getElementById("addAutBtn");
    const nome = document.getElementById("nome_a");
    const biografia = document.getElementById("biografia");
    const dataNascimento = document.getElementById("dataNascimento");
    const autorId= document.getElementById("id_autor");
    nome.value = Autores.nome;
    biografia.value = Autores.biografia;
    dataNascimento.value = new Date(Autores.dataNascimento).toISOString().split('T')[0];
    autorId.value = Autores.id;
    addAutBtn.click();
/**/
}

function limparFormulario(){
    const nome = document.getElementById("nome_a");
    const biografia = document.getElementById("biografia");
    const dataNascimento = document.getElementById("dataNascimento");
    const autorId= document.getElementById("id_autor");

    nome.value = "";
    biografia.value = "";
    dataNascimento.value = "";
    autorId.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "/api/autores";
    const BookForm = document.getElementById("bookForm");
    const BookPopup = document.getElementById("bookPopup");
    const addAutBtn = document.getElementById("addAutBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Carregar Autores ao carregar a página
    fetchAutores();
    // carregarbiografiaes();
    // carregarAutores();

    // Mostrar popup ao clicar no botão "Adicionar autor"
    addAutBtn.addEventListener("click", function() {
        BookPopup.classList.add("show");
        BookPopup.classList.remove("hidden");
    });

    // Fechar popup
    closePopupBtn.addEventListener("click", function() {
        BookPopup.classList.add("hidden");
        BookPopup.classList.remove("show");
        limparFormulario();
    });

    // Adicionar novo Autores ou atualizar um existente
    BookForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome_a").value;
        const biografia = document.getElementById("biografia").value;
        const dataNascimento = document.getElementById("dataNascimento").value;
        const autorId= document.getElementById("id_autor").value;

        let methodSalvar = "POST";
        let apiUrlSalvar = apiUrl;
        if(autorId != "" && autorId > 0){
            methodSalvar = "PUT";
            apiUrlSalvar += "/" + autorId;
        }
    
        fetch(apiUrlSalvar, {
            method: methodSalvar,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, biografia, dataNascimento })
        })
        .then(res => {
            if (res.ok && res.status == "201") return res.json();
            else if (res.ok && res.status == "204") return;
            throw new Error(res.statusText);
        })
        .then(dataNascimento => {
            fetchAutores();
            limparFormulario();
            closePopupBtn.click();
        })
        .catch(error => {
            console.error("Erro ao adicionar/atualizar Autores:", error);
        });
    
    });
});

function carregarbiografiaes() {
    fetch("/api/biografiaes")
    .then(response => response.json())
    .then(biografiaes => {
      const biografiaSelect = document.getElementById("biografia");
      biografiaes.forEach(biografia => {
        const option = document.createElement("option");
        option.value = biografia.id;
        option.textContent = biografia.nome;
        biografiaSelect.appendChild(option);
      });
    })
    .catch(error => console.error("Erro ao carregar biografiaes:", error));
  }

function carregarAutores() {
    fetch("/api/autores")
    .then(response => response.json())
    .then(Autores => {
      const Autoreselect = document.getElementById("autor");
      Autores.forEach(autor => {
        const option = document.createElement("option");
        option.value = autor.id;
        option.textContent = autor.nome;
        Autoreselect.appendChild(option);
      });
    })
    .catch(error => console.error("Erro ao carregar Autores:", error));
  }
