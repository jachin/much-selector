import { expect } from '@open-wc/testing';
import head from 'lodash-es/head.js';
import tail from 'lodash-es/tail.js';
import isArray from 'lodash-es/isArray.js';
import isObject from 'lodash-es/isObject.js';
import {
  Sifter,
  tokenize,
  prepareSearch,
  getScoreFunction,
} from '../src/sifter.js';

/**
 * Many tests ported from
 * https://github.com/brianreavis/sifter.js/blob/master/test/api.js
 */

describe('Sifter', () => {
  it('search for a needle', () => {
    const items = [
      { title: 'hay' },
      { title: 'straw' },
      { title: 'grass' },
      { title: 'chaff' },
      { title: 'needle' },
      { title: 'monkey' },
      { title: 'banana' },
    ];

    const sifter = new Sifter(items);
    const result = sifter.search('need', { fields: ['title'] });
    expect(result.items).to.have.lengthOf(1);

    expect(result).to.have.property('query');
    expect(result).to.have.property('tokens');
    expect(result.total).to.equal(1);

    const foundItem = head(result.items);

    expect(foundItem.id).to.equal(4);
    expect(foundItem).to.have.property('score');
  });

  it('parse a big long list', () => {
    const items = [
      { title: '' },
      { title: 'Amount: 1' },
      { title: 'Amount: 12' },
      { title: 'Amount: 2' },
      { title: 'Amount: 4' },
      { title: 'Collection: -10 AN' },
      { title: 'Collection: -12 AN' },
      { title: 'Collection: -16 AN' },
      { title: 'Collection: -3 AN' },
      { title: 'Collection: -4 AN' },
      { title: 'Collection: -6 AN' },
      { title: 'Collection: -8 AN' },
      { title: 'Collection: 05-08 Truck Ford' },
      { title: 'Collection: 39-46 Truck Chevy' },
      { title: 'Collection: 47-54 Chevy Truck Glass' },
      { title: 'Collection: 47-54 Chevy Truck Weather' },
      { title: 'Collection: 47-54 Chevy truck Metal' },
      { title: 'Collection: 47-54 Truck Chevy' },
      { title: 'Collection: 4x4' },
      { title: 'Collection: 55-57 Bel Air Chevy' },
      { title: 'Collection: 55-59 Chevy Truck Weather' },
      { title: 'Collection: 55-59 Truck Chevy' },
      { title: 'Collection: 55-59 chevy truck metal' },
      { title: 'Collection: 57-60 Truck Ford' },
      { title: 'Collection: 60-66 Chevy Truck Weather' },
      { title: 'Collection: 60-66 Truck Chevy' },
      { title: 'Collection: 60-66 chevy truck metal' },
      { title: 'Collection: 61-66 Turck Ford' },
      { title: 'Collection: 65-73 Mustang Ford' },
      { title: 'Collection: 67-69 Camaro Chevy' },
      { title: 'Collection: 67-72 Chevy Truck Glass' },
      { title: 'Collection: 67-72 Chevy Truck Weather' },
      { title: 'Collection: 67-72 Truck Chevy' },
      { title: 'Collection: 67-72 Truck Ford' },
      { title: 'Collection: 67-72 chevy truck metal' },
      { title: 'Collection: 70-81 Camaro Chevy' },
      { title: 'Collection: 73-87 Chevy Truck Weather' },
      { title: 'Collection: 73-87 Truck Chevy' },
      { title: 'Collection: 73-87 chevy truck metal' },
      { title: 'Collection: 74-78 Mustang Ford' },
      { title: 'Collection: 79-93 Mustang Ford' },
      { title: 'Collection: 82-92 Camaro Chevy' },
      { title: 'Collection: 88-98 Truck Chevy' },
      { title: 'Collection: 88-98 chevy truck metal' },
      { title: 'Collection: 92-97 Truck Ford' },
      { title: 'Collection: 98-04 Truck Ford' },
      { title: 'Collection: 99-15 Truck Chevy' },
      { title: 'Collection: 99-15 chevy truck metal' },
      { title: 'Collection: Accessories' },
      { title: 'Collection: Air Cleaners & Accessories' },
      { title: 'Collection: Air Conditioning' },
      { title: 'Collection: All Fuel Systems' },
      { title: 'Collection: Allstar' },
      { title: 'Collection: American Retro' },
      { title: 'Collection: Atech' },
      { title: 'Collection: B&M' },
      { title: 'Collection: BBC Long Water Pump' },
      { title: 'Collection: BBC Short Water Pump' },
      { title: 'Collection: Best Sellers' },
      { title: 'Collection: Black Fittings' },
      { title: 'Collection: Blazer Chevy' },
      { title: 'Collection: Blazer Metal' },
      { title: 'Collection: Blue/Red Fittings' },
      { title: 'Collection: Bous Performance INC.' },
      { title: 'Collection: Brake Components' },
      { title: 'Collection: Brakes' },
      { title: 'Collection: Bronco Metal' },
      { title: 'Collection: Buick' },
      { title: 'Collection: Bulkheads' },
      { title: 'Collection: CCR Products' },
      { title: 'Collection: Caltracs Bars' },
      { title: 'Collection: Calvert Racing' },
      { title: 'Collection: Camaro' },
      { title: 'Collection: Camaro Metal' },
      { title: 'Collection: Carburetors' },
      { title: 'Collection: Chevelle Chevy' },
      { title: 'Collection: Chevelle Metal' },
      { title: 'Collection: Chevy' },
      { title: 'Collection: Chevy Truck' },
      { title: 'Collection: Chevy Truck & Car' },
      { title: 'Collection: Chevy Truck Metal' },
      { title: 'Collection: Chrysler' },
      { title: 'Collection: Classic Chevrolet' },
      { title: 'Collection: Classic Chevy' },
      { title: 'Collection: Classic Ford' },
      { title: 'Collection: Column Dress Up Kits' },
      { title: 'Collection: Compressors' },
      { title: 'Collection: Counterpart Automotive' },
      { title: 'Collection: Distributors' },
      { title: 'Collection: Dodge' },
      { title: 'Collection: Dodge Truck Metal' },
      { title: 'Collection: EFI Systems' },
      { title: 'Collection: El Camino Chevy' },
      { title: 'Collection: El Camino Metal' },
      { title: 'Collection: Electric Fans' },
      { title: 'Collection: Electrical' },
      { title: 'Collection: Engine Components' },
      { title: 'Collection: Exhaust' },
      { title: 'Collection: Exterior' },
      { title: 'Collection: Fittings & Hoses' },
      { title: 'Collection: Flowmaster' },
      { title: 'Collection: Ford' },
      { title: 'Collection: Ford Truck Metal' },
      { title: 'Collection: Front Runners' },
      { title: 'Collection: GMC' },
      { title: 'Collection: GMC Jimmy Metal' },
      { title: 'Collection: Garage Art' },
      { title: 'Collection: Gaskets' },
      { title: 'Collection: General Components' },
      { title: 'Collection: Glass & Weatherstrip' },
      { title: 'Collection: Headers' },
      { title: 'Collection: Headers & Exhaust' },
      { title: 'Collection: Holley' },
      { title: 'Collection: Home page' },
      { title: 'Collection: Hose Clamps' },
      { title: 'Collection: Hoses' },
      { title: 'Collection: Hurst' },
      { title: 'Collection: Hybroboost Systems' },
      { title: 'Collection: Impala Chevy' },
      { title: 'Collection: Impala Metal' },
      { title: 'Collection: Interior' },
      { title: 'Collection: Jeep' },
      { title: 'Collection: KeyParts' },
      { title: 'Collection: LS' },
      { title: 'Collection: Lighting Components' },
      { title: 'Collection: MBM Brakes' },
      { title: 'Collection: MSD' },
      { title: 'Collection: Malibu Chevy' },
      { title: 'Collection: Malibu Metal' },
      { title: 'Collection: Mega Menu - Featured Products' },
      { title: 'Collection: Monte Carlo Chevy' },
      { title: 'Collection: Monte Carlo Metal' },
      { title: 'Collection: Mustang Metal' },
      { title: 'Collection: NOS' },
      { title: 'Collection: Nova Chevy' },
      { title: 'Collection: Nova Metal' },
      { title: 'Collection: Other' },
      { title: 'Collection: PPD' },
      { title: 'Collection: Performance Online (POL)' },
      { title: 'Collection: Pipe Fittings' },
      { title: 'Collection: Polished Fittings' },
      { title: 'Collection: Pontiac Firebird Metal' },
      { title: 'Collection: Power Adders' },
      { title: 'Collection: Power Steering & Alternator' },
      { title: 'Collection: Precision' },
      { title: 'Collection: ProCharger' },
      { title: 'Collection: Pulleys & Brackets' },
      { title: 'Collection: Quick Fuel Technology' },
      { title: 'Collection: RAM' },
      { title: 'Collection: RPC' },
      { title: 'Collection: Radiators' },
      { title: 'Collection: Russell' },
      { title: 'Collection: SAE Speed' },
      { title: 'Collection: SBC Long Water Pump' },
      { title: 'Collection: SBC Short Water Pump' },
      { title: 'Collection: Sheet Metal' },
      { title: 'Collection: Shifters' },
      { title: 'Collection: Speed' },
      { title: 'Collection: Speedmaster' },
      { title: 'Collection: Starters & Electrical' },
      { title: 'Collection: Steel Fittings' },
      { title: 'Collection: Steering' },
      { title: 'Collection: Steering Components' },
      { title: 'Collection: Suburban Chevy' },
      { title: 'Collection: Suburban Metal' },
      { title: 'Collection: Superchargers' },
      { title: 'Collection: Sure Fit Kits' },
      { title: 'Collection: Suspension' },
      { title: 'Collection: Suspension Components' },
      { title: 'Collection: Tools' },
      { title: 'Collection: Top Street Performance' },
      { title: 'Collection: Torque Converters' },
      { title: 'Collection: Transmission' },
      { title: 'Collection: Transmission Components' },
      { title: 'Collection: Valve Covers & Accessories' },
      { title: 'Collection: Vintage Air' },
      { title: 'Collection: Water Pumps' },
      { title: 'Collection: Weiand' },
      { title: 'Collection: Wilwood Engineering' },
      { title: 'Collection: homepage top' },
      { title: 'Color: Blue' },
      { title: 'Color: Chrome' },
      { title: 'Color: Red' },
      { title: 'Finish: Army Green' },
      { title: 'Finish: Army Green & Rusted' },
      { title: 'Finish: Black' },
      { title: 'Finish: Blue & Rusted' },
      { title: 'Finish: Gold' },
      { title: 'Finish: Gold & Rusted' },
      { title: 'Finish: Green & Rusted' },
      { title: 'Finish: Orange & Rusted' },
      { title: 'Finish: Orange Blue & Rusted' },
      { title: 'Finish: Painted' },
      { title: 'Finish: Painted & Rusted' },
      { title: 'Finish: Painted (Red/Black)' },
      { title: 'Finish: Raw' },
      { title: 'Finish: Red' },
      { title: 'Finish: Red & Rusted' },
      { title: 'Finish: Rusted' },
      { title: 'Finish: White & Rusted' },
      { title: 'Finish: Yellow & Rusted' },
      { title: 'Finish: Yellow Blue & Rusted' },
      { title: 'Product Type: 4x4' },
      { title: 'Product Type: Air Cleaners & Accessories' },
      { title: 'Product Type: Air Conditioning' },
      { title: 'Product Type: Brake Systems' },
      { title: 'Product Type: CalTrac' },
      { title: 'Product Type: Carburetors' },
      { title: 'Product Type: Dash Parts' },
      { title: 'Product Type: Distributors' },
      { title: 'Product Type: Door Panels & Hardware' },
      { title: 'Product Type: Electric Fans' },
      { title: 'Product Type: Electrical' },
      { title: 'Product Type: Engine Components' },
      { title: 'Product Type: Exterior' },
      { title: 'Product Type: Exterior Accessories' },
      { title: 'Product Type: Fittings & Hoses' },
      { title: 'Product Type: Fuel Systems' },
      { title: 'Product Type: Garage Art' },
      { title: 'Product Type: Gauges' },
      { title: 'Product Type: Glass' },
      { title: 'Product Type: Headers & Exhaust' },
      { title: 'Product Type: Interior' },
      { title: 'Product Type: Lighting Components' },
      { title: 'Product Type: Metal' },
      { title: 'Product Type: Motor Mounts' },
      { title: 'Product Type: Power Adders' },
      { title: 'Product Type: ProCharger' },
      { title: 'Product Type: Pulleys & Brackets' },
      { title: 'Product Type: Radiators' },
      { title: 'Product Type: Shifter' },
      { title: 'Product Type: Starters & Electrical' },
      { title: 'Product Type: Steering Columns & Wheels' },
      { title: 'Product Type: Suspension Components' },
      { title: 'Product Type: Tools' },
      { title: 'Product Type: Transmission' },
      { title: 'Product Type: Valve Covers & Accessories' },
      { title: 'Product Type: Water Pumps' },
      { title: 'Product Type: Weatherstripping' },
      { title: 'Product Type: eBay' },
      { title: 'Set Quantity: 1' },
      { title: 'Set Quantity: 12' },
      { title: 'Set Quantity: 14' },
      { title: 'Set Quantity: 4' },
      { title: 'Set Quantity: 8' },
      { title: 'Set Quantity: eight' },
      { title: 'Set Quantity: four' },
      { title: 'Set Quantity: fourteen' },
      { title: 'Set Quantity: one' },
      { title: 'Set Quantity: twelve' },
      { title: 'Size: 12 in' },
      { title: 'Size: 15 in' },
      { title: 'Size: 15"' },
      { title: 'Size: 18 in' },
      { title: 'Size: 20 in' },
      { title: 'Size: 23"' },
      { title: 'Size: 24 in' },
      { title: 'Size: 28 in' },
      { title: 'Size: 36 in' },
      { title: 'Size: 36"' },
      { title: 'Size: 40 in' },
      { title: 'Size: 46 in' },
      { title: 'Size: 46"' },
      { title: 'Size: 54 in' },
      { title: 'Size: 56 in' },
      { title: 'Tag: 02-08' },
      { title: 'Tag: 03-12' },
      { title: 'Tag: 05-08' },
      { title: 'Tag: 05-14' },
      { title: 'Tag: 06-18' },
      { title: 'Tag: 09-14' },
      { title: 'Tag: 09-Present' },
      { title: 'Tag: 09-present' },
      { title: 'Tag: 15-present' },
      { title: 'Tag: 1500' },
      { title: 'Tag: 175CC' },
      { title: 'Tag: 190' },
      { title: 'Tag: 192' },
      { title: 'Tag: 1937' },
      { title: 'Tag: 1938' },
      { title: 'Tag: 1939' },
      { title: 'Tag: 1940' },
      { title: 'Tag: 1941' },
      { title: 'Tag: 1942' },
      { title: 'Tag: 1943' },
      { title: 'Tag: 1944' },
      { title: 'Tag: 1945' },
      { title: 'Tag: 1946' },
      { title: 'Tag: 1947' },
      { title: 'Tag: 1948' },
      { title: 'Tag: 1949' },
      { title: 'Tag: 1950' },
      { title: 'Tag: 1951' },
      { title: 'Tag: 1952' },
      { title: 'Tag: 1953' },
      { title: 'Tag: 1954' },
      { title: 'Tag: 1955' },
      { title: 'Tag: 1956' },
      { title: 'Tag: 1957' },
      { title: 'Tag: 1958' },
      { title: 'Tag: 1959' },
      { title: 'Tag: 196' },
      { title: 'Tag: 1960' },
      { title: 'Tag: 1961' },
      { title: 'Tag: 1962' },
      { title: 'Tag: 1963' },
      { title: 'Tag: 1964' },
      { title: 'Tag: 1965' },
      { title: 'Tag: 1966' },
      { title: 'Tag: 19666' },
      { title: 'Tag: 1967' },
      { title: 'Tag: 19677' },
      { title: 'Tag: 1968' },
      { title: 'Tag: 1969' },
      { title: 'Tag: 1970' },
      { title: 'Tag: 1971' },
      { title: 'Tag: 1972' },
      { title: 'Tag: 1973' },
      { title: 'Tag: 1974' },
      { title: 'Tag: 1975' },
      { title: 'Tag: 1976' },
      { title: 'Tag: 1977' },
      { title: 'Tag: 1978' },
      { title: 'Tag: 1979' },
      { title: 'Tag: 1980' },
      { title: 'Tag: 1981' },
      { title: 'Tag: 1982' },
      { title: 'Tag: 1983' },
      { title: 'Tag: 1984' },
      { title: 'Tag: 1985' },
      { title: 'Tag: 1986' },
      { title: 'Tag: 1987' },
      { title: 'Tag: 1988' },
      { title: 'Tag: 1989' },
      { title: 'Tag: 1990' },
      { title: 'Tag: 1991' },
      { title: 'Tag: 1992' },
      { title: 'Tag: 1993' },
      { title: 'Tag: 1994' },
      { title: 'Tag: 1995' },
      { title: 'Tag: 1996' },
      { title: 'Tag: 1997' },
      { title: 'Tag: 1998' },
      { title: 'Tag: 1999' },
      { title: 'Tag: 2000' },
      { title: 'Tag: 2001' },
      { title: 'Tag: 2002' },
      { title: 'Tag: 2003' },
      { title: 'Tag: 2004' },
      { title: 'Tag: 2005' },
      { title: 'Tag: 2006' },
      { title: 'Tag: 2007' },
      { title: 'Tag: 2008' },
      { title: 'Tag: 2009' },
      { title: 'Tag: 2010' },
      { title: 'Tag: 2011' },
      { title: 'Tag: 2012' },
      { title: 'Tag: 2013' },
      { title: 'Tag: 2014' },
      { title: 'Tag: 2015' },
      { title: 'Tag: 2016' },
      { title: 'Tag: 2017' },
      { title: 'Tag: 2018' },
      { title: 'Tag: 205CC' },
      { title: 'Tag: 250' },
      { title: 'Tag: 2500' },
      { title: 'Tag: 260' },
      { title: 'Tag: 283' },
      { title: 'Tag: 289' },
      { title: 'Tag: 290' },
      { title: 'Tag: 291' },
      { title: 'Tag: 292' },
      { title: 'Tag: 293' },
      { title: 'Tag: 294' },
      { title: 'Tag: 295' },
      { title: 'Tag: 296' },
      { title: 'Tag: 297' },
      { title: 'Tag: 298' },
      { title: 'Tag: 299' },
      { title: 'Tag: 2WD' },
      { title: 'Tag: 3' },
      { title: 'Tag: 300' },
      { title: 'Tag: 301' },
      { title: 'Tag: 302' },
      { title: 'Tag: 305' },
      { title: 'Tag: 318' },
      { title: 'Tag: 327' },
      { title: 'Tag: 340' },
      { title: 'Tag: 350' },
      { title: 'Tag: 3500' },
      { title: 'Tag: 351' },
      { title: 'Tag: 351C' },
      { title: 'Tag: 351W' },
      { title: 'Tag: 360' },
      { title: 'Tag: 383' },
      { title: 'Tag: 39-46' },
      { title: 'Tag: 396' },
      { title: 'Tag: 400' },
      { title: 'Tag: 402' },
      { title: 'Tag: 427' },
      { title: 'Tag: 442' },
      { title: 'Tag: 454' },
      { title: 'Tag: 47-54' },
      { title: 'Tag: 4754' },
      { title: 'Tag: 496' },
      { title: 'Tag: 4WD' },
      { title: 'Tag: 4x4' },
      { title: 'Tag: 5.7' },
      { title: 'Tag: 50-54' },
      { title: 'Tag: 502' },
      { title: 'Tag: 540' },
      { title: 'Tag: 55-57' },
      { title: 'Tag: 55-59' },
      { title: 'Tag: 57-60' },
      { title: 'Tag: 58-60' },
      { title: 'Tag: 58-64' },
      { title: 'Tag: 6-72' },
      { title: 'Tag: 60-66' },
      { title: 'Tag: 61-64' },
      { title: 'Tag: 61-66' },
      { title: 'Tag: 62-67' },
      { title: 'Tag: 62-73' },
      { title: 'Tag: 62CC' },
      { title: 'Tag: 64-67' },
      { title: 'Tag: 64-73' },
      { title: 'Tag: 6425' },
      { title: 'Tag: 64CC' },
      { title: 'Tag: 65-70' },
      { title: 'Tag: 65-73' },
      { title: 'Tag: 66-77' },
      { title: 'Tag: 67-69' },
      { title: 'Tag: 67-70' },
      { title: 'Tag: 67-72' },
      { title: 'Tag: 67-722' },
      { title: 'Tag: 6772' },
      { title: 'Tag: 68-72' },
      { title: 'Tag: 68-74' },
      { title: 'Tag: 69-72' },
      { title: 'Tag: 70-81' },
      { title: 'Tag: 700R4' },
      { title: 'Tag: 72-87' },
      { title: 'Tag: 727' },
      { title: 'Tag: 73-77' },
      { title: 'Tag: 73-79' },
      { title: 'Tag: 73-87' },
      { title: 'Tag: 73-91' },
      { title: 'Tag: 74-78' },
      { title: 'Tag: 78-83' },
      { title: 'Tag: 78-87' },
      { title: 'Tag: 79-93' },
      { title: 'Tag: 80-86' },
      { title: 'Tag: 80692' },
      { title: 'Tag: 81-88' },
      { title: 'Tag: 82-92' },
      { title: 'Tag: 82-93' },
      { title: 'Tag: 87-91' },
      { title: 'Tag: 87-96' },
      { title: 'Tag: 88-98' },
      { title: 'Tag: 904' },
      { title: 'Tag: 92-94' },
      { title: 'Tag: 92-944' },
      { title: 'Tag: 92-96' },
      { title: 'Tag: 92-97' },
      { title: 'Tag: 94-01' },
      { title: 'Tag: 94-96' },
      { title: 'Tag: 98-04' },
      { title: 'Tag: 99-15' },
      { title: 'Tag: A' },
      { title: 'Tag: A Body' },
      { title: 'Tag: AED' },
      { title: 'Tag: AFB' },
      { title: 'Tag: AMX' },
      { title: 'Tag: Air Cleaner' },
      { title: 'Tag: Alternator' },
      { title: 'Tag: Aluminum' },
      { title: 'Tag: Anniversary' },
      { title: 'Tag: Apollo' },
      { title: 'Tag: Art' },
      { title: 'Tag: Aspen' },
      { title: 'Tag: Avalanche' },
      { title: 'Tag: B Series' },
      { title: 'Tag: B&M' },
      { title: 'Tag: BBC' },
      { title: 'Tag: BBF' },
      { title: 'Tag: Barracuda' },
      { title: 'Tag: Bathroom' },
      { title: 'Tag: Bedroom' },
      { title: 'Tag: Bel Air' },
      { title: 'Tag: Belvedere' },
      { title: 'Tag: Big Block' },
      { title: 'Tag: Biscayne' },
      { title: 'Tag: Black' },
      { title: 'Tag: Black Intake' },
      { title: 'Tag: Blazer' },
      { title: 'Tag: Blower Tunnel' },
      { title: 'Tag: Brakes' },
      { title: 'Tag: Bronco' },
      { title: 'Tag: Buick' },
      { title: 'Tag: C-1500' },
      { title: 'Tag: C10' },
      { title: 'Tag: C1500' },
      { title: 'Tag: C20' },
      { title: 'Tag: C4' },
      { title: 'Tag: C6' },
      { title: 'Tag: CHEVY' },
      { title: 'Tag: Cadillac' },
      { title: 'Tag: Camaro' },
      { title: 'Tag: Caprice' },
      { title: 'Tag: Century' },
      { title: 'Tag: Challenger' },
      { title: 'Tag: Charger' },
      { title: 'Tag: Cherokee' },
      { title: 'Tag: Chevelle' },
      { title: 'Tag: Chevrolet' },
      { title: 'Tag: Chevy' },
      { title: 'Tag: Chevy II' },
      { title: 'Tag: Chrome' },
      { title: 'Tag: Chrysler' },
      { title: 'Tag: Colorado' },
      { title: 'Tag: Comet' },
      { title: 'Tag: Commander' },
      { title: 'Tag: Coronet' },
      { title: 'Tag: Corvette' },
      { title: 'Tag: Cougar' },
      { title: 'Tag: Crossfire' },
      { title: 'Tag: Cruiser' },
      { title: 'Tag: Cuda' },
      { title: 'Tag: Cummins' },
      { title: 'Tag: Custom' },
      { title: 'Tag: Cutlass' },
      { title: 'Tag: Cyclone' },
      { title: 'Tag: D Series' },
      { title: 'Tag: Dakota' },
      { title: 'Tag: Dar' },
      { title: 'Tag: Dart' },
      { title: 'Tag: Decor' },
      { title: 'Tag: Demon' },
      { title: 'Tag: Diesel' },
      { title: 'Tag: Dodge' },
      { title: 'Tag: Dress' },
      { title: 'Tag: Duramax' },
      { title: 'Tag: Durango' },
      { title: 'Tag: Duster' },
      { title: 'Tag: Edelbrock' },
      { title: 'Tag: El Camino' },
      { title: 'Tag: Electrical' },
      { title: 'Tag: Engine' },
      { title: 'Tag: Entryway' },
      { title: 'Tag: Escalade' },
      { title: 'Tag: F' },
      { title: 'Tag: F Body' },
      { title: 'Tag: F-100' },
      { title: 'Tag: F-150' },
      { title: 'Tag: F-250' },
      { title: 'Tag: F-350' },
      { title: 'Tag: F85' },
      { title: 'Tag: Fairlane' },
      { title: 'Tag: Falcon' },
      { title: 'Tag: Firebird' },
      { title: 'Tag: Ford' },
      { title: 'Tag: Front Runner' },
      { title: 'Tag: Fuel Injection' },
      { title: 'Tag: Fuel Rails' },
      { title: 'Tag: Full Size Car' },
      { title: 'Tag: Fury' },
      { title: 'Tag: GM' },
      { title: 'Tag: GMC' },
      { title: 'Tag: GS' },
      { title: 'Tag: GTO' },
      { title: 'Tag: GTX' },
      { title: 'Tag: Galaxie' },
      { title: 'Tag: Garage' },
      { title: 'Tag: Gauges' },
      { title: 'Tag: Gen 4' },
      { title: 'Tag: Gran Fury' },
      { title: 'Tag: Gran Sport' },
      { title: 'Tag: Grand' },
      { title: 'Tag: Grand Cherokee' },
      { title: 'Tag: Grand Prix' },
      { title: 'Tag: HEI' },
      { title: 'Tag: Hangings' },
      { title: 'Tag: Holley' },
      { title: 'Tag: II' },
      { title: 'Tag: Impala' },
      { title: 'Tag: Intake' },
      { title: 'Tag: Javelin' },
      { title: 'Tag: Javlin' },
      { title: 'Tag: Jeep' },
      { title: 'Tag: Jimmy' },
      { title: 'Tag: Kit' },
      { title: 'Tag: LQ4' },
      { title: 'Tag: LQ9' },
      { title: 'Tag: LS' },
      { title: 'Tag: LS1' },
      { title: 'Tag: LS2' },
      { title: 'Tag: LS3' },
      { title: 'Tag: LS6' },
      { title: 'Tag: LS7' },
      { title: 'Tag: LWP' },
      { title: 'Tag: Lemans' },
      { title: 'Tag: Lincoln' },
      { title: 'Tag: Logo' },
      { title: 'Tag: MBM Brakes' },
      { title: 'Tag: MSD' },
      { title: 'Tag: Magnum' },
      { title: 'Tag: Malibu' },
      { title: 'Tag: Maverick' },
      { title: 'Tag: Mercury' },
      { title: 'Tag: Monaco' },
      { title: 'Tag: Monte Carlo' },
      { title: 'Tag: Mopar' },
      { title: 'Tag: Mustang' },
      { title: 'Tag: National' },
      { title: 'Tag: Nitro' },
      { title: 'Tag: Nova' },
      { title: 'Tag: Off-Road' },
      { title: 'Tag: Oil Pressure' },
      { title: 'Tag: Oldsmobile' },
      { title: 'Tag: Omega' },
      { title: 'Tag: One-Fifty' },
      { title: 'Tag: Outdoor' },
      { title: 'Tag: Passenger' },
      { title: 'Tag: Petroleum' },
      { title: 'Tag: Pickup' },
      { title: 'Tag: Pickup Truck' },
      { title: 'Tag: Pinto' },
      { title: 'Tag: Plymouth' },
      { title: 'Tag: Plymouth Cuda' },
      { title: 'Tag: Polara' },
      { title: 'Tag: Polished' },
      { title: 'Tag: Pontia' },
      { title: 'Tag: Pontiac' },
      { title: 'Tag: Porsche' },
      { title: 'Tag: Power Steering' },
      { title: 'Tag: Powerglide' },
      { title: 'Tag: ProCharger' },
      { title: 'Tag: ProStreet' },
      { title: 'Tag: Proportioning Valve' },
      { title: 'Tag: Quadrajet' },
      { title: 'Tag: Quick Fuel' },
      { title: 'Tag: RAM' },
      { title: 'Tag: RT' },
      { title: 'Tag: Ram' },
      { title: 'Tag: Ranchero' },
      { title: 'Tag: Ranger' },
      { title: 'Tag: Raptor' },
      { title: 'Tag: Rectangle Port' },
      { title: 'Tag: Red' },
      { title: 'Tag: Regal' },
      { title: 'Tag: Road Runner' },
      { title: 'Tag: Roadrunner' },
      { title: 'Tag: Royal Monaco' },
      { title: 'Tag: S-10' },
      { title: 'Tag: SBC' },
      { title: 'Tag: SBF' },
      { title: 'Tag: SRT-10' },
      { title: 'Tag: SWP' },
      { title: 'Tag: Satellite' },
      { title: 'Tag: Savoy' },
      { title: 'Tag: Scamp' },
      { title: 'Tag: Serpentine' },
      { title: 'Tag: Sierra' },
      { title: 'Tag: Signage' },
      { title: 'Tag: Signs' },
      { title: 'Tag: Silerado' },
      { title: 'Tag: Silverado' },
      { title: 'Tag: Skylark' },
      { title: 'Tag: Small Block' },
      { title: 'Tag: Sniper' },
      { title: 'Tag: Special' },
      { title: 'Tag: Sportswagon' },
      { title: 'Tag: Sprint' },
      { title: 'Tag: Stainless' },
      { title: 'Tag: Starters' },
      { title: 'Tag: Steering Column' },
      { title: 'Tag: Suburban' },
      { title: 'Tag: Swinger' },
      { title: 'Tag: T Bird' },
      { title: 'Tag: TH400' },
      { title: 'Tag: TRUCK' },
      { title: 'Tag: Tacoma' },
      { title: 'Tag: Tahoe' },
      { title: 'Tag: Tall' },
      { title: 'Tag: Temperature' },
      { title: 'Tag: Tempest' },
      { title: 'Tag: Throttle Body' },
      { title: 'Tag: Torino' },
      { title: 'Tag: Toyota' },
      { title: 'Tag: Transam' },
      { title: 'Tag: Truck' },
      { title: 'Tag: Tundra' },
      { title: 'Tag: Two-Fifty' },
      { title: 'Tag: Two-Ten' },
      { title: 'Tag: Universal' },
      { title: 'Tag: Up' },
      { title: 'Tag: Valiant' },
      { title: 'Tag: Valve Cover' },
      { title: 'Tag: Ventura' },
      { title: 'Tag: Ventura II' },
      { title: 'Tag: Venture' },
      { title: 'Tag: Vintage Air' },
      { title: 'Tag: Vista' },
      { title: 'Tag: Voare' },
      { title: 'Tag: Volare' },
      { title: 'Tag: Volt Meter' },
      { title: 'Tag: Wall' },
      { title: 'Tag: Water Temp' },
      { title: 'Tag: Wilwood' },
      { title: 'Tag: Wrangler' },
      { title: 'Tag: X' },
      { title: 'Tag: X Body' },
      { title: 'Tag: X-Runner' },
      { title: 'Tag: Yukon' },
      { title: 'Tag: Yukon XL' },
      { title: 'Tag: ZQ8' },
      { title: 'Tag: advertising' },
      { title: 'Tag: aft' },
      { title: 'Tag: aircraft' },
      { title: 'Tag: american' },
      { title: 'Tag: anniversary' },
      { title: 'Tag: antique' },
      { title: 'Tag: art' },
      { title: 'Tag: automotive' },
      { title: 'Tag: bedroom' },
      { title: 'Tag: bel air' },
      { title: 'Tag: birthday' },
      { title: 'Tag: blazer' },
      { title: 'Tag: blue' },
      { title: 'Tag: bobcat' },
      { title: 'Tag: bravada' },
      { title: 'Tag: bronco' },
      { title: 'Tag: buick' },
      { title: 'Tag: c10' },
      { title: 'Tag: c4' },
      { title: 'Tag: c6' },
      { title: 'Tag: camaro' },
      { title: 'Tag: canyon' },
      { title: 'Tag: caprice' },
      { title: 'Tag: car' },
      { title: 'Tag: cave' },
      { title: 'Tag: cclone' },
      { title: 'Tag: chevelle' },
      { title: 'Tag: chevrole' },
      { title: 'Tag: chevrolet' },
      { title: 'Tag: chevy' },
      { title: 'Tag: cheyv' },
      { title: 'Tag: chief' },
      { title: 'Tag: cj' },
      { title: 'Tag: classic' },
      { title: 'Tag: cnc' },
      { title: 'Tag: cobra' },
      { title: 'Tag: collectibles' },
      { title: 'Tag: comet' },
      { title: 'Tag: commando' },
      { title: 'Tag: corvette' },
      { title: 'Tag: cougar' },
      { title: 'Tag: cuda' },
      { title: 'Tag: cyclone' },
      { title: 'Tag: deco' },
      { title: 'Tag: decor' },
      { title: 'Tag: dino' },
      { title: 'Tag: dodge' },
      { title: 'Tag: drodge' },
      { title: 'Tag: emblem' },
      { title: 'Tag: entryway' },
      { title: 'Tag: esso' },
      { title: 'Tag: excursion' },
      { title: 'Tag: expedition' },
      { title: 'Tag: exxon' },
      { title: 'Tag: failane' },
      { title: 'Tag: fairlane' },
      { title: 'Tag: falcon' },
      { title: "Tag: father's day" },
      { title: 'Tag: firebird' },
      { title: 'Tag: flag' },
      { title: 'Tag: flying' },
      { title: 'Tag: ford' },
      { title: 'Tag: fuel' },
      { title: 'Tag: furd' },
      { title: 'Tag: garage' },
      { title: 'Tag: gas' },
      { title: 'Tag: gasoline' },
      { title: 'Tag: gaspump' },
      { title: 'Tag: gassign' },
      { title: 'Tag: general' },
      { title: 'Tag: genuine' },
      { title: 'Tag: gift' },
      { title: 'Tag: gifts' },
      { title: 'Tag: gm' },
      { title: 'Tag: gmc' },
      { title: 'Tag: gray' },
      { title: 'Tag: gulf' },
      { title: 'Tag: highway' },
      { title: 'Tag: husband' },
      { title: 'Tag: impala' },
      { title: 'Tag: indian' },
      { title: 'Tag: industrial' },
      { title: 'Tag: islander' },
      { title: 'Tag: jeep' },
      { title: 'Tag: jimmy' },
      { title: 'Tag: jk' },
      { title: 'Tag: lardo' },
      { title: 'Tag: latest' },
      { title: 'Tag: long water pump' },
      { title: 'Tag: man' },
      { title: 'Tag: military' },
      { title: 'Tag: mobil' },
      { title: 'Tag: montego' },
      { title: 'Tag: motor' },
      { title: 'Tag: motors' },
      { title: 'Tag: mustang' },
      { title: 'Tag: nova' },
      { title: 'Tag: office' },
      { title: 'Tag: oil' },
      { title: 'Tag: old' },
      { title: 'Tag: other' },
      { title: 'Tag: outdoor' },
      { title: 'Tag: overland' },
      { title: 'Tag: paint' },
      { title: 'Tag: parts' },
      { title: 'Tag: patio' },
      { title: 'Tag: petroeum' },
      { title: 'Tag: petroleum' },
      { title: 'Tag: pontiac' },
      { title: 'Tag: pontiacs' },
      { title: 'Tag: porcelain' },
      { title: 'Tag: pump' },
      { title: 'Tag: ram' },
      { title: 'Tag: ranchero' },
      { title: 'Tag: red' },
      { title: 'Tag: renegade' },
      { title: 'Tag: retro' },
      { title: 'Tag: rh' },
      { title: 'Tag: rio grand' },
      { title: 'Tag: roadmaster' },
      { title: 'Tag: route' },
      { title: 'Tag: route 66' },
      { title: 'Tag: ruck' },
      { title: 'Tag: rust' },
      { title: 'Tag: s10' },
      { title: 'Tag: sahara' },
      { title: 'Tag: script' },
      { title: 'Tag: service' },
      { title: 'Tag: shell' },
      { title: 'Tag: short water pump' },
      { title: 'Tag: sierra' },
      { title: 'Tag: sinclair' },
      { title: 'Tag: skull' },
      { title: 'Tag: sport' },
      { title: 'Tag: ss' },
      { title: 'Tag: standard' },
      { title: 'Tag: star' },
      { title: 'Tag: station' },
      { title: 'Tag: steel' },
      { title: 'Tag: studebaker' },
      { title: 'Tag: swp' },
      { title: 'Tag: tahoe' },
      { title: 'Tag: texaco' },
      { title: 'Tag: texas' },
      { title: 'Tag: three' },
      { title: 'Tag: thunderbird' },
      { title: 'Tag: torino' },
      { title: 'Tag: trans am' },
      { title: 'Tag: transmissions' },
      { title: 'Tag: triple' },
      { title: 'Tag: truck' },
      { title: 'Tag: tuck' },
      { title: 'Tag: universal' },
      { title: 'Tag: v8' },
      { title: 'Tag: vette' },
      { title: 'Tag: vintage' },
      { title: 'Tag: vintageoil' },
      { title: 'Tag: war' },
      { title: 'Tag: willy' },
      { title: 'Tag: windsor' },
      { title: 'Tag: world' },
      { title: 'Tag: wrangler' },
      { title: 'Tag: yellow' },
      { title: 'Tag: yj' },
      { title: 'Tag: z28' },
      { title: 'Title: Default Title' },
    ];

    const sifter = new Sifter(items);

    const result = sifter.search('vintage', { fields: ['title'] });
    expect(result.items).to.have.lengthOf(4);
  });

  describe('tokenize()', () => {
    it('should return an empty array when given an empty string', () => {
      const tokens = tokenize('');
      expect(tokens).to.have.lengthOf(0);
    });

    it('should return an array', () => {
      const tokens = tokenize('hello world');
      expect(isArray(tokens)).to.equal(true);
    });

    it('should return an array', () => {
      const tokens = tokenize('hello world');
      expect(tokens).to.have.lengthOf(2);
    });

    describe('returned tokens', () => {
      let tokens;
      beforeEach(() => {
        tokens = tokenize('hello world');
      });

      it('string property', () => {
        expect(head(tokens)).to.have.property('string');
        expect(typeof head(tokens).string).to.equal('string');
        expect(head(tokens).string).to.equal('hello');
        expect(head(tail(tokens)).string).to.equal('world');
      });

      it('regex property', () => {
        expect(head(tokens)).to.have.property('regex');
        expect(head(tokens).regex instanceof RegExp).to.be.true;
        expect(head(tokens).regex.test('HelLO')).to.be.true;
        expect(head(tail(tokens)).regex.test('woRLD')).to.be.true;
        expect(head(tail(tokens)).regex.test('afawfaf')).to.be.false;
        expect(head(tokens).regex.test('hęłlö')).to.be.true;
        expect(head(tail(tokens)).regex.test('wÕrlð')).to.be.true;
      });
    });
  });

  describe('getScoreFunction()', () => {
    it('should acknowledge AND "conjunction" option', () => {
      const score = getScoreFunction('one two', {
        fields: ['a', 'b'],
        conjunction: 'and',
      });

      expect(score({ a: 'one' })).to.equal(0);
      expect(score({ a: 'one', b: 'two' })).to.be.above(0);
      expect(score({ a: 'one', b: 'one' })).to.equal(0);
      expect(score({ a: 'one', b: 'three' })).to.equal(0);
      expect(score({ a: 'three', b: 'three' })).to.equal(0);
    });

    it('should acknowledge or "conjunction" option', () => {
      const score = getScoreFunction('one two', {
        fields: ['a', 'b'],
        conjunction: 'or',
      });

      expect(score({ a: 'one' })).to.be.above(0);
      expect(score({ a: 'one', b: 'two' })).to.be.above(0);
      expect(score({ a: 'one', b: 'one' })).to.be.above(0);
      expect(score({ a: 'one', b: 'three' })).to.be.above(0);
      expect(score({ a: 'three', b: 'three' })).to.equal(0);
    });

    it('with query and options should return a function that returns a number', () => {
      const score = getScoreFunction('test', { fields: ['a', 'b'] });
      expect(score({ a: 'test' })).to.be.a('number');
      expect(score({ a: 'test' })).to.be.above(0);
      expect(score({})).to.be.a('number');
    });

    it('with pre-prepared search should return a function that returns a number', () => {
      const search = prepareSearch('test', { fields: ['a', 'b'] });
      const score = getScoreFunction(search);
      expect(score({ a: 'test' })).to.be.a('number');
      expect(score({ a: 'test' })).to.be.above(0);
      expect(score({})).to.be.a('number');
    });
  });

  describe('prepareSearch()', () => {
    it('should normalize options', () => {
      const search = prepareSearch('a', {
        fields: { field: 'a' },
        sort: { field: 'a' },
        sort_empty: { field: 'a' },
      });

      expect(isArray(search.options.fields)).to.be.true;
      expect(isArray(search.options.sort)).to.be.true;
      expect(isArray(search.options.sort_empty)).to.be.true;
    });
    it('returned object', () => {
      const search = prepareSearch('hello world');
      expect(search.total).to.equal(0);
      expect(isArray(search.tokens)).to.be.true;
      expect(search.tokens.length).to.equal(2);
      expect(isArray(search.items)).to.be.true;
      expect(search.items.length).to.equal(0);
      expect(search.options).to.not.be.null;
      expect(isArray(search.options)).to.be.false;
      expect(isObject(search.options)).to.be.true;
    });
  });

  describe('search()', () => {
    it('should allow "fields" option to be a string', () => {
      const sifter = new Sifter([{ field: 'a' }, {}]);
      const result = sifter.search('a', { fields: 'field' });
      expect(result.items[0].id).to.equal(0);
    });

    it('should allow to search nested fields', () => {
      const sifter = new Sifter([
        { fields: { nested: 'aaa' } },
        { fields: { nested: 'add' } },
        { fields: { nested: 'abb' } },
      ]);
      const result = sifter.search('aaa', {
        fields: 'fields.nested',
        nesting: true,
      });

      expect(result.items).to.have.lengthOf(1);
      expect(result.items[0].id).to.equal(0);
    });

    it('should allow word boundaries to be respected', () => {
      const sifter = new Sifter([{ name: 'John Smith' }, { name: 'Jane Doe' }]);

      let result = sifter.search('mith', { fields: 'name' });
      expect(result.items).to.have.lengthOf(1);

      result = sifter.search('mith', {
        fields: 'name',
        respect_word_boundaries: true,
      });
      expect(result.items).to.have.lengthOf(0);

      result = sifter.search('Smi', {
        fields: 'name',
        respect_word_boundaries: true,
      });
      expect(result.items).to.have.lengthOf(1);

      result = sifter.search('John Sm', {
        fields: 'name',
        respect_word_boundaries: true,
      });
      expect(result.items).to.have.lengthOf(1);

      result = sifter.search('ohn Smith', {
        fields: 'name',
        respect_word_boundaries: true,
        conjunction: 'and',
      });
      expect(result.items).to.have.lengthOf(0);
    });

    describe('sorting', () => {
      it("it should respect 'sort_empty' option when query absent", () => {
        const sifter = new Sifter([
          { field: 'aaa' },
          { field: 'add' },
          { field: 'abb' },
        ]);

        const result = sifter.search('', {
          fields: 'field',
          sort: { field: 'field', direction: 'asc' },
          sort_empty: { field: 'field', direction: 'desc' },
        });

        expect(result.items[0].id).to.equal(1);
        expect(result.items[1].id).to.equal(2);
        expect(result.items[2].id).to.equal(0);
      });

      it('should work with one field (as object)', () => {
        const sifter = new Sifter([
          { field: 'aaa' },
          { field: 'add' },
          { field: 'abb' },
        ]);
        const result = sifter.search('', {
          fields: 'field',
          sort: { field: 'field' },
        });

        expect(result.items[0].id).to.equal(0);
        expect(result.items[1].id).to.equal(2);
        expect(result.items[2].id).to.equal(1);
      });

      it('should work with one field (as array)', () => {
        const sifter = new Sifter([
          { field: 'aaa' },
          { field: 'add' },
          { field: 'abb' },
        ]);
        const result = sifter.search('', {
          fields: 'field',
          sort: [{ field: 'field' }],
        });

        expect(result.items[0].id).to.equal(0);
        expect(result.items[1].id).to.equal(2);
        expect(result.items[2].id).to.equal(1);
      });

      it('should work with multiple fields and respect priority', () => {
        const sifter = new Sifter([
          { a: 'bbb', b: 'bbb' },
          { a: 'bbb', b: 'ccc' },
          { a: 'bbb', b: 'aaa' },
          { a: 'aaa' },
        ]);
        const result = sifter.search('', {
          fields: 'field',
          sort: [{ field: 'a' }, { field: 'b' }],
        });

        expect(result.items[0].id).to.equal(3);
        expect(result.items[1].id).to.equal(2);
        expect(result.items[2].id).to.equal(0);
        expect(result.items[3].id).to.equal(1);
      });

      it('should respect numeric fields', () => {
        const sifter = new Sifter([
          { field: 1.0 },
          { field: 12.9 },
          { field: 9.1 },
          { field: -9.0 },
        ]);
        const result = sifter.search('', {
          fields: 'field',
          sort: [{ field: 'field' }],
        });

        expect(result.items[0].id).to.equal(3);
        expect(result.items[1].id).to.equal(0);
        expect(result.items[2].id).to.equal(2);
        expect(result.items[3].id).to.equal(1);
      });

      it('should respect sort direction', () => {
        const sifter = new Sifter([
          { a: 'bbb', b: 'rrr' },
          { a: 'bbb', b: 'aaa' },
          { a: 'aaa', b: 'rrr' },
          { a: 'aaa', b: 'aaa' },
        ]);
        const result = sifter.search('', {
          fields: 'field',
          sort: [
            { field: 'b', direction: 'desc' },
            { field: 'a', direction: 'asc' },
          ],
        });

        expect(result.items[0].id).to.equal(2);
        expect(result.items[1].id).to.equal(0);
        expect(result.items[2].id).to.equal(3);
        expect(result.items[3].id).to.equal(1);
      });

      it('should add implicit "$score" field when query present', () => {
        const sifter = new Sifter([{ field: 'yoo' }, { field: 'book' }]);
        const result = sifter.search('oo', {
          fields: 'field',
          sort: [{ field: 'field' }],
        });

        expect(result.items[0].id).to.equal(0);
        expect(result.items[1].id).to.equal(1);
      });

      it('should not add implicit "$score" field if explicitly given', () => {
        const sifter = new Sifter([
          { field: 'boooo' },
          { field: 'yoo' },
          { field: 'aaa' },
        ]);
        const result = sifter.search('oo', {
          filter: false,
          fields: 'field',
          sort: [{ field: 'field' }, { field: '$score' }],
        });

        expect(result.items[0].id).to.equal(2);
        expect(result.items[1].id).to.equal(0);
        expect(result.items[2].id).to.equal(1);
      });

      it('should be locale-aware', () => {
        const sifter = new Sifter([
          { field: 'Zoom Test' },
          { field: 'Água Test' },
        ]);
        const result = sifter.search('', {
          fields: 'field',
          sort: [{ field: 'field', direction: 'asc' }],
        });

        expect(result.items[0].id).to.equal(1);
        expect(result.items[1].id).to.equal(0);
      });

      it('should work with nested fields', () => {
        const sifter = new Sifter([
          { fields: { nested: 'aaa' } },
          { fields: { nested: 'add' } },
          { fields: { nested: 'abb' } },
        ]);
        const result = sifter.search('', {
          fields: [],
          sort: { field: 'fields.nested' },
          nesting: true,
        });

        expect(result.items[0].id).to.equal(0);
        expect(result.items[1].id).to.equal(2);
        expect(result.items[2].id).to.equal(1);
      });
    });

    describe('returned results', () => {
      let sifter, options, result, resultEmpty, resultAll;

      beforeEach(() => {
        sifter = new Sifter([
          { title: 'Matterhorn', location: 'Switzerland', continent: 'Europe' },
          { title: 'Eiger', location: 'Switzerland', continent: 'Europe' },
          { title: 'Everest', location: 'Nepal', continent: 'Asia' },
          { title: 'Gannett', location: 'Wyoming', continent: 'North America' },
          { title: 'Denali', location: 'Alaska', continent: 'North America' },
        ]);

        options = { limit: 1, fields: ['title', 'location', 'continent'] };
        result = sifter.search('switzerland europe', options);
        resultEmpty = sifter.search('awawfawfawf', options);
        resultAll = sifter.search('', {
          fields: ['title', 'location', 'continent'],
          sort: [{ field: 'title' }],
        });
      });

      it('should not vary when using an array vs an object as a data source', () => {
        const sifterBuiltWithAnObject = new Sifter({
          a: {
            title: 'Matterhorn',
            location: 'Switzerland',
            continent: 'Europe',
          },
          b: { title: 'Eiger', location: 'Switzerland', continent: 'Europe' },
          c: { title: 'Everest', location: 'Nepal', continent: 'Asia' },
          d: {
            title: 'Gannett',
            location: 'Wyoming',
            continent: 'North America',
          },
          e: {
            title: 'Denali',
            location: 'Alaska',
            continent: 'North America',
          },
        });
        const resultBuiltWithAnObject = sifterBuiltWithAnObject.search(
          'switzerland europe',
          options
        );
        expect(resultBuiltWithAnObject.items[0].id).to.equal('a');
        expect(result.items[0].id).to.equal(0);
      });

      describe('"items" array', () => {
        it('should be an array', () => {
          expect(Array.isArray(result.items)).to.be.true;
          expect(Array.isArray(resultEmpty.items)).to.be.true;
          expect(Array.isArray(resultAll.items)).to.be.true;
        });
        it('should include entire set if no query provided', () => {
          expect(resultAll.items).to.have.lengthOf(5);
        });
        it('should not have a length that exceeds "limit" option', () => {
          expect(result.items.length).to.be.below(options.limit + 1);
        });
        it('should not contain any items with a score not equal to 1 (without query)', () => {
          for (let i = 0, n = resultAll.items.length; i < n; i++) {
            expect(resultAll.items[i].score).to.equal(1);
          }
        });
        it('should not contain any items with a score of zero (with query)', () => {
          for (let i = 0, n = result.items.length; i < n; i++) {
            expect(result.items[i].score).not.to.equal(0);
          }
        });
        it('should be empty when no results match', () => {
          expect(resultEmpty.items).to.have.lengthOf(0);
        });

        describe('elements', () => {
          it('should be objects', () => {
            expect(result.items[0]).to.be.a('object');
            expect(Array.isArray(result.items[0])).to.be.false;
          });
          describe('"score" property', () => {
            it('should exist and be a number', () => {
              expect(result).to.have.nested.property('items[0].score', 0.5);
              expect(resultAll).to.have.nested.property('items[0].score', 1);
            });
          });
          describe('"id" property', () => {
            it('should exist', () => {
              expect(result).to.have.nested.property('items[0].id', 0);
              expect(resultAll).to.have.nested.property('items[0].id', 4);
            });
          });
        });

        describe('options', () => {
          it('should not be a reference to original options', () => {
            expect(result.options).not.equal(options);
          });

          it('should match original search options', () => {
            expect(result.options).to.deep.equal(options);
          });
        });

        describe('"tokens"', () => {
          it('should be an array', () => {
            expect(Array.isArray(result.tokens)).to.be.true;
          });

          describe('elements', () => {
            it('should be a object', () => {
              expect(typeof result.tokens[0]).to.equal('object');
              expect(Array.isArray(result.tokens[0])).to.be.false;
            });

            it('"string" property', () => {
              expect(result.tokens[0]).to.have.property(
                'string',
                'switzerland'
              );
              expect(result.tokens[1]).to.have.property('string', 'europe');
            });

            it('"regex" property', () => {
              expect(result.tokens[0].regex).to.not.be.undefined;
              expect(result.tokens[0].regex instanceof RegExp).to.be.true;
            });
          });
        });

        describe('"query"', () => {
          it('should match original query', () => {
            expect(result.query).to.equal('switzerland europe');
          });
        });

        describe('"total"', () => {
          it('should be an integer and valid', () => {
            expect(typeof result.total).to.equal('number');
            expect(Math.floor(result.total)).to.equal(Math.ceil(result.total));
            expect(Math.floor(result.total)).to.equal(2);
            expect(Math.floor(resultEmpty.total)).to.equal(0);
          });
        });
      });
    });
  });
});
