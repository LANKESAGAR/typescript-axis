import { Crypto } from "../CryptoTypes";
import React from "react";

export type AppProps = {
    crypto: Crypto
}

export default function CryptoSummary({crypto}: AppProps){
    return <p>{crypto.name + ' $' + crypto.current_price}</p>
}