import React from 'react';
import { Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import HotelInfo from "./hotel_info";
import HotelFacilities from "./hotel_facilities";

import styles from "./hotel_info_section.module.css";

export default function HotelInfoSection({ property }) {
  const { t } = useTranslation();
  const { description, facilities, title } = property;


  return (
    <Row className={styles.hotelInfoContainer}>
      <HotelInfo description={description} />
      <HotelFacilities title={title} facilities={facilities} />
    </Row>    
  )
}