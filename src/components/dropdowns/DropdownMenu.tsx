import { Menu, MenuProps } from "@mantine/core";
import { ReactNode } from "react";

export type DropdownMenuItemProps = {
  id?: string;
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type?: "label" | "item" | "div";
  classNames?: {
    item?: string;
    itemLabel?: string;
    itemSection?: string;
  };
  onClick?: () => void;
};

type DropdownMenuProps = {
  children?: ReactNode;
  items: DropdownMenuItemProps[];
} & MenuProps;

export const DropdownMenu = ({
  children,
  items,
  ...args
}: DropdownMenuProps) => {
  return (
    <Menu shadow="md" min-width={100} {...args}>
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown>
        {items?.map((item, index) => {
          if (item.type === "label")
            return <Menu.Label key={index}>{item?.label}</Menu.Label>;
          if (item.type === "div") return <Menu.Divider key={index} />;
          return (
            <Menu.Item
              classNames={{
                item: item.classNames?.item,
                itemLabel: item.classNames?.itemLabel,
                itemSection: item.classNames?.itemSection,
              }}
              key={index}
              rightSection={item.rightIcon}
              leftSection={item.leftIcon}
              onClick={item.onClick}
            >
              {item?.label}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};
