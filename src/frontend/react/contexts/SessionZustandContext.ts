import React from "react";
import { StoreApi, UseBoundStore } from "zustand";
import {
	SessionZustandService,
	SessionZustandState,
} from "../../../core/services/storage/zustand/SessionZustandService";
import { container } from "tsyringe";

const sessionZustandService = container.resolve(SessionZustandService);
export const SessionZustandContext = React.createContext<
	UseBoundStore<StoreApi<SessionZustandState>>
>(sessionZustandService.zustand as any);
