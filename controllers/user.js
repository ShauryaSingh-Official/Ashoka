const UsersModel = require("../models/user");
const User = UsersModel.user;

// _____________________________________________________________________________________________________________
exports.getUser = async (req, res) => {
  // user name and password
  const token = req.params.token.split(":")[1];
  try {
    const user = await User.findOne({ token: token });
    res.status(200, "SUCCESS, User record found successful !!!").json(user);
  } catch (err) {
    res.status(401, "BAD REQUEST, User record found failed !!!").json(err);
  }
};

// _____________________________________________________________________________________________________________
exports.patchCartAndCartDetails = async (req, res) => {
  const id = req.params.id.split(":")[1];
  try {
    const updatedUser = await User.findOneAndUpdate({ _id: id }, req.body);
    res.status(200, "Cart and CartDetails Updated.").json(updatedUser);
  } catch (err) {
    res
      .status(404, "Cart and CartDetails Updation failed with status code 404.")
      .json(err);
  }
};

// _____________________________________________________________________________________________________________
exports.putCheckoutDetails = async (req, res) => {
  const id = req.params.id.split(":")[1];
  let DBUser;
  try {
    DBUser = await User.findOne({ _id: id });
  } catch (err) {
    res.status(401, "BAD REQUEST, USER'S CART NOT FOUND").json(err);
  }
    // console.log(DBUser);

  let newUser = {
    ...DBUser._doc,
    address: {
      addressLine: req.body.addressLine,
      city: req.body.city,
      state: req.body.state,
      pinCode: req.body.pinCode,
      country: req.body.country,
    },
    phone: req.body.phone,
    orders: [
      ...DBUser._doc.orders,
      {
        orderProducts: [...DBUser._doc.cart],
        orderDate: Date.now(),
        orderAddress: {
          addressLine: req.body.addressLine,
          city: req.body.city,
          state: req.body.state,
          pinCode: req.body.pinCode,
          country: req.body.country,
        },
        orderPhone: req.body.phone,
        orderTotal: DBUser._doc.cartDetails.grandTotal,
      },
    ],
    cart: [],
    cartDetails: {
      totalQuantity: 0,
      totalAmount: 0,
      grandTotal: 0,
      shippingCharges: 0,
      totalWeight: 0,
    },
  };

  try {
    const oldRecord = await User.findOneAndReplace({ _id: id }, newUser);
    console.log(oldRecord);
    res
      .status(201, "Update Address and Phone totalAmounts etc i.e update order")
      .json(oldRecord);
  } catch (err) {
    console.log("ERROR " , err);
    res.status(404, "SOME ERROR OCCURED!!! ").json(err);
  }
};

// _____________________________________________________________________________________________________________
exports.addProductToCart = async (req, res) => {
  // Add to cart clicked
  const id = req.params.id.split(":")[1];
  try {
    const user = await User.findOne({ _id: id });
    cart = [...user._doc.cart, req.body];
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { cart: cart }
    );
    res.status(201, "Add to Cart Successful.").json(updatedUser);
  } catch (err) {
    res.status(201, "FAILED, PRODUCT IS NOT ADDED TO CART!!!").json(err);
  }
};

// _____________________________________________________________________________________________________________
exports.deleteCartProduct = async (req, res) => {
  console.log(req.query);
  const pid = req.query.productId;
  let id = req.url.split(":")[1].split("?")[0];
  console.log(pid , "111" );
  console.log(id, "112")

  try {
    const user = await User.findOne({ _id: id });
    let new_cart = [...user._doc.cart].filter((product, index) => {
      return product._id != pid;
    });
    const deletedCartProduct = await User.findOneAndUpdate(
      { _id: id },
      { cart: new_cart }
    );
    res
      .status(202, "SUCCESSFUL, Cart product deleted !!!")
      .json(deletedCartProduct);
  } catch (err) {
    res.status(404, "FAILED, Cart product delete failed !!!").json(err);
  }
};
// /cart/delete:id?productId=id         (URL FORMAT)

// _____________________________________________________________________________________________________________
exports.clearCart = async (req, res) => {
  const id = req.params.id.split(":")[1];
  let toResetData = {
    cart: [],
    cartDetails: {
      totalQuantity: 0,
      totalAmount: 0,
      grandTotal: 0,
      shippingCharges: 0,
      totalWeight: 0,
    },
  };
  try {
    const deleted = await User.findOneAndUpdate({ _id: id }, toResetData);
    res.status(202, "SUCCESSFUL, User cart cleard !!!").json(deleted);
  } catch (err) {
    res.status(404, "ERROR, Retry again !!!").json(err);
  }
};