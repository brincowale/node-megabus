'use strict';

const querystring = require('querystring');

const _ = require('lodash');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const moment = require('moment');

exports.LOCATION_CODES = {
  'Aberdeen': 1,
  'Aberystwyth': 140,
  'Amiens': 185,
  'Amsterdam': 110,
  'Angers': 233,
  'Antwerp': 133,
  'Aviemore': 2,
  'Avignon': 206,
  'Axminster': 3,
  'Banbury': 4,
  'Barcelona': 170,
  'Barnsley': 5,
  'Bath Spa': 6,
  'Bedford': 7,
  'Berlin': 197,
  'Birmingham': 8,
  'Birmingham International Airport': 9,
  'Blackburn': 128,
  'Bologna': 219,
  'Bolton': 10,
  'Bordeaux': 235,
  'Bourges': 242,
  'Bournemouth': 11,
  'Bradford': 12,
  'Bremen': 192,
  'Brighton': 143,
  'Bristol': 13,
  'Bristol (Aztec)': 225,
  'Bristol (Cribbs Causeway)': 226,
  'Bristol (Filton)': 227,
  'Bristol Airport': 249,
  'Bristol UWE': 14,
  'Brive-la-Gaillarde': 172,
  'Brussels': 112,
  'Camborne': 16,
  'Cambridge': 17,
  'Canterbury': 19,
  'Cardiff': 20,
  'Carlisle': 21,
  'Carmarthen': 22,
  'Castleford': 23,
  'Chatellerault': 238,
  'Cheltenham': 24,
  'Chester': 130,
  'Chesterfield': 25,
  'Clermont Ferrand': 244,
  'Colchester': 122,
  'Cologne': 135,
  'Coventry': 27,
  'Crawley': 144,
  'Cumbernauld': 125,
  'Cwmbran': 29,
  'Daventry': 162,
  'Derby': 30,
  'Dijon': 246,
  'Doncaster': 31,
  'Dortmund': 193,
  'Dundee': 32,
  'Dunfermline': 126,
  'East Dereham': 119,
  'East Midlands Parkway': 33,
  'Edinburgh': 34,
  'Edinburgh Airport': 35,
  'Exeter': 36,
  'Falkirk': 127,
  'Feldkirchen': 210,
  'Florence': 223,
  'Frankfurt / Main': 188,
  'Freiburg (Breisgau)': 204,
  'Genoa': 220,
  'Gent': 124,
  'Glasgow': 38,
  'Gloucester': 39,
  'Gottingen': 195,
  'Grantham': 177,
  'Grimsby': 174,
  'Halbeath Interchange': 138,
  'Hamburg': 191,
  'Hannover': 194,
  'Havant': 42,
  'Heidelberg': 203,
  'High Wycombe': 145,
  'Honiton': 44,
  'Huddersfield': 45,
  'Hull': 46,
  'Inverkeithing': 48,
  'Inverness': 49,
  'Ipswich': 123,
  'Karlsruhe': 202,
  'Kassel': 196,
  'Kettering': 178,
  'Kings Lynn': 120,
  'Kinross': 51,
  'La Spezia (Sarzana)': 221,
  'Lampeter': 139,
  'Lancaster': 116,
  'Le Havre': 247,
  'Le Mans': 234,
  'Leeds': 52,
  'Leicester': 53,
  'Leipzig': 198,
  'Lille': 132,
  'Limoges': 171,
  'Lincoln': 175,
  'Liverpool': 54,
  'London': 56,
  'Loughborough': 57,
  'Luton': 141,
  'Lyon': 200,
  'Manchester': 58,
  'Marseille': 229,
  'Metz': 241,
  'Middlesbrough': 59,
  'Milan': 187,
  'Milton Keynes': 60,
  'Montpellier': 207,
  'Mulhouse': 205,
  'Munich': 190,
  'Nantes': 231,
  'Naples': 212,
  'Newark-on-Trent': 176,
  'Newbury': 62,
  'Newcastle': 63,
  'Newport': 64,
  'Newquay': 65,
  'Newton Abbot': 150,
  'Northampton': 166,
  'Norwich': 66,
  'Norwich': 67,
  'Nottingham': 68,
  'Nuremburg': 199,
  'Oxford': 71,
  'Padua': 217,
  'Paignton': 72,
  'Paris': 113,
  'Pembroke Dock': 73,
  'Penzance': 74,
  'Perpignan': 208,
  'Perth': 75,
  'Peterborough': 121,
  'Pisa': 222,
  'Pitlochry': 76,
  'Plymouth': 77,
  'Poitiers': 237,
  'Poole': 78,
  'Portsmouth': 79,
  'Preston': 80,
  'Reading': 81,
  'Redruth': 82,
  'Reims': 239,
  'Rennes': 232,
  'Rome': 186,
  'Rosslare': 83,
  'Rotterdam': 134,
  'Rouen': 248,
  'Rugby': 84,
  'Salisbury': 86,
  'Scunthorpe': 88,
  'Sheffield': 90,
  'Siena': 224,
  'Silverstone': 91,
  'Southampton': 93,
  'Southampton Airport': 108,
  'St Erth': 165,
  'St Etienne': 245,
  'Stirling': 95,
  'Stockport': 164,
  'Stoke-On-Trent': 118,
  'Strasbourg': 209,
  'Stuttgart': 189,
  'Sunderland': 96,
  'Swansea': 97,
  'Swindon': 98,
  'Taunton': 100,
  'Thetford': 109,
  'Torquay': 101,
  'Toulon': 230,
  'Toulouse': 173,
  'Tours': 236,
  'Towcester': 167,
  'Turin': 214,
  'Venice': 216,
  'Verona': 215,
  'Wakefield/Woolley Edge': 102,
  'Warrington': 103,
  'Weymouth': 104,
  'Wigan': 129,
  'Winchester': 105,
  'Worcester': 136,
  'Worthing': 142,
  'Yeovil Junction': 106,
  'York': 107,
};

class Route {
  constructor(origin, destination) {
    if (!exports.LOCATION_CODES[origin]) {
      throw new Error(`Unknown origin: ${origin}`);
    }
    if (!exports.LOCATION_CODES[destination]) {
      throw new Error(`Unknown destination: ${destination}`);
    }
    this.origin = origin;
    this.originCode = exports.LOCATION_CODES[origin];
    this.destination = destination;
    this.destinationCode = exports.LOCATION_CODES[destination];
  }
}

class Ticket {
  constructor(data) {
    this.origin = data.origin;
    this.destination = data.destination;
    this.date = data.date;
    this.departure = data.departure;
    this.arrival = data.arrival;
    this.price = data.price;
    this.price_cents = data.price_cents;
  }

  toString() {
    return `${this.price},${this.price_cents}€ ${this.origin} -> ${this.destination} (${this.date} ${this.departure} - ${this.arrival})`;
  }
}

class TicketFinder {
  constructor(data) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.routes = data.routes;
  }

  _buildURL(date, originCode, departureCode) {
    let qs = querystring.stringify({
      originCode: originCode,
      destinationCode: departureCode,
      outboundDepartureDate: date,
      inboundDepartureDate: '',
      passengerCount: 1,
      transportType: 0,
      concessionCount: 0,
      nusCount: 0,
      outboundWheelchairSeated: 0,
      outboundOtherDisabilityCount: 0,
      inboundWheelchairSeated: 0,
      inboundOtherDisabilityCount: 0,
      outboundPcaCount: 0,
      inboundPcaCount: 0,
      promotionCode: '',
      withReturn: 0
    });
    return `http://eseu.megabus.com/JourneyResults.aspx?${qs}`;
  }

  _getHTMLPromise(url) {
    return fetch(url)
      .then((res) => {
        return res.text();
      });
  }

  _parseTickets(html, date, route) {
    let $ = cheerio.load(html);
    let items = $('#JourneyResylts_OutboundList_main_div > ul')
      .not('.heading')
      .toArray();
    return items.map((item) => {
      let $item = $(item);
      let departure = /([01]?[0-9]|2[0-3]):[0-5][0-9]/.exec($item.find('.two > p:nth-child(1)').text());
      let arrival = /([01]?[0-9]|2[0-3]):[0-5][0-9]/.exec($item.find('.two > p:nth-child(2)').text());
      let price = /([0-9]+),([0-9]+)/.exec($item.find('.five > p').text());
      return new Ticket({
        origin: route.origin,
        destination: route.destination,
        date: date,
        departure: departure[0],
        arrival: arrival[0],
	price: price[1],
	price_cents: price[2],
      });
    });
  }

  _getTicketsPromise(date, route) {
    let url = this._buildURL(date, route.originCode, route.destinationCode);
    return this._getHTMLPromise(url).then((html) => {
      return this._parseTickets(html, date, route);
    });
  }

  getTicketsPromise() {
    let startDate = moment(this.startDate, 'DD/MM/YYYY');
    let endDate = moment(this.endDate, 'DD/MM/YYYY');
    let promises = [];
    for (let date = moment(startDate); !date.isAfter(endDate); date.add(1, 'days')) {
      this.routes.forEach((route) => {
        promises.push(this._getTicketsPromise(date.format('DD/MM/YYYY'), route));
      });
    }
    return Promise.all(promises)
      .then((results) => {
        return _.flatten(results);
      });
  }

  getTicketsInPriceRangePromise(min, max) {
    return this.getTicketsPromise().then((tickets) => {
      return tickets.filter((ticket) => {
        return min <= ticket.price && ticket.price <= max;
      });
    });
  }
}

exports.Route = Route;
exports.Ticket = Ticket;
exports.TicketFinder = TicketFinder;
