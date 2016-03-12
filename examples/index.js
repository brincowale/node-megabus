'use strict';

const megabus = require('../lib');

if (module === require.main) {
  let finder = new megabus.TicketFinder({
    // european date (dd/mm/yyyy)
    startDate: '1/4/2016',
    endDate: '1/4/2016',
    routes: [
      // Barcelona <-> Paris
      new megabus.Route('Barcelona', 'Paris'),
      new megabus.Route('Paris', 'Barcelona'),

      // Toulouse <-> Paris
      new megabus.Route('Toulouse', 'Paris'),
      new megabus.Route('Paris', 'Toulouse'),

      // Manchester <-> London
      new megabus.Route('Manchester', 'London'),
      new megabus.Route('London', 'Manchester'),
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
