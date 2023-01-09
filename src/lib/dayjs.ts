import dayjs from 'dayjs';
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export type Dayjs = dayjs.Dayjs;

export type { ConfigType } from "dayjs";

export default dayjs;