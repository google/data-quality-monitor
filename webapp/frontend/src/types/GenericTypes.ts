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

import {AlertColor} from '@mui/material';
/**
 * Handle messages to be displayed on front end
 *
 * @date 8/18/2023 - 12:48:04 PM
 *
 * @export
 * @interface MessageType
 * @typedef {MessageType}
 */
export interface CustomMessage {
  message?: string | undefined;
  severity?: AlertColor | undefined;
}

/**
 * Properties for a custom info dialogue box
 * It is used for displaying "more information"
 * about job scheduler, workflow and workflow executions
 *
 * @date 8/30/2023 - 4:43:52 PM
 *
 * @export
 * @interface DetailsDialogBoxProps
 * @typedef {DetailsDialogBoxProps}
 */
export interface DetailsDialogBoxProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

/**
 * Properties for custom pop up designed
 * for seeking user's confirmation
 * before taking any action such as execute, delete
 * @date 9/1/2023 - 12:22:40 PM
 *
 * @interface ConfirmPopupProps
 * @typedef {ConfirmPopupProps}
 */
export interface ConfirmPopupProps {
  open: boolean;
  onClose: () => void;
  onAction: () => {};
  expectedConfirmationText: string;
  actionButtonLabel: string;
  popupInfoCaption: string;
  popupMessage: string;
  popupHeader: string;
}
