//
//  PushHandlerActivity.java
//

package com.plugin.GCM;

import java.io.FileOutputStream;
import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

public class PushHandlerActivity extends Activity
{
	public static final int NOTIFICATION_ID = 237;
	public static boolean EXITED = false;
	
    // this activity will be started if the user touches a notification that we own. If returning from the background,
	// we process it immediately. If from a cold start, we cache the payload and start the main activity which will then process the cached payload.
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
		Log.v("onCreate:", "entry");

        super.onCreate(savedInstanceState);

        Bundle extras = getIntent().getExtras();
        if (extras != null)
        {
    		Bundle	originalExtras = extras.getBundle("pushBundle");
    		if (originalExtras != null)
        	{
              	if (EXITED)
                {
            	    PackageManager pm = getPackageManager();
            		Intent launchIntent = pm.getLaunchIntentForPackage(getApplicationContext().getPackageName());    		
         		
                	// remember how we got here
            		originalExtras.putBoolean("coldstart", true);
                		
                	// serialize and cache the payload before starting the main activity.
            		String json = extrasToJSON(originalExtras).toString();
                	try
                	{
                		FileOutputStream fos = openFileOutput("cached_payload", Context.MODE_PRIVATE);
                		fos.write(json.getBytes());
                		fos.close();
                	}
                	catch (Exception e)
                	{
                		e.printStackTrace();
                	}

                	// now fire up our main activity
                	startActivity(launchIntent);      
                }
              	else
              	{
              		// our main activity was already running (in the background), process the payload
            		sendToApp(originalExtras);
        		}

				// Now that we've processed the notification, remove it from the tray
				CharSequence appName = this.getPackageManager().getApplicationLabel(this.getApplicationInfo());
        		if (null == (String)appName)
					appName = "";
        
        		NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        		mNotificationManager.cancel((String) appName, NOTIFICATION_ID);
			}
        }
    	
        finish();
    }
    
    // surface the notification up to the JS layer
    public static void sendToApp(Bundle extras)
    {
    	JSONObject json = extrasToJSON(extras);
    	
    	PushPlugin.sendJavascript( json );
    }
    
    // serialize the bundle for caching or JS processing
    private static JSONObject extrasToJSON(Bundle extras)
    {
		try
		{
			JSONObject json;
			json = new JSONObject().put("event", "message");
        
			JSONObject jsondata = new JSONObject();
			Iterator<String> it = extras.keySet().iterator();
			while (it.hasNext())
			{
				String key = it.next();
				String value = extras.getString(key);	
        	
				// System data from Android
				if (key.equals("from") || key.equals("collapse_key"))
				{
					json.put(key, value);
				}
				else if (key.equals("foreground"))
				{
					json.put(key, extras.getBoolean("foreground"));
				}
				else if (key.equals("coldstart"))
				{
					json.put(key, extras.getBoolean("coldstart"));
				}
				else
				{
					// Maintain backwards compatibility
					if (key.equals("message") || key.equals("msgcnt") || key.equals("soundname"))
					{
						json.put(key, value);
					}
        		
					// Try to figure out if the value is another JSON object
					if (value.startsWith("{"))
					{
						try
						{
							JSONObject json2 = new JSONObject(value);
							jsondata.put(key, json2);
						}
						catch (Exception e)
						{
							jsondata.put(key, value);
						}
						// Try to figure out if the value is another JSON array
					}
					else if (value.startsWith("["))
					{
						try
						{
							JSONArray json2 = new JSONArray(value);
							jsondata.put(key, json2);
						}
						catch (Exception e)
						{
							jsondata.put(key, value);
						}
					}
					else
					{
						jsondata.put(key, value);
					}
				}
			} // while
			json.put("payload", jsondata);
        
			Log.v("extrasToJSON:", json.toString());

			return json;
		}
		catch( JSONException e)
		{
			Log.e("extrasToJSON:", "JSON exception");
		}        	
		return null;      	
    }

    @Override
    protected void onNewIntent(Intent intent)
    {
        super.onNewIntent(intent);
    }
}
