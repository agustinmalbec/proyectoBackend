const cartId = document.getElementById('userCart').dataset.id;
let addButton = document.querySelectorAll(".add");
for (let n of addButton) {
    n.addEventListener("click", (e) => {
        e.preventDefault();
        let cid = cartId;
        let pid = e.target.id;
        fetch(`/api/carts/${cid}/product/${pid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: 1 }),
        });
    });
}