/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Badge,
} from "flowbite-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";
import { NumberFormatter } from "../../utils/formatters";

const theme = {
  root: {
    base: "w-full text-left text-sm text-gray-500 dark:text-gray-400 backdrop-blur-md",
    shadow:
      "absolute left-0 top-0 -z-10 h-full w-full rounded-sm bg-white/40 dark:bg-white/[0.03] border border-gray-100/50 dark:border-white/[0.05] shadow-xl",
    wrapper: "relative",
  },
  body: {
    base: "group/body",
    cell: {
      base: "px-6 py-4 group-first/body:group-first/row:first:rounded-tl-sm group-first/body:group-first/row:last:rounded-tr-sm group-last/body:group-last/row:first:rounded-bl-sm group-last/body:group-last/row:last:rounded-br-sm",
    },
  },
  head: {
    base: "group/head text-[10px] capitalize text-gray-700 dark:text-gray-400 tracking-[0.2em]",
    cell: {
      base: "bg-gray-50/50 px-6 py-3 group-first/head:first:rounded-tl-sm group-first/head:last:rounded-tr-sm dark:bg-black/20",
    },
  },
  row: {
    base: "group/row transition-colors duration-200",
    hovered: "hover:bg-white/60 dark:hover:bg-white/10",
    striped:
      "odd:bg-transparent even:bg-white/20 odd:dark:bg-transparent even:dark:bg-white/[0.02]",
  },
};

export function RecentSales() {
  const sales = useLiveQuery(async () => {
    return await db.sales.orderBy("date").reverse().limit(20).toArray();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PAID":
        return "success";
      case "UNPAID":
        return "failure";
      case "PARTIAL":
      case "INSTALLMENT":
        return "warning";
      case "QUOTE":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <p className="text-[10px] text-gray-500 capitalize tracking-widest">
          Latest 20 activities
        </p>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <Table theme={theme} hoverable>
          <TableHead>
            <TableHeadCell>Receipt</TableHeadCell>
            <TableHeadCell>Customer</TableHeadCell>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Total Amount</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-100/10">
            {sales?.map((sale) => (
              <TableRow key={sale.id} className="bg-transparent">
                <TableCell className="whitespace-nowrap text-gray-900 dark:text-white">
                  {sale.receipt_number || sale.id.substring(0, 8)}
                </TableCell>
                <TableCell className="font-medium">
                  {sale.customer_name || "Valued Customer"}
                </TableCell>
                <TableCell className="text-xs">
                  {new Date(sale.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className=" text-gray-900 dark:text-white">
                  {NumberFormatter.formatCurrency(sale.total_amount)}
                </TableCell>
                <TableCell>
                  <Badge
                    color={getStatusColor(sale.status)}
                    className="rounded-sm uppercase text-[9px] px-2  tracking-wider">
                    {sale.status.toLowerCase() === "completed"
                      ? "Paid"
                      : sale.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {(!sales || sales.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-400 italic">
                  No recent sales found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
