type Guest = {
  adult: number;
  child: number;
};

type Room = {
  roomPrice: number;
  adultPrice: number;
  childPrice: number;
  capacity: number;
};

interface Allocation extends Guest {
  price: number;
}

const getPrice = (guest: Guest, room: Room): number =>
  room.roomPrice +
  guest.adult * room.adultPrice +
  guest.child * room.childPrice;

// only count for adults
const getCapacityRatio = ({
  roomPrice,
  adultPrice,
  capacity,
}: Room): number => {
  return (roomPrice + adultPrice * capacity) / capacity;
};

const getAllocation = (guest: Guest, room: Room): Allocation => {
  const childTakenCapacity = Math.min(guest.child, room.capacity - 1);
  const adultTakenCapacity = Math.min(
    guest.adult,
    room.capacity - childTakenCapacity
  );
  guest.child -= childTakenCapacity;
  guest.adult -= adultTakenCapacity;

  return {
    adult: adultTakenCapacity,
    child: childTakenCapacity,
    price: getPrice(
      { adult: adultTakenCapacity, child: childTakenCapacity },
      room
    ),
  };
};

type RoomKey = "4,2" | "7,3" | "16,0";

const roomData = new Map<RoomKey, Room[]>([
  [
    "4,2",
    [
      { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
      { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
    ],
  ],
  [
    "7,3",
    [
      { roomPrice: 2000, adultPrice: 200, childPrice: 100, capacity: 4 },
      { roomPrice: 2000, adultPrice: 200, childPrice: 100, capacity: 4 },
      { roomPrice: 2000, adultPrice: 400, childPrice: 200, capacity: 2 },
      { roomPrice: 2000, adultPrice: 400, childPrice: 200, capacity: 2 },
    ],
  ],
  [
    "16,0",
    [
      { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
      { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
      { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
      { roomPrice: 500, adultPrice: 1000, childPrice: 600, capacity: 2 },
    ],
  ],
]);

const getRooms = (key: RoomKey): Room[] =>
  roomData
    .get(key)
    ?.toSorted((a, b) => getCapacityRatio(a) - getCapacityRatio(b)) || [];

const getDefaultRoomAllocation = (
  guest: Guest,
  rooms: Room[]
): Allocation[] => {
  const allocations: Allocation[] = [];
  const clonedGuest = structuredClone(guest);
  for (const room of rooms) {
    if (clonedGuest.adult === 0) break;

    allocations.push(getAllocation(clonedGuest, room));
  }
  return allocations;
};

export type { Guest, Room, Allocation, RoomKey };

export { getPrice, getRooms, getDefaultRoomAllocation };
