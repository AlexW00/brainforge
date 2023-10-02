import { useContext } from "react";
import { SessionZustandContext } from "../../contexts/SessionZustandContext";
import { StoreApi, UseBoundStore } from "zustand";
import { SessionZustandState } from "../../../../core/services/storage/zustand/SessionZustandService";

export const useZustand = (): UseBoundStore<StoreApi<SessionZustandState>> => {
	return useContext(SessionZustandContext);
};
