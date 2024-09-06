import MapView, { Marker } from "react-native-maps";
import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import tw from "twrnc";

export default function TabTwoScreen() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const options = { accuracy: Location.Accuracy.High, distanceInterval: 0.3 };
      await Location.watchPositionAsync(options, (location: any) => {
        setLocation(location);
      });
    })();
  }, []);

  return (
    <View style={tw`flex-1`}>
      {location ? (
        <MapView
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0002,
            longitudeDelta: 0.0001,
          }}
          style={tw`w-full h-full`}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
          />
        </MapView>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg text-red-500`}>
            {errorMsg ? errorMsg : "Fetching location..."}
          </Text>
        </View>
      )}
    </View>
  );
}
