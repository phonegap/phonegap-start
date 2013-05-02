package com.google.android.gcm;

import java.util.List;

import com.plugin.GCM.PushHandlerActivity;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningTaskInfo;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import com.plugin.GCM.PushPlugin;


@SuppressLint("NewApi")
public class GCMIntentService extends GCMBaseIntentService {

  public static final String ME="GCMReceiver";

  public GCMIntentService() {
    super("GCMIntentService");
  }
  private static final String TAG = "GCMIntentService";

  @Override
  public void onRegistered(Context context, String regId) {

    Log.v(ME + ":onRegistered", "Registration ID arrived!");
    Log.v(ME + ":onRegistered", regId);

    JSONObject json;

    try
    {
      json = new JSONObject().put("event", "registered");
      json.put("regid", regId);

      Log.v(ME + ":onRegisterd", json.toString());

      // Send this JSON data to the JavaScript application above EVENT should be set to the msg type
      // In this case this is the registration ID
      PushPlugin.sendJavascript( json );

    }
    catch( JSONException e)
    {
      // No message to the user is sent, JSON failed
      Log.e(ME + ":onRegisterd", "JSON exception");
    }
  }

  @Override
  public void onUnregistered(Context context, String regId) {
    Log.d(TAG, "onUnregistered - regId: " + regId);
  }

  @Override
  protected void onMessage(Context context, Intent intent) {
	Log.d(TAG, "onMessage - context: " + context);

    // Extract the payload from the message
	Bundle extras = intent.getExtras();
    if (extras != null)
    {
    	boolean	foreground = this.isInForeground();
    	
    	extras.putBoolean("foreground", foreground);
    	
    	if (foreground)
    		PushHandlerActivity.sendToApp(extras);
    	else
    		this.onReceive(context, extras);
    }
  }
  
	public void onReceive(Context context, Bundle extras)
	{
		NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
		CharSequence appName = context.getPackageManager().getApplicationLabel(context.getApplicationInfo());
		if (null == appName)
			appName = "";
		
		Intent notificationIntent = new Intent(this, PushHandlerActivity.class);
		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
		notificationIntent.putExtra("pushBundle", extras);
		
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);		

		NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context)
		.setSmallIcon(context.getApplicationInfo().icon)
		.setWhen(System.currentTimeMillis())
		.setContentTitle(appName)
		.setTicker(appName)
		.setContentIntent(contentIntent);
		
		String message = extras.getString("message");
		if (message != null)
		{
			mBuilder.setContentText(message);
		}
		else 
		{
			mBuilder.setContentText("<missing message content>");
		}

		String msgcnt = extras.getString("msgcnt");
		if (msgcnt != null)
		{
			mBuilder.setNumber(Integer.parseInt(msgcnt));
		}
		
		mNotificationManager.notify((String) appName, PushHandlerActivity.NOTIFICATION_ID, mBuilder.build());
		try
		{
			Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
			Ringtone r = RingtoneManager.getRingtone(getApplicationContext(), notification);
			r.play();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	public boolean isInForeground()
	{
	    ActivityManager activityManager = (ActivityManager) getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
	    List<RunningTaskInfo> services = activityManager
	    		.getRunningTasks(Integer.MAX_VALUE);

	    if (services.get(0).topActivity.getPackageName().toString().equalsIgnoreCase(getApplicationContext().getPackageName().toString()))
	        return true;
		
		return false;
	}	

  @Override
  public void onError(Context context, String errorId) {
    Log.e(TAG, "onError - errorId: " + errorId);
  }

}
