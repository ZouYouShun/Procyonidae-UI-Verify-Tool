import type { google } from '@google-cloud/speech/build/protos/protos';

function pad(num: number, size = 2) {
  let s = `${num}`;
  while (s.length < size) {
    s = `0${s}`;
  }
  return s;
}

const getTimeString = (secs: number) => {
  const hours = Math.floor(secs / (60 * 60));
  const minutes = Math.floor((secs % (60 * 60)) / 60);
  const seconds = Math.floor(secs % 60);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const oneNanosecond = Math.pow(10, 9);

const getNanosecondString = (nanoseconds: number) => {
  return (nanoseconds / oneNanosecond).toFixed(3).slice(2);
};

export const getFullTimeString = (duration: google.protobuf.IDuration) => {
  const timeString = getTimeString(+duration.seconds);
  const nanoString = getNanosecondString(duration.nanos);

  return `${timeString},${nanoString}`;
};
