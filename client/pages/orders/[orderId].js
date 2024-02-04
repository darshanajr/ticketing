import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      <p>
        Time left for payment: {Math.round(timeLeft / 60)} minutes and{" "}
        {timeLeft % 60} seconds
      </p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Od6uOKjHyhNNonR2EePwbwNbzx7cehv5wq1IPFG8UddDrd4a1E2gfRUa9fPij4kfAJ0OtbknovG2jKar3i5QfwA00w4OtGym4"
        amount={order.ticket.price * 100}
        currency="USD"
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};
