import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number;
  userLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}) => {
  if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude) return [];

  try {
    const timesPromises = markers.map(async (marker) => {
      // console.log(`Calculating route from driver at (${marker.latitude}, ${marker.longitude}) to user at (${userLatitude}, ${userLongitude})`);
      
      const responseToUser = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`
      );
      
      const dataToUser = await responseToUser.json();
      
      // Check for no routes and log details
      if (!dataToUser.routes || dataToUser.routes.length === 0) {
        console.error("No routes found from driver to user", {
          driver: { latitude: marker.latitude, longitude: marker.longitude },
          user: { latitude: userLatitude, longitude: userLongitude },
          error: dataToUser,
        });
        return null; // Skip this marker if no route is found
      }

      const timeToUser = dataToUser.routes[0].legs[0].duration.value; // Time in seconds
      const distanceToUser = dataToUser.routes[0].legs[0].distance.value / 1000; // Distance in kilometers


      // console.log(`Calculating route from user at (${userLatitude}, ${userLongitude}) to destination at (${destinationLatitude}, ${destinationLongitude})`);
      
      const responseToDestination = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
      );
      
      const dataToDestination = await responseToDestination.json();

      // Check for no routes to the destination
      if (!dataToDestination.routes || dataToDestination.routes.length === 0) {
        console.error("No routes found from user to destination", {
          user: { latitude: userLatitude, longitude: userLongitude },
          destination: { latitude: destinationLatitude, longitude: destinationLongitude },
          error: dataToDestination,
        });
        return null; // Skip this marker if no route is found
      }

      const timeToDestination = dataToDestination.routes[0].legs[0].duration.value; // Time in seconds
      const totalTime = (timeToUser + timeToDestination) / 60; // Total time in minutes

      const distanceToDestination = dataToDestination.routes[0].legs[0].distance.value / 1000; // Distance in kilometers


      const totalDistance = distanceToUser + distanceToDestination; // Total distance in kilometers

      const timeDriverToUser = timeToUser / 60;

      const time = timeToDestination / 60;

      const priceFromDriver = (Number(marker.cost_per_kilometer) * totalDistance);


      return { ...marker, time: timeToUser / 60, ride_time: timeToDestination / 60, price: priceFromDriver }; // Attach total time to marker data
    });

    const results = await Promise.all(timesPromises);
    return results.filter((result) => result !== null); // Filter out markers with no routes
  } catch (error) {
    console.error("Error calculating driver times:", error);
    return [];
  }
};
