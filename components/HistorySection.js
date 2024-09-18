"use client";
import { LiquidityComponent, SingleCard } from "./index";
import { useAccount } from "wagmi";
import { useEffect, useState, useRef } from "react";
import { getSwapHistory } from "@/utils/context";
import { ADDRESS_COIN_MAP } from "@/utils/saleToken";
import { toEth } from "@/utils/utils";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
const HeroSection = () => {
  const { address } = useAccount();

  const [rows, setRows] = useState([]);

  const getData = async () => {
    let id = 0;
    const transactions = [];

    while (true) {
      try {
        const receipt = await getSwapHistory(id);

        if (receipt.message) {
          // 请求失败则终止循环
          break;
        } else {
          transactions.push({
            key: id,
            userAddress: receipt[0],
            tokenInName: ADDRESS_COIN_MAP[receipt[3]],
            amountIn: toEth(receipt[2]),
            tokenOutName: ADDRESS_COIN_MAP[receipt[5]],
            amountOut: toEth(receipt[4]),
          });
          id++;
        }
      } catch (error) {
        console.error(`Error fetching transaction for id ${id}: ${error}`);
        break;
      }
    }

    setRows(transactions);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      key: "userAddress",
      label: "User Address",
    },
    {
      key: "tokenInName",
      label: "Token In Name",
    },
    {
      key: "amountIn",
      label: "Amount In",
    },
    {
      key: "tokenOutName",
      label: "Token Out Name",
    },
    {
      key: "amountOut",
      label: "Amount Out",
    },
  ];
  return (
    <section className="bg-[#1A1A1A]  ">
      <div className="container p-6 mx-auto w-3/5">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn align="center" key={column.key}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody className="h-96 overflow-auto" items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default HeroSection;
