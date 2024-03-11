cartsRouter.post('/', async (req, res) => Crea un carrito

cartsRouter.get('/:cid', async (req, res) => Obtiene un carrito por id

cartsRouter.post('/:cid/product/:pid', middlewarePassportJWT, isUser, async (req, res) => Agrega un producto mediante su id a un carrito mediante su id

cartsRouter.delete('/:cid', async (req, res) => Borra un carrito por id

cartsRouter.delete('/:cid/product/:pid', async (req, res) => Borra un producto mediante su id a de un carrito mediante su id

cartsRouter.put('/:cid', async (req, res) => Actualiza un carrito recibiendo un array de productos

cartsRouter.put('/:cid/product/:pid', async (req, res) => Actualiza la cantidad de un producto del carrito

cartsRouter.put('/:cid/purchase', async (req, res) => Finaliza la compra, revisa si hay stock suficiente de los productos del carrito y genera un ticket con los productos y el monto, y devuelve los productos sin stock
