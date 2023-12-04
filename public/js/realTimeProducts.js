const socket = io();

const products = [];
const addForm = document.getElementById('addProduct');
const deleteForm = document.getElementById('deleteProduct');

addForm.addEventListener('submit', e => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target));
    socket.emit('addProduct', data);
    addForm.reset();
});

deleteForm.addEventListener('submit', e => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target));
    socket.emit('deleteProduct', data);
    deleteForm.reset();
})

const render = async (data) => {
    const html = document.getElementById('productList');
    html.innerHTML = '';
    await data.forEach((element) => {
        const elementHtml = document.createElement('div');
        elementHtml.innerHTML = ` <h3>${element.title}</h3>
    <p>${element.description}</p>
    <p>${element.code}</p>
    <p>${element.price}</p>
    <p>${element.stock}</p>
    <p>${element.category}</p>
    ${element.thumbnail ? `<p>${element.thumbnail}</p>` : ''}
    `;
        html.appendChild(elementHtml);
    });
};

socket.on('products', (data) => {
    render(data);
});