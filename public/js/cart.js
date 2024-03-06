const cartId = document.getElementById('userCart').dataset.id;
const cerrarCarrito = document.getElementById('finishCart');
cerrarCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    fetch(`/api/carts/${cartId}/purchase`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    })
    //.then((response) => response.json())
    /*.then((datos) => {
        let cart = payCart()
        return fetch('/api/tickets/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cart)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                // localStorage.removeItem('idCarrito');
                // window.location.href = '../../products';
            })
            .catch((err) => {
                console.log('An error occurred:', err)
            })
    });  */
});