import * as React from "react"
import { NavLink } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

function NavBar() {
  return (
    <div className="absolute top-8 left-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 p-2 rounded-md border border-gray-100 bg-white/90 shadow-sm"
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-5 rounded bg-gray-700" />
            <span className="block h-0.5 w-5 rounded bg-gray-700" />
            <span className="block h-0.5 w-5 rounded bg-gray-700" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="min-w-[220px] p-2 bg-white rounded-lg shadow-lg border border-gray-100"
        >
          <DropdownMenuLabel className="px-2 pb-1 text-xs text-gray-500">Menu</DropdownMenuLabel>

          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to="/login">Login</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to="/create-account">Create Account</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to="/qr-code">QR Code</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to="/map">Map</NavLink>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-between">
              Language
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-36 p-1 bg-white rounded-md border border-gray-100 shadow-md">
              <DropdownMenuItem className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">French</DropdownMenuItem>
              <DropdownMenuItem className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">German</DropdownMenuItem>
              <DropdownMenuItem className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">English</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to="/logout">Log out</NavLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default NavBar
