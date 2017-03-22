import axios from 'axios';
import { sleep } from './util';
import * as cache from 'memory-cache';

export interface Coordinate {
  lat: number,
  long: number
}

export default async function getip(ip: string): Promise<Coordinate> {
  let coord = cache.get(ip);
  while (coord === 'fetching') {
    await sleep(100);
    coord = cache.get(ip);
  }
  if (!coord) {
    cache.put(ip, 'fetching');
    const { data } = await axios.get(`https://freegeoip.net/json/${ip}`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    coord = { lat: data.latitude, long: data.longitude };
    cache.put(ip, coord);
  }
  
  return coord;
}