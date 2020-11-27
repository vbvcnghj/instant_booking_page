import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ConfirmationPage from 'pages/confirmation_page';
import HotelPage from 'pages/hotel_page';
import PaymentPage from 'pages/payment_page';

import routes from './routes';

export default function Routing() {
  return (
    <Switch>
      <Route path={routes.hotelPage} exact>
        <HotelPage />
      </Route>
      <Route path={routes.paymentPage} exact>
        <PaymentPage />
      </Route>
      <Route path={routes.confirmationPage} exact>
        <ConfirmationPage />
      </Route>
      <Route path="*">
        404
      </Route>
    </Switch>
  );
}
