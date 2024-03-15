const socket = io();

const products = [];
const addForm = document.getElementById('addProduct');
const deleteForm = document.getElementById('deleteProduct');

addForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target));
    await socket.emit('addProduct', data);
    addForm.reset();
});

deleteForm.addEventListener('submit', e => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target));
    socket.emit('deleteProduct', { _id: Object.values(data) });
    deleteForm.reset();
})



const render = async (data) => {
    const html = document.getElementById('productList');
    html.innerHTML = '';
    await data.forEach((element) => {
        const elementHtml = document.createElement('div');
        elementHtml.classList.add('card', 'g-col-6');
        elementHtml.innerHTML = ` <h2>${element.title}</h2>
    <p>Codigo: ${element.code}</p>
    <p>Precio: ${element.price}</p>
    <p>Stock: ${element.stock}</p>
    <p>Categoria: ${element.category}</p>
    <button onclick="deleteProduct('${element._id}')">Eliminar</button>
    `;
        html.appendChild(elementHtml);
    });
};

async function deleteProduct(productId) {
    await socket.emit('deleteProduct', { _id: productId });
}

socket.on('products', (data) => {
    render(data);
});