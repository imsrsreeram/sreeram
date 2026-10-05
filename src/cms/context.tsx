import React, { createContext, useContext } from "react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
export const DataContext = createContext<any>(PORTFOLIO_DATA);
export const usePortfolioData = () => useContext(DataContext);
