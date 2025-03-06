import React from "react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"

interface DropDownMenuProps {
  name?: string
  icon?: React.ReactNode
  links: linkProps[]
}

export interface linkProps {
  name: string
  icon?: React.ReactNode
  function: () => void
  warning?: boolean
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({ name, icon, links }) => {
  return (
    <Menu>
      <MenuButton className={"text-gray-600 hover:text-gray-900"}>
        {name} {icon}
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className="w-52 origin-top-left rounded-xl border bg-white p-1 text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {links.map((link) => (
          <MenuItem key={link.name}>
            <button
              className={`group flex w-full h-fit items-center gap-2 rounded-lg py-1.5 px-3 ${link.warning ? `text-red-500 hover:bg-red-200` : `hover:bg-gray-200`}`}
              onClick={link.function}
            >
              {link.icon} {link.name}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export default DropDownMenu
