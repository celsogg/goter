package com.enlix.goter;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

import android.util.Log;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.*;
import android.net.Uri;
import com.ionicframework.goter917690.R;
//import android.R;
import android.os.Bundle;
import android.view.View;
import android.content.Context;
import android.content.Intent;

import com.loopj.android.http.*;
import org.apache.http.Header;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

public class GoterService extends BackgroundService {

	private final static String TAG = GoterService.class.getSimpleName();

	private String token = "";
	private String mHelloTo = "World";
	private Integer notCounter = 0;

	private String urlBase = "http://goter.herokuapp.com/";

	final static String GROUP_KEY_GOTER = "group_key_goter";

	@Override
	protected JSONObject doWork() {
		JSONObject result = new JSONObject();
/*		@SuppressWarnings("deprecation")
		NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
			.setSmallIcon(R.drawable.icon)
			.setContentTitle("My notification")
			.setContentText("Hello World!")
			.setGroup(GROUP_KEY_GOTER);
		// Creates an explicit intent for an Activity in your app
		Intent resultIntent = new Intent(this, GoterService.class);

		// The stack builder object will contain an artificial back stack for the
		// started Activity.
		// This ensures that navigating backward from the Activity leads out of
		// your application to the Home screen.
		TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
		// Adds the back stack for the Intent (but not the Intent itself)
		stackBuilder.addParentStack(GoterService.class);
		// Adds the Intent that starts the Activity to the top of the stack
		stackBuilder.addNextIntent(resultIntent);
		PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
		mBuilder.setContentIntent(resultPendingIntent);
		NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
		// mId allows you to update the notification later on.
		mNotificationManager.notify(notCounter, mBuilder.build());
		notCounter++;

		try {
			SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			String now = df.format(new Date(System.currentTimeMillis()));

			String msg = "Hello " + this.mHelloTo + " - its currently " + now;
			result.put("Message", msg);

			Log.d(TAG, msg);
		} catch (JSONException e) {}*/

		
		RequestParams params = new RequestParams();
		Log.d(TAG, "token: " + this.token);

		params.put("token", this.token);


		SyncHttpClient client = new SyncHttpClient();
		client.get(urlBase + "/api/v1/goter/pin-searchs", params, new JsonHttpResponseHandler() {

		    @Override
		    public void onStart() {
		        // called before request is started
		    }

		    @Override
		    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
		        // called when response HTTP status is "200 OK"
		        Log.d(TAG, "Funciono la wa");
		    }

		    @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray searches) {
                // Pull out the first event on the public timeline
                /*JSONObject firstEvent = timeline.get(0);
                String tweetText = firstEvent.getString("text");

                // Do something with the response
                System.out.println(tweetText);*/
            	Log.d(TAG, "Funciono la wa en el jsonarray");
            }

		    @Override
		    public void onFailure(int statusCode, Header[] headers, Throwable e, JSONObject errorResponse ) {
		        // called when response HTTP status is "4XX" (eg. 401, 403, 404)
		        Log.d(TAG, "NOOO funciono la wa "+errorResponse);
		    }

		    @Override
		    public void onRetry(int retryNo) {
		        // called when request is retried
			}
		});
		return result;
	}

	@Override
	protected JSONObject getConfig() {
		JSONObject result = new JSONObject();
		try {
			result.put("token", this.token);
			//result.put()
		} catch (JSONException e) {}
		return result;
	}

	@Override
	protected void setConfig(JSONObject config) {
		try {
			if (config.has("token")){
				this.token = config.getString("token");
			}else{
				System.out.println("----------------------->>>> no se pudo setear");	
			}
		} catch (JSONException e) {}
	}

	@Override
	protected JSONObject initialiseLatestResult() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected void onTimerEnabled() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void onTimerDisabled() {
		// TODO Auto-generated method stub

	}


}