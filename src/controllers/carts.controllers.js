import cartDao from "../dao/mongoDao/cart.dao.js";


const handleAsync = (fn) => async (req, res, next) => {
  try {
    const result = await fn(req, res, next);
    res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

const createCart = handleAsync(async (req, res) => {
  const cart = await cartDao.create();
  return cart;
});

const addProductToCart = handleAsync(async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartDao.addProductToCart(cid, pid);
  if (!cart.product) return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el id ${pid}` });
  if (!cart.cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
  return cart;
});

const updateQuantityProductInCart = handleAsync(async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const cart = await cartDao.updateQuantityProductInCart(cid, pid, quantity);
  if (!cart.product) return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el id ${pid}` });
  if (!cart.cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
  return cart;
});

const deleteProductInCart = handleAsync(async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartDao.deleteProductInCart(cid, pid);
  if (!cart.product) return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el id ${pid}` });
  if (!cart.cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
  return cart;
});

const getCartById = handleAsync(async (req, res) => {
  const { cid } = req.params;
  const cart = await cartDao.getById(cid);
  if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
  return cart;
});

const updateCart = handleAsync(async (req, res) => {
  const { cid } = req.params;
  const cart = await cartDao.update(cid, req.body);
  if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
  return cart;
});

const deleteAllProductsInCart = handleAsync(async (req, res) => {
  const { cid } = req.params;
  const cart = await cartDao.deleteAllProductsInCart(cid);
  if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
  return cart;
});

export default {
  createCart,
  addProductToCart,
  updateQuantityProductInCart,
  deleteProductInCart,
  getCartById,
  updateCart,
  deleteAllProductsInCart
};
