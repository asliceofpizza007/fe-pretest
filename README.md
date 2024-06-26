## Important Statement
1. 在實作 `getDefaultRoomAllocation` Fn 時，我有預設兩個立場：
   1. 給出的 **Rooms** 必定滿足人數分配需求，不會發生一個大人多數小孩卻需要兩個以上房間的情況。
   2. **adultPrice** 永遠大於 **childPrice**。
2. 透過第一點的兩個預設，確認得出的初始分配為總金額最低的方案。
3. `CustomInputNumber` 元件及 `getDefaultRoomAllocation` Fn 都有撰寫必要的單元測試。
4. `CustomInputNumber` 滿足 Spec 上所有需求，但此專案在應用上，我透過 props 調整成我認為 UX 體驗最好的方式使用，如: readOnly。
5. 根據文件需求，有不明確的部分，因為時間的關係沒進行詢問。

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
