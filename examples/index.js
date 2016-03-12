'use strict';

const megabus = require('../lib');

megabus.LOCATION_CODES = {
  'Barcelona': 170,
  'Paris': 113,
  'Toulouse': 173,
};

if (module === require.main) {
  let finder = new megabus.TicketFinder({
    startDate: '1/4/2016',
    endDate: '4/4/2016',
    routes: [
      // Barcelona <-> Paris
      new megabus.Route('Barcelona', 'Paris'),
      new megabus.Route('Paris', 'Barcelona'),

      // Toulouse <-> Paris
      new megabus.Route('Toulouse', 'Paris'),
      new megabus.Route('Paris', 'Toulouse'),
    ]
  });

  finder
    // .getTicketsPromise()
    .getTicketsInPriceRangePromise(0, 20)
    .then((tickets) => {
      tickets.forEach((ticket, idx) => {
        console.log(`[${idx + 1}] ${ticket.toString()}`);
      })
      console.log(`*** ${tickets.length} tickets found ***`);
    });
}
