import { format } from "date-fns";

export const formatToEuropeanDate = (date: Date | string | number) =>
  format(new Date(date), "dd-MM-yyyy");
