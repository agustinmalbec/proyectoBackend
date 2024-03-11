export const createProductErrorInfo = ({ product }) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Lista de propiedades requeridas:
            -> title: type: String, recibido: ${product.title}
            -> category: type: String, recibido: ${product.category}
            -> description: type: String, recibido: ${product.description}
            -> price: type: Number, recibido: ${product.price}
            -> stock: type: Number, recibido: ${product.stock}
    `;
};