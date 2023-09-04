/**
Copyright 2023 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Returns a unique key for the react object where
 * there is no unique key available
 */
export function generateRandomIndex() {
  const length = 10;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let index = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    index += charset.charAt(Math.floor(Math.random() * n));
  }
  return index;
}

/**
 * Format date and time based on the seconds string
 * returned by google cloud apis
 */
export function formatSecondsToDateTime(seconds: string | undefined | null) {
  if (seconds === undefined || seconds === null) {
    return;
  }

  let formattedDateTime = '';
  let secondsNumber = Number(seconds);
  if (isNaN(secondsNumber) || secondsNumber < 0) {
    secondsNumber = 0;
  }
  const date = new Date(secondsNumber * 1000); // Convert seconds to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedDateTime;
}

// Get name from parent returned by google apis
export function getShortName(fullName: string) {
  const names = fullName.split('/');
  return names[names.length - 1];
}
