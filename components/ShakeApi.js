import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { Accelerometer } from "expo-sensors";

const QuoteText = styled.Text`
  font-weight: bold;
  color: white;
  font-size: 40px;
  padding-bottom: 10px;
`;

const AuthorText = styled.Text`
  color: white;
  font-size: 18px;
`;

const ApiButton = styled.TouchableHighlight`
  width: 50%;
  background-color: coral;
`;

const ShakeApi = () => {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [quote, setQuote] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    generateQuote();
  }, []);

  useEffect(() => {
    Accelerometer.setUpdateInterval(1000);
    subscribe();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isShaking(data)) {
      generateQuote();
    }
  }, [data]);

  const subscribe = () => {
    setSubscription(
      Accelerometer.addListener((AccelerometerData) => {
        setData(AccelerometerData);
      })
    );
  };

  const unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const generateQuote = () => {
    setLoading(true);
    fetch("https://zenquotes.io/api/random")
      .then((res) => res.json())
      .then((data) => setQuote(data))
      .finally(() => setLoading(false));
  };

  const isShaking = (data) => {
    const totalForce = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);

    return totalForce > 1.78;
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  const { x, y, z } = data;

  return (
    <View>
      {quote.map((data) => {
        return (
          <View key={data.h}>
            <QuoteText>"{data.q}"</QuoteText>
            <AuthorText>{data.a}</AuthorText>
          </View>
        );
      })}
    </View>
  );
};

export default ShakeApi;
