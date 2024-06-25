import {
  type RoomKey,
  type Allocation,
  getDefaultRoomAllocation,
  getRooms,
} from "./allocation-utils";

describe("Allocation Utils", () => {
  // mock structuredClone
  global.structuredClone = (v) => JSON.parse(JSON.stringify(v));
  it("should return allocations correctly", () => {
    const guest = { adult: 7, child: 3 };
    const rooms = getRooms(`${guest.adult},${guest.child}` as RoomKey);

    const allocations = getDefaultRoomAllocation(guest, rooms);
    const totalPrice = allocations.reduce(
      (acc: number, curr: Allocation) => acc + curr.price,
      0
    );
    expect(allocations.length).toBe(3);
    expect(totalPrice).toBe(8100);
  });
});
