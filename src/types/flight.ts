export type Board = "arrivals" | "departures" | "all";

export type FlightDto = {
  id: string;

  flightNumber: string;
  flightCode: string;

  airlineName: string;
  airlineCode: string;

  originAirport: string;
  destinationAirport: string;

  departureDateTime?: string;
  arrivalDateTime?: string;

  departureTime?: string;
  arrivalTime?: string;

  gateTerminal?: string;
  gateCode?: string;

  status: string;
};
