import React, { useCallback, useContext, useRef, useState } from 'react';
import { DateRangePicker } from 'react-dates';
import { useMedia } from 'react-media';
import moment from 'moment';

import Label from 'components/label';

import { BookingDataContext } from 'containers/data_context';

import { DATE_FORMAT, DATE_UI_FORMAT } from 'constants/formats';
import MEDIA_QUERIES from 'constants/media_queries';

import DayCell from './day_cell';
import InfoSection from './info_section';

import 'react-dates/lib/css/_datepicker.css';
import styles from './rangepicker.module.css';

import 'react-dates/initialize';

const OPEN_DIRECTIONS = {
  up: 'up',
  down: 'down',
};

const MIN_STAY_LENGTH = 1;

const getMinStayLength = (closedDates, checkinDate) => {
  if (!checkinDate || !moment(checkinDate).isValid() || !closedDates.data) {
    return MIN_STAY_LENGTH;
  }
  const { minStayArrival, minStayThrough } = closedDates.data;
  const formattedCheckinDate = checkinDate.format(DATE_FORMAT);
  const { [formattedCheckinDate]: minStayArrivalValue = MIN_STAY_LENGTH } = minStayArrival;
  const { [formattedCheckinDate]: minStayThroughValue = MIN_STAY_LENGTH } = minStayThrough;
  const minStayLength = Math.max(minStayArrivalValue, minStayThroughValue);

  return minStayLength;
};

export default function RangePicker(props) {
  const { closedDates } = useContext(BookingDataContext);
  const {
    checkinDate,
    checkoutDate,
    name = '',
    checkinDatePlaceholder,
    checkinDateLabel,
    checkoutDatePlaceholder,
    checkoutDateLabel,
    onDatesChange,
  } = props;
  const [focusedInput, setFocusedInput] = useState(null);
  const [openDirection, setOpenDirection] = useState(OPEN_DIRECTIONS.up);
  const matchedQueries = useMedia({ queries: MEDIA_QUERIES });
  const minStayLength = getMinStayLength(closedDates, checkinDate);
  const inputRef = useRef(null);

  const isMobile = matchedQueries.xs;
  const numberOfMonths = matchedQueries.xs || matchedQueries.sm ? 1 : 2;

  const getIsClosedToArrival = useCallback((day, formattedDay) => {
    const { closedToArrival, closed } = closedDates.data;

    const minStayLenghForDate = getMinStayLength(closedDates, day);

    const isClosedInRange = closed.find((closedDate) => {
      const formattedClosedDate = moment(closedDate, DATE_FORMAT);

      const isAfterCheckIn = formattedClosedDate.isAfter(day);
      // Closed date could be used for checkout so we reduce offset by 1
      const isBeforeMinLengh = formattedClosedDate.isSameOrBefore(day.clone().add(minStayLenghForDate - 1, 'days'));

      return isAfterCheckIn && isBeforeMinLengh;
    });

    const isClosed = closed.includes(formattedDay);
    const isClosedToArrival = closedToArrival.includes(formattedDay);

    return isClosed || isClosedToArrival || isClosedInRange;
  }, [closedDates]);

  const getIsClosedToDeparture = useCallback((day, formattedDay) => {
    const { closedToDeparture, closed } = closedDates.data;

    const closestClosed = checkinDate && closed.find((closedDate) => {
      const formattedClosedDate = moment(closedDate, DATE_FORMAT);

      return checkinDate.isBefore(formattedClosedDate);
    });

    const isDateBeforeArrival = day.isSameOrBefore(checkinDate);
    const isClosedToDeparture = closedToDeparture.includes(formattedDay);
    // Closed date could be selected as departure date, but shouldnt be in range
    const isAfterClosed = closestClosed && day.isAfter(moment(closestClosed, DATE_FORMAT), 'day');

    return isDateBeforeArrival || isClosedToDeparture || isAfterClosed;
  }, [closedDates, checkinDate]);

  const getIsDayBlocked = useCallback((day) => {
    if (!closedDates.data) {
      return false;
    }

    const formattedDay = day.format(DATE_FORMAT);

    if (focusedInput === 'startDate') {
      return getIsClosedToArrival(day, formattedDay);
    }

    if (focusedInput === 'endDate') {
      return getIsClosedToDeparture(day, formattedDay);
    }

    return false;
  }, [closedDates, focusedInput, getIsClosedToArrival, getIsClosedToDeparture]);

  const handleFocusChange = useCallback((newFocusedInput) => {
    const inputCoords = inputRef.current.getBoundingClientRect();
    const isPickerCloserToTop = inputCoords.y < (window.innerHeight / 2);

    const newOpenDirection = isPickerCloserToTop ? OPEN_DIRECTIONS.down : OPEN_DIRECTIONS.up;

    if (newFocusedInput === 'startDate') {
      onDatesChange({ startDate: checkinDate, endDate: null });
    }

    setOpenDirection(newOpenDirection);
    setFocusedInput(newFocusedInput);
  }, [inputRef, checkinDate, setOpenDirection, setFocusedInput, onDatesChange]);

  const handleDatesReset = useCallback(() => {
    onDatesChange({ startDate: null, endDate: null });
  }, [onDatesChange]);

  const renderCalendarDay = useCallback((dayProps) => (
      <DayCell
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...dayProps}
        minStayLength={minStayLength}
      />
  ), [minStayLength]);

  const renderCalendarInfo = useCallback(() => (
    <InfoSection onClear={handleDatesReset} />
  ), [handleDatesReset]);

  return (
    <div className={styles.rangepicker} ref={inputRef}>
      <div className={styles.labelContainer}>
        <Label>{checkinDateLabel}</Label>
        <Label>{checkoutDateLabel}</Label>
      </div>
      <DateRangePicker
        displayFormat={DATE_UI_FORMAT}
        startDate={checkinDate}
        endDate={checkoutDate}
        anchorDirection="right"
        startDatePlaceholderText={checkinDatePlaceholder}
        endDatePlaceholderText={checkoutDatePlaceholder}
        startDateId={`${name}_start_date`}
        endDateId={`${name}_end_date`}
        openDirection={openDirection}
        numberOfMonths={numberOfMonths}
        withFullScreenPortal={isMobile}
        onDatesChange={onDatesChange}
        focusedInput={focusedInput}
        minimumNights={minStayLength}
        renderCalendarDay={renderCalendarDay}
        isDayBlocked={getIsDayBlocked}
        onFocusChange={handleFocusChange}
        renderCalendarInfo={renderCalendarInfo}
      />
    </div>
  );
}
