import { Link, Navigate } from "react-router-dom";
import gif from "../assets/gif.gif";
import { NewOrderRequest } from "../types/api-types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { resetCart } from "../redux/reducer/cartReducer";
const orderSuccessfull = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const orderData: NewOrderRequest = {
    shippingInfo,
    orderItems: cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
    user: user?._id!,
  };

  return (
    <>
      {orderData.orderItems.length === 0 ? (
        <Navigate to={"/"} />
      ) : (
        <section className="orderSuccess">
          <div>
            <img src={gif} style={{ display: "absolute", zIndex: "10" }} />
          </div>
          <h1>Order Placed Successfully</h1>

          <div>
            <article className="shipping-info-card">
              {/* <button className="product-delete-btn" onClick={deleteHandler}>
               <FaTrash />
             </button> */}
              <h1>Order Info</h1>
              <section>
                <h2>Order Items</h2>

                {orderData.orderItems.map((i) => (
                  <div key={i._id} className="products">
                    <img src={i.photo} alt="" />
                    <span>
                      <p>
                        Name: <span>{i.name}</span>
                      </p>
                      <p>
                        Price: <span>₹{i.price}</span>
                      </p>
                      <p>
                        Quantity: <span>{i.quantity}</span>
                      </p>
                    </span>
                  </div>
                ))}
              </section>
              <h5>Address:</h5>
              <p>
                {`${orderData.shippingInfo.address}, ${
                  orderData.shippingInfo.city
                }, ${
                  orderData.shippingInfo.state
                }, ${orderData.shippingInfo.country.toUpperCase()} ${
                  orderData.shippingInfo.pinCode
                }`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: ${orderData.subtotal}</p>
              <p>Shipping Charges: ${orderData.shippingCharges}</p>
              <p>Tax: ${orderData.tax}</p>
              <p>Discount: ${orderData.discount}</p>
              <p>Total: ${orderData.total}</p>
            </article>
            <Link to={"/"} onClick={() => dispatch(resetCart())}>
              Continue Shopping
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default orderSuccessfull;

// <h5>Status Info</h5>
// <p>
//   Status: Delivered
//   <span
//       className={
//         status === "Delivered"
//           ? "purple"
//           : status === "Shipped"
//           ? "green"
//           : "red"
//       }
//     >
//       {status}
//     </span>
// </p>
//  <button className="shipping-btn" onClick={updateHandler}>
//     Process Status
//   </button>
