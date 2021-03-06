import { useReducer } from 'react';
import { useLocation } from 'react-router-dom';

import { actions, INITIAL_STATE, reducer } from './reducers/booking_data';
import { clearSavedState, getSavedState, setSavedState } from './reducers/booking_data/utils/manage_saved_state';

export default () => {
  const [bookingData, dispatch] = useReducer(reducer, INITIAL_STATE);
  const location = useLocation();

  const setParams = (newParams) => {
    return actions.setParams(dispatch, newParams);
  };

  const resetParams = () => {
    return actions.resetParams(dispatch);
  };

  const setParamsAndLoadRoomsInfo = (newParams) => {
    return actions.setParamsAndLoadRoomsInfo(dispatch, bookingData.channelId, newParams);
  };

  const loadProperty = () => {
    return actions.loadProperty(dispatch, bookingData.channelId);
  };

  const loadRoomsInfo = () => {
    return actions.loadRoomsInfo(dispatch, bookingData.channelId, bookingData.params);
  };

  const loadClosedDates = () => {
    return actions.loadClosedDates(dispatch, bookingData.channelId);
  };

  const initBookingData = (bookingQueryParams, savedBookingData) => {
    return actions.initBookingData(dispatch, location, bookingQueryParams, savedBookingData);
  };

  const saveDataToStorage = () => {
    setSavedState(bookingData);
  };

  const getDataFromStorage = () => {
    return getSavedState();
  };

  const clearDataFromStorage = () => {
    clearSavedState();
  };

  const bookingActions = {
    initBookingData,
    setParams,
    resetParams,
    setParamsAndLoadRoomsInfo,

    loadProperty,
    loadRoomsInfo,
    loadClosedDates,

    saveDataToStorage,
    getDataFromStorage,
    clearDataFromStorage,
  };

  return { bookingData, bookingActions };
};
