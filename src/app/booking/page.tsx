"use client";
import {
  useAllocationDispatch,
  useAllocationState,
  AllocationActionKind,
  type UpdateAllocationPayload,
} from "@/context/allocation-context";
import { useEffect, useState } from "react";

import { CustomInputNumber } from "@/components";

export default function Booking({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { allocations, remainingGuest, rooms } = useAllocationState();
  const dispatch = useAllocationDispatch();

  useEffect(() => {
    const payload = {
      adult: Number(searchParams.adult),
      child: Number(searchParams.child),
    };

    dispatch({
      type: AllocationActionKind.SET_DEFAULT_ALLOCATIONS,
      payload,
    });
  }, [dispatch, searchParams]);

  const [v, setV] = useState<number>();
  return (
    <section className="w-[800px] mx-auto">
      <h1>{`住客人數： ${searchParams.adult}位大人，${searchParams.child}位小孩/${allocations.length}房`}</h1>
      <h3>{`尚未分配人數：${remainingGuest.adult}位大人，${remainingGuest.child}位小孩`}</h3>
      <div className="grid w-full">
        {allocations.map((allocation, i) => {
          const { adult, child, price } = allocation;
          const { capacity, adultPrice, childPrice } = rooms[i];
          return (
            <div className="flex flex-col gap-2" key={i}>
              <h3>{`Room ${i + 1}: ${adult + child}/${capacity}人`}</h3>
              <h4>{price}</h4>
              <div className="flex justify-between items-center">
                <p>{`大人 ${adultPrice}/人`}</p>
                <CustomInputNumber
                  value={adult}
                  name={`room-${i}-adult`}
                  onChange={(e) => {
                    const isIncrease = Number(e.target.value) - adult > 0;
                    if (
                      (!isIncrease && adult === 0) ||
                      (isIncrease &&
                        (capacity === adult + child ||
                          remainingGuest.adult === 0))
                    )
                      return;
                    const payload: UpdateAllocationPayload = {
                      member: "adult",
                      action: isIncrease ? "inc" : "dec",
                      roomIdx: i,
                    };

                    dispatch({
                      type: AllocationActionKind.UPDATE_ALLOCATION,
                      payload,
                    });
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <p>{`小孩 ${childPrice}/人`}</p>
                <CustomInputNumber
                  value={child}
                  name={`room-${i}-child`}
                  onChange={(e) => {
                    const isIncrease = Number(e.target.value) - child > 0;
                    if (
                      (!isIncrease && child === 0) ||
                      (isIncrease &&
                        (capacity === adult + child ||
                          remainingGuest.child === 0))
                    )
                      return;
                    const payload: UpdateAllocationPayload = {
                      member: "child",
                      action: isIncrease ? "inc" : "dec",
                      roomIdx: i,
                    };

                    dispatch({
                      type: AllocationActionKind.UPDATE_ALLOCATION,
                      payload,
                    });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
