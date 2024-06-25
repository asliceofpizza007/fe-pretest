"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";

import {
  getRooms,
  getDefaultRoomAllocation,
  type Guest,
  type Room,
  type Allocation,
  type RoomKey,
} from "@/utils/allocation-utils";

type AllocationState = {
  allocations: Allocation[];
  rooms: Room[];
  remainingGuest: Guest;
};

const initState: AllocationState = {
  allocations: [],
  rooms: [],
  remainingGuest: {
    adult: 0,
    child: 0,
  },
};

const AllocationContext = createContext<AllocationState>(initState);

enum AllocationActionKind {
  SET_DEFAULT_ALLOCATIONS = "SET_DEFAULT_ALLOCATIONS",
  UPDATE_ALLOCATION = "UPDATE_ALLOCATION",
}

type UpdateAllocationPayload = {
  member: keyof Guest;
  action: "inc" | "dec";
  roomIdx: number;
};

type AllocationAction =
  | {
      type: AllocationActionKind.SET_DEFAULT_ALLOCATIONS;
      payload: Guest;
    }
  | {
      type: AllocationActionKind.UPDATE_ALLOCATION;
      payload: UpdateAllocationPayload;
    };

const AllocationDispatchContext =
  createContext<Dispatch<AllocationAction> | null>(null);

const allocationReducer = (
  allocationState: AllocationState,
  action: AllocationAction
) => {
  const { type, payload } = action;
  switch (type) {
    case AllocationActionKind.SET_DEFAULT_ALLOCATIONS:
      return {
        ...allocationState,
        allocations: getDefaultRoomAllocation(payload, allocationState.rooms),
        rooms: getRooms(`${payload.adult},${payload.child}` as RoomKey),
        remainingGuest: {
          adult: 0,
          child: 0,
        },
      };
    case AllocationActionKind.UPDATE_ALLOCATION:
      const { remainingGuest, rooms, allocations } = allocationState;
      let { adult: remainingAdult, child: remainingChild } = remainingGuest;
      const { member, action, roomIdx } = payload;

      const newVal = structuredClone(allocations[roomIdx]);
      if (action === "dec") {
        newVal[member] -= 1;
        if (member === "adult") {
          remainingAdult += 1;
          newVal.price -= rooms[roomIdx].adultPrice;
        } else {
          remainingChild += 1;
          newVal.price -= rooms[roomIdx].childPrice;
        }
      } else {
        newVal[member] += 1;
        if (member === "adult") {
          remainingAdult -= 1;
          newVal.price += rooms[roomIdx].adultPrice;
        } else {
          remainingChild -= 1;
          newVal.price += rooms[roomIdx].childPrice;
        }
      }

      const from = allocations.slice(0, roomIdx);
      const end = allocations.slice(roomIdx + 1);
      const newAllocations: Allocation[] = [...from, newVal, ...end];
      return {
        ...allocationState,
        allocations: newAllocations,
        remainingGuest: {
          adult: remainingAdult,
          child: remainingChild,
        },
      };
    default:
      throw Error("Unknown action: " + type);
  }
};

const AllocationProvider = ({ children }: { children: ReactNode }) => {
  const [allocationState, dispatch] = useReducer(allocationReducer, initState);

  return (
    <AllocationContext.Provider value={allocationState}>
      <AllocationDispatchContext.Provider value={dispatch}>
        {children}
      </AllocationDispatchContext.Provider>
    </AllocationContext.Provider>
  );
};

const useAllocationState = () => {
  const ctx = useContext(AllocationContext);
  if (!ctx)
    throw new Error(
      "useAllocationState must be use under the context provider."
    );
  return ctx;
};

const useAllocationDispatch = () => {
  const ctx = useContext(AllocationDispatchContext);
  if (!ctx)
    throw new Error(
      "useAllocationDispatch must be use under the context provider."
    );
  return ctx;
};

export type { UpdateAllocationPayload };

export {
  AllocationProvider,
  useAllocationState,
  useAllocationDispatch,
  AllocationActionKind,
};
