"use client";
import { createContext, useContext } from "react";
import type { SectionId } from "@/data/sections";

export const NavContext = createContext<(id: SectionId) => void>(() => {});
export const useNavigate = () => useContext(NavContext);
