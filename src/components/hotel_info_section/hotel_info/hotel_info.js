import React from 'react';
import { useTranslation } from "react-i18next";
import { Row } from "react-bootstrap";

import styles from "./hotel_info.module.css";

export default function HotelInfo({ description }) {
  const { t } = useTranslation();

  if (!description) {
    return null;
  }

  return (
    <div>
      <div className={styles.hotelInfoTitle}>{t("hotel_page:hotel_info")}:</div>
      <pre className={styles.hotelDescription}>{description}</pre>
    </div>  
  );
}