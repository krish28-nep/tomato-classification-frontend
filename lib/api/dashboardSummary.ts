import axios from "../axios"
import { DashboardSummary } from "@/types/dashboardSummary"

export const fetchDashboardSummary = async <T extends DashboardSummary = DashboardSummary>(): Promise<T> => {
    const { data } = await axios.get("/user/dashboard");
    return data.data
}
