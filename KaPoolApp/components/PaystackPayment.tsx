import React from 'react';
import { View, Text, Alert } from 'react-native';
import  { Paystack }  from 'react-native-paystack-webview';
import axios from 'axios';
import { API_URL, PAYSTACK_PUBLIC_KEY } from '@/lib/utils'; // Adjust the path as necessary


const PaystackPayment = ({ amount, email, reference, onSuccess, ride }) => {
  // Handle Paystack response after successful payment
  const handlePaystackSuccess = async (responseData) => {
    try {
      // Call the backend to verify the payment using the reference
      const verifyResponse = await axios.post(`${API_URL}/payments`, {
        reference: reference,  // Get reference from Paystack response
        ride_id: ride._id
      });

      if (verifyResponse.data.payment && verifyResponse.data.payment.status === 'paid') {
        Alert.alert('Payment Successful', 'Your payment was successful');
        // Invoke the success callback
        onSuccess(verifyResponse.data.payment);
      } else {
        Alert.alert('Payment Failed', 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error?.response?.data?.message);
      Alert.alert('Error', 'There was an issue verifying the payment.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Paystack
        showPayButton={false}
        paystackKey={PAYSTACK_PUBLIC_KEY} // Replace with your Paystack public key
        amount={amount}
        billingEmail={email}
        activityIndicatorColor="green"
        onCancel={() => {
          Alert.alert('Payment Cancelled', 'You cancelled the payment');
        }}
        onSuccess={(res) => {
          handlePaystackSuccess(res);
        }}
        autoStart={true}
        refNumber={reference}
      />
    </View>
  );
};

export default PaystackPayment;
