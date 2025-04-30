import { myAxios } from "./Helper";

// api to users who subscribed to a tiffin providers plan
export const fetchSubscriptions = (providerId) => {
    return myAxios.get('/api/v1/subscription/tiffin-provider/' + providerId)
        .then((response) => response.data);
}

export const fetchSubscriptionOfUser = (subId) => {
    return myAxios.get('/api/v1/subscription/' + subId)
        .then((response) => response.data);
}

export const getSubscriptionCount = (providerId) => {
    return myAxios.get(`api/v1/subscription/count/${providerId}`)
        .then((response) => response.data);
}

export const getAllSubscriptionCount = () => {
    return myAxios.get(`api/v1/subscription/count`)
        .then((response) => response.data);
}