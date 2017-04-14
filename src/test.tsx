import * as React from "react";
import * as ReactDOM from "react-dom";
import axios from 'axios';
import { sleep } from './util';
import * as moment from 'moment';

import IronMap from "./map";
let mapRef: any;

ReactDOM.render(
    <IronMap ref={ref => mapRef = ref}/>,
    document.getElementById("example")
);


async function simulateLogs() {
  while (!mapRef) {
    await sleep(100);
  }

  const { data } = await axios.get('/testlogs.json');
  const array = '[' + data.replace(/\n/g, ',').slice(0, -1) + ']'
  const logs: any[] = JSON.parse(array);

  let last = undefined;
  for (const request of logs) {
    const payload: string[] = request.textPayload.split(' ');
    // console.log(payload);
    const requestType = payload[5];
    const url = payload[6];
    const status = payload[8];
    const ip = payload[payload.length - 2].replace('"', '').replace(',','');
    const timeString = payload[3].replace('[','').split(/:|\//g);
    const time = moment(timeString[0] + ' ' + timeString[1] + ' ' + timeString[2] + ' ' + timeString[3] + ':' + timeString[4] + ':' + timeString[5] + ' ' + payload[4].replace(']',''))
    console.log(requestType, url, status, ip, timeString, time.unix());
    if (last) {
      const delta = time.unix() - last.unix();
      if (delta) {
        console.log('sleep', delta);
        await sleep(delta * 200);
      }
    }

    await mapRef.pingIp(ip);
    last = time;
  }
}

simulateLogs();
