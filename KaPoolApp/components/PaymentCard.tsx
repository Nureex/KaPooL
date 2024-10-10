import { View, Text, Image } from "react-native";
import React from "react";

const PaymentCard = ({ payment }) => {
  return (
    <View className="bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3 p-4">
      <Text className="text-lg font-semibold">Payment Details</Text>
      <View className="mt-2">
        <Text className="text-md font-JakartaMedium">
          Amount: <Text className="font-JakartaBold">₦{payment.amount}</Text>
        </Text>
        <Text className="text-md font-JakartaMedium">
          Method: <Text className="font-JakartaBold">{payment.payment_method}</Text>
        </Text>
        <Text className="text-md font-JakartaMedium">
          Status:{" "}
          <Text className={`font-JakartaBold ${payment.status === "paid" ? "text-green-500" : "text-red-500"}`}>
            {payment.status}
          </Text>
        </Text>
        <Text className="text-md font-JakartaMedium">
          Transaction ID: <Text className="font-JakartaBold">{payment.transaction_id}</Text>
        </Text>
      </View>
    </View>
  );
};

export default PaymentCard;
