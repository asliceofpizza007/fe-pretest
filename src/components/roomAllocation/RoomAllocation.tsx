"use client";
import Link from "next/link";
import { useState, useMemo, useCallback, useEffect } from "react";

import { CustomInputNumber } from "@/components";
import {
  type Guest,
  type Room,
  type Allocation,
  getDefaultRoomAllocation,
  getPrice,
} from "@/utils/allocation-utils";

type RoomAllocationProps = {
  guest: Guest;
  rooms: Room[];
  onChange?: (result: Allocation[]) => void;
};

const RoomAllocation = ({ guest, rooms, onChange }: RoomAllocationProps) => {
  const [allocations, setAllocations] = useState<Allocation[]>(
    getDefaultRoomAllocation(guest, rooms)
  );

  const remainingGuest = useMemo<Guest>(() => {
    const remaining = allocations.reduce(
      (acc: Guest, curr: Allocation) => {
        acc.adult -= curr.adult;
        acc.child -= curr.child;
        return acc;
      },
      { ...guest }
    );
    return remaining;
  }, [allocations, guest]);

  const updateAllocations = useCallback(
    (roomIdx: number, type: "adult" | "child", val: number) => {
      setAllocations((preAl) => {
        const newAl = { ...preAl[roomIdx] };
        newAl[type] = val;
        newAl.price = getPrice(
          { adult: newAl.adult, child: newAl.child },
          rooms[roomIdx]
        );
        return [...preAl.slice(0, roomIdx), newAl, ...preAl.slice(roomIdx + 1)];
      });
    },
    [rooms]
  );

  useEffect(() => {
    onChange?.(allocations);
  }, [allocations, onChange]);

  return (
    <>
      <Link href="/" className="inline-block my-2 rounded bg-au-primary p-2">
        Go back
      </Link>
      <h1 className="font-bold text-xl py-4">{`住客人數： ${guest.adult}位大人，${guest.child}位小孩/${allocations.length}房`}</h1>
      <h3 className="rounded bg-au-primary/50 p-2">{`尚未分配人數：${remainingGuest.adult}位大人，${remainingGuest.child}位小孩`}</h3>
      <div className="flex flex-col gap-4 w-full mt-2">
        {allocations.map((allocation, i) => {
          const { adult, child, price } = allocation;
          const { capacity, adultPrice, childPrice } = rooms[i];
          return (
            <div
              className="flex flex-col gap-2 py-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-gray-200"
              key={i}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{`Room ${i + 1}: ${
                  adult + child
                }/${capacity}人`}</p>
                <p>{`${price} TWD`}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="flex flex-col">
                  <span>{`大人 ${adultPrice}/人`}</span>
                  <span className="text-gray-400">年齡 20+</span>
                </p>
                <CustomInputNumber
                  value={adult}
                  name={`room-${i}-adult`}
                  min={child === 0 ? 0 : 1}
                  max={capacity}
                  readOnly
                  onChange={(e) => {
                    const isIncrease = Number(e.target.value) - adult > 0;
                    if (
                      (!isIncrease && adult === 0) ||
                      (isIncrease &&
                        (capacity === adult + child ||
                          remainingGuest.adult === 0))
                    )
                      return;
                    updateAllocations(i, "adult", Number(e.target.value));
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <p>{`小孩 ${childPrice}/人`}</p>
                <CustomInputNumber
                  value={child}
                  name={`room-${i}-child`}
                  min={0}
                  max={adult === 0 ? 0 : capacity}
                  readOnly
                  onChange={(e) => {
                    const isIncrease = Number(e.target.value) - child > 0;
                    if (
                      (!isIncrease && child === 0) ||
                      (isIncrease &&
                        (capacity === adult + child ||
                          remainingGuest.child === 0))
                    )
                      return;
                    updateAllocations(i, "child", Number(e.target.value));
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RoomAllocation;
