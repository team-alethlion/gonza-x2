import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

const theme = {
  root: {
    base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
    shadow:
      "absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-white drop-shadow-md dark:bg-black",
    wrapper: "relative",
  },
  body: {
    base: "group/body",
    cell: {
      base: "px-6 py-4 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg",
    },
  },
  head: {
    base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
    cell: {
      base: "bg-gray-50 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700",
    },
  },
  row: {
    base: "group/row",
    hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
    striped:
      "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
  },
};

export function RecentSales() {
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Product name</TableHeadCell>
            <TableHeadCell>Color</TableHeadCell>
            <TableHeadCell>Category</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Apple MacBook Pro 17"
            </TableCell>
            <TableCell>Sliver</TableCell>
            <TableCell>Laptop</TableCell>
            <TableCell>$2999</TableCell>
            <TableCell>
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Edit
              </a>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Microsoft Surface Pro
            </TableCell>
            <TableCell>White</TableCell>
            <TableCell>Laptop PC</TableCell>
            <TableCell>$1999</TableCell>
            <TableCell>
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Edit
              </a>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Magic Mouse 2
            </TableCell>
            <TableCell>Black</TableCell>
            <TableCell>Accessories</TableCell>
            <TableCell>$99</TableCell>
            <TableCell>
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Edit
              </a>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
