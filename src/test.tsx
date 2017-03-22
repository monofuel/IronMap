import * as React from "react";
import * as ReactDOM from "react-dom";
import axios from 'axios';
import { sleep } from './util';

import IronMap from "./map";
let mapRef: any;

ReactDOM.render(
    <IronMap ref={ref => mapRef = ref}/>,
    document.getElementById("example")
);

/*
async function simulateLogs() {
  while (!mapRef) {
    await sleep(100);
  }

  const { data } = await axios.get('/testlogs.json');
  const array = '[' + data.replace(/\n/g, ',').slice(0, -1) + ']'
  const logs: any[] = JSON.parse(array);

  for (const request of logs) {
    const payload: string[] = request.textPayload.split(' ');
    // console.log(payload);
    const requestType = payload[5];
    const url = payload[6];
    const status = payload[8];
    const ip = payload[payload.length - 2].replace('"', '').replace(',','');
    console.log(requestType, url, status, ip);
    await mapRef.pingIp(ip);
    await sleep(200);
  }
}

simulateLogs();
*/