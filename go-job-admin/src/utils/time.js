import dayjs from "dayjs";

export const formatTime = (time, fmt='YYYY-MM-DD HH:mm:ss') => {
    return dayjs(time).format(fmt)
}