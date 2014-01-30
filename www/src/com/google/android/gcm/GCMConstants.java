/*
 * Copyright 2012 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.android.gcm;

/**
 * Constants used by the GCM library.
 */
public final class GCMConstants {

    /**
     * Intent sent to GCM to register the application.
     */
    public static final String INTENT_TO_GCM_REGISTRATION =
            "com.google.android.c2dm.intent.REGISTER";

    /**
     * Intent sent to GCM to unregister the application.
     */
    public static final String INTENT_TO_GCM_UNREGISTRATION =
            "com.google.android.c2dm.intent.UNREGISTER";

    /**
     * Intent sent by GCM indicating with the result of a registration request.
     */
    public static final String INTENT_FROM_GCM_REGISTRATION_CALLBACK =
            "com.google.android.c2dm.intent.REGISTRATION";

    /**
     * Intent used by the GCM library to indicate that the registration call
     * should be retried.
     */
    public static final String INTENT_FROM_GCM_LIBRARY_RETRY =
            "com.google.android.gcm.intent.RETRY";

    /**
     * Intent sent by GCM containing a message.
     */
    public static final String INTENT_FROM_GCM_MESSAGE =
            "com.google.android.c2dm.intent.RECEIVE";

    /**
     * Extra used on {@link #INTENT_TO_GCM_REGISTRATION} to indicate the sender
     * account (a Google email) that owns the application.
     */
    public static final String EXTRA_SENDER = "sender";

    /**
     * Extra used on {@link #INTENT_TO_GCM_REGISTRATION} to get the application
     * id.
     */
    public static final String EXTRA_APPLICATION_PENDING_INTENT = "app";

    /**
     * Extra used on {@link #INTENT_FROM_GCM_REGISTRATION_CALLBACK} to indicate
     * that the application has been unregistered.
     */
    public static final String EXTRA_UNREGISTERED = "unregistered";

    /**
     * Extra used on {@link #INTENT_FROM_GCM_REGISTRATION_CALLBACK} to indicate
     * an error when the registration fails. See constants starting with ERROR_
     * for possible values.
     */
    public static final String EXTRA_ERROR = "error";

    /**
     * Extra used on {@link #INTENT_FROM_GCM_REGISTRATION_CALLBACK} to indicate
     * the registration id when the registration succeeds.
     */
    public static final String EXTRA_REGISTRATION_ID = "registration_id";

    /**
     * Type of message present in the {@link #INTENT_FROM_GCM_MESSAGE} intent.
     * This extra is only set for special messages sent from GCM, not for
     * messages originated from the application.
     */
    public static final String EXTRA_SPECIAL_MESSAGE = "message_type";

    /**
     * Special message indicating the server deleted the pending messages.
     */
    public static final String VALUE_DELETED_MESSAGES = "deleted_messages";

    /**
     * Number of messages deleted by the server because the device was idle.
     * Present only on messages of special type
     * {@link #VALUE_DELETED_MESSAGES}
     */
    public static final String EXTRA_TOTAL_DELETED = "total_deleted";

    /**
     * Permission necessary to receive GCM intents.
     */
    public static final String PERMISSION_GCM_INTENTS =
            "com.google.android.c2dm.permission.SEND";

    /**
     * @see GCMBroadcastReceiver
     */
    public static final String DEFAULT_INTENT_SERVICE_CLASS_NAME =
            ".GCMIntentService";

    /**
     * The device can't read the response, or there was a 500/503 from the
     * server that can be retried later. The application should use exponential
     * back off and retry.
     */
    public static final String ERROR_SERVICE_NOT_AVAILABLE =
            "SERVICE_NOT_AVAILABLE";

    /**
     * There is no Google account on the phone. The application should ask the
     * user to open the account manager and add a Google account.
     */
    public static final String ERROR_ACCOUNT_MISSING =
            "ACCOUNT_MISSING";

    /**
     * Bad password. The application should ask the user to enter his/her
     * password, and let user retry manually later. Fix on the device side.
     */
    public static final String ERROR_AUTHENTICATION_FAILED =
            "AUTHENTICATION_FAILED";

    /**
     * The request sent by the phone does not contain the expected parameters.
     * This phone doesn't currently support GCM.
     */
    public static final String ERROR_INVALID_PARAMETERS =
            "INVALID_PARAMETERS";
    /**
     * The sender account is not recognized. Fix on the device side.
     */
    public static final String ERROR_INVALID_SENDER =
            "INVALID_SENDER";

    /**
     * Incorrect phone registration with Google. This phone doesn't currently
     * support GCM.
     */
    public static final String ERROR_PHONE_REGISTRATION_ERROR =
            "PHONE_REGISTRATION_ERROR";

    private GCMConstants() {
        throw new UnsupportedOperationException();
    }
}
