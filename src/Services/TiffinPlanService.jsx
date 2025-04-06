import { myAxios } from "./Helper";

// get all tiffin plans of a tiffin provider
export const getTiffinPlans = (userId) => {
    return myAxios.get('/api/v1/tiffinplan/tiffin-provider/'+userId)
    .then((response) => response.data);
}

// get single tiffin plan
export const getTiffinPlan = (planId) => {
    return myAxios.get('/api/v1/tiffinplan/'+planId)
    .then((response) => response.data);
}

// add tiffin plan
export const addTiffinPlan = (userId, tiffinData) => {
    return myAxios.post('/api/v1/tiffinplan/tiffin-provider/'+userId, tiffinData)
    .then((response) => response.data);
}

// update tiffin plan
export const updateTiffinPlan = (planId, tiffinData) => {
    return myAxios.put('/api/v1/tiffinplan/'+planId, tiffinData)
    .then((response) => response.data);
}

// update menuitem in tiffin plan
export const updateMneuItemInTiffinPlan = (planId, day, menuIds) => {
    return myAxios.put(`/api/v1/tiffinplan/${planId}/day/${day}`, menuIds)
    .then((response) => response.data);
}

// delete tiffin plan
export const deleteTiffinPlan = (planId) => {
    return myAxios.delete('/api/v1/tiffinplan/'+planId)
    .then((response) => response.data);
}