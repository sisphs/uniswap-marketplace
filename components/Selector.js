"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { WETH, BNB, USDC, DEFAULT_VALUE } from "@/utils/saleToken";

const Selector = ({ defaultValue, ignoreValue, setToken, id }) => {
  const menu = [
    { key: WETH, name: WETH },
    { key: BNB, name: BNB },
    { key: USDC, name: USDC },
  ];

  const [selectedItem, setSelectedItem] = useState();

  const getFilteredItems = (ignoreValue) => {
    return menu.filter((item) => item["key"] != ignoreValue);
  };

  const [menuItems, setMenuItems] = useState(getFilteredItems(ignoreValue));

  useEffect(() => {
    setSelectedItem(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setMenuItems(getFilteredItems(ignoreValue));
  }, [ignoreValue]);

  return (
    <Dropdown className="bg-[#ecf1f6] rounded-md">
      <DropdownTrigger>
        <Button
          className="w-56 font-bold text-sm text-white rounded-md"
          style={{
            backgroundColor:
              selectedItem === DEFAULT_VALUE ? "#2c3e50" : "#2c2f36",
          }}
        >
          {selectedItem}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        className="bg-[#ecf1f6]"
        aria-label="Dynamic Actions"
        items={menuItems}
        onAction={(key) => {
          setSelectedItem(key);
          setToken(key);
        }}
      >
        {(item) => (
          <DropdownItem
            className="px-2 py-1 text-black"
            aria-label={id}
            key={item.key}
            color={item.key === "delete" ? "error" : "default"}
          >
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default Selector;
