"use strict";

class Utils {
  static assignRandomColor() {
    return random(Config.colors);
  }

  static getClosestVehicleAhead(currentVehicle, vehicles) {
    const vehiclesAhead = vehicles.filter(
      (vehicle) =>
        vehicle.distance > currentVehicle.distance &&
        vehicle.lane === currentVehicle.lane
    );
    if (vehiclesAhead.length > 0) {
      return vehiclesAhead.reduce((closest, vehicle) =>
        vehicle.distance < closest.distance ? vehicle : closest
      );
    }
    return null;
  }

  static getVehiclesInLane(vehicle, vehicles, lane, road) {
    if (lane < 0 || lane >= road.nLanes) {
      return [];
    }
    return vehicles.filter((otherVehicle) =>
      otherVehicle.lane === lane && otherVehicle !== vehicle
    );
  }

  static checkOverlap(newVehicle, vehicles) {
    const safeDistance = Config.simulation.safeDistance;
    for (const vehicle of vehicles) {
      if (
        vehicle.lane === newVehicle.lane &&
        abs(vehicle.distance - newVehicle.distance) <
          (vehicle.length + newVehicle.length) / 2 + safeDistance
      ) {
        return true;
      }
    }
    return false;
  }
}
