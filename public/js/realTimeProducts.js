const socket = io();
const products = [];
const addForm = document.getElementById('addProduct');
const deleteForm = document.getElementById('deleteProduct');

addForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target));
    await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    await socket.emit('update');
    addForm.reset();
});

deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target));
    await fetch(`/api/products/${{ _id: data }}`, {
        method: 'DELETE',
    });
    await socket.emit('update');
    deleteForm.reset();
})

const render = async (data) => {
    const html = document.getElementById('productList');
    html.innerHTML = '';
    await data.forEach((element) => {
        const elementHtml = document.createElement('div');
        elementHtml.classList.add('card', 'g-col-6');
        elementHtml.innerHTML = ` <h2>${element.title}</h2>
    <p>Código: ${element.code}</p>
    <p>Precio: ${element.price}</p>
    <p>Stock: ${element.stock}</p>
    <p>Categoría: ${element.category}</p>
    <button onclick="deleteProduct('${element._id}')">Eliminar</button>
    `;
        html.appendChild(elementHtml);
    });
};

async function deleteProduct(productId) {
    await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
    });
    await socket.emit('update');
}

socket.on('products', (data) => {
    render(data);
});