import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { NewOrderRequest } from "../types/api-types";
import { responseToast } from "../utils/features";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
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

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

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
    try {
      const res = await newOrder(orderData);
      if (res.success === false) {
        setIsProcessing(false);
        return toast.error( "Something Went Wrong");
      } else {
      
        dispatch(resetCart());
        responseToast(res, navigate, "/orders");
      }
    } catch (error) {
      console.log(error);
    }
    // const { paymentIntent, error } = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: { return_url: window.location.origin },
    //   redirect: "if_required",
    // });

    // if (error) {
    //   setIsProcessing(false);
    //   return toast.error(error.message || "Something Went Wrong");
    // }

    // if (paymentIntent.status === "succeeded") {
    //   const res = await newOrder(orderData);
    //   dispatch(resetCart());
    //   responseToast(res, navigate, "/orders");
    // }
    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    <Elements
      options={{
        clientSecret,
      }}
      stripe={stripePromise}
    >
      <CheckOutForm />
    </Elements>
  );
};

export default Checkout;

// import { useSelector } from "react-redux";
// import { RootState } from "../redux/store";
// import { loadStripe } from "@stripe/stripe-js";
// import { useNewOrderMutation } from "../redux/api/orderAPI";
// import { NewOrderRequest } from "../types/api-types";

// export default function checkout() {
//   const { user } = useSelector((state: RootState) => state.userReducer);

//   const [newOrder] = useNewOrderMutation();

//   const {
//     shippingInfo,
//     cartItems,
//     subtotal,
//     tax,
//     discount,
//     shippingCharges,
//     total,
//   } = useSelector((state: RootState) => state.cartReducer);

//   const orderData: NewOrderRequest = {
//     shippingInfo,
//     orderItems: cartItems,
//     subtotal,
//     tax,
//     discount,
//     shippingCharges,
//     total,
//     user: user?._id!,
//   };

//   const makePayment = async () => {
//     const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY);
//     const responce = await newOrder(orderData);
//     const session = await responce.json();
//     const result = await stripe?.redirectToCheckout({
//       sessionId: session.id,
//     });

//     if (result?.error) {
//       console.log(result.error);
//     }
//   };

//   return (
//     <div>
//       {/* <PaymentElement /> */}
//       <button type="submit" onClick={makePayment}>
//         Pay
//       </button>
//     </div>
//   );
// }
