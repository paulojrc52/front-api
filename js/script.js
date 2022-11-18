const edit = document.querySelector('#edit')
const add = document.querySelector('#add')
const form = document.querySelector('#form')
const formEdit = document.querySelector('#formEdit')
const productsList = document.querySelector('#products-list')


const API_URL = 'http://localhost:8080/api/products'


// Adiciona evento de click no botão editar
function eventButtonEdit() {
    const botoesEditar = document.querySelectorAll('.botao-editar')
    botoesEditar.forEach(botao => {
        botao.onclick = function(event) {
            event.preventDefault()
            add.classList.add('hidden')
            edit.classList.remove('hidden')

            const id = this.dataset.id
            const name = this.dataset.name
            const brand = this.dataset.brand
            const price = this.dataset.price

            document.forms['formEdit'].id.value = id
            document.forms['formEdit'].name.value = name
            document.forms['formEdit'].brand.value = brand
            document.forms['formEdit'].price.value = price
            
        }
    })
}

// Adiciona evento de click no botão excluir
function eventButtonRemove() {
    const botoesExcuir = document.querySelectorAll('.botao-excluir')
    botoesExcuir.forEach(botao => {
        botao.onclick = function(event) {
            event.preventDefault()

            const id = this.dataset.id

            fetch(`${API_URL}/${id}`,{
                method: 'DELETE',
            }).then(response => {
                response.json().then(data => {
                    if(data.message === 'success') {
                        obterLista()
                        alert('Produto excluído com sucesso!')
                    } else {
                        alert('Ops, ocorreu um erro, tente novamente!')
                    }
                })
            })
        }
    })
}

// Obtem lista de produtos
function obterLista(){
    fetch(API_URL).then(response => {
        response.json().then(data => {
            const productsHtml = data.map(product => `
                <li>
                    ${product.name} - ${product.brand} - Valor: ${product.price} - <a 
                        href="#" 
                        class="botao-editar" 
                        data-id="${product._id}" 
                        data-name="${product.name}" 
                        data-brand="${product.brand}" 
                        data-price="${product.price}"
                    >
                        [editar]
                    </a> - 
                    <a 
                        href="#" 
                        class="botao-excluir" 
                        data-id="${product._id}"
                    >
                        [excluir]
                    </a>
                </li>
            `).join('')
            
            productsList.innerHTML = productsHtml

            eventButtonRemove()
            eventButtonEdit()
    
        })
    })
}

obterLista()

// Cadastrar um produto
form.onsubmit = function(event) {
    event.preventDefault()

    const name = document.forms['form'].name.value
    const brand = document.forms['form'].brand.value
    const price = document.forms['form'].price.value


    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            brand,
            price
        })
    }).then(response =>{
        response.json().then(data => {
            if(data.message === 'success') {
                form.reset()
                obterLista()
                alert('Cadastro realizado com sucesso!')
            } else {
                alert('Ops, ocorreu um erro, tente novamente!')
            }
        })
    })
}

// Editar um Produto
formEdit.onsubmit = function(event) {
    event.preventDefault()

    const id = document.forms['formEdit'].id.value
    const name = document.forms['formEdit'].name.value
    const brand = document.forms['formEdit'].brand.value
    const price = document.forms['formEdit'].price.value

    fetch(`${API_URL}/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            brand,
            price
        })
    }).then(response => {
        response.json().then(data => {
            if(data.message === 'success') {
                formEdit.reset()
                add.classList.remove('hidden')
                edit.classList.add('hidden')
                obterLista()
                alert('Produto alterado com sucesso!')
            } else {
                alert('Ops, ocorreu um erro, tente novamente!')
            }
        })
    })
}

