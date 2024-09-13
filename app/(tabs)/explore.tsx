import MapView, { Marker } from "react-native-maps";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import tw from "twrnc";

export default function TabTwoScreen() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<any>();
  const [pickupLocation, setPickupLocation] = useState<any>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // const options = { accuracy: Location.Accuracy.High, distanceInterval: 1.2 };
      // await Location.watchPositionAsync(options, (location: any) => {
      //   setLocation(location);
      // });
    })();
  }, []);

  const findPickupLocation = (text: any) => {
    const { latitude, longitude } = location.coords

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3dDP+4pG7O7Qz/o77os/ht1kRQ9T/UrHbfeYt9gFT5mw=",
      },
    };

    fetch(
      `https://api.foursquare.com/v3/places/search?query=${text}&ll=${latitude},${longitude}&radius=100000`,
      options
    )
      .then((response) => response.json())
      .then((response) => setSearchResult(response.results))
      .catch((err) => console.error(err));
  };

  return (
    <View style={tw`flex-1`}>
      <View style={tw`mt-5 p-2`}>
        <TextInput
          placeholder="Search Pickup places"
          style={tw`border`}
          onChangeText={findPickupLocation}
        />
      </View>
      {searchResult && !pickupLocation && (
        <View style={tw`w-full`}>
          {searchResult.map((item: any) => {
            console.log(item.location);
            
            return (
              <TouchableOpacity onPress={() => setPickupLocation(item)}>
                <Text>
                  {item.name} | {item.location.formatted_address}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
