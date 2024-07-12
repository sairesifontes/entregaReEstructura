import { Router } from "express";
import licorDao from "../dao/mongoDao/licor.dao.js";
import { authorization, passportCall } from "../middlewares/passport.middleware.js";
import { productDataValidator } from "../validators/productData.validator.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: {
        price: sort === "asc" ? 1 : -1,
      },
      lean: true,
    };

    if (status) {
      const licores = await licorDao.getAll({ status: status }, options);
      return res.status(200).json({ status: "success", payload: licores });
    }

    if (category) {
      const licores = await licorDao.getAll({ categoria: category }, options);
      return res.status(200).json({ status: "success", payload: licores });
    }

    const licores = await licorDao.getAll({}, options);

    res.status(200).json({ status: "success", payload: licores });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/:lid", async (req, res) => {
  try {
    const { lid } = req.params;

    const licor = await licorDao.getById(lid);
    if (!licor) {
      return res.status(404).json({ status: "Error", msg: `Licor con el id ${lid} no encontrado` });
    }

    res.status(200).json({ status: "success", payload: licor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.post("/", passportCall("jwt"), authorization("admin"), productDataValidator, async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productDao.create(product);

    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.put("/:pid", passportCall("jwt"), authorization("admin"), async (req, res) => {
  try {
    const { pid } = req.params;
    const productData = req.body;

    const updateProduct = await productDao.update(pid, productData);
    if (!updateProduct) return res.status(404).json({ status: "Error", msg: `Producto con el id ${pid} no encontrado` });

    res.status(200).json({ status: "success", payload: updateProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.delete("/:pid", passportCall("jwt"), authorization("admin"), async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productDao.deleteOne(pid);
    if (!product) return res.status(404).json({ status: "Error", msg: `Producto con el id ${pid} no encontrado` });

    res.status(200).json({ status: "success", payload: "Producto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
})

export default router;
