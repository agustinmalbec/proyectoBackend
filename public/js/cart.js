const cartId = document.getElementById('userCart').dataset.id;
const cerrarCarrito = document.getElementById('finishCart');
cerrarCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.json())
        .then(objeto => {
            Swal.fire({
                title: 'Detalle de la compra',
                text: `Monto total: ${objeto.amount}
                Fecha de compra: ${objeto.purchase_datetime}`,
                icon: 'success',
                confirmButtonText: '<a href="/">Vuelva al inicio</a>'
            });

        })

});

let deleteButton = document.querySelectorAll(".delete");

for (let n of deleteButton) {
    n.addEventListener("click", (e) => {
        e.preventDefault();
        let cid = cartId;
        let pid = e.target.id;
        fetch(`/api/carts/${cid}/product/${pid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(data => {
            Swal.fire({
                title: 'Eliminado del carrito',
                icon: 'success',
                timer: 1200,
                showConfirmButton: false
            });
            setTimeout(() => {
                location.reload();
            }, 1200);
        });
    });
}