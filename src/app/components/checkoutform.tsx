import { useContext, useEffect, useState } from "react"
import {
    PaymentElement,
    useStripe,
    useElements,
  } from "@stripe/react-stripe-js";
  import { SteamidContext } from "../utils/UserContext";

  interface PayButtonProps {
    // Define the type for the onClick function// Define the type for the disabled state
    amount: any; // If you need to display the amount
    currency: any;
    value: any;
}

const paymentElementOptions:any = {
    layout: "tabs"
  }

const PayButton: React.FC<PayButtonProps> = ({amount, currency, value }) => {
    const [error, setError] = useState("")
    const [status, setStatus] = useState("")

    //steamid context:
    const loggedInSteamId = useContext(SteamidContext)
    
    const stripe = useStripe();
    const elements = useElements();
    value = elements

    useEffect(() => {
      console.log("steam id context in checkoutform:", loggedInSteamId)
    },[])

    useEffect(() => {
      if (!stripe) {
        return;
      }
  
      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );
  
      if (!clientSecret) {
        return;
      }
  
      stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
        if (!paymentIntent) {
          return;
        }
  
        setStatus(paymentIntent.status);
      });
    }, [stripe])

    async function completePayment(e:any) {
        e.preventDefault()
        console.log("here")
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
          }

          console.log("this is hitting")

          const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              // Make sure to change this to your payment completion page
              //return_url: "http://localhost:3000/payment/mastercard-cash-payment",
            }, 
            redirect: "if_required"
          });

          if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
              console.log(error.message)
              return
            } else {
              console.log("Unexpected error.")
              return
            }
          }

          try {

              const sendToBackend = {
                amount: Number(amount),
                steamId: loggedInSteamId.toString()
              }

              const response = await fetch("http://localhost:8080/api/add-balance-from-stripe-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(sendToBackend)
              })
              const body = await response.json()
              setError(`Success, ${body}$ credited`)
              setTimeout(() => {
                location.href = "/"
                location.reload()
              }, 1000)
          } catch {
            console.log("error")
          }

    }

    return (
        <form id="payment-form" className="flex flex-col mt-4 w-full gap-2">
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={!stripe} className="shadow-red-700 redaccent rounded-sm w-full p-1 mt-4 shadow shadow-red-700 text-white py-1" type="submit" onClick={completePayment} value={value}>Pay {amount}$</button>
            <button className="mx-auto text-red-400 text-xs my-2 hover:text-red-500">Cancel</button>
            <div className={`${error ? "mt-20 mx-auto animate-show-error w-fit px-1 py-2 my-auto mx-auto justify-center items-center rounded-sm bg-green-500 font-semibold text-sm text-white" : "hidden"}`}>{error}</div>
        </form>
    )
}

export default PayButton;